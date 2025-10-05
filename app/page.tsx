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
    title: "Cortex Industries Rex O-Ring Game",
    category: "Commercial Short",
    thumbnail: "/videos/commercial-shorts/Cortex-industries-Rex-oring-game-sm.mp4#t=0.1",
    videoPath: "/videos/commercial-shorts/Cortex-industries-Rex-oring-game-sm.mp4",
    duration: "0:30",
  },
  {
    id: 2,
    title: "Duck Cleaning Commercial",
    category: "Commercial Short",
    thumbnail: "/videos/commercial-shorts/duckcleaning-commerical.mp4#t=0.1",
    videoPath: "/videos/commercial-shorts/duckcleaning-commerical.mp4",
    duration: "0:45",
  },
  {
    id: 3,
    title: "Graco Fusion AP",
    category: "Commercial Short",
    thumbnail: "/videos/commercial-shorts/Graco Fusion AP.mp4#t=0.1",
    videoPath: "/videos/commercial-shorts/Graco Fusion AP.mp4",
    duration: "0:55",
  },
  {
    id: 4,
    title: "KoolFoam - Fly South",
    category: "Commercial Short",
    thumbnail: "/videos/commercial-shorts/koolfoam-fly-south.mp4#t=0.1",
    videoPath: "/videos/commercial-shorts/koolfoam-fly-south.mp4",
    duration: "0:40",
  },
  {
    id: 5,
    title: "Noble Insulation Commercial",
    category: "Commercial Short",
    thumbnail: "/videos/commercial-shorts/noble-insulation-commerical-sm.mp4#t=0.1",
    videoPath: "/videos/commercial-shorts/noble-insulation-commerical-sm.mp4",
    duration: "0:35",
  },
]

const commercialsLonger = [
  {
    id: 1,
    title: "EDI Commercial",
    category: "Extended Commercial",
    thumbnail: "/videos/commercials-longer/EDI-Commerical.mp4#t=0.1",
    videoPath: "/videos/commercials-longer/EDI-Commerical.mp4",
    duration: "3:45",
  },
  {
    id: 2,
    title: "ICA Duct Clean - Body Wash",
    category: "Extended Commercial",
    thumbnail: "/videos/commercials-longer/ICA-Duct-Clean-Bodywash.mp4#t=0.1",
    videoPath: "/videos/commercials-longer/ICA-Duct-Clean-Bodywash.mp4",
    duration: "2:20",
  },
  {
    id: 3,
    title: "ICA - Getting Ducts Clean",
    category: "Extended Commercial",
    thumbnail: "/videos/commercials-longer/ICA-Getting-Ducts-Clean.mp4#t=0.1",
    videoPath: "/videos/commercials-longer/ICA-Getting-Ducts-Clean.mp4",
    duration: "4:15",
  },
  {
    id: 4,
    title: "Only Foam - SprayFoam Party",
    category: "Extended Commercial",
    thumbnail: "/videos/commercials-longer/Only-Foam-SprayFoam-Party.mp4#t=0.1",
    videoPath: "/videos/commercials-longer/Only-Foam-SprayFoam-Party.mp4",
    duration: "3:30",
  },
]

const musicVideoCommercials = [
  {
    id: 1,
    title: "Mrs. SprayFoam - Call Me Maybe",
    artist: "Mrs. SprayFoam",
    thumbnail: "/videos/music-video-commercials/Mrs-SprayFoam-Call-Me-Maybe.mp4#t=0.1",
    videoPath: "/videos/music-video-commercials/Mrs-SprayFoam-Call-Me-Maybe.mp4",
    duration: "3:30",
  },
  {
    id: 2,
    title: "Mrs. SprayFoam - Let It Foam",
    artist: "Mrs. SprayFoam",
    thumbnail: "/videos/music-video-commercials/Mrs-Sprayfoam-Let-It-Foam.mp4#t=0.1",
    videoPath: "/videos/music-video-commercials/Mrs-Sprayfoam-Let-It-Foam.mp4",
    duration: "3:15",
  },
]

const funnyClips = [
  {
    id: 1,
    title: "Breaking Batts",
    category: "Comedy",
    thumbnail: "/videos/funny-clips/Breaking-Batts.mp4#t=0.1",
    videoPath: "/videos/funny-clips/Breaking-Batts.mp4",
    duration: "2:45",
  },
  {
    id: 2,
    title: "Insulated Chicken Brothers - Episode 1",
    category: "Comedy",
    thumbnail: "/videos/funny-clips/Insulated-chicken-brothers-cartoon.mp4#t=0.1",
    videoPath: "/videos/funny-clips/Insulated-chicken-brothers-cartoon.mp4",
    duration: "3:20",
  },
  {
    id: 3,
    title: "Insulated Chicken Brothers - Episode 2",
    category: "Comedy",
    thumbnail: "/videos/funny-clips/Insulated-Chicken-Brothers-Cartoon2.mp4#t=0.1",
    videoPath: "/videos/funny-clips/Insulated-Chicken-Brothers-Cartoon2.mp4",
    duration: "3:00",
  },
]

const showsCartoons = [
  {
    id: 1,
    title: "The Foam Rangers",
    description: "Animated series coming soon",
    thumbnail: "/placeholder.svg",
    status: "Coming Soon",
  },
  {
    id: 2,
    title: "Insulation Adventures",
    description: "Educational cartoon series",
    thumbnail: "/placeholder.svg",
    status: "Coming Soon",
  },
  {
    id: 3,
    title: "SprayFoam TV Weekly",
    description: "Weekly industry show",
    thumbnail: "/placeholder.svg",
    status: "Coming Soon",
  },
]