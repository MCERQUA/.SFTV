import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ShowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Shows</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shows.map((show) => (
            <Card key={show.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img src={show.thumbnail} alt={show.title} className="h-full w-full object-cover" />
                {show.status === "Coming Soon" && (
                  <Badge className="absolute top-4 right-4">Coming Soon</Badge>
                )}
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-xl font-bold">{show.title}</h2>
                <p className="mb-4 text-muted-foreground">{show.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>{show.host}</span>
                  <span className="text-muted-foreground">{show.schedule}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

const shows = [
  {
    id: 1,
    title: "Foam Facts Live",
    description: "Weekly deep dive into spray foam science and best practices",
    host: "Mike Johnson",
    schedule: "Mondays 7PM EST",
    thumbnail: "/placeholder.svg",
    status: "Active"
  },
  {
    id: 2,
    title: "Contractor Corner",
    description: "Business tips and industry insights for spray foam contractors",
    host: "Sarah Williams",
    schedule: "Wednesdays 6PM EST",
    thumbnail: "/placeholder.svg",
    status: "Active"
  },
  {
    id: 3,
    title: "The Foam Rangers",
    description: "Animated series for the next generation of insulators",
    host: "Various",
    schedule: "Coming 2024",
    thumbnail: "/placeholder.svg",
    status: "Coming Soon"
  }
]