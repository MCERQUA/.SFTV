"use client"

import { useEffect, useRef, useState } from "react"
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoPath: string
  title: string
}

export function VideoModal({ isOpen, onClose, videoPath, title }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)

      // Track view when modal opens
      fetch('/api/video-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath, videoTitle: title })
      }).catch(err => console.error('Failed to track modal view:', err))
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isOpen, videoPath, title])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const togglePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 mx-4 w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-lg bg-card shadow-2xl">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="h-full w-full"
              src={videoPath}
              autoPlay
              muted={isMuted}
            />

            <div className="absolute top-4 right-4">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
                onClick={onClose}
              >
                <X className="h-5 w-5 text-orange-500" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-card/95 p-4 backdrop-blur">
            <h3 className="font-semibold text-lg">{title}</h3>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>

              <Button
                size="icon"
                variant="secondary"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}