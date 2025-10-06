"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, Calendar, MapPin, Volume2, VolumeX, Maximize2, Play } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { VideoModal } from "./video-modal"
import { PlaceholderThumbnail } from "./create-placeholder-thumbnail"

interface CarouselItem {
  id: number
  title: string
  thumbnail: string
  videoPath?: string
  show?: string
  category?: string
  artist?: string
  description?: string
  duration?: string
  episodes?: number
  date?: string
  location?: string
  status?: string
}

interface ContentCarouselProps {
  title: string
  items: CarouselItem[]
  comingSoon?: boolean
}

function VideoCard({ item, onExpand }: { item: CarouselItem; onExpand: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current && item.videoPath) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    onExpand()
  }

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Always show thumbnail image */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <div className="absolute inset-0">
          <PlaceholderThumbnail title={item.title} category={item.category} />
        </div>
      )}

      {/* Video element (hidden until hover) */}
      {item.videoPath && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          muted={isMuted}
          loop
          playsInline
          preload="none"
        >
          <source src={item.videoPath} type="video/mp4" />
        </video>
      )}

      {/* Play icon overlay (shows when not playing) */}
      {item.videoPath && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-opacity group-hover:opacity-0">
            <Play className="h-6 w-6 text-gray-900 ml-0.5" />
          </div>
        </div>
      )}

      {/* Control buttons (show on hover) */}
      {isHovered && item.videoPath && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
            onClick={handleExpand}
          >
            <Maximize2 className="h-4 w-4 text-white" />
            <span className="sr-only">Expand</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export function ContentCarousel({ title, items, comingSoon = false }: ContentCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)
  const [modalVideo, setModalVideo] = useState<CarouselItem | null>(null)

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1))
  }

  const handleNext = () => {
    setStartIndex(Math.min(items.length - 4, startIndex + 1))
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-3xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev} disabled={startIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} disabled={startIndex >= items.length - 4}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {comingSoon ? (
            items.slice(startIndex, startIndex + 4).map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden transition-all opacity-75"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover opacity-50"
                  />
                  {item.status && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded bg-background/90 px-4 py-2 text-lg font-bold backdrop-blur">
                        {item.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold leading-tight text-pretty">{item.title}</h3>
                  {item.description && <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>}
                </div>
              </Card>
            ))
          ) : (
            items.slice(startIndex, startIndex + 4).map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <VideoCard item={item} onExpand={() => setModalVideo(item)} />
                {item.duration && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
                    <Clock className="h-3 w-3" />
                    {item.duration}
                  </div>
                )}
                {item.episodes && (
                  <div className="absolute bottom-2 right-2 rounded bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
                    {item.episodes} Episodes
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                {item.show && <p className="text-xs font-medium text-primary">{item.show}</p>}
                {item.category && <p className="text-xs font-medium text-primary">{item.category}</p>}
                {item.artist && <p className="text-xs font-medium text-muted-foreground">by {item.artist}</p>}
                <h3 className="font-semibold leading-tight text-pretty">{item.title}</h3>
                {item.description && <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>}
                {item.date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
        </div>
      </div>

      {modalVideo && modalVideo.videoPath && (
        <VideoModal
          isOpen={true}
          onClose={() => setModalVideo(null)}
          videoPath={modalVideo.videoPath}
          title={modalVideo.title}
        />
      )}
    </section>
  )
}
