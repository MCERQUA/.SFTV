import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">Submit Content</h1>
        <p>Submit your spray foam videos and content for review.</p>
      </main>
      <Footer />
    </div>
  )
}