import { NextRequest, NextResponse } from "next/server"
import {
  initDatabase,
  query
} from "@/lib/db"

// Initialize database on first load
initDatabase()

interface AIProductionInquiry {
  id: string
  companyName: string
  contactName: string
  email: string
  phone?: string
  projectType: string
  timeline: string
  message?: string
  submittedAt: string
  status: 'pending' | 'contacted' | 'in-progress' | 'completed' | 'closed'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.companyName || !body.contactName || !body.email || !body.projectType) {
      return NextResponse.json(
        { error: "Missing required fields: companyName, contactName, email, projectType" },
        { status: 400 }
      )
    }

    // Create AI production inquiry object
    const inquiry: AIProductionInquiry = {
      id: `ai_prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyName: body.companyName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || null,
      projectType: body.projectType,
      timeline: body.timeline || '',
      message: body.message || null,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }

    // Create ai_production_inquiries table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS ai_production_inquiries (
        id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        project_type TEXT NOT NULL,
        timeline TEXT,
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `)

    // Insert the AI production inquiry
    await query(
      `INSERT INTO ai_production_inquiries
       (id, company_name, contact_name, email, phone, project_type, timeline, message, submitted_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        inquiry.id,
        inquiry.companyName,
        inquiry.contactName,
        inquiry.email,
        inquiry.phone,
        inquiry.projectType,
        inquiry.timeline,
        inquiry.message,
        inquiry.submittedAt,
        inquiry.status
      ]
    )

    console.log("AI production consultation saved:", inquiry.id)

    return NextResponse.json(
      {
        message: "AI production consultation request received successfully",
        id: inquiry.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error in POST /api/ai-production-inquiry:", error)
    return NextResponse.json(
      {
        error: "Failed to save AI production consultation request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Inquiries carry names, emails and phone numbers. This listing had no authentication and no
  // consumer (only the consultation modal POSTs here), so it is not served (2026-09-13).
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  )
}
