# Architecture & Codebase Tour

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript with React 19
- **Styling:** Tailwind CSS (via `app/globals.css`) with utility-first patterns and custom font variables (Geist Sans & Mono)
- **Component library primitives:** Local UI system derived from shadcn/ui stored in `components/ui`
- **Database:** PostgreSQL (Netlify DB/Neon) with connection pooling
- **Video Processing:** ffmpeg for thumbnails and duration detection
- **AI Integration:** HuggingFace Inference API (Ovi model - currently blocked)
- **Icons:** `lucide-react`
- **Analytics:** `@vercel/analytics` and custom view tracking

## Directory Layout
```
.
├── app/
│   ├── ai-video/           // AI video generation interface (ChatGPT-style)
│   ├── admin/              // Admin panel for managing submissions
│   │   └── submissions/    // Video submission management
│   ├── api/                // API routes
│   │   ├── generate-video/ // AI video generation endpoint
│   │   ├── submissions/    // Submission CRUD operations
│   │   ├── video-jobs/     // Async job status checking
│   │   └── video-views/    // View tracking endpoints
│   ├── companies/          // Company channel pages
│   │   └── [slug]/         // Dynamic company pages
│   ├── globals.css         // Tailwind layer definitions and global tokens
│   ├── layout.tsx          // Root layout (fonts, Suspense boundary, Analytics)
│   └── page.tsx            // Homepage composition
├── components/
│   ├── header.tsx          // Sticky global navigation with mobile menu
│   ├── live-hero.tsx       // Live stream hero banner
│   ├── schedule-preview.tsx// Daily schedule cards
│   ├── content-carousel.tsx// Generic carousel for multiple content types
│   ├── cta-section.tsx     // Dual call-to-action cards
│   ├── footer.tsx          // Footer navigation and attribution
│   ├── sponsor-modal.tsx   // Sponsorship inquiry modal
│   ├── video-modal.tsx     // Video player modal
│   ├── video-submission-form.tsx // User video submission form
│   ├── video-thumbnail.tsx // Dynamic thumbnail component
│   ├── theme-provider.tsx  // (Currently unused) theming helper for dark/light support
│   └── ui/                 // Shared UI primitives (60+ components)
├── lib/
│   ├── db.ts               // Database connection and queries
│   ├── video-data.ts       // Video content metadata
│   └── video-utils.ts      // Video processing utilities
├── hooks/                  // Custom React hooks
├── scripts/                // Utility scripts for video processing
├── public/
│   ├── companies/          // Company assets (logos, heroes, videos)
│   ├── videos/             // Video files organized by category
│   └── thumbnails/         // Generated video thumbnails
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

## Database Architecture
- **Provider:** PostgreSQL via Netlify DB (Neon-powered)
- **Connection:** Pooled connections using `pg` library
- **Tables:**
  - `submissions` - Video submission tracking with contact info and admin status
  - `video_views` - Aggregate view counts per video
  - `view_logs` - Detailed analytics with session tracking
  - `video_jobs` - AI video generation job status (planned)
- **Location:** Database configuration in `lib/db.ts`

## API Architecture
- **Video Views** (`/api/video-views`): GET/POST for view tracking and retrieval
- **Submissions** (`/api/submissions`): Full CRUD for video submission workflow
- **AI Video Generation** (`/api/generate-video`): Async video generation with job tracking
- **Video Jobs** (`/api/video-jobs`): Status polling for long-running AI generation

## AI Video Generation System
- **Interface:** ChatGPT-style UI with collapsible sidebar (`/ai-video`)
- **Status:** Currently blocked on HuggingFace API format issues
- **Architecture:** Async job processing with polling for timeout handling
- **Model:** Attempting to use `chetwinlow1/Ovi` for image-to-video generation
- **Storage:** Temporary in-memory job tracking (database integration attempted but failed)

## Company Channel System
- **Structure:** `/companies/[slug]` with dynamic routing
- **Assets:** Organized in `/public/companies/[slug]/` (logos, heroes, videos)
- **Companies:** 7 spray foam contractors with individual branding

## External Integrations & Future Hooks
- `theme-provider.tsx` is scaffolded but unused. Enabling it would add dark-mode support across components.
- Real streaming integration planned for `LiveHero` component
- All header/footer routes are now implemented with proper pages

## Testing & Quality
No automated tests are configured yet. When introducing tests consider:
- Component-level testing with React Testing Library or Storybook for visual regression.
- Type safety enforced via TypeScript; keep strict mode enabled in `tsconfig.json` when possible.
- Linting available via `pnpm lint` (Next.js built-in ESLint config).
