"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

/*eslint-disable @typescript-eslint/no-explicit-any*/

export default function LivePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        setTimeout(attach, 1000); // hls.js not loaded yet
      }
    };

    video.addEventListener("seeking", pin);
    attach();
    return () => {
      stopped = true;
      hls?.destroy();
      video.removeEventListener("seeking", pin);
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
        className="aspect-video w-full rounded-xl bg-black"
      />
    </>
  );
}
