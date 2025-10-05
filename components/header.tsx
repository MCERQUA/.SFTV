import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Radio } from "lucide-react"

export function Header() {
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
            <Link
              href="/contractors"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Find a Contractor
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:inline-flex bg-transparent">
            Submit Video
          </Button>
          <Button size="sm" className="hidden md:inline-flex">
            Sponsor Kit
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
