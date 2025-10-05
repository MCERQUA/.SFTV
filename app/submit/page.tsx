"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoSubmissionForm } from "@/components/video-submission-form"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-4xl font-bold">Submit Your Video</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Share your spray foam content with our community. We accept videos from YouTube, Vimeo, Google Drive, or direct links.
          </p>
          <VideoSubmissionForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}