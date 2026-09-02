"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

/*eslint-disable @typescript-eslint/no-explicit-any*/

function SpeakerOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="m23 9-6 6" />
      <path d="m17 9 6 6" />
    </svg>
  );
}

export default function LivePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Starts muted because browser autoplay policy only permits a MUTED autostart.
  // The effect below immediately tries to drop that; if the browser refuses,
  // `needsGesture` puts up the prompt whose tap is the gesture that earns sound.
  const [muted, setMuted] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);

  const unmute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    setMuted(false);
    setNeedsGesture(false);
    // A gesture-driven play() is always permitted — this also covers the case
    // where even the muted autoplay never started.
    void video.play().catch(() => {});
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      unmute();
    } else {
      video.muted = true;
      setMuted(true);
    }
  }, [unmute]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = "/stream/hls/index.m3u8";
    let hls: any = null;
    let stopped = false;

    // true live: always pinned to the live edge, no seekback
    const pin = () => {
      if (video.seekable.length) {
        const end = video.seekable.end(video.seekable.length - 1);
        if (video.duration === Infinity || end - video.currentTime > 12) {
          video.currentTime = end;
        }
      }
    };

    // The stream carries real audio, so silence is never the right resting
    // state. Ask for sound outright; only fall back to muted when the browser
    // actually refuses, instead of assuming it will.
    const tryUnmutedAutoplay = () => {
      if (stopped) return;
      video.muted = false;
      video.volume = 1;
      void video
        .play()
        .then(() => {
          if (stopped) return;
          setMuted(false);
          setNeedsGesture(false);
        })
        .catch(() => {
          if (stopped) return;
          // Refused (no user activation yet). Restore the muted autoplay so the
          // picture keeps running, and ask for the one tap that buys sound.
          video.muted = true;
          setMuted(true);
          setNeedsGesture(true);
          void video.play().catch(() => {});
        });
    };

    const attach = () => {
      if (stopped) return;
      const Hls = (window as any).Hls;
      if (Hls && Hls.isSupported()) {
        hls = new Hls({ liveSyncDurationCount: 3 });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_e: unknown, d: { fatal?: boolean }) => {
          if (d.fatal) {
            setTimeout(() => {
              hls?.destroy();
              hls = null;
              attach();
            }, 4000);
          }
        });
      } else if (
        typeof (window as any).MediaSource === "undefined" &&
        video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // iOS Safari only: no MediaSource means hls.js can never attach.
        // Chromium answers canPlayType with "maybe" but cannot play HLS natively,
        // so this branch must never fire there — it kills the video permanently.
        video.src = src;
      } else {
        setTimeout(attach, 250); // hls.js not loaded yet
      }
    };

    video.addEventListener("seeking", pin);
    video.addEventListener("loadeddata", tryUnmutedAutoplay, { once: true });
    attach();
    return () => {
      stopped = true;
      hls?.destroy();
      video.removeEventListener("seeking", pin);
      video.removeEventListener("loadeddata", tryUnmutedAutoplay);
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js"
        strategy="afterInteractive"
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        className="fixed inset-0 h-full w-full bg-black object-contain"
        style={{ width: "100vw", height: "100dvh" }}
      />

      {/* Autoplay was allowed only without sound — one tap anywhere buys it. */}
      {needsGesture && (
        <button
          type="button"
          onClick={unmute}
          aria-label="Turn on sound"
          className="fixed inset-0 z-20 flex cursor-pointer items-center justify-center bg-transparent"
        >
          <span className="flex items-center gap-3 rounded-full bg-black/70 px-6 py-4 text-base font-semibold tracking-wide text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
            <SpeakerOnIcon />
            Tap for sound
          </span>
        </button>
      )}

      {/* Persistent control so sound can be turned back off (no native controls). */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Turn on sound" : "Mute"}
        aria-pressed={!muted}
        className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
      >
        {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
      </button>
    </>
  );
}
