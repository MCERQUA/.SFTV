import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Become a Sponsor</h1>
        <p>Partner with SprayFoam TV to reach industry professionals.</p>
      </main>
      <Footer />
    </div>
  )
}