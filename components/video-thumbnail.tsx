"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface VideoThumbnailProps {
  videoPath: string
  alt: string
  className?: string
}

export function VideoThumbnail({ videoPath, alt, className }: VideoThumbnailProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const handleLoadedMetadata = () => {
      video.currentTime = 10 // Seek to 10 seconds for a better frame
    }

    const handleSeeked = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          setThumbnailSrc(url)
        }
      }, 'image/jpeg', 0.9)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('seeked', handleSeeked)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('seeked', handleSeeked)
      if (thumbnailSrc) {
        URL.revokeObjectURL(thumbnailSrc)
      }
    }
  }, [videoPath])

  if (thumbnailSrc) {
    return (
      <img
        src={thumbnailSrc}
        alt={alt}
        className={className}
      />
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        src={videoPath}
        style={{ display: 'none' }}
        preload="metadata"
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className={`${className} bg-muted animate-pulse`} />
    </>
  )
}