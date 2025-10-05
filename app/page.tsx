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
        <ContentCarousel title="Recent Episodes" items={recentEpisodes} />
        <ContentCarousel title="Popular Shows" items={popularShows} />
        <CTASection />
        <ContentCarousel title="Upcoming Events" items={upcomingEvents} />
      </main>
      <Footer />
    </div>
  )
}

const recentEpisodes = [
  {
    id: 1,
    title: "Closed Cell vs Open Cell: The Ultimate Showdown",
    show: "Foam Facts",
    thumbnail: "/spray-foam-insulation-close-up.jpg",
    duration: "24:15",
  },
  {
    id: 2,
    title: "Attic Insulation Best Practices",
    show: "Pro Tips",
    thumbnail: "/attic-insulation.png",
    duration: "18:42",
  },
  {
    id: 3,
    title: "Equipment Maintenance 101",
    show: "Gear Guide",
    thumbnail: "/spray-foam-equipment-maintenance.jpg",
    duration: "31:20",
  },
  {
    id: 4,
    title: "Commercial Project Walkthrough",
    show: "On the Job",
    thumbnail: "/commercial-building-insulation.jpg",
    duration: "45:10",
  },
]

const popularShows = [
  {
    id: 1,
    title: "Foam Facts",
    description: "Deep dives into spray foam science and chemistry",
    thumbnail: "/spray-foam-science-laboratory.jpg",
    episodes: 24,
  },
  {
    id: 2,
    title: "Pro Tips",
    description: "Expert techniques from industry veterans",
    thumbnail: "/professional-contractor-teaching.jpg",
    episodes: 18,
  },
  {
    id: 3,
    title: "Gear Guide",
    description: "Equipment reviews and maintenance tutorials",
    thumbnail: "/spray-foam-equipment-tools.jpg",
    episodes: 15,
  },
  {
    id: 4,
    title: "On the Job",
    description: "Real project walkthroughs and case studies",
    thumbnail: "/construction-site-insulation-work.jpg",
    episodes: 32,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "SprayFoam Expo 2025",
    date: "March 15-17, 2025",
    location: "Las Vegas, NV",
    thumbnail: "/trade-show-convention-center.jpg",
  },
  {
    id: 2,
    title: "Safety Certification Workshop",
    date: "April 8, 2025",
    location: "Online",
    thumbnail: "/safety-training-workshop.jpg",
  },
  {
    id: 3,
    title: "New Product Launch Livestream",
    date: "April 22, 2025",
    location: "Live on SprayFoam TV",
    thumbnail: "/product-launch-event.png",
  },
]
