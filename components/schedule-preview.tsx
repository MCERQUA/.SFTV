import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

export function SchedulePreview() {
  const schedule = [
    {
      time: "2:00 PM",
      title: "Foam Facts: Closed Cell Deep Dive",
      status: "live",
    },
    {
      time: "3:00 PM",
      title: "Pro Tips: Attic Application Techniques",
      status: "upcoming",
    },
    {
      time: "4:00 PM",
      title: "Gear Guide: Equipment Maintenance",
      status: "upcoming",
    },
    {
      time: "5:00 PM",
      title: "On the Job: Commercial Project Tour",
      status: "upcoming",
    },
  ]

  return (
    <section className="border-b border-border bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="font-mono text-2xl font-bold">Today's Schedule</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/schedule" className="gap-1">
              Full Schedule
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {schedule.map((item, index) => (
            <Card
              key={index}
              className={`p-4 transition-colors hover:border-primary ${
                item.status === "live" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="font-mono text-sm font-bold text-primary">{item.time}</p>
                  <p className="text-sm font-medium leading-tight text-pretty">{item.title}</p>
                </div>
                {item.status === "live" && (
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-destructive" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
