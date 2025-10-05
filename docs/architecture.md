# Architecture & Codebase Tour

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript with React 19
- **Styling:** Tailwind CSS (via `app/globals.css`) with utility-first patterns and custom font variables (Geist Sans & Mono)
- **Component library primitives:** Local UI system derived from shadcn/ui stored in `components/ui`
- **Icons:** `lucide-react`
- **Analytics:** `@vercel/analytics`

## Directory Layout
```
.
├── app/
│   ├── globals.css         // Tailwind layer definitions and global tokens
│   ├── layout.tsx          // Root layout (fonts, Suspense boundary, Analytics)
│   └── page.tsx            // Homepage composition
├── components/
│   ├── header.tsx          // Sticky global navigation
│   ├── live-hero.tsx       // Live stream hero banner
│   ├── schedule-preview.tsx// Daily schedule cards
│   ├── content-carousel.tsx// Generic carousel for multiple content types
│   ├── cta-section.tsx     // Dual call-to-action cards
│   ├── footer.tsx          // Footer navigation and attribution
│   ├── theme-provider.tsx  // (Currently unused) theming helper for dark/light support
│   └── ui/                 // Shared UI primitives (Button, Card, Badge, etc.)
├── public/                 // Static assets referenced by components
├── styles/                 // Tailwind configuration extensions
└── docs/                   // Living documentation hub (this folder)
```

## Component Composition
`app/page.tsx` imports each major section component. Data for carousels is defined inline in the page and passed via props, while each section controls its own markup and styling.

### State & Interactivity
- `LiveHero` manages a local `isPlaying` state that toggles playback iconography.
- `ContentCarousel` maintains a `startIndex` state to paginate visible cards; navigation buttons mutate this state.
- All other sections render static content and rely on CSS for hover/active affordances.

### Styling Conventions
- Utility classes express layout, spacing, and typographic hierarchy. Tailwind's design tokens (e.g., `bg-card`, `text-muted-foreground`) map to the theme defined in `globals.css`.
- Cards use `group`/`group-hover` to animate images on hover, emphasising featured content.
- Responsiveness is driven by Tailwind breakpoints (`md`, `lg`) to adjust grid layouts and navigation visibility.

### Fonts & Layout
`app/layout.tsx` wires Geist Sans and Geist Mono via the `next/font` API and exposes them as CSS variables applied to the `<body>`. A top-level `<Suspense>` boundary enables future streaming data fetching with graceful fallbacks.

## External Integrations & Future Hooks
- The header/footer link to routes that do not yet exist; creating corresponding pages will be a first step when expanding content.
- `theme-provider.tsx` is scaffolded but unused. Enabling it would add dark-mode support across components.
- Static arrays in `app/page.tsx` should ultimately be replaced with data fetching functions (e.g., `generateStaticParams`, server actions, CMS clients).

## Testing & Quality
No automated tests are configured yet. When introducing tests consider:
- Component-level testing with React Testing Library or Storybook for visual regression.
- Type safety enforced via TypeScript; keep strict mode enabled in `tsconfig.json` when possible.
- Linting available via `pnpm lint` (Next.js built-in ESLint config).
