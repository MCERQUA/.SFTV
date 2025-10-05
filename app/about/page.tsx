import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">About SprayFoam TV</h1>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed">
            SprayFoam TV is the premier 24/7 streaming platform dedicated to the spray foam insulation industry.
            We provide educational content, industry news, product demonstrations, and entertainment specifically
            tailored for spray foam professionals and enthusiasts.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}