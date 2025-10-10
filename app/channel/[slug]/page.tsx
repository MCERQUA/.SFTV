"use client";

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

interface ChannelPageProps {
  params: {
    slug: string;
  };
}

// Company video data
const companyVideos = {
  "allstate-spray-foam": [
    {
      id: 20,
      title: "Allstate Cozy Royalites",
      thumbnail: "/thumbnails/funny-clips/Allstate-Cozy-royalites.jpg",
      videoPath: "/videos/funny-clips/Allstate-Cozy-royalites.mp4",
      category: "Comedy",
      duration: "0:17"
    }
  ],
  "cortez-industries": [
    {
      id: 1,
      title: "Rex O-Ring Game",
      thumbnail: "/thumbnails/commercial-shorts/cortex-rex.jpg",
      videoPath: "/videos/commercial-shorts/Cortex-industries-Rex-oring-game-sm.mp4",
      category: "Commercial Short",
      duration: "0:17"
    },
    {
      id: 15,
      title: "Cortex Rex: Day Off Camping",
      thumbnail: "/thumbnails/funny-clips/cortex-rex-camping.jpg",
      videoPath: "/videos/funny-clips/Cortez-Rex-Day-Off-Camping.mp4",
      category: "Animation",
      duration: "0:56"
    },
    {
      id: 16,
      title: "Rex Camping Recap",
      thumbnail: "/thumbnails/funny-clips/rex-camping-recap.jpg",
      videoPath: "/videos/funny-clips/Rex-Camping-Recap.mp4",
      category: "Animation",
      duration: "1:18"
    },
    {
      id: 17,
      title: "Cortex Rex: Density Check",
      thumbnail: "/thumbnails/funny-clips/cortex-density-check.jpg",
      videoPath: "/videos/funny-clips/Cortex-Rex-Density-Check.mp4",
      category: "Animation",
      duration: "0:08"
    },
    {
      id: 18,
      title: "Cortex Rex: Jobsite Emergency",
      thumbnail: "/thumbnails/funny-clips/cortex-jobsite-emergency.jpg",
      videoPath: "/videos/funny-clips/Cortez-Rex-Jobsite-Emergency.mp4",
      category: "Animation",
      duration: "0:08"
    }
  ],
  "kool-foam": [
    {
      id: 4,
      title: "KoolFoam - Fly South",
      thumbnail: "/thumbnails/commercial-shorts/koolfoam.jpg",
      videoPath: "/videos/commercial-shorts/koolfoam-fly-south.mp4",
      category: "Commercial Short",
      duration: "0:16"
    },
    {
      id: 21,
      title: "Kool Foam - Keep Kool",
      thumbnail: "/thumbnails/funny-clips/Kook-Foam-keep-Kool.jpg",
      videoPath: "/videos/funny-clips/Kook-Foam-keep-Kool.mp4",
      category: "Comedy",
      duration: "0:17"
    }
  ],
  "noble-insulation": [
    {
      id: 5,
      title: "Noble Insulation Commercial",
      thumbnail: "/thumbnails/commercial-shorts/noble-insulation.jpg",
      videoPath: "/videos/commercial-shorts/noble-insulation-commerical-sm.mp4",
      category: "Commercial Short",
      duration: "0:10"
    }
  ],
  "insulation-contractors-of-arizona": [
    {
      id: 7,
      title: "ICA Duct Clean Bodywash",
      thumbnail: "/thumbnails/commercials-longer/ica-bodywash.jpg",
      videoPath: "/videos/commercials-longer/ICA-Duct-Clean-Bodywash.mp4",
      category: "Commercial",
      duration: "0:23"
    },
    {
      id: 8,
      title: "ICA Getting Ducts Clean",
      thumbnail: "/thumbnails/commercials-longer/ica-ducts.jpg",
      videoPath: "/videos/commercials-longer/ICA-Getting-Ducts-Clean.mp4",
      category: "Commercial",
      duration: "0:33"
    }
  ],
  "mad-dog-sprayfoam": [
    {
      id: 19,
      title: "Mad Dog SprayFoam",
      thumbnail: "/thumbnails/funny-clips/mad-dog-sprayfoam.jpg",
      videoPath: "/videos/funny-clips/Mad-Dog-Sprayfoam.mp4",
      category: "Comedy",
      duration: "0:10"
    }
  ],
  "on-the-mark-spray-foam": []
};

// Company data
const companies = [
  { name: "Allstate Spray Foam", location: "Multiple Locations", videos: 1, slug: "allstate-spray-foam" },
  { name: "On The Mark Spray Foam", location: "Regional", videos: 0, slug: "on-the-mark-spray-foam" },
  { name: "Kool Foam", location: "Southwest", videos: 2, slug: "kool-foam" },
  { name: "Cortez Industries", location: "Arizona", videos: 5, slug: "cortez-industries" },
  { name: "Insulation Contractors Of Arizona", location: "Arizona", videos: 2, slug: "insulation-contractors-of-arizona" },
  { name: "Noble Insulation", location: "Regional", videos: 1, slug: "noble-insulation" },
  { name: "Mad Dog SprayFoam", location: "Regional", videos: 1, slug: "mad-dog-sprayfoam" }
];

export default function ChannelPage({ params }: ChannelPageProps) {
  const company = companies.find(c => c.slug === params.slug);
  const videos = companyVideos[params.slug as keyof typeof companyVideos] || [];

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Company Hero Section */}
      <div className="relative h-80 overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-gradient-to-r from-primary/30 via-background to-secondary/30"
            style={{
              backgroundImage: company.slug === 'allstate-spray-foam'
                ? `url(/companies/${company.slug}/hero/allstate-spftv-banner.png)`
                : `url(/companies/${company.slug}/hero/hero-image.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-card/80 backdrop-blur-sm border border-border rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={company.slug === 'allstate-spray-foam'
                    ? `/companies/${company.slug}/logo/Asset 1.png`
                    : `/companies/${company.slug}/logo/logo.png`}
                  alt={`${company.name} Logo`}
                  className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
                <div className="w-20 h-20 md:w-28 md:h-28 hidden items-center justify-center">
                  <span className="text-2xl md:text-4xl font-bold text-foreground">{company.name.charAt(0)}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                {company.name}
              </h1>
              <p className="text-gray-200 mb-4 text-lg">
                Professional spray foam insulation services in {company.location}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                <span>📍 {company.location}</span>
                <span>📺 {company.videos} Videos</span>
                <span>👁️ {(Math.floor(Math.random() * 5000) + 1000).toLocaleString()} Views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold">
                Contact Company
              </button>
              <button className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 backdrop-blur-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Videos */}
          <div className="lg:col-span-2">
            {/* Featured Video */}
            {videos.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Featured Video</h2>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster={videos[0].thumbnail}
                    preload="metadata"
                  >
                    <source src={videos[0].videoPath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground">{videos[0].title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>🎬 {videos[0].category}</span>
                    <span>⏱️ {videos[0].duration}</span>
                    <span>👁️ {(Math.floor(Math.random() * 5000) + 1000).toLocaleString()} Views</span>
                  </div>
                </div>
              </section>
            )}

            {/* Company Videos Grid */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                All Videos ({videos.length})
                {videos.length === 0 && " - Coming Soon"}
              </h2>
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, i) => (
                    <div key={video.id} className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-colors">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xl">▶</span>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{video.category}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>👁️ {(Math.floor(Math.random() * 1000) + 100).toLocaleString()} Views</span>
                          <span>📅 {Math.floor(Math.random() * 30) + 1} days ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <span className="text-4xl">🎬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Videos Yet</h3>
                  <p className="text-muted-foreground">
                    {company.name} hasn't uploaded any videos yet. Check back soon!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Company Info */}
          <div className="space-y-6">
            {/* About Company */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">About</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {company.name} provides professional spray foam insulation services.
                We specialize in residential and commercial insulation solutions.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground">{company.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Videos:</span>
                  <span className="text-foreground">{company.videos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty:</span>
                  <span className="text-foreground">Spray Foam Insulation</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span>📍</span>
                  <span className="text-muted-foreground">{company.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📞</span>
                  <span className="text-muted-foreground">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📧</span>
                  <span className="text-muted-foreground">info@{company.slug}.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>🌐</span>
                  <span className="text-muted-foreground">www.{company.slug}.com</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Residential Spray Foam Insulation</li>
                <li>• Commercial Insulation Services</li>
                <li>• Attic Insulation</li>
                <li>• Crawl Space Insulation</li>
                <li>• Energy Efficiency Consulting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}