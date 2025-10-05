import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>
        <p>Contact SprayFoam TV for inquiries and support.</p>
      </main>
      <Footer />
    </div>
  )
}