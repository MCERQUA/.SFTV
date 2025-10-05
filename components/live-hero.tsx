"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, Maximize } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const videoPlaylist = [
  "/videos/commercial-shorts/Cortex-industries-Rex-oring-game-sm.mp4",
  "/videos/commercial-shorts/Graco Fusion AP.mp4",
  "/videos/commercial-shorts/duckcleaning-commerical.mp4",
  "/videos/commercial-shorts/koolfoam-fly-south.mp4",
  "/videos/commercial-shorts/noble-insulation-commerical-sm.mp4",
  "/videos/commercials-longer/EDI-Commerical.mp4",
  "/videos/commercials-longer/ICA-Duct-Clean-Bodywash.mp4",
  "/videos/commercials-longer/ICA-Getting-Ducts-Clean.mp4",
  "/videos/commercials-longer/Only-Foam-SprayFoam-Party.mp4",
  "/videos/music-video-commercials/Mrs-SprayFoam-Call-Me-Maybe.mp4",
  "/videos/music-video-commercials/Mrs-Sprayfoam-Let-It-Foam.mp4",
  "/videos/funny-clips/Breaking-Batts.mp4",
  "/videos/funny-clips/Insulated-Chicken-Brothers-Cartoon2.mp4",
  "/videos/funny-clips/Insulated-chicken-brothers-cartoon.mp4"
]

export function LiveHero() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.log('Auto-play was prevented:', error)
          setIsPlaying(false)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    // Start playing on first user interaction if not already playing
    if (userInteracted && !isPlaying && isVideoLoaded) {
      setIsPlaying(true)
    }
  }, [userInteracted, isVideoLoaded])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      const nextIndex = (currentVideoIndex + 1) % videoPlaylist.length
      setCurrentVideoIndex(nextIndex)
    }

    video.addEventListener('ended', handleVideoEnd)
    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [currentVideoIndex])

  useEffect(() => {
    if (videoRef.current) {
      setIsVideoLoaded(false)
      videoRef.current.load()

      const handleCanPlay = () => {
        setIsVideoLoaded(true)
        if (userInteracted && isPlaying) {
          videoRef.current?.play().catch(() => {})
        }
      }

      videoRef.current.addEventListener('canplay', handleCanPlay)
      return () => {
        videoRef.current?.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [currentVideoIndex])

  const handlePlayClick = () => {
    setUserInteracted(true)
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-card">
      {/* Video background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background">
        {/* Fallback gradient for mobile/loading state */}
        <div className={`absolute inset-0 bg-gradient-to-br from-orange-600/20 via-blue-600/20 to-purple-600/20 ${isVideoLoaded && isPlaying ? 'opacity-0' : ''} transition-opacity duration-500`} />

        <video
          ref={videoRef}
          className={`h-full w-full object-cover opacity-60 ${!isVideoLoaded ? 'invisible' : ''}`}
          muted={isMuted}
          playsInline
          preload="metadata"
        >
          <source src={videoPlaylist[currentVideoIndex]} type="video/mp4" />
        </video>

        {/* Loading indicator */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-12">
          <div className="max-w-3xl space-y-4">
            <Badge className="w-fit bg-destructive text-destructive-foreground">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
              LIVE NOW
            </Badge>
            <h1 className="font-mono text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
              SprayFoamTV
            </h1>
            <p className="text-lg text-muted-foreground text-pretty md:text-xl">
              Entertainment for the Spray Foam Industry
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  setUserInteracted(true)
                  if (isVideoLoaded) {
                    setIsPlaying(true)
                  }
                }}
              >
                <Play className="h-5 w-5" />
                Watch Live
              </Button>
              <Button size="lg" variant="outline">
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-10 w-10 bg-card/80 backdrop-blur"
          onClick={handlePlayClick}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-10 w-10 bg-card/80 backdrop-blur"
          onClick={toggleMute}
        >
          <Volume2 className={`h-4 w-4 ${isMuted ? 'opacity-50' : ''}`} />
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-10 w-10 bg-card/80 backdrop-blur"
          onClick={toggleFullscreen}
        >
          <Maximize className="h-4 w-4" />
          <span className="sr-only">Fullscreen</span>
        </Button>
      </div>
    </section>
  )
}
