"use client";

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Company Channels
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover spray foam contractors and their video content
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            />
          </div>
          <select className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground">
            <option>All Locations</option>
            <option>Location 1</option>
            <option>Location 2</option>
          </select>
          <select className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary text-foreground">
            <option>All Services</option>
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Company Card Template */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors group">
              {/* Square Hero Image/Video Area */}
              <div className="relative aspect-square overflow-hidden">
                {/* Background Image/Video Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-muted to-secondary/20"></div>

                {/* Optional: Video background for company cards */}
                {/* <video
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  autoPlay
                  muted
                  loop
                  src={`/company-videos/company-${i}-hero.mp4`}
                /> */}

                {/* Optional: Image background for company cards */}
                {/* <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={`/company-images/company-${i}-hero.jpg`}
                  alt={`Company ${i} Background`}
                /> */}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>

                {/* Company Logo/Avatar Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-card/80 backdrop-blur-sm border border-border rounded-lg"></div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute top-4 right-4 text-right">
                  <div className="text-white text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                    📺 {Math.floor(Math.random() * 50) + 5} Videos
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1 line-clamp-1">Company Name {i}</h3>
                <p className="text-sm text-muted-foreground mb-3">Location {i}</p>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  Professional spray foam insulation services and solutions.
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>👁️ {(Math.floor(Math.random() * 500) + 100).toLocaleString()} Views</span>
                  <span>⭐ {(Math.random() * 2 + 3).toFixed(1)}</span>
                </div>

                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  View Channel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}