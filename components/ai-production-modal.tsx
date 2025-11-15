"use client"

import { useState } from "react"
import { X, Video, Mail, Phone, User, MessageSquare, Building2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AIProductionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AIProductionModal({ isOpen, onClose }: AIProductionModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    projectType: "",
    timeline: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/ai-production-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit consultation request')
      }

      const result = await response.json()
      console.log('AI production consultation submitted:', result.id)

      setShowSuccess(true)

      // Reset form and close after showing success
      setTimeout(() => {
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          projectType: "",
          timeline: "",
          message: "",
        })
        setShowSuccess(false)
        onClose()
      }, 3000)

    } catch (error) {
      console.error('Error submitting AI production consultation:', error)
      alert('Failed to submit consultation request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
        <div className="bg-card rounded-lg shadow-2xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Bring Your Brand to Life
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Professional AI-powered commercials and shows for your spray foam business
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5 text-orange-500" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
            {showSuccess ? (
              <div className="py-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  We've received your consultation request and will contact you within 24 hours to discuss your project.
                </p>
              </div>
            ) : (
              <>
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Company Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="Your Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@company.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Project Details
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type *</Label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => handleSelectChange("projectType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commercial-short">Short Commercial (10-30s)</SelectItem>
                          <SelectItem value="commercial-long">Long-Form Commercial (30s-2min)</SelectItem>
                          <SelectItem value="music-video">Music Video Commercial</SelectItem>
                          <SelectItem value="show-series">Show or Series</SelectItem>
                          <SelectItem value="promotional">Promotional Video</SelectItem>
                          <SelectItem value="social-media">Social Media Content</SelectItem>
                          <SelectItem value="custom">Custom Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => handleSelectChange("timeline", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                          <SelectItem value="standard">Standard (2-4 weeks)</SelectItem>
                          <SelectItem value="flexible">Flexible (1-2 months)</SelectItem>
                          <SelectItem value="ongoing">Ongoing Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details / Vision</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your vision, target audience, brand message, or any specific ideas you have in mind..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Benefits Info */}
                <div className="rounded-lg bg-primary/5 p-4 space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    What You'll Get:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Professional AI-generated video content tailored to your brand</li>
                    <li>• Broadcast-quality commercials and promotional material</li>
                    <li>• Featured placement on SprayFoam TV platform</li>
                    <li>• Social media ready content in multiple formats</li>
                    <li>• Fast turnaround with unlimited revision rounds</li>
                    <li>• Full commercial rights to all created content</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting || !formData.companyName || !formData.contactName || !formData.email || !formData.projectType}
                  >
                    {isSubmitting ? "Submitting..." : "Request Free Consultation"}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
