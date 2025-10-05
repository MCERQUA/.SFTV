import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <p>Your privacy is important to us at SprayFoam TV.</p>
      </main>
      <Footer />
    </div>
  )
}