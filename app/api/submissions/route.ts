import { NextRequest, NextResponse } from "next/server"
import { VideoSubmission } from "@/lib/video-utils"

// In-memory storage for development/demo
// In production, you'd use a database
let inMemorySubmissions: VideoSubmission[] = []

export async function GET() {
  try {
    return NextResponse.json(inMemorySubmissions)
  } catch (error) {
    console.error("Error in GET /api/submissions:", error)
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ensure we have all required fields
    if (!body.title || !body.videoUrl || !body.contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create submission object with all fields
    const submission: VideoSubmission = {
      id: body.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.title,
      description: body.description || "",
      category: body.category || "",
      creatorName: body.creatorName || "",
      contactEmail: body.contactEmail,
      videoUrl: body.videoUrl,
      sourceType: body.sourceType || "other",
      embedUrl: body.embedUrl,
      thumbnailUrl: body.thumbnailUrl,
      duration: body.duration,
      socialMedia: {
        twitter: body.twitter,
        instagram: body.instagram,
        website: body.website
      },
      additionalNotes: body.additionalNotes,
      status: "pending",
      submittedAt: body.submittedAt || new Date().toISOString()
    }

    // Add to in-memory storage
    inMemorySubmissions.push(submission)

    console.log("Submission saved:", submission.id)

    return NextResponse.json(
      { message: "Submission received", id: submission.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in POST /api/submissions:", error)
    return NextResponse.json(
      { error: "Failed to save submission", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, adminNotes } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const index = inMemorySubmissions.findIndex(s => s.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    inMemorySubmissions[index] = {
      ...inMemorySubmissions[index],
      status,
      adminNotes,
      reviewedAt: new Date().toISOString()
    }

    console.log("Submission updated:", id)

    return NextResponse.json(
      { message: "Submission updated", submission: inMemorySubmissions[index] },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in PATCH /api/submissions:", error)
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    )
  }
}