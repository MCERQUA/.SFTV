"use client"

import { Header } from "@/components/header"
import { notFound } from "next/navigation"

// Company data mapping
const companies = {
  "cortez-industries": {
    name: "Cortez Industries",
    description: "Leading spray foam insulation solutions and equipment manufacturing.",
    founded: "2010",
    location: "Phoenix, Arizona",
    specialties: ["Equipment Manufacturing", "Spray Foam Solutions", "Industrial Applications"]
  },
  "jamsocial": {
    name: "JamSocial",
    description: "Creative marketing and video production company specializing in spray foam industry content.",
    founded: "2018",
    location: "Phoenix, Arizona",
    specialties: ["Video Production", "Marketing", "Creative Content"]
  },
  "kool-foam": {
    name: "Kool Foam",
    description: "Professional spray foam insulation contractors providing energy-efficient solutions.",
    founded: "2012",
    location: "Phoenix, Arizona",
    specialties: ["Residential Insulation", "Commercial Projects", "Energy Efficiency"]
  },
  "noble-insulation": {
    name: "Noble Insulation",
    description: "Premier insulation contractor serving residential and commercial clients.",
    founded: "2015",
    location: "Phoenix, Arizona",
    specialties: ["Spray Foam Installation", "Attic Insulation", "Commercial Services"]
  },
  "insulation-contractors-of-arizona": {
    name: "Insulation Contractors of Arizona",
    description: "Arizona's leading insulation contractor with comprehensive service offerings.",
    founded: "2008",
    location: "Phoenix, Arizona",
    specialties: ["Duct Cleaning", "Spray Foam", "Energy Audits"]
  },
  "on-the-mark-spray-foam": {
    name: "On The Mark Spray Foam",
    description: "Precision spray foam insulation contractor with expert installation services.",
    founded: "2014",
    location: "Phoenix, Arizona",
    specialties: ["Precision Installation", "Residential Services", "Commercial Projects"]
  },
  "allstate-spray-foam": {
    name: "Allstate Spray Foam",
    description: "Trusted spray foam insulation contractor serving the entire state.",
    founded: "2013",
    location: "Phoenix, Arizona",
    specialties: ["State-wide Service", "Quality Installation", "Customer Satisfaction"]
  },
  "mad-dog-sprayfoam": {
    name: "Mad Dog SprayFoam",
    description: "High-energy spray foam contractor known for reliable and fast service.",
    founded: "2016",
    location: "Phoenix, Arizona",
    specialties: ["Fast Installation", "Reliable Service", "Competitive Pricing"]
  },
  "sprayfoam-tv": {
    name: "SprayFoam TV",
    description: "The premier video platform for spray foam insulation professionals and enthusiasts.",
    founded: "2024",
    location: "Phoenix, Arizona",
    specialties: ["Video Content", "Industry Education", "Professional Training"]
  }
}

interface CompanyPageProps {
  params: Promise<{ slug: string }>
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params
  const company = companies[slug as keyof typeof companies]

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Company Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{company.name}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {company.description}
            </p>
          </div>

          {/* Company Details */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">Founded</h3>
              <p className="text-2xl font-bold">{company.founded}</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">Location</h3>
              <p className="text-lg">{company.location}</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2 text-orange-500">Services</h3>
              <ul className="space-y-1">
                {company.specialties.map((specialty, index) => (
                  <li key={index} className="text-sm">{specialty}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center bg-card p-12 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">Company Profile Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're working on building comprehensive company profiles with videos,
              testimonials, and detailed service information.
            </p>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full">
              <span className="animate-pulse">●</span>
              Under Construction
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}