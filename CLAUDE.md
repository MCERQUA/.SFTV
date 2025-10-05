# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Key Directories
- `app/` - Next.js App Router pages and root layout
- `components/` - Feature components and UI primitives
  - `ui/` - Reusable shadcn/ui-based components
- `lib/` - Utility functions
- `hooks/` - Custom React hooks
- `docs/` - Comprehensive project documentation

### Important Configuration
- **Path aliases:** Use `@/*` to import from project root
- **Build settings:** Currently ignores ESLint/TypeScript errors during build (see `next.config.mjs`)
- **TypeScript:** Strict mode enabled in `tsconfig.json`

## Component Architecture

### Main Components
- `app/page.tsx` - Homepage composition importing all section components
- `components/header.tsx` - Sticky navigation with responsive menu
- `components/live-hero.tsx` - Live stream hero with playback controls
- `components/schedule-preview.tsx` - Daily schedule cards
- `components/content-carousel.tsx` - Reusable carousel for episodes/shows/events
- `components/cta-section.tsx` - Call-to-action cards
- `components/footer.tsx` - Multi-column footer navigation

### State Management
- Components use local React state (useState)
- No global state management currently implemented
- Data is currently mocked as static arrays in `app/page.tsx`

## Documentation Hub

The `/docs` folder contains living documentation:
- `project-overview.md` - Mission, audience, and features
- `architecture.md` - Technical structure and conventions
- `development-guide.md` - Setup and collaboration guidelines
- `ui-component-catalog.md` - Component implementation details
- `roadmap.md` - Future plans and priorities
- `progress-tracker.md` - Development progress log

**Important:** Update relevant documentation when making changes, especially `progress-tracker.md` after significant updates.

## Development Conventions

### Styling
- Use Tailwind utility classes exclusively
- Leverage existing `components/ui/` primitives before creating new ones
- Follow responsive patterns using Tailwind breakpoints (`md`, `lg`)
- Use CSS variables for theme tokens (defined in `globals.css`)

### Component Patterns
- Components manage their own local state
- Props are used for data passing from parent components
- Use `group`/`group-hover` classes for hover effects on cards
- Maintain TypeScript strict mode compliance

### Data Flow
- Static data currently defined in `app/page.tsx`
- Video categories: Commercial Shorts, Commercials Longer, Music Video Commercials, Funny Clips, Shows/Cartoons (Coming Soon)
- Future: Replace with CMS/API integrations
- No environment variables required currently

### Video Asset Structure
- Videos organized in `/public/videos/` by category:
  - `commercial-shorts/` - Short commercials under 60 seconds
  - `commercials-longer/` - Extended commercial content
  - `music-video-commercials/` - Music-based commercials
  - `funny-clips/` - Entertainment content
  - `shows-cartoons/` - Full shows and animated content (Coming Soon)
- Thumbnails in `/public/thumbnails/` with matching category structure

## Common Tasks

### Adding a New Page
Create a new directory under `app/` with a `page.tsx` file following the App Router conventions.

### Adding a New Component
1. Create component in `components/` directory
2. Use existing UI primitives from `components/ui/`
3. Follow existing naming and styling patterns
4. Update documentation if it's a major feature

### Modifying UI Components
The `components/ui/` directory contains base primitives. Modify carefully as they're used across the application.

## Future Integration Points
- Real streaming player integration in LiveHero component
- CMS/API for dynamic content (replacing static arrays)
- Authentication system
- Additional routes for Schedule, Shows, Events pages
- Dark mode support (theme-provider.tsx is scaffolded but unused)
- push whenever updates and changes are completed.
- YOU ARE OPERATING ON A CLOUD VPS DO NOT TOUCH ANY PORTS, AND DO NOT DEPLOY TO LOCALHOST
- DO NOT DEPLOY TO LOCAL HOST!!!
- DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!!# DO NOT DEPLOY TO LOCAL HOST!!! # DO NOT DEPLOY TO LOCAL HOST!!!
- PUSH TO GITHUB AFTER CHANGES!!!