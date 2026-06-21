"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const WEBHOOK_URL = "https://josh.jam-bot.com/social-api/api/leads/webhook/netlify?tenant=josh&site=sprayfoamtv.com"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, form_name: "quote", site: "sprayfoamtv.com" }),
      })
      setStatus("sent")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  const input = "w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Questions, content submissions, or sponsorship? Reach out below.
        </p>

        {status === "sent" ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Message Received!</h2>
            <p className="text-muted-foreground">We'll be in touch within one business day.</p>
          </div>
        ) : (
          <form
            name="contact"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-8 space-y-5"
          >
            <input type="hidden" name="form-name" value="contact" />
            <input name="bot-field" type="hidden" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Name *</label>
                <input required name="name" type="text" className={input} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email *</label>
                <input required name="email" type="email" className={input} placeholder="you@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
              <input name="phone" type="tel" className={input} placeholder="(555) 123-4567" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Inquiry Type</label>
              <select name="inquiry_type" className={input}>
                <option value="">Select…</option>
                <option value="general">General Inquiry</option>
                <option value="content">Content Submission</option>
                <option value="sponsorship">Sponsorship</option>
                <option value="advertising">Advertising</option>
                <option value="press">Press / Media</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Message</label>
              <textarea name="message" rows={5} className={input} placeholder="How can we help you?" />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            {status === "error" && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
