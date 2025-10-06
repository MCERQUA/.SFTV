"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Calendar,
  User,
  Film,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { VideoSubmission, getEmbedUrl } from "@/lib/video-utils"

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({})
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [approvalCategories, setApprovalCategories] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      // Use Netlify Functions endpoint on production (custom domain or Netlify)
      const isProduction = !window.location.hostname.includes('localhost')
      const endpoint = isProduction
        ? "/.netlify/functions/submissions"
        : "/api/submissions"

      const response = await fetch(endpoint)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setSubmissions(data)
    } catch (err) {
      setError("Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, status: "approved" | "rejected", category?: string, newFileName?: string) => {
    setProcessingId(id)
    try {
      // Find the submission to check if it has Cloudinary video
      const submission = submissions.find(s => s.id === id)

      // If submission has Cloudinary video, use the approval API
      if (submission && (submission as any).cloudinaryPublicId) {
        const response = await fetch("/api/videos/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: id,
            action: status === "approved" ? "approve" : "reject",
            category: category || submission.category,
            newFileName: newFileName,
            adminNotes: adminNotes[id] || ""
          })
        })

        if (!response.ok) throw new Error("Failed to process video")
      } else {
        // For non-Cloudinary videos, use the regular submission endpoint
        const isProduction = !window.location.hostname.includes('localhost')
        const endpoint = isProduction
          ? "/.netlify/functions/submissions"
          : "/api/submissions"

        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            status,
            adminNotes: adminNotes[id] || ""
          })
        })

        if (!response.ok) throw new Error("Failed to update")
      }

      await fetchSubmissions()
      setAdminNotes({ ...adminNotes, [id]: "" })
    } catch (err) {
      setError("Failed to update submission")
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getSourceBadge = (sourceType: string) => {
    const colors: { [key: string]: string } = {
      youtube: "bg-red-500",
      vimeo: "bg-blue-500",
      direct: "bg-purple-500",
      cloudinary: "bg-indigo-500",
      "google-drive": "bg-yellow-500",
      dropbox: "bg-blue-600",
      streamable: "bg-orange-500",
      other: "bg-gray-500"
    }
    return (
      <Badge className={colors[sourceType] || colors.other}>
        {sourceType.replace("-", " ").toUpperCase()}
      </Badge>
    )
  }

  const filterSubmissions = (status?: string) => {
    if (!status) return submissions
    return submissions.filter(s => s.status === status)
  }

  const SubmissionCard = ({ submission }: { submission: VideoSubmission }) => {
    const extendedSubmission = submission as any
    const embedUrl = submission.sourceType === "cloudinary" && extendedSubmission.cloudinaryUrl
      ? extendedSubmission.cloudinaryUrl
      : getEmbedUrl(submission.videoUrl, submission.sourceType)
    const showEmbed = ["youtube", "vimeo", "streamable"].includes(submission.sourceType) ||
                      (submission.sourceType === "cloudinary" && extendedSubmission.cloudinaryUrl)

    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{submission.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="h-3 w-3" />
                {submission.creatorName}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(submission.status)}
              {getSourceBadge(submission.sourceType)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showEmbed ? (
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              {submission.sourceType === "cloudinary" ? (
                <video
                  src={extendedSubmission.cloudinaryUrl}
                  poster={extendedSubmission.thumbnailUrl}
                  controls
                  className="h-full w-full"
                />
              ) : (
                <iframe
                  src={embedUrl}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg bg-muted p-8">
              <div className="text-center">
                <Film className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Video preview not available</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.open(submission.videoUrl, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Video
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm">{submission.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {submission.contactEmail}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(submission.submittedAt).toLocaleDateString()}
              </span>
              {submission.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {submission.duration}
                </span>
              )}
              {extendedSubmission.fileSize && (
                <span className="flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  {(extendedSubmission.fileSize / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
              {extendedSubmission.videoFormat && (
                <span className="flex items-center gap-1">
                  Format: {extendedSubmission.videoFormat.toUpperCase()}
                </span>
              )}
            </div>
            {extendedSubmission.cloudinaryPublicId && (
              <div className="text-xs text-muted-foreground">
                Cloudinary ID: {extendedSubmission.cloudinaryPublicId}
              </div>
            )}
          </div>

          {submission.status === "pending" && (
            <div className="space-y-3 border-t pt-4">
              {extendedSubmission.cloudinaryPublicId && (
                <div className="space-y-2">
                  <Label htmlFor={`category-${submission.id}`}>Approval Category</Label>
                  <Select
                    value={approvalCategories[submission.id] || submission.category}
                    onValueChange={(value) => setApprovalCategories({ ...approvalCategories, [submission.id]: value })}
                  >
                    <SelectTrigger id={`category-${submission.id}`}>
                      <SelectValue placeholder="Select category for approval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial-shorts">Commercial Shorts</SelectItem>
                      <SelectItem value="commercials-longer">Commercials Longer</SelectItem>
                      <SelectItem value="music-video-commercials">Music Video Commercials</SelectItem>
                      <SelectItem value="funny-clips">Funny Clips</SelectItem>
                      <SelectItem value="shows-cartoons">Shows/Cartoons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Textarea
                placeholder="Admin notes (optional)"
                value={adminNotes[submission.id] || ""}
                onChange={(e) => setAdminNotes({ ...adminNotes, [submission.id]: e.target.value })}
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => updateSubmissionStatus(
                    submission.id,
                    "approved",
                    approvalCategories[submission.id] || submission.category
                  )}
                  disabled={processingId === submission.id}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateSubmissionStatus(submission.id, "rejected")}
                  disabled={processingId === submission.id}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}

          {submission.adminNotes && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Admin Notes:</p>
              <p className="text-sm text-muted-foreground">{submission.adminNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Video Submissions</h1>
          <Button onClick={fetchSubmissions} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({filterSubmissions("pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({filterSubmissions("approved").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({filterSubmissions("rejected").length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({submissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {filterSubmissions("pending").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No pending submissions</p>
                </CardContent>
              </Card>
            ) : (
              filterSubmissions("pending").map(sub => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            {filterSubmissions("approved").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No approved submissions</p>
                </CardContent>
              </Card>
            ) : (
              filterSubmissions("approved").map(sub => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            {filterSubmissions("rejected").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No rejected submissions</p>
                </CardContent>
              </Card>
            ) : (
              filterSubmissions("rejected").map(sub => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Film className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No submissions yet</p>
                </CardContent>
              </Card>
            ) : (
              submissions.map(sub => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}