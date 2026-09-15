"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { LiveHero } from "@/components/live-hero"
import { SchedulePreview } from "@/components/schedule-preview"
import { ContentCarousel } from "@/components/content-carousel"
import { CTASection } from "@/components/cta-section"
import { JamEditorBanner } from "@/components/jam-editor-banner"
import { SprayFoamRadioBanner } from "@/components/sprayfoam-radio-banner"
import { Footer } from "@/components/footer"
import { FloatingUploadButton } from "@/components/floating-upload-button"
import { AIProductionModal } from "@/components/ai-production-modal"
import { commercialShorts, commercialsLonger, musicVideoCommercials, funnyClips, upcomingShows } from "@/lib/video-data"

export default function HomePage() {
  const [isAIProductionModalOpen, setIsAIProductionModalOpen] = useState(false)

  useEffect(() => {
    // In-app browsers (Messenger, Instagram) throw SecurityError on storage access —
    // an uncaught throw here crashes the whole React tree (client-side exception page).
    let hasSeenModal: string | null = null
    try {
      hasSeenModal = sessionStorage.getItem('hasSeenAIProductionModal')
    } catch {
      // storage blocked: show the modal once per page load instead of crashing
    }

    if (!hasSeenModal) {
      // Delay modal appearance by 1 second for better UX
      const timer = setTimeout(() => {
        setIsAIProductionModalOpen(true)
        try {
          sessionStorage.setItem('hasSeenAIProductionModal', 'true')
        } catch {
          // storage blocked: non-fatal, modal just re-shows on next load
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <LiveHero />
        <SchedulePreview />
        <ContentCarousel title="Commercial Shorts" items={commercialShorts} />
        <ContentCarousel title="Commercials Longer" items={commercialsLonger} />
        <SprayFoamRadioBanner />
        <ContentCarousel title="Music Video Commercials" items={musicVideoCommercials} />
        <ContentCarousel title="Funny Clips" items={funnyClips} />
        <ContentCarousel title="Shows/Cartoons" items={upcomingShows} comingSoon={true} />
        <CTASection />
        <JamEditorBanner />
      </main>
      <Footer />
      <FloatingUploadButton />

      {/* AI Production Modal - Auto-opens on first visit */}
      <AIProductionModal
        isOpen={isAIProductionModalOpen}
        onClose={() => setIsAIProductionModalOpen(false)}
      />
    </div>
  )
}

