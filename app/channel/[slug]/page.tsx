"use client";

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

interface ChannelPageProps {
  params: {
    slug: string;
  };
}

// Company data
const companies = [
  { name: "Allstate Spray Foam", location: "Multiple Locations", videos: 8, slug: "allstate-spray-foam" },
  { name: "On The Mark Spray Foam", location: "Regional", videos: 12, slug: "on-the-mark-spray-foam" },
  { name: "Kool Foam", location: "Southwest", videos: 15, slug: "kool-foam" },
  { name: "Cortez Industries", location: "Arizona", videos: 6, slug: "cortez-industries" },
  { name: "Insulation Contractors Of Arizona", location: "Arizona", videos: 9, slug: "insulation-contractors-of-arizona" },
  { name: "Noble Insulation", location: "Regional", videos: 7, slug: "noble-insulation" },
  { name: "Mad Dog SprayFoam", location: "Regional", videos: 5, slug: "mad-dog-sprayfoam" }
];

export default function ChannelPage({ params }: ChannelPageProps) {
  const company = companies.find(c => c.slug === params.slug);

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
              backgroundImage: `url(/companies/${company.slug}/hero/hero-image.jpg)`,
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
                  src={`/companies/${company.slug}/logo/logo.png`}
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
            <section className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Featured Video</h2>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Featured video content for {company.name}</span>
              </div>
            </section>

            {/* Company Videos Grid */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">All Videos ({company.videos})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: company.videos }, (_, i) => (
                  <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">Video {i + 1}</h3>
                      <p className="text-sm text-muted-foreground">Video description for {company.name}</p>
                      <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                        <span>👁️ {(Math.floor(Math.random() * 1000) + 100).toLocaleString()} Views</span>
                        <span>📅 {Math.floor(Math.random() * 30) + 1} days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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