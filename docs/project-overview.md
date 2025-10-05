# Project Overview

## Vision
SprayFoam TV is a streaming hub designed for spray foam insulation professionals. The site highlights a live broadcast, curated schedule highlights, on-demand episode carousels, and calls-to-action that convert viewers into contributors, contractors, or sponsors.

## Target Audience
- **Spray foam contractors** seeking continuous education and industry updates.
- **Manufacturers and vendors** looking for sponsorship and advertising opportunities.
- **Homeowners or facilities managers** interested in finding vetted spray foam specialists.

## Core Value Proposition
1. **Always-on expertise** – a hero section emulating a live stream with contextual controls.
2. **At-a-glance programming** – a daily schedule preview highlighting currently live and upcoming shows.
3. **Curated libraries** – carousels for recent episodes, popular shows, and upcoming events.
4. **Action-oriented CTAs** – dedicated cards to submit content or find contractors.
5. **Trust-building footer** – navigation shortcuts and company details that reinforce credibility.

## Current Feature Set
| Area | Description | Files |
| --- | --- | --- |
| Global layout | App Router layout with Geist font pairing and analytics instrumentation. | `app/layout.tsx`
| Homepage composition | Stitches together hero, schedule, carousels, CTA, and footer. | `app/page.tsx`
| Header | Sticky navigation with responsive menu controls. | `components/header.tsx`
| Live hero | Live stream hero banner with playback controls and CTA buttons. | `components/live-hero.tsx`
| Schedule preview | Four-card summary of the daily programming slate. | `components/schedule-preview.tsx`
| Content carousel | Generic carousel powering episodes, shows, and events sections. | `components/content-carousel.tsx`
| CTA section | Dual call-to-action cards for video submission and contractor search. | `components/cta-section.tsx`
| Footer | Multi-column resource footer with dynamic copyright. | `components/footer.tsx`

## Content Model Snapshot
Current data is mocked directly in `app/page.tsx` as static arrays (`recentEpisodes`, `popularShows`, and `upcomingEvents`). These lists populate the `ContentCarousel` component. Future integrations should plan to replace these with CMS or API-driven data sources.

## Future Opportunities
- Expand routing to match header/footer navigation targets (Schedule, Shows, Events, etc.).
- Integrate a real streaming player in `LiveHero` and connect the controls to playback state.
- Externalise schedule and carousel data to a CMS or serverless API.
- Layer in authentication and user preferences (e.g., watchlists, reminders).
- Introduce sponsorship management tools and analytics dashboards.
