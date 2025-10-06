import Link from "next/link"
import { Video, Sparkles, ArrowRight } from "lucide-react"

export function JamEditorBanner() {
  return (
    <section className="relative overflow-hidden border-y-2 border-red-600/30 bg-black py-8">
      {/* Red glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      {/* Animated glow orbs */}
      <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="group relative flex flex-col items-center justify-between gap-4 rounded-lg border border-red-600/20 bg-gradient-to-r from-gray-900/90 via-black to-gray-900/90 p-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all hover:shadow-[0_0_40px_rgba(239,68,68,0.25)] md:flex-row md:p-8">
          {/* Left side content */}
          <div className="flex items-center gap-4">
            <div className="hidden h-12 w-12 items-center justify-center rounded-lg border border-red-600/30 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] md:flex">
              <Video className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">
                Try{" "}
                <Link
                  href="https://video.jamsocial.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-all hover:gap-2"
                >
                  <span className="font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">
                    JAM
                  </span>
                  <span className="text-white">Video Editor</span>
                  <ArrowRight className="h-4 w-4 text-red-500" />
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Professional online video editing - no downloads required
              </p>
            </div>
          </div>

          {/* Right side CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="h-4 w-4 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span>Free to use</span>
            </div>
            <Link
              href="https://video.jamsocial.app"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:bg-red-700 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]"
            >
              <span className="relative z-10">Start Editing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>

          {/* Corner accents */}
          <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-red-600/40" />
          <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-red-600/40" />
        </div>
      </div>
    </section>
  )
}