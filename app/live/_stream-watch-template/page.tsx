import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Radio, CalendarClock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LIVE_STREAMS, getStream } from "@/lib/live-streams";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LIVE_STREAMS.map((stream) => ({ slug: stream.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stream = getStream(slug);
  if (!stream) return {};
  return {
    title: `${stream.title} — Live Stream | ${stream.org}`,
    description: stream.description,
    alternates: { canonical: `/live/${stream.slug}` },
  };
}

export default async function StreamWatchPage({ params }: Props) {
  const { slug } = await params;
  const stream = getStream(slug);
  if (!stream) notFound();

  return (
    <>
      <section className="border-b bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3">
            {stream.status === "live" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                <Radio className="h-3 w-3" aria-hidden />
                Live now
              </span>
            )}
            <span className="text-sm font-medium text-muted-foreground">{stream.org}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{stream.title}</h1>
          {stream.schedule && (
            <p className="mt-3 inline-flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="h-4 w-4" aria-hidden />
              {stream.schedule}
            </p>
          )}
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{stream.description}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {stream.youtubeId ? (
          <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-xl border bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${stream.youtubeId}`}
              title={`${stream.title} — live stream by ${stream.org}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mx-auto max-w-4xl rounded-xl border bg-card p-8 text-center">
            <p className="text-lg font-medium">This stream is watched on {stream.org}&rsquo;s own page.</p>
            <p className="mt-2 text-muted-foreground">
              We link you straight to the source rather than re-hosting their broadcast.
            </p>
            <div className="mt-6">
              <Button asChild>
                <a href={stream.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  Watch on {stream.org}
                </a>
              </Button>
            </div>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-4xl text-sm text-muted-foreground">
          Stream content, scheduling, and broadcast are owned and operated by {stream.org}.
        </p>
      </section>
    </>
  );
}
