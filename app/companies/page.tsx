"use client";

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden mb-12">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-primary/30 via-background to-secondary/30"></div>
          {/* <video className="w-full h-full object-cover" autoPlay muted loop src="/hero-video.mp4" /> */}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Company Channels
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover spray foam contractors and their video content
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">

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

        {/* Company Grid - Square Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: "Allstate Spray Foam", location: "Multiple Locations", videos: 8 },
            { name: "On The Mark Spray Foam", location: "Regional", videos: 12 },
            { name: "Kool Foam", location: "Southwest", videos: 15 },
            { name: "Cortez Industries", location: "Arizona", videos: 6 },
            { name: "Insulation Contractors Of Arizona", location: "Arizona", videos: 9 },
            { name: "Noble Insulation", location: "Regional", videos: 7 },
            { name: "Mad Dog SprayFoam", location: "Regional", videos: 5 }
          ].map((company, i) => (
            <div key={i} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer">
              {/* Square Hero Area */}
              <div className="relative aspect-square overflow-hidden">
                {/* Background - can be replaced with actual company image/video */}
                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-muted to-secondary/30 group-hover:scale-105 transition-transform duration-300"></div>

                {/* Company Logo/Avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-card/90 backdrop-blur-sm border border-border rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{company.name.charAt(0)}</span>
                  </div>
                </div>

                {/* Video Count Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                    📺 {company.videos}
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{company.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{company.location}</p>
                <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs py-2 rounded-md transition-all duration-200">
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