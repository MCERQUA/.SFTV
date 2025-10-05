import { NextRequest, NextResponse } from "next/server"
import { VideoSubmission } from "@/lib/video-utils"
import {
  initDatabase,
  getSubmissions,
  createSubmission,
  updateSubmissionStatus
} from "@/lib/db"

// Initialize database on first load
initDatabase()

export async function GET() {
  try {
    const submissions = await getSubmissions()
    return NextResponse.json(submissions)
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

    // Save to database
    const success = await createSubmission(submission)

    if (!success) {
      throw new Error("Failed to save submission to database")
    }

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

    const success = await updateSubmissionStatus(id, status, adminNotes)

    if (!success) {
      return NextResponse.json(
        { error: "Submission not found or update failed" },
        { status: 404 }
      )
    }

    console.log("Submission updated:", id)

    return NextResponse.json(
      { message: "Submission updated" },
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