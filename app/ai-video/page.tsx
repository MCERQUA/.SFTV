"use client";

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Play, Download, Sparkles } from "lucide-react"

export default function AIVideoPage() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a video prompt")
      return
    }

    if (!selectedImage) {
      setError("Please upload an input image")
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress(0)
    setGeneratedVideo(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 2000)

      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('image', selectedImage)

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await response.json()
      setGeneratedVideo(data.videoUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <div className="relative h-96 md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-secondary/20"></div>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                AI Video Generator
              </h1>
            </div>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Create professional spray foam videos using AI. Just describe what you want and our AI will generate it for you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Your Video
              </CardTitle>
              <CardDescription>
                Describe the spray foam video you want to create. Be specific about the scene, actions, and style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-2">
                  Input Image
                </label>
                <div className="space-y-4">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                  {imagePreview && (
                    <div className="aspect-video max-w-xs bg-muted rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Animation Prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Example: The spray foam starts expanding and filling the cavity, camera slowly zooms in on the application process..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {isGenerating && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating video...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Video Preview/Result */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Video</CardTitle>
              <CardDescription>
                Your AI-generated video will appear here when ready.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      src={generatedVideo}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your generated video will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Example Prompts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Example Prompts</CardTitle>
            <CardDescription>
              Get inspired with these sample video prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Professional contractor applying spray foam insulation in a residential attic, high-quality equipment, safety gear, detailed application process",
                "Time-lapse of spray foam expansion in wall cavity, showing complete coverage and thermal barrier formation",
                "Before and after comparison of home insulation, energy efficiency demonstration, cost savings visualization",
                "Commercial spray foam application on large building roof, professional crew, industrial equipment, aerial view"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="text-sm">{example}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate high-quality videos suitable for professional use in marketing and training.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry Specific</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Trained specifically on spray foam insulation processes and industry standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fast Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate professional videos in minutes, not hours or days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}