"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2, CheckCircle } from "lucide-react"

declare global {
  interface Window {
    cloudinary: any
  }
}

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (result: any) => void
  onUploadError?: (error: any) => void
  maxFileSize?: number
  folder?: string
  buttonText?: string
  buttonClassName?: string
}

export function CloudinaryUploadWidget({
  onUploadSuccess,
  onUploadError,
  maxFileSize = 25 * 1024 * 1024, // 25MB default
  folder = "uploads/pending",
  buttonText = "Upload Video",
  buttonClassName = ""
}: CloudinaryUploadWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Load Cloudinary Upload Widget script
    if (!window.cloudinary) {
      const script = document.createElement("script")
      script.src = "https://upload-widget.cloudinary.com/global/all.js"
      script.async = true
      document.body.appendChild(script)
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetRef.current) {
        widgetRef.current.destroy()
      }
    }
  }, [])

  const openWidget = () => {
    if (!window.cloudinary) {
      setErrorMessage("Upload widget is still loading. Please try again.")
      setUploadStatus("error")
      return
    }

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      setErrorMessage("Upload service is not configured. Please contact support.")
      setUploadStatus("error")
      return
    }

    // Create upload widget
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        resourceType: "video",
        folder: folder,
        maxFileSize: maxFileSize,
        clientAllowedFormats: ["mp4", "webm", "mov", "avi", "mkv"],
        maxDuration: 600, // 10 minutes max
        showPoweredBy: false,
        showAdvancedOptions: false,
        showCompletedButton: true,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1"
          },
          fonts: {
            default: {
              active: true
            }
          }
        },
        text: {
          en: {
            upload: {
              title: "Upload Your SprayFoam Video",
              button: "Select Video",
              drag_title: "Drag and drop your video here",
              error: {
                filesize: "File size must be less than 25MB",
                filetype: "Only video files are allowed"
              }
            }
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "upload-added") {
          setIsLoading(true)
          setUploadStatus("uploading")
          setErrorMessage("")
        }

        if (!error && result && result.event === "success") {
          setIsLoading(false)
          setUploadStatus("success")

          // Get video info
          const videoInfo = {
            publicId: result.info.public_id,
            url: result.info.secure_url,
            thumbnailUrl: result.info.secure_url.replace(/\.[^/.]+$/, ".jpg"),
            duration: result.info.duration,
            format: result.info.format,
            size: result.info.bytes,
            width: result.info.width,
            height: result.info.height,
            createdAt: result.info.created_at
          }

          onUploadSuccess(videoInfo)

          // Reset after success
          setTimeout(() => {
            setUploadStatus("idle")
          }, 3000)

          widget.close()
        }

        if (error) {
          console.error("Upload error:", error)
          setIsLoading(false)
          setUploadStatus("error")
          setErrorMessage(error.statusText || "Upload failed. Please try again.")
          if (onUploadError) {
            onUploadError(error)
          }
        }
      }
    )

    widgetRef.current = widget
    widget.open()
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={openWidget}
        disabled={isLoading}
        className={buttonClassName || "w-full"}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>

      {uploadStatus === "success" && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Video uploaded successfully! It will be reviewed before appearing on the site.
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === "error" && errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}