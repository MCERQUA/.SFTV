"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoSubmissionForm } from "@/components/video-submission-form"

export default function SubmitPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Submit Your Video</h1>
            <p className="mb-6 text-base text-muted-foreground md:text-lg">
              Share your spray foam content with our community. Upload your video file directly (up to 25MB) or provide a link from YouTube, Vimeo, Google Drive, and more.
            </p>
            <VideoSubmissionForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}