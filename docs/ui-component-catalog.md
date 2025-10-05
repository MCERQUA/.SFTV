# UI Component Catalog

This catalog documents each reusable component shipped with the homepage foundation. Update this file whenever components change or new ones are added.

## Global Sections
### `Header`
- **Purpose:** Persistent top navigation with brand identity, route links, and primary CTAs.
- **Key props/state:** None; renders static links. Responsive behaviour hides/show buttons using Tailwind breakpoints.
- **Future enhancements:** Implement mobile navigation drawer and wire CTA buttons to actual forms.

### `LiveHero`
- **Purpose:** Mimics a live streaming experience with hero imagery, program details, and playback controls.
- **Key props/state:** Internal `isPlaying` boolean toggles play/pause icon. Buttons currently placeholders for future player integration.
- **Future enhancements:** Replace static background with an embedded player (`next/dynamic` + HLS), connect controls to playback, display metadata (host, viewer count).

### `SchedulePreview`
- **Purpose:** Highlights today's programming in a responsive grid.
- **Key props/state:** Local `schedule` array (hardcoded) with `time`, `title`, and `status`. Status drives styling for the live entry.
- **Future enhancements:** Accept schedule data via props, link each card to detailed show pages, show timezone conversions.

### `ContentCarousel`
- **Purpose:** Generic carousel for episodes, shows, and events.
- **Props:**
  - `title: string` – section heading.
  - `items: CarouselItem[]` – array containing fields such as `title`, `thumbnail`, `duration`, `episodes`, `date`, and `location`.
- **State:** `startIndex` integer to control the current window of items (4 visible at a time).
- **Behaviours:** Prev/next buttons clamp the index to `0` and `items.length - 4`. Cards display contextual metadata (duration, episode count, date/location) when provided.
- **Future enhancements:** Add keyboard navigation, autoplay, drag/scroll gestures, and responsive item counts.

### `CTASection`
- **Purpose:** Drive user conversion with two prominent cards (Submit Video, Find a Contractor).
- **Key props/state:** None; CTA destinations are static routes.
- **Future enhancements:** Track clicks, personalise CTAs based on user type, and integrate form modals.

### `Footer`
- **Purpose:** Provide secondary navigation, community links, and company info.
- **Key props/state:** None; includes dynamic copyright year.
- **Future enhancements:** Add newsletter signup, social links, localisation-aware content.

## Shared UI Primitives (`components/ui`)
While not exhaustively documented here, the `components/ui` directory contains shadcn-derived primitives (Button, Card, Badge, etc.). When customising or adding primitives, update this section with API notes and usage examples to prevent duplication.
