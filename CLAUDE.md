# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules
- **DO NOT** assume or code anything "new" without asking questions or finding answers to "if" that new thing already has a system or something related setup
- **DO NOT DEPLOY TO LOCALHOST** - This runs on a cloud VPS
- **ALWAYS PUSH TO GITHUB** after changes are completed
- **CHECK EXISTING SYSTEMS FIRST** before implementing new features

## Project Overview

SprayFoam TV is a Next.js 15 video platform for spray foam insulation professionals. It's built with React 19, TypeScript, and Tailwind CSS, featuring a component library based on shadcn/ui primitives. The platform hosts various video content including commercial shorts, longer commercials, music video commercials, funny clips, and upcoming shows/cartoons.

## Development Commands

```bash
# Install dependencies (pnpm is preferred)
pnpm install

# Run development server
pnpm dev          # Starts on http://localhost:3000

# Build for production
pnpm build

# Run production build locally
pnpm start

# Lint code
pnpm lint

# Utility Scripts
node scripts/get-video-durations.sh     # Get actual video durations
node scripts/regenerate-thumbnails.sh   # Regenerate video thumbnails
```

## Architecture

### Tech Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript with React 19
- **Styling:** Tailwind CSS via `app/globals.css`
- **UI Components:** Custom shadcn/ui-based components in `components/ui/`
- **Icons:** lucide-react
- **Fonts:** Geist Sans & Mono (configured in `app/layout.tsx`)
- **Analytics:** @vercel/analytics
- **Database:** PostgreSQL (Netlify DB/Neon)
- **Video Processing:** ffmpeg (installed at `~/.local/bin/ffmpeg`)

### Database
- **Provider:** Netlify DB (powered by Neon PostgreSQL)
- **Database Name:** sprayfoamtv (neondb)
- **Connection:** Uses pooled connection via `DATABASE_URL` environment variable
- **Tables:**
  - `submissions` - Video submission tracking (contact info, status, admin notes)
  - `video_views` - Aggregate video view counts
  - `view_logs` - Detailed view analytics (session tracking, user agents)
- **Library:** Using `pg` (node-postgres) with connection pooling
- **Location:** Database configuration in `lib/db.ts`
- **Environment Variables Required:**
  - `DATABASE_URL` - PostgreSQL connection string (already configured in .env.local)

### Key Directories
- `app/` - Next.js App Router pages and root layout
  - `api/` - API routes
    - `submissions/` - Video submission handling
    - `video-views/` - View tracking endpoints
  - `admin/` - Admin panel pages
- `components/` - Feature components and UI primitives
  - `ui/` - Reusable shadcn/ui-based components (60+ components)
- `lib/` - Utility functions and data
  - `db.ts` - Database connection and queries
  - `video-data.ts` - Video content data
  - `video-utils.ts` - Video processing utilities
- `hooks/` - Custom React hooks
- `scripts/` - Utility scripts for video processing
- `public/`
  - `videos/` - Video files organized by category
  - `thumbnails/` - Generated video thumbnails
- `docs/` - Comprehensive project documentation

### Pages Available
- `/` - Homepage with video carousels
- `/about` - About page
- `/schedule` - Schedule page
- `/shows` - Shows listing
- `/events` - Events page
- `/submit` - Video submission form
- `/sponsor` - Sponsor information (modal form)
- `/contractors` - Find a contractor
- `/contact` - Contact information
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/admin/submissions` - Admin panel for video submissions

### Important Configuration
- **Path aliases:** Use `@/*` to import from project root
- **Build settings:** Currently ignores ESLint/TypeScript errors during build (see `next.config.mjs`)
- **TypeScript:** Strict mode enabled in `tsconfig.json`

## Component Architecture

### Main Components
- `components/header.tsx` - Sticky navigation with responsive menu and sponsor modal
- `components/live-hero.tsx` - Live stream hero with video playlist and controls
- `components/schedule-preview.tsx` - Daily schedule cards
- `components/content-carousel.tsx` - Reusable carousel with view tracking
- `components/cta-section.tsx` - Call-to-action cards (Submit Video, Find Contractor)
- `components/footer.tsx` - Multi-column footer navigation
- `components/sponsor-modal.tsx` - Sponsorship inquiry form
- `components/video-modal.tsx` - Video player modal
- `components/video-submission-form.tsx` - User video submission form
- `components/video-thumbnail.tsx` - Dynamic thumbnail generation

### Features Implemented
- **Mobile Navigation:** Hamburger menu with dropdown
- **Video View Tracking:** Automatic view counting with database persistence
- **Video Hover Preview:** Auto-play on hover with mute/unmute controls
- **Sponsor Modal:** Complete form for sponsorship inquiries
- **Video Submission System:** User submissions with admin review panel
- **Responsive Design:** Mobile-first with tablet/desktop breakpoints
- **Session Tracking:** Cookie-based sessions for analytics

### State Management
- Components use local React state (useState)
- No global state management currently implemented
- View counts fetched from API on component mount
- Session management via cookies

## Development Conventions

### Styling
- Use Tailwind utility classes exclusively
- Leverage existing `components/ui/` primitives before creating new ones
- Follow responsive patterns using Tailwind breakpoints (`md`, `lg`)
- Use CSS variables for theme tokens (defined in `globals.css`)
- Mobile controls are always visible, desktop shows on hover

### Component Patterns
- Components manage their own local state
- Props are used for data passing from parent components
- Use `group`/`group-hover` classes for hover effects on cards
- Maintain TypeScript strict mode compliance
- All client components must have `"use client"` directive

### Data Flow
- Video metadata stored in `lib/video-data.ts`
- Video categories: Commercial Shorts, Commercials Longer, Music Video Commercials, Funny Clips, Shows/Cartoons
- View counts fetched from database via API
- Submissions handled through PostgreSQL database

### Video Asset Structure
- Videos organized in `/public/videos/` by category:
  - `commercial-shorts/` - Short commercials (10-17 seconds)
  - `commercials-longer/` - Extended commercial content (23s-1:47)
  - `music-video-commercials/` - Music-based commercials (~1:30)
  - `funny-clips/` - Entertainment content (8 videos including Cortex Rex series)
  - `shows-cartoons/` - Full shows and animated content (Coming Soon)
- Thumbnails in `/public/thumbnails/` with matching category structure
- All video durations are accurately tracked from actual files

## API Endpoints

### Video Views (`/api/video-views`)
- `GET` - Retrieve view counts (all, specific, or top videos)
- `POST` - Track a video view

### Submissions (`/api/submissions`)
- `GET` - Retrieve all submissions
- `POST` - Create new submission
- `PATCH` - Update submission status (admin)

## Common Tasks

### Adding a New Video
1. Add video file to appropriate `/public/videos/[category]/` folder
2. Run `bash scripts/regenerate-thumbnails.sh` to generate thumbnail
3. Update `lib/video-data.ts` with video metadata
4. Run `bash scripts/get-video-durations.sh` to get actual duration

### Adding a New Page
Create a new directory under `app/` with a `page.tsx` file following the App Router conventions.

### Adding a New Component
1. Create component in `components/` directory
2. Use existing UI primitives from `components/ui/`
3. Follow existing naming and styling patterns
4. Update this documentation if it's a major feature

### Modifying UI Components
The `components/ui/` directory contains base primitives. Modify carefully as they're used across the application.

## Recent Updates
- Mobile menu functionality with toggle
- Video view tracking system with PostgreSQL
- Sponsor modal form implementation
- Navigation buttons at bottom for mobile carousels
- Orange highlighting for carousel navigation when more content exists
- Proper video thumbnails generated with ffmpeg
- Actual video durations from file metadata
- View count display on video cards

## Environment Setup
- ffmpeg installed at `~/.local/bin/ffmpeg` for video processing
- PostgreSQL database configured via Netlify DB
- Session cookies for view tracking

## Future Integration Points
- Real streaming player integration in LiveHero component
- CMS/API for dynamic content (replacing static arrays)
- Authentication system for admin features
- Enhanced analytics dashboard
- Dark mode support (theme-provider.tsx is scaffolded but unused)
- Migration to @netlify/neon package for optimized database queries