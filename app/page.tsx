import { Header } from "@/components/header"
import { LiveHero } from "@/components/live-hero"
import { SchedulePreview } from "@/components/schedule-preview"
import { ContentCarousel } from "@/components/content-carousel"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
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
      </main>
      <Footer />
    </div>
  )
}

