export type StreamStatus = "live" | "upcoming" | "ended";

export interface LiveStream {
  slug: string;
  title: string;
  org: string;
  description: string;
  /** Real, verified outbound URL for the stream or the org's live/watch page. */
  url: string;
  status: StreamStatus;
  /** Human-readable schedule label, e.g. "Thursday, Sept 10 — 2:00 PM ET". */
  schedule?: string;
  /**
   * Optional verified YouTube video ID. Only set this after watching the ID
   * load on youtube.com/watch — never guess. When absent, the watch page
   * links out instead of embedding.
   */
  youtubeId?: string;
}

export interface LiveSource {
  org: string;
  description: string;
  url: string;
}

/**
 * Where the spray foam industry actually broadcasts live. Every URL here is a
 * top-level company URL already verified at build time — same rule as the
 * video cards: no guessed deep paths, no fabricated embeds.
 */
export const LIVE_SOURCES: LiveSource[] = [
  {
    org: "Graco",
    description: "Equipment manufacturer — contractor training and product demos.",
    url: "https://www.graco.com",
  },
  {
    org: "SprayWorks",
    description: "Rigs, equipment, and hands-on training sessions.",
    url: "https://sprayworksequipment.com",
  },
  {
    org: "SPFA",
    description: "Spray Polyurethane Foam Alliance — industry webinars and events.",
    url: "https://www.sprayfoam.org",
  },
  {
    org: "BASF SPF",
    description: "Chemical supplier — application science and product education.",
    url: "https://www.spf.basf.com",
  },
  {
    org: "ProFoam",
    description: "Distributor — product and jobsite livestreams.",
    url: "https://www.profoam.com",
  },
  {
    org: "Spray Foam Magazine",
    description: "Trade press — interviews and event coverage.",
    url: "https://www.sprayfoammagazine.com/videos",
  },
];

/**
 * Scheduled or in-progress streams. Add the first real entry here, then move
 * app/live/_stream-watch-template/page.tsx to app/live/[slug]/page.tsx
 * — a [slug] route with an EMPTY generateStaticParams breaks `output: export`,
 * which is why the watch page ships dormant as a private folder. Rebuild ships
 * the stream on /live and its own /live/<slug> watch page.
 */
export const LIVE_STREAMS: LiveStream[] = [];

export function getStream(slug: string): LiveStream | undefined {
  return LIVE_STREAMS.find((s) => s.slug === slug);
}
