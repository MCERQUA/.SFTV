"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Link, Youtube, Film } from "lucide-react"
import { detectVideoSource, getEmbedUrl, getThumbnailUrl, videoCategories, type VideoSourceType } from "@/lib/video-utils"

export function VideoSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    creatorName: "",
    contactEmail: "",
    videoUrl: "",
    duration: "",
    twitter: "",
    instagram: "",
    website: "",
    additionalNotes: "",
    termsAccepted: false
  })

  const [detectedSource, setDetectedSource] = useState<VideoSourceType>("other")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, videoUrl: url })
    const source = detectVideoSource(url)
    setDetectedSource(source)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.termsAccepted) {
      setErrorMessage("Please accept the terms and conditions")
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const submission = {
        ...formData,
        sourceType: detectedSource,
        embedUrl: getEmbedUrl(formData.videoUrl, detectedSource),
        thumbnailUrl: getThumbnailUrl(formData.videoUrl, detectedSource),
        status: "pending" as const,
        submittedAt: new Date().toISOString(),
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // Use Netlify Functions endpoint on production
      const endpoint = window.location.hostname.includes('netlify')
        ? "/.netlify/functions/submissions"
        : "/api/submissions"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission)
      })

      if (!response.ok) throw new Error("Failed to submit")

      setSubmitStatus("success")
      setFormData({
        title: "",
        description: "",
        category: "",
        creatorName: "",
        contactEmail: "",
        videoUrl: "",
        duration: "",
        twitter: "",
        instagram: "",
        website: "",
        additionalNotes: "",
        termsAccepted: false
      })
      setDetectedSource("other")
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Failed to submit your video. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSourceIcon = () => {
    switch (detectedSource) {
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "vimeo":
      case "direct":
        return <Film className="h-4 w-4" />
      default:
        return <Link className="h-4 w-4" />
    }
  }

  const getSourceLabel = () => {
    switch (detectedSource) {
      case "youtube": return "YouTube"
      case "vimeo": return "Vimeo"
      case "direct": return "Direct Video"
      case "google-drive": return "Google Drive"
      case "dropbox": return "Dropbox"
      case "streamable": return "Streamable"
      default: return "External Link"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Submission Form</CardTitle>
        <CardDescription>
          Fill out the form below to submit your video for review. We'll notify you once it's been reviewed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your video title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL *</Label>
              <div className="relative">
                <Input
                  id="videoUrl"
                  required
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="YouTube, Vimeo, Google Drive, or direct video URL"
                />
                {formData.videoUrl && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground">
                    {getSourceIcon()}
                    <span>{getSourceLabel()}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: YouTube, Vimeo, Google Drive, Dropbox, Streamable, or direct MP4/WebM links
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {videoCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your video..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="creatorName">Creator/Company Name *</Label>
                <Input
                  id="creatorName"
                  required
                  value={formData.creatorName}
                  onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                  placeholder="Your name or company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  required
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Video Duration (optional)</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2:30 or 30 seconds"
              />
            </div>

            <div className="space-y-2">
              <Label>Social Media (optional)</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Twitter/X handle"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
                <Input
                  placeholder="Instagram handle"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
                <Input
                  placeholder="Website URL"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
              <Textarea
                id="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, termsAccepted: checked as boolean })
                }
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I confirm that I have the rights to submit this video and grant SprayFoamTV
                permission to feature it on the platform. I understand that submissions will
                be reviewed before publication.
              </Label>
            </div>
          </div>

          {submitStatus === "success" && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your video has been submitted successfully! We'll review it and notify you at the email provided.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !formData.termsAccepted}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Video"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}