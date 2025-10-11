"use client"

import { useState } from "react"
import { X, Building2, Mail, Phone, User, MessageSquare, DollarSign, Calendar } from "lucide-react"
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

interface SponsorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SponsorModal({ isOpen, onClose }: SponsorModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    sponsorshipType: "",
    budget: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sponsor-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit sponsor inquiry')
      }

      const result = await response.json()
      console.log('Sponsor inquiry submitted:', result.id)

      setShowSuccess(true)

      // Reset form and close after showing success
      setTimeout(() => {
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          sponsorshipType: "",
          budget: "",
          message: "",
        })
        setShowSuccess(false)
        onClose()
      }, 3000)

    } catch (error) {
      console.error('Error submitting sponsor inquiry:', error)
      // You could add error state handling here
      alert('Failed to submit sponsor inquiry. Please try again.')
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
              <h2 className="text-xl md:text-2xl font-bold">Become a Sponsor</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Affordable 1-year partnerships to reach spray foam professionals
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
                  We've received your sponsorship inquiry and will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Company Information
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

                {/* Sponsorship Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Sponsorship Details
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sponsorshipType">Sponsorship Type *</Label>
                      <Select
                        value={formData.sponsorshipType}
                        onValueChange={(value) => handleSelectChange("sponsorshipType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sponsorship type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title">Title Sponsor (1 Year)</SelectItem>
                          <SelectItem value="platinum">Platinum Partner (1 Year)</SelectItem>
                          <SelectItem value="gold">Gold Partner (1 Year)</SelectItem>
                          <SelectItem value="silver">Silver Partner (1 Year)</SelectItem>
                          <SelectItem value="episode">Episode Sponsor (Per Episode)</SelectItem>
                          <SelectItem value="segment">Segment Sponsor (Per Segment)</SelectItem>
                          <SelectItem value="custom">Custom Package</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => handleSelectChange("budget", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2k">$2,000 - $5,000</SelectItem>
                          <SelectItem value="5k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k">$10,000 - $15,000</SelectItem>
                          <SelectItem value="20k">$15,000 - $25,000</SelectItem>
                          <SelectItem value="35k">$25,000 - $35,000</SelectItem>
                          <SelectItem value="50k">$35,000 - $50,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message / Special Requirements</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your sponsorship goals and any special requirements..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Benefits Info */}
                <div className="rounded-lg bg-primary/5 p-4 space-y-2">
                  <h4 className="font-semibold">Sponsorship Benefits Include:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Brand exposure to thousands of spray foam professionals</li>
                    <li>• Custom commercial production and 1-year placement</li>
                    <li>• Logo placement and brand mentions throughout content</li>
                    <li>• Industry event sponsorship opportunities</li>
                    <li>• Social media promotion across all channels</li>
                    <li>• Featured placement in contractor directory</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting || !formData.companyName || !formData.contactName || !formData.email || !formData.sponsorshipType}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Sponsorship Inquiry"}
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