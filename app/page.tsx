import { Header } from "@/components/header"
import { LiveHero } from "@/components/live-hero"
import { SchedulePreview } from "@/components/schedule-preview"
import { ContentCarousel } from "@/components/content-carousel"
import { CTASection } from "@/components/cta-section"
import { JamEditorBanner } from "@/components/jam-editor-banner"
import { Footer } from "@/components/footer"
import { FloatingUploadButton } from "@/components/floating-upload-button"
import { commercialShorts, commercialsLonger, musicVideoCommercials, funnyClips, upcomingShows } from "@/lib/video-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <LiveHero />
        <SchedulePreview />
        <ContentCarousel title="Commercial Shorts" items={commercialShorts} />
        <ContentCarousel title="Commercials Longer" items={commercialsLonger} />
        <ContentCarousel title="Music Video Commercials" items={musicVideoCommercials} />
        <ContentCarousel title="Funny Clips" items={funnyClips} />
        <ContentCarousel title="Shows/Cartoons" items={upcomingShows} comingSoon={true} />
        <CTASection />
        <JamEditorBanner />
      </main>
      <Footer />
      <FloatingUploadButton />
    </div>
  )
}

