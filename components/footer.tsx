import Link from "next/link"
import { Radio } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-primary" />
              <span className="font-mono text-xl font-bold tracking-tight">
                SPRAYFOAM<span className="text-primary">TV</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-pretty">
              The 24/7 livestream channel and on-demand video hub for the spray foam insulation industry.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono font-semibold">Watch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/schedule" className="text-muted-foreground transition-colors hover:text-foreground">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/shows" className="text-muted-foreground transition-colors hover:text-foreground">
                  Shows
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono font-semibold">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/submit" className="text-muted-foreground transition-colors hover:text-foreground">
                  Submit Video
                </Link>
              </li>
              <li>
                <Link href="/contractors" className="text-muted-foreground transition-colors hover:text-foreground">
                  Find a Contractor
                </Link>
              </li>
              <li>
                <Link href="/sponsor" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sponsor Kit
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SprayFoam TV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
