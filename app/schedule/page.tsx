import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Programming Schedule</h1>

        <div className="grid gap-4">
          {schedule.map((day) => (
            <Card key={day.day} className="p-6">
              <h2 className="mb-4 text-2xl font-bold">{day.day}</h2>
              <div className="space-y-3">
                {day.programs.map((program, index) => (
                  <div key={index} className="flex items-center justify-between border-l-4 border-primary pl-4">
                    <div>
                      <h3 className="font-semibold">{program.title}</h3>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {program.time}
                      {program.live && <Badge className="ml-2">LIVE</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

const schedule = [
  {
    day: "Monday",
    programs: [
      { time: "9:00 AM", title: "Morning Foam Report", description: "Industry news and updates", live: true },
      { time: "2:00 PM", title: "Technique Tuesday", description: "Installation best practices" },
      { time: "7:00 PM", title: "Foam Facts Live", description: "Weekly deep dive", live: true }
    ]
  },
  {
    day: "Tuesday",
    programs: [
      { time: "10:00 AM", title: "Equipment Essentials", description: "Maintenance and troubleshooting" },
      { time: "3:00 PM", title: "Safety First", description: "Safety protocols and updates" },
      { time: "8:00 PM", title: "Industry Spotlight", description: "Featured contractors and projects" }
    ]
  },
  {
    day: "Wednesday",
    programs: [
      { time: "9:00 AM", title: "Morning Foam Report", description: "Industry news and updates", live: true },
      { time: "1:00 PM", title: "Product Showcase", description: "New products and innovations" },
      { time: "6:00 PM", title: "Contractor Corner", description: "Business insights", live: true }
    ]
  }
]