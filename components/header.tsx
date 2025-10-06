"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Radio, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Radio className="h-6 w-6 text-primary" />
            <span className="font-mono text-xl font-bold tracking-tight">
              SPRAYFOAM<span className="text-primary">TV</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/schedule"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Schedule
            </Link>
            <Link
              href="/shows"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Shows
            </Link>
            <Link
              href="/events"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Events
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/sponsor">Sponsor Kit</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="/schedule"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Schedule
            </Link>
            <Link
              href="/shows"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Shows
            </Link>
            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Events
            </Link>
            <Link
              href="/sponsor"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
            >
              Sponsor Kit
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
