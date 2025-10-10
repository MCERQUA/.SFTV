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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Card Template */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">Company Name {i}</h3>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  Brief company description and services offered.
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>📺 X Videos</span>
                  <span>👁️ X Views</span>
                </div>

                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
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