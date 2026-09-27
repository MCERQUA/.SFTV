import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="border-y border-border bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-3xl gap-8">
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="font-mono text-2xl font-bold">Submit Your Video</h3>
              <p className="text-muted-foreground text-pretty">
                Share your expertise with the spray foam community. Submit project walkthroughs, tips, or product
                reviews to be featured on SprayFoam TV.
              </p>
              <Button size="lg" className="mt-4" asChild>
                <Link href="/submit">Submit Now</Link>
              </Button>
            </div>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          </Card>
        </div>
      </div>
    </section>
  )
}
