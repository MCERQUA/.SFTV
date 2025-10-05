import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Upcoming Events</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-xl font-bold">{event.title}</h2>
                <p className="mb-4 text-muted-foreground">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.attendees}
                  </div>
                </div>
                <Button className="mt-4 w-full">Register Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

const events = [
  {
    id: 1,
    title: "SprayFoam Convention 2024",
    description: "Annual gathering of industry professionals",
    date: "March 15-17, 2024",
    location: "Las Vegas, NV",
    attendees: "500+ Expected",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Regional Training Workshop",
    description: "Hands-on training for new installers",
    date: "February 8, 2024",
    location: "Dallas, TX",
    attendees: "50 Spots Available",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Virtual Tech Summit",
    description: "Latest innovations in spray foam technology",
    date: "January 25, 2024",
    location: "Online",
    attendees: "Unlimited",
    image: "/placeholder.svg"
  }
]