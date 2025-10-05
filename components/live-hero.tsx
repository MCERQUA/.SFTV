"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, Maximize } from "lucide-react"
import { useState } from "react"

export function LiveHero() {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-card">
      {/* Video placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background">
        <img src="/spray-foam-insulation-application-action-shot.jpg" alt="Live broadcast" className="h-full w-full object-cover opacity-60" />
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
              FOAM FACTS: CLOSED CELL DEEP DIVE
            </h1>
            <p className="text-lg text-muted-foreground text-pretty md:text-xl">
              Join industry expert Mike Johnson as he breaks down the science behind closed cell spray foam insulation
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button size="lg" className="gap-2">
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
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
        <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/80 backdrop-blur">
          <Volume2 className="h-4 w-4" />
          <span className="sr-only">Volume</span>
        </Button>
        <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/80 backdrop-blur">
          <Maximize className="h-4 w-4" />
          <span className="sr-only">Fullscreen</span>
        </Button>
      </div>
    </section>
  )
}
