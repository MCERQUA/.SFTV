import { NextRequest, NextResponse } from "next/server"
import { approveVideo, deleteVideo } from "@/lib/cloudinary"
import { updateSubmissionStatus } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { submissionId, action, category, newFileName } = await request.json()

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get submission details from database
    const pool = (await import("@/lib/db")).default
    const result = await pool.query(
      'SELECT * FROM submissions WHERE id = $1',
      [submissionId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    const submission = result.rows[0]
    const publicId = submission.cloudinary_public_id

    if (!publicId) {
      return NextResponse.json(
        { error: "No Cloudinary video associated with this submission" },
        { status: 400 }
      )
    }

    if (action === "approve") {
      // Move video to approved folder
      const movedVideo = await approveVideo(publicId, category || submission.category, newFileName)

      // Update submission status and new public ID
      await pool.query(
        `UPDATE submissions
         SET status = 'approved',
             reviewed_at = CURRENT_TIMESTAMP,
             cloudinary_public_id = $1,
             cloudinary_url = $2
         WHERE id = $3`,
        [movedVideo.public_id, movedVideo.secure_url, submissionId]
      )

      // Also update the regular video_url for compatibility
      await pool.query(
        `UPDATE submissions SET video_url = $1 WHERE id = $2`,
        [movedVideo.secure_url, submissionId]
      )

      return NextResponse.json({
        message: "Video approved and moved successfully",
        newPublicId: movedVideo.public_id,
        newUrl: movedVideo.secure_url
      })
    } else if (action === "reject") {
      // Delete video from Cloudinary
      await deleteVideo(publicId)

      // Update submission status
      await updateSubmissionStatus(submissionId, "rejected", "Video rejected and removed")

      return NextResponse.json({
        message: "Video rejected and deleted"
      })
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error processing video approval:", error)
    return NextResponse.json(
      { error: "Failed to process video approval" },
      { status: 500 }
    )
  }
}