# `/live` — the 24/7 HLS channel

How the live page gets its picture and its sound. Everything below was measured on
2026-09-01/02, not inferred from the code.

## The path, end to end

```
browser → https://sprayfoamtv.com/live          (this repo, app/live/)
            │  <video> + hls.js, source "/stream/hls/index.m3u8"
            ▼
          netlify.toml  [[redirects]]  /stream/hls/*  →  200 proxy
            ▼
          https://games.jam-bot.com/stream/hls/:splat
            ▼
          nginx (JamBot VPS) — static root /mnt/obs/games/emulatorjs/web
            ▼
          /mnt/obs/games/emulatorjs/web/stream/hls/{index.m3u8, seg_%09d.ts}
            ▲
          ffmpeg, looping /mnt/system/base/livestream/playlist.ffconcat
          -c:v libx264 -c:a aac -ar 48000 -ac 2 -b:a 192k
          -f hls -hls_time 4 -hls_list_size 6
```

Two traps worth knowing before debugging this again:

1. **The origin is the `games.jam-bot.com` vhost, not `sftv.jam-bot.com`.** A
   `sftv.jam-bot.com` vhost config exists at
   `/mnt/system/base/sprayfoamtv/channel/nginx-sftv.jam-bot.com.conf` and a *second*
   ffmpeg writes a *second* HLS ladder to
   `/mnt/system/base/sprayfoamtv/channel/hls/` (`live.m3u8`, `seg-%05d.ts`) — but that
   vhost is **not installed in `sites-enabled`**, so nothing serves it. Segment naming
   is how you tell the two apart: `seg_000000527.ts` is the one on air,
   `seg-00463.ts` is the one that is not. Probing the wrong ladder will give you
   answers about a stream nobody is watching.
2. **`games.jam-bot.com` has no `/stream/` location block.** The files are served by
   its catch-all static `root`. There is nothing stream-specific in that vhost to grep
   for.

## Sound

The channel **does** carry audio and always has. Measured on the served segments and
on all 22 source clips:

| what | measurement |
|---|---|
| served segment audio stream | `aac`, 48000 Hz, 2 ch |
| served segment audio packets | 167–225 per 4 s segment |
| served segment loudness | `mean_volume -16.8 dB`, `max_volume -2.7 dB` |
| source clips with an audio track | **22 of 22** |
| source clip loudness range | −15.5 dB to −21.7 dB mean |

So if `/live` is silent, the stream is not the place to look.

### Why it was silent until 2026-09-02

`app/live/live-player.tsx` rendered `<video autoPlay muted playsInline>` and **nothing
in the component ever cleared `muted`** — no unmute control, no volume UI, no click
handler. The `muted` attribute is not optional for the *initial* autoplay (every
browser blocks an unmuted autostart without user activation), but it has to be
dropped afterwards, and that half was missing. The page was permanently muted by
construction.

### The attempted fix

Two additions to `live-player.tsx`. Needs confirmation in production, on a real
browser, before it is called solved:

1. **Try for sound first.** On `loadeddata`, set `muted = false` and call `play()`.
   Browsers that have granted this origin autoplay-with-sound (prior interaction,
   high media engagement) just play with audio. If `play()` rejects, restore
   `muted = true`, resume the muted autoplay so the picture never stops, and raise
   the prompt below. The fallback is driven by the actual rejection, not by
   assuming refusal.
2. **A gesture to buy sound, and a control to give it back.** A full-viewport
   "Tap for sound" prompt appears only when the browser refused; one tap anywhere
   unmutes. A persistent 48 px speaker toggle sits bottom-right so sound can be
   turned back off — the element has no native `controls`, so without this there is
   no way to re-mute.

Verification done so far: production build clean (`npm run build`, `/live` route
compiles), and the emitted chunk contains the unmute assignment, the `loadeddata`
hook and the prompt string. **Not yet confirmed by ear in a browser.**

## Debugging recipe

```bash
# Is the stream up, and does it have audible audio?
SEG=$(curl -s https://sprayfoamtv.com/stream/hls/index.m3u8 | grep -m1 '\.ts$')
curl -s -o /tmp/seg.ts "https://sprayfoamtv.com/stream/hls/$SEG"
ffprobe -v error -show_streams -of default=noprint_wrappers=1 /tmp/seg.ts | grep -E 'codec_type|codec_name|channels|sample_rate'
ffmpeg -v error -i /tmp/seg.ts -map 0:a -c:a pcm_s16le -f wav /tmp/a.wav -y
ffmpeg -hide_banner -i /tmp/a.wav -af volumedetect -f null - 2>&1 | grep volume
```

`volumedetect` prints at *info* loglevel — running it under `-v error` prints
nothing at all, which reads exactly like silence. Use `-hide_banner`, not `-v error`.

A declared audio stream is not audible audio: a mid-write segment can probe as
`aac` with `sample_rate=0` and **zero** audio packets. Count packets and measure
volume; do not stop at the codec name.

## Adding or changing what airs

Clips are the `file '...'` lines in `/mnt/system/base/livestream/playlist.ffconcat`
on the VPS. The ffmpeg loop must be restarted to pick up a changed playlist.
