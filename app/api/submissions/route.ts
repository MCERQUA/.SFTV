import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { VideoSubmission } from "@/lib/video-utils"

const SUBMISSIONS_FILE = path.join(process.cwd(), "data", "submissions.json")

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function getSubmissions(): Promise<VideoSubmission[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(SUBMISSIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveSubmissions(submissions: VideoSubmission[]) {
  await ensureDataDir()
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
}

export async function GET() {
  try {
    const submissions = await getSubmissions()
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const submission: VideoSubmission = await request.json()

    if (!submission.title || !submission.videoUrl || !submission.contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const submissions = await getSubmissions()
    submissions.push(submission)
    await saveSubmissions(submissions)

    return NextResponse.json(
      { message: "Submission received", id: submission.id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save submission" },
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

    const submissions = await getSubmissions()
    const index = submissions.findIndex(s => s.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    submissions[index] = {
      ...submissions[index],
      status,
      adminNotes,
      reviewedAt: new Date().toISOString()
    }

    await saveSubmissions(submissions)

    return NextResponse.json(
      { message: "Submission updated", submission: submissions[index] },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    )
  }
}