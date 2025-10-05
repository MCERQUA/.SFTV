import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone } from "lucide-react"

export default function ContractorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Featured Contractors</h1>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contractors.map((contractor) => (
            <Card key={contractor.id} className="overflow-hidden">
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{contractor.name}</h2>
                    <Badge className="mt-2">{contractor.specialty}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-semibold">{contractor.rating}</span>
                  </div>
                </div>
                <p className="mb-4 text-muted-foreground">{contractor.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {contractor.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {contractor.phone}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">View Profile</Button>
                  <Button size="sm" variant="outline" className="flex-1">Contact</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Become a Featured Contractor</h2>
          <p className="mb-6 text-muted-foreground">
            Join our network of certified spray foam professionals and grow your business
          </p>
          <Button size="lg">Apply Now</Button>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

const contractors = [
  {
    id: 1,
    name: "ProFoam Solutions",
    specialty: "Commercial",
    rating: "4.9",
    description: "Specializing in large-scale commercial insulation projects",
    location: "Houston, TX",
    phone: "(555) 123-4567"
  },
  {
    id: 2,
    name: "Elite Spray Systems",
    specialty: "Residential",
    rating: "4.8",
    description: "Expert residential insulation with 15+ years experience",
    location: "Phoenix, AZ",
    phone: "(555) 234-5678"
  },
  {
    id: 3,
    name: "Green Foam Experts",
    specialty: "Eco-Friendly",
    rating: "5.0",
    description: "Sustainable spray foam solutions for modern homes",
    location: "Portland, OR",
    phone: "(555) 345-6789"
  }
]