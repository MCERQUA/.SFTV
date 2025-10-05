import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <p>Terms and conditions for using SprayFoam TV.</p>
      </main>
      <Footer />
    </div>
  )
}