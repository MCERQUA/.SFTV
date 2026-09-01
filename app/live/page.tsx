import type { Metadata } from "next";
import Link from "next/link";
import { Radio, CalendarClock, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIVE_SOURCES, LIVE_STREAMS, type StreamStatus } from "@/lib/live-streams";

export const metadata: Metadata = {
  title: "Live Streams — Spray Foam Industry Livestreams",
  description:
    "Live and upcoming spray foam industry livestreams — equipment demos, training sessions, and association webinars from Graco, SprayWorks, SPFA, BASF, ProFoam, and Spray Foam Magazine.",
  alternates: { canonical: "/live" },
};

const STATUS_STYLES: Record<StreamStatus, { label: string; classes: string }> = {
  live: { label: "Live now", classes: "bg-red-600 text-white" },
  upcoming: { label: "Upcoming", classes: "bg-accent text-accent-foreground" },
  ended: { label: "Ended", classes: "bg-muted text-muted-foreground" },
};

function StreamCard({ slug, title, org, description, status, schedule }: {
  slug: string;
  title: string;
  org: string;
  description: string;
  status: StreamStatus;
  schedule?: string;
}) {
  const s = STATUS_STYLES[status];
  return (
    <Link
      href={`/live/${slug}`}
      className="group block rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${s.classes}`}>
          {status === "live" && <Radio className="h-3 w-3" aria-hidden />}
          {s.label}
        </span>
        <span className="text-sm text-muted-foreground">{org}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold group-hover:underline">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {schedule && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium">
          <CalendarClock className="h-4 w-4" aria-hidden />
          {schedule}
        </p>
      )}
    </Link>
  );
}

export default function LivePage() {
  const live = LIVE_STREAMS.filter((s) => s.status === "live");
  const upcoming = LIVE_STREAMS.filter((s) => s.status === "upcoming");
  const hasStreams = live.length + upcoming.length > 0;

  return (
    <>
      <section className="border-b bg-muted py-16">
        <div className="container mx-auto px-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium">
            <Radio className="h-4 w-4" aria-hidden />
            Live Streams
          </p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Watch the spray foam industry, live
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Livestreamed equipment demos, contractor training, and association webinars —
            always credited to the real company broadcasting them.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {live.length > 0 ? "Live now" : "Scheduled streams"}
        </h2>
        {hasStreams ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...live, ...upcoming].map((stream) => (
              <StreamCard key={stream.slug} {...stream} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border bg-card p-8 text-center">
            <p className="text-lg font-medium">No streams scheduled right now.</p>
            <p className="mt-2 text-muted-foreground">
              When a live session is scheduled it will appear here with its own watch page.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              In the meantime, the industry&rsquo;s regular broadcast destinations are below —
              follow them to catch sessions as they happen.
            </p>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">Where the industry streams live</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          These are the real broadcast sources for spray foam live content. Every stream
          listed on this site credits the company producing it and links to them directly.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_SOURCES.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold group-hover:underline">{source.org}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{source.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                Visit source
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Hiring for a foam project?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Get matched with a vetted, insured spray foam contractor in your area.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link href="/contractors">Find Contractors</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
