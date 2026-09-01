"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, Maximize } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

// THE HERO PLAYS FINISHED CLIENT COMMERCIALS. That is the whole rule for this list.
//
// It used to lead with /videos/channel/sprayfoamtv-stream-v2.mp4 — a 5m47s compilation cut
// from the shared test-dev render pool. Measured 2026-09-01, that one file was 40% of the
// loop's runtime and the first thing every visitor saw, and it is the source of every
// complaint about this player:
//   - it is SCENE FRAGMENTS from one sitcom (The Off-Ratio Bar), not the commercials we made
//   - several of its segments are near-still talking-head renders, so it reads as a slideshow
//   - the pillarbox padding and the static bumpers between segments are BAKED INTO the file,
//     which is where the black screens come from — object-cover on the element cannot undo
//     letterboxing that is already pixels
//   - the pool it was cut from is /mnt/clients/test-dev/openvoiceui/uploads, which is every
//     tenant's render scratch, not a spray-foam library, so off-channel clients leaked in
// The file is still on disk and still in the video catalog; it just does not get to be the
// channel. If a compilation leads again, cut it from THIS list, not from the shared pool.
//
// Every entry below is ffprobe-verified: has an audio stream, is landscape, and is a
// complete commercial rather than a cut-down.
const videoPlaylist = [
  // CHECK 1 (Mike, 2026-09-01): prove the hero rotates through more than one clip and
  // carries sound. Three music/hype spots, ffprobe-verified to have an audio stream and
  // to be landscape, ~4m15s round trip so a rotation is visible without waiting.
  // The wider commercial list is one commit back (32942ea) when we want it again.
  "/videos/music-video-commercials/Mrs-SprayFoam-Call-Me-Maybe.mp4",   // 1:29, music video
  "/videos/commercials-longer/Only-Foam-SprayFoam-Party.mp4",          // 1:13, party spot
  "/videos/music-video-commercials/Mrs-Sprayfoam-Let-It-Foam.mp4"      // 1:32, music video
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

  // The page's own control cluster is positioned inside the hero and is NOT visible once
  // the video element itself is fullscreen, which would leave a viewer with sound they
  // cannot mute and nothing but Esc. Lend them the browser's native controls for exactly
  // as long as they are fullscreen, then take them back.
  useEffect(() => {
    const onFsChange = () => {
      const video = videoRef.current
      if (!video) return
      video.controls = document.fullscreenElement === video
    }
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
    }
  }, [])

  // Fullscreen, the way the four browsers that matter actually spell it.
  // iOS Safari has NO Element.requestFullscreen at all — only the video-only
  // webkitEnterFullscreen — so a bare requestFullscreen() is a no-op on iPhone.
  const enterFullscreen = (video: HTMLVideoElement) => {
    if (document.fullscreenElement) return
    const el = video as any
    const req = video.requestFullscreen?.bind(video) ?? el.webkitRequestFullscreen?.bind(el)
    if (req) {
      Promise.resolve(req()).catch(() => el.webkitEnterFullscreen?.())
    } else {
      el.webkitEnterFullscreen?.()
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      enterFullscreen(video)
    }
  }

  // WATCH LIVE (fixed 2026-09-01).
  // This button used to be `setUserInteracted(true); if (isVideoLoaded) setIsPlaying(true)`.
  // That was correct until muted autoplay landed the day before: by the time anyone can
  // click, isPlaying is ALREADY true, so setIsPlaying(true) is a no-op React bails out of,
  // the [isPlaying] effect never re-runs, and setUserInteracted only feeds an effect guarded
  // by `!isPlaying`. The document-level unmute-on-first-gesture has also already fired on
  // whatever the visitor clicked first (usually the AI-production modal's Close), so even
  // that path short-circuits on autoUnmutedRef. Measured on production: clicking it changed
  // paused/muted/fullscreen/url by nothing at all.
  //
  // The hero video is a 60%-opacity BACKGROUND behind the overlay copy, so "already playing"
  // was never what the button promised. It promises watching. So: take the audio (this click
  // is a real gesture, which is exactly what the autoplay policy wants), guarantee playback,
  // and go fullscreen on the video.
  const handleWatchLive = () => {
    const video = videoRef.current
    setUserInteracted(true)
    if (!video) return

    autoUnmutedRef.current = true    // don't let the global handler double-unmute after this
    userSetMuteRef.current = false   // clicking Watch Live is choosing sound, not silence
    video.muted = false
    setIsMuted(false)
    setIsPlaying(true)

    video.play().catch(() => {
      // Sound refused for some other reason — keep the picture rather than leaving a dead
      // player behind, same degradation the auto-unmute path uses.
      video.muted = true
      setIsMuted(true)
      video.play().catch(() => {})
    })

    enterFullscreen(video)
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
              <Button size="lg" className="gap-2" onClick={handleWatchLive}>
                <Play className="h-5 w-5" />
                Watch Live
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/schedule">View Schedule</Link>
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
