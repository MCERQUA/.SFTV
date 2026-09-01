"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, Maximize } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const videoPlaylist = [
  // Channel compilation built by mac-claude 2026-08-31 (3:31, 1080p) — all client mascot
  // clips + the Off-Ratio episode scenes cut together with channel-flip transitions.
  // Leads the loop so the homepage opens on the current channel reel. A v2 with the back
  // half of the episode is expected; swap the file, this path stays the same.
  "/videos/channel/sprayfoamtv-stream-v2.mp4",
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
  const autoUnmutedRef = useRef(false)     // we only ever auto-unmute ONCE
  const userSetMuteRef = useRef(false)     // set when the viewer uses the mute button

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
    // AUTOPLAY (2026-08-31). This used to require `userInteracted`, so the channel sat on a
    // still frame until someone clicked — on a page whose whole promise is "24/7 livestream".
    // Muted autoplay is permitted by every current browser; UNmuted autoplay is not, and the
    // video mounts with muted={isMuted} and isMuted=true. So start as soon as it is loaded
    // while muted, and keep the interaction path for the unmuted case.
    // If a browser still refuses, the play().catch above resets isPlaying to false and the
    // play button appears — the page degrades to the old behaviour rather than breaking.
    if (!isPlaying && isVideoLoaded && (isMuted || userInteracted)) {
      setIsPlaying(true)
    }
  }, [userInteracted, isVideoLoaded, isMuted])

  // UNMUTE ON FIRST INTERACTION (2026-08-31).
  // Browsers block autoplay WITH SOUND until the page has been "activated" by a real user
  // gesture — but once any gesture has happened, unmuting is allowed. This page auto-opens
  // AIProductionModal one second in, so nearly every visitor produces a gesture by closing
  // it. We listen for the first gesture ANYWHERE rather than coupling to that modal, so it
  // still works if the modal is suppressed (sessionStorage 'hasSeenAIProductionModal') or
  // removed later.
  //
  // Two things we deliberately do NOT do:
  //  - fight the viewer: if their gesture was the mute button itself, userSetMuteRef is set
  //    and we leave it muted forever.
  //  - retry: autoUnmutedRef makes this strictly once per page load.
  useEffect(() => {
    const unmuteOnce = (e: Event) => {
      if (autoUnmutedRef.current || userSetMuteRef.current) return
      // ignore a gesture that landed on the mute control — that viewer is choosing silence
      const t = e.target as HTMLElement | null
      if (t && t.closest && t.closest('[data-mute-toggle]')) return
      autoUnmutedRef.current = true
      const v = videoRef.current
      if (!v) return
      v.muted = false
      setIsMuted(false)
      // a gesture also satisfies the play policy, so make sure it is actually rolling
      v.play().catch(() => {
        // sound refused for some other reason — fall back to muted playback rather than
        // leaving a paused player behind
        v.muted = true
        setIsMuted(true)
        v.play().catch(() => {})
      })
    }
    const opts = { once: false, capture: true } as AddEventListenerOptions
    document.addEventListener('pointerdown', unmuteOnce, opts)
    document.addEventListener('keydown', unmuteOnce, opts)
    document.addEventListener('touchstart', unmuteOnce, opts)
    return () => {
      document.removeEventListener('pointerdown', unmuteOnce, opts)
      document.removeEventListener('keydown', unmuteOnce, opts)
      document.removeEventListener('touchstart', unmuteOnce, opts)
    }
  }, [])

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
      userSetMuteRef.current = true      // viewer owns the audio state from here on
      autoUnmutedRef.current = true
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
          autoPlay
          playsInline
          preload="auto"
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
          className="h-12 w-12 md:h-10 md:w-10 bg-black/70 backdrop-blur hover:bg-black/80 border border-white/20"
          onClick={handlePlayClick}
        >
          {isPlaying ? <Pause className="h-5 w-5 md:h-4 md:w-4 text-white" /> : <Play className="h-5 w-5 md:h-4 md:w-4 text-white" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 md:h-10 md:w-10 bg-black/70 backdrop-blur hover:bg-black/80 border border-white/20"
          onClick={toggleMute}
          data-mute-toggle
        >
          <Volume2 className={`h-5 w-5 md:h-4 md:w-4 text-white ${isMuted ? 'opacity-50' : ''}`} />
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 md:h-10 md:w-10 bg-black/70 backdrop-blur hover:bg-black/80 border border-white/20"
          onClick={toggleFullscreen}
        >
          <Maximize className="h-5 w-5 md:h-4 md:w-4 text-white" />
          <span className="sr-only">Fullscreen</span>
        </Button>
      </div>
    </section>
  )
}
