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

`/live` being silent on 2026-09-01 had **two independent causes**, either of which
alone was enough. Both are fixed; they are recorded separately because they fail
differently and will recur differently.

| what | before | after |
|---|---|---|
| served segment audio stream | `aac` 48000 Hz 2 ch (declared) | same |
| served segment audio packets | **0** on a bad run | 164–231 per segment |
| served segment loudness | n/a (no packets) | `mean -15.0 dB`, `max -1.7 dB` |
| audio decoded by a real browser | **0 bytes** | **294,810 bytes** |
| ffmpeg stall-guard restarts | 5 in 2 minutes | **0** in 3+ minutes |
| source clips with an audio track | 22 of 22 | unchanged |

### Cause 1 — the player could never unmute (this repo)

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

Verified against the **deployed** page (headless Chromium, autoplay policy forced to
`document-user-activation-required` so the browser genuinely refuses):
`promptVisible: true` before the gesture → the fallback path fired as designed;
after one click `muted: false`, `promptVisible: false`, `audioBytesDecoded: 294810`,
no JS errors. Picture playing, unmuted, audio decoding — all three PASS.

### Cause 2 — mixed 48 kHz / 96 kHz sources broke the encoder (the VPS)

Independently of the player, the stream itself was intermittently producing segments
with **zero audio packets**, and wedging.

`/mnt/system/base/livestream/media/` held **11 clips at 48000 Hz and 11 at 96000 Hz**.
The concat demuxer configures **one** decoder from the **first** file and feeds every
later file's packets to it — and the keeper *shuffles the rotation on every restart*.
So whichever rate happened to sort first, the other eleven clips failed to decode for
that entire run:

```
[aac] Number of scalefactor bands in group (42) exceeds limit (41).
[aist#0:1/aac] Error submitting packet to decoder: Invalid data found when processing input
```

Two consequences, both live on the public site: output segments carried no audio at
all, and ffmpeg spun on the decode errors producing nothing until the keeper's stall
guard killed it — **5 restarts in 2 minutes**.

This is why the symptom looked intermittent: a shuffle that happened to put a 48 kHz
clip first produced a working, audible stream (measured −16.8 dB at 23:47), and the
next restart could produce a silent one (measured 0 audio packets at 00:04).

**Re-encoding in the broadcast ffmpeg cannot fix this** — and the keeper had already
tried, twice, per its own comments. That fixes the *output* mux; the failure is on the
*input decode* side of the concat demuxer. The only fix is uniform input parameters.

Fixed by `scripts/livestream-normalize.sh` on the VPS: every clip is normalized once
into `.normalized/` at 48000 Hz stereo (video stream-copied, so it is cheap), cached
by mtime, and the keeper concatenates *those*. Originals in `media/` are untouched.

### Cause 3 (found while fixing 2) — two keepers fighting

`crontab` guards the keeper with `tmux has-session -t livestream || tmux new-session …`,
which asks whether the **session** exists, not whether a keeper is **running**. A tmux
session had died leaving its keeper loop alive as an orphan, so cron started a second
one: measured 2026-09-02, one keeper 1h25m old outside tmux plus a fresh one. Each
keeper's `stop_ffmpeg` runs `pkill -f livestream/playlist.ffconcat`, which kills the
*other* keeper's encoder. They took turns killing each other; the playlist went stale;
both stall guards fired. It presented exactly as "ffmpeg wedged".

Fixed with an `flock` single-instance lock in `livestream-keeper.sh` — a lock on the
work, not on the terminal it happens to run in. Negative-tested: a second keeper logs
`another keeper already holds the lock -> exiting` and the process count stays at 1.

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
