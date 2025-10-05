import { Header } from "@/components/header"
import { LiveHero } from "@/components/live-hero"
import { SchedulePreview } from "@/components/schedule-preview"
import { ContentCarousel } from "@/components/content-carousel"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

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
        <CTASection />
        <ContentCarousel title="Funny Clips" items={funnyClips} />
        <ContentCarousel title="Shows/Cartoons" items={showsCartoons} comingSoon={true} />
      </main>
      <Footer />
    </div>
  )
}

const commercialShorts = [
  {
    id: 1,
    title: "Quick Foam Application Demo",
    category: "Commercial Short",
    thumbnail: "/spray-foam-insulation-close-up.jpg",
    duration: "0:30",
  },
  {
    id: 2,
    title: "Energy Savings in 60 Seconds",
    category: "Commercial Short",
    thumbnail: "/attic-insulation.png",
    duration: "0:45",
  },
  {
    id: 3,
    title: "Why Choose Spray Foam?",
    category: "Commercial Short",
    thumbnail: "/spray-foam-equipment-maintenance.jpg",
    duration: "0:55",
  },
  {
    id: 4,
    title: "Professional Installation Quick Look",
    category: "Commercial Short",
    thumbnail: "/commercial-building-insulation.jpg",
    duration: "0:40",
  },
]

const commercialsLonger = [
  {
    id: 1,
    title: "Complete Home Insulation Guide",
    category: "Extended Commercial",
    thumbnail: "/spray-foam-science-laboratory.jpg",
    duration: "3:45",
  },
  {
    id: 2,
    title: "Commercial Building Case Study",
    category: "Extended Commercial",
    thumbnail: "/professional-contractor-teaching.jpg",
    duration: "5:20",
  },
  {
    id: 3,
    title: "ROI of Spray Foam Insulation",
    category: "Extended Commercial",
    thumbnail: "/spray-foam-equipment-tools.jpg",
    duration: "4:15",
  },
  {
    id: 4,
    title: "Full Service Overview",
    category: "Extended Commercial",
    thumbnail: "/construction-site-insulation-work.jpg",
    duration: "6:30",
  },
]

const musicVideoCommercials = [
  {
    id: 1,
    title: "Foam It Up - The Anthem",
    artist: "SprayFoam Crew",
    thumbnail: "/trade-show-convention-center.jpg",
    duration: "2:30",
  },
  {
    id: 2,
    title: "Insulation Nation",
    artist: "Industry Beats",
    thumbnail: "/safety-training-workshop.jpg",
    duration: "3:15",
  },
  {
    id: 3,
    title: "Seal the Deal",
    artist: "Foam Kings",
    thumbnail: "/product-launch-event.png",
    duration: "2:45",
  },
]

const funnyClips = [
  {
    id: 1,
    title: "Foam Fails Compilation",
    category: "Comedy",
    thumbnail: "/spray-foam-insulation-close-up.jpg",
    duration: "1:45",
  },
  {
    id: 2,
    title: "DIY Disasters: What Not to Do",
    category: "Comedy",
    thumbnail: "/attic-insulation.png",
    duration: "2:20",
  },
  {
    id: 3,
    title: "Contractor Bloopers Reel",
    category: "Comedy",
    thumbnail: "/spray-foam-equipment-maintenance.jpg",
    duration: "3:00",
  },
]

const showsCartoons = [
  {
    id: 1,
    title: "The Foam Rangers",
    description: "Animated series coming soon",
    thumbnail: "/commercial-building-insulation.jpg",
    status: "Coming Soon",
  },
  {
    id: 2,
    title: "Insulation Adventures",
    description: "Educational cartoon series",
    thumbnail: "/spray-foam-science-laboratory.jpg",
    status: "Coming Soon",
  },
  {
    id: 3,
    title: "SprayFoam TV Weekly",
    description: "Weekly industry show",
    thumbnail: "/professional-contractor-teaching.jpg",
    status: "Coming Soon",
  },
]
