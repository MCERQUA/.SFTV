"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Link from "next/link"

export function FloatingUploadButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-72 animate-in fade-in slide-in-from-bottom-4 rounded-lg border bg-card p-4 shadow-lg">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow-md hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
          <h3 className="mb-2 font-semibold">Upload Your Video</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Share your spray foam content with our community. Files up to 25MB.
          </p>
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/submit">
                <Upload className="mr-2 h-4 w-4" />
                Upload Video File
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/submit">Submit Video URL</Link>
            </Button>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:bg-primary/90 md:h-auto md:w-auto md:rounded-md md:px-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Upload className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Upload Video</span>
      </Button>
    </div>
  )
}