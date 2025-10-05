"use client"

import { VideoSourceType } from "@/lib/video-utils"

interface EmbedVideoPlayerProps {
  url: string
  embedUrl: string
  sourceType: VideoSourceType
  title: string
  className?: string
}

export function EmbedVideoPlayer({
  url,
  embedUrl,
  sourceType,
  title,
  className = ""
}: EmbedVideoPlayerProps) {
  if (sourceType === "direct") {
    return (
      <video
        className={`h-full w-full ${className}`}
        controls
        preload="metadata"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  }

  if (["youtube", "vimeo", "streamable", "google-drive"].includes(sourceType)) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className={`h-full w-full ${className}`}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Video type not supported for embedding
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Open video in new tab
        </a>
      </div>
    </div>
  )
}