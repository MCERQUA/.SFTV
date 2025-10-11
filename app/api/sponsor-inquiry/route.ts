import { NextRequest, NextResponse } from "next/server"
import {
  initDatabase,
  query
} from "@/lib/db"

// Initialize database on first load
initDatabase()

interface SponsorInquiry {
  id: string
  companyName: string
  contactName: string
  email: string
  phone?: string
  sponsorshipType: string
  budget: string
  message?: string
  submittedAt: string
  status: 'pending' | 'contacted' | 'closed'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.companyName || !body.contactName || !body.email || !body.sponsorshipType) {
      return NextResponse.json(
        { error: "Missing required fields: companyName, contactName, email, sponsorshipType" },
        { status: 400 }
      )
    }

    // Create sponsor inquiry object
    const sponsorInquiry: SponsorInquiry = {
      id: `sponsor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyName: body.companyName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || null,
      sponsorshipType: body.sponsorshipType,
      budget: body.budget || '',
      message: body.message || null,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }

    // Create sponsor_inquiries table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS sponsor_inquiries (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        sponsorship_type TEXT NOT NULL,
        budget TEXT,
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `)

    // Insert the sponsor inquiry
    await query(
      `INSERT INTO sponsor_inquiries
       (id, company_name, contact_name, email, phone, sponsorship_type, budget, message, submitted_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sponsorInquiry.id,
        sponsorInquiry.companyName,
        sponsorInquiry.contactName,
        sponsorInquiry.email,
        sponsorInquiry.phone,
        sponsorInquiry.sponsorshipType,
        sponsorInquiry.budget,
        sponsorInquiry.message,
        sponsorInquiry.submittedAt,
        sponsorInquiry.status
      ]
    )

    console.log("Sponsor inquiry saved:", sponsorInquiry.id)

    return NextResponse.json(
      {
        message: "Sponsor inquiry received successfully",
        id: sponsorInquiry.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error in POST /api/sponsor-inquiry:", error)
    return NextResponse.json(
      {
        error: "Failed to save sponsor inquiry",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Create table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS sponsor_inquiries (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        sponsorship_type TEXT NOT NULL,
        budget TEXT,
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `)

    // Fetch all sponsor inquiries
    const inquiries = await query(`
      SELECT * FROM sponsor_inquiries
      ORDER BY submitted_at DESC
    `)

    return NextResponse.json(inquiries)

  } catch (error) {
    console.error("Error in GET /api/sponsor-inquiry:", error)
    return NextResponse.json(
      { error: "Failed to fetch sponsor inquiries" },
      { status: 500 }
    )
  }
}