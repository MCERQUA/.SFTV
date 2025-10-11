# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules
- **DO NOT** assume or code anything "new" without asking questions or finding answers to "if" that new thing already has a system or something related setup
- **CHECK EXISTING SYSTEMS FIRST** before implementing new features
- **ALWAYS PUSH TO GITHUB** after changes are completed
- **YOU ARE OPERATING ON A CLOUD VPS DO NOT TOUCH ANY PORTS, AND DO NOT DEPLOY TO LOCALHOST**
- **DO NOT DEPLOY TO LOCAL HOST!!!**
- **DO NOT DEPLOY TO LOCAL HOST!!!** # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!!# DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!!
- **PUSH TO GITHUB AFTER CHANGES!!!**

# DO NOT REPLY WITH "You're absolutly right." make productive replys with info not pointless response text trying to make the user "feel good"

## Documentation and Problem-Solving Requirements

### **CRITICAL: Failed Attempts and Solution Tracking**
- **ALWAYS UPDATE `/docs/` when making changes** - Documentation must reflect current reality, not outdated aspirations
- **DOCUMENT ALL FAILED ATTEMPTS** - Track every attempted solution that didn't work in the relevant docs
- **DO NOT CLAIM SOLUTIONS ARE "FIXED"** - Use language like "attempted fix", "trying approach", "this may resolve"
- **ASSUME SOLUTIONS MIGHT NOT WORK** - Most solutions are attempts, not guarantees
- **TRACK PROBLEM PATTERNS** - Note recurring issues and what approaches have been tried before
- **UPDATE IMPLEMENTATION NOTES** - Keep `/docs/ai-video-implementation-notes.md` and similar files current with latest attempts
- **BE HONEST ABOUT STATUS** - Use "Status: Still debugging" not "Status: Fixed" until actually verified working

### **Documentation Update Rules**
1. **Before working**: Read relevant `/docs/` files to understand current state and previous attempts
2. **During work**: Track what you're trying and why in real-time
3. **After attempts**: Update docs with results (successful or failed) immediately
4. **Never assume**: Each "fix" is an attempt until proven to work in production

### **Problem-Solving Language**
- ❌ "This fixes the issue"
- ✅ "This attempts to fix the issue"
- ❌ "Problem resolved"
- ✅ "Attempted solution - needs testing"
- ❌ "I've fixed the API format"
- ✅ "I've tried a different API format approach"

## Project Overview

**SprayFoam TV** is a Next.js 15 video platform for spray foam insulation professionals deployed at **https://sprayfoamtv.com**. It's built with React 19, TypeScript, and Tailwind CSS, featuring a component library based on shadcn/ui primitives. The platform hosts various video content including commercial shorts, longer commercials, music video commercials, funny clips, and upcoming shows/cartoons.

### Site Design & Styling
- **Theme:** Dark broadcast theme with neon accents (SprayFoam TV branded)
- **Background:** `bg-background` (very dark: `oklch(0.12 0.01 270)`) - almost black
- **Cards:** `bg-card` (dark gray: `oklch(0.18 0.015 270)`) with rounded corners
- **Text:** `text-foreground` (light/white: `oklch(0.98 0.01 90)`)
- **Primary Accent:** Orange (`oklch(0.68 0.19 45)`) - used for buttons and highlights
- **Secondary Accent:** Green (`oklch(0.75 0.18 130)`)
- **Typography:** Geist Sans/Mono fonts
- **Layout:** Grid-based with responsive columns, card-based sections
- **Key Pattern:** All pages should use `bg-background` (dark) instead of `bg-gray-50` (light)

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
- `/ai-video` - ✅ **AI Video Generation** - ChatGPT-style interface for creating videos
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

## Company Assets Directory Structure

### Organization
Company assets are organized in `/public/companies/` with the following structure:

```
public/companies/
├── allstate-spray-foam/
├── cortez-industries/
├── insulation-contractors-of-arizona/
├── kool-foam/
├── mad-dog-sprayfoam/
├── noble-insulation/
└── on-the-mark-spray-foam/
```

### Each Company Directory Contains:
- **`/hero/`** - Background images/videos for hero sections (`hero-image.jpg`, `hero-video.mp4`)
- **`/logo/`** - Company logos and branding (`logo.png`, `logo.svg`, `logo-white.png`)
- **`/videos/`** - Company-specific video content (`promo.mp4`, `testimonial.mp4`)
- **`/thumbnails/`** - Generated thumbnails for videos (`promo-thumb.jpg`)

### Usage Pattern:
```typescript
const heroImage = `/companies/${companySlug}/hero/hero-image.jpg`
const logo = `/companies/${companySlug}/logo/logo.png`
```

## Recent Updates
- ✅ **AI Video Generation System** - ChatGPT-style interface at `/ai-video` using HuggingFace Ovi model
- ✅ **Netlify Blobs Storage** - Efficient video storage with streaming endpoints (`/api/video-blob/[jobId]`)
- Company channel pages with hero sections and square cards
- Organized directory structure for company assets
- Real company data integration (7 spray foam contractors)
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
- **AI Video Generation**: HuggingFace API token (`HF_TOKEN`) + Netlify Blobs storage
- **Dependencies**: `@huggingface/inference`, `@netlify/blobs`, `@netlify/functions`

## Important Build Notes

### Netlify Forms Migration (Critical)
**DO NOT USE** `data-netlify` attributes or Netlify Forms with Next.js runtime v5+
- The `@netlify/plugin-nextjs@5` does NOT support traditional Netlify Forms
- Using `data-netlify="true"` will cause build failures with error: "Failed assembling prerendered content for upload"
- Forms should use API routes or edge functions instead
- Hidden forms for Netlify form detection are NOT compatible with the current runtime

## AI Video Generation System
- **URL**: https://sprayfoamtv.com/ai-video
- **Status**: ✅ Fully operational production system
- **Architecture**: ChatGPT-style interface with Netlify Blobs storage
- **Model**: HuggingFace `chetwinlow1/Ovi` via `fal-ai` provider
- **Flow**: Upload image + prompt → Generate video (~40s) → Stream via blob endpoint
- **Storage**: Netlify Blobs (`ai-videos` store) with graceful fallback
- **Documentation**: `/docs/ai-video-implementation-notes.md`

## Future Integration Points
- Real streaming player integration in LiveHero component
- CMS/API for dynamic content (replacing static arrays)
- Authentication system for admin features
- Enhanced analytics dashboard
- Dark mode support (theme-provider.tsx is scaffolded but unused)
- Migration to @netlify/neon package for optimized database queries
- these warnings serve as a reminder of how many times "CLAUDE" "you" have assumed you are smart and know what your doing while completely ignoring your instructions. \
- ##IMPORTANT! -NEVER reply with "Your're absolutely right" ONLY respond  with, What you did wrong and what you will do to fix or correct it or move forward.
- #NEVER add fake info or fake numbers any placeholder content should be obvious and not fake
- DO NOT DEPLOY TO LOCAL HOST!