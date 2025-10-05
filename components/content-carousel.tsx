"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, Calendar, MapPin, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { VideoModal } from "./video-modal"

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (videoRef.current && item.videoPath) {
      // Set the current time to get a thumbnail
      videoRef.current.currentTime = 0.1

      const handleLoadedData = () => {
        setIsLoaded(true)
      }

      videoRef.current.addEventListener('loadeddata', handleLoadedData)

      return () => {
        videoRef.current?.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [item.videoPath])

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

  if (!item.videoPath) {
    return (
      <img
        src={item.thumbnail || "/placeholder.svg"}
        alt={item.title}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
    )
  }

  return (
    <>
      <div
        className="absolute inset-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105 ${!isLoaded ? 'invisible' : ''}`}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause()
            e.currentTarget.currentTime = 0.1
          }}
        >
          <source src={item.videoPath} type="video/mp4" />
        </video>

        {isHovered && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
              onClick={handleExpand}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Expand</span>
            </Button>
          </div>
        )}
      </div>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </>
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
