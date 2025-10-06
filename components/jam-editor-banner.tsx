import Link from "next/link"
import { Video, Sparkles, ArrowRight } from "lucide-react"

export function JamEditorBanner() {
  return (
    <section className="border-t border-border bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-gray-900 to-black p-6 md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="hidden h-12 w-12 items-center justify-center rounded-lg bg-gray-800 md:flex">
              <Video className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">
                Try{" "}
                <Link
                  href="https://video.jamsocial.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                >
                  <span className="font-black text-red-600">JAM</span>
                  <span className="text-white">Video Editor</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-300">
                Professional online video editing - no downloads required
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Free to use</span>
            </div>
            <Link
              href="https://video.jamsocial.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Start Editing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}