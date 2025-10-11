# Architecture & Codebase Tour

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript with React 19
- **Styling:** Tailwind CSS (via `app/globals.css`) with utility-first patterns and custom font variables (Geist Sans & Mono)
- **Component library primitives:** Local UI system derived from shadcn/ui stored in `components/ui`
- **Database:** PostgreSQL (Netlify DB/Neon) with connection pooling
- **Authentication:** Custom session-based auth with bcryptjs password hashing
- **Video Processing:** ffmpeg for thumbnails and duration detection
- **AI Integration:** HuggingFace Inference API (Ovi model via fal-ai)
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
│   │   ├── auth/           // Authentication endpoints (login, signup, logout, me)
│   │   ├── generate-video/ // AI video generation endpoint (protected)
│   │   ├── submissions/    // Submission CRUD operations
│   │   ├── video-jobs/     // Async job status checking (protected)
│   │   ├── video-blob/     // Video file serving (protected)
│   │   └── video-views/    // View tracking endpoints
│   ├── companies/          // Company channel pages
│   │   └── [slug]/         // Dynamic company pages
│   ├── globals.css         // Tailwind layer definitions and global tokens
│   ├── layout.tsx          // Root layout (fonts, Suspense boundary, Analytics)
│   └── page.tsx            // Homepage composition
├── components/
│   ├── auth-form.tsx       // Login/signup form component
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
│   ├── auth.ts             // Authentication middleware and utilities
│   ├── db.ts               // Database connection and queries
│   ├── video-data.ts       // Video content metadata
│   └── video-utils.ts      // Video processing utilities
├── hooks/
│   ├── use-auth.ts         // Authentication state management hook
│   └── [other hooks]       // Custom React hooks
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
  - `users` - User accounts with email, password hash, and profile info
  - `user_sessions` - Session management with expiration tracking
  - `submissions` - Video submission tracking with contact info and admin status
  - `video_views` - Aggregate view counts per video
  - `view_logs` - Detailed analytics with session tracking
  - `video_jobs` - AI video generation job status
- **Location:** Database configuration in `lib/db.ts`
- **Environment:** Uses `NETLIFY_DATABASE_URL` in production, `DATABASE_URL` locally

## API Architecture

### Authentication Endpoints
- **Signup** (`/api/auth/signup`): POST - Create new user account with email/password
- **Login** (`/api/auth/login`): POST - Authenticate user and create session
- **Logout** (`/api/auth/logout`): POST - Destroy user session
- **Me** (`/api/auth/me`): GET - Get current user info from session

### Public Endpoints
- **Video Views** (`/api/video-views`): GET/POST for view tracking and retrieval
- **Submissions** (`/api/submissions`): Full CRUD for video submission workflow

### Protected Endpoints (Require Authentication)
- **AI Video Generation** (`/api/generate-video`): POST - Async video generation with job tracking
- **Video Jobs** (`/api/video-jobs`): GET - Status polling for long-running AI generation
- **Video Blob** (`/api/video-blob/[jobId]`): GET - Stream generated video files

## AI Video Generation System
- **Interface:** ChatGPT-style UI with collapsible sidebar (`/ai-video`) - **Authentication Required**
- **Status:** Fully operational with Netlify Blobs storage
- **Architecture:** Async job processing with polling and real-time status updates
- **Model:** `chetwinlow1/Ovi` via fal-ai provider for image-to-video generation
- **Storage:** Netlify Blobs with streaming endpoints for large video files
- **Security:** All endpoints protected by session-based authentication

## Authentication System

### Overview
- **Type:** Custom session-based authentication (no third-party providers)
- **Password Security:** bcryptjs hashing with salt rounds (12)
- **Session Management:** 7-day session cookies with automatic cleanup
- **Security Features:** HttpOnly cookies, secure in production, CSRF protection

### User Flow
1. **Registration:** Users create accounts with email/password at `/ai-video`
2. **Login:** Email/password authentication with session creation
3. **Session:** Persistent login via secure session cookies
4. **Access Control:** AI video features require valid authentication
5. **Logout:** Session destruction and cookie cleanup

### Implementation Details
- **Authentication Middleware:** `lib/auth.ts` - validates sessions and extracts user data
- **Session Storage:** Database-backed with automatic expiration
- **Frontend Hook:** `useAuth()` hook manages authentication state
- **UI Components:** `AuthForm` component handles login/signup forms
- **Protected Routes:** AI video generation requires authentication

### Database Schema
```sql
-- Users table
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
)

-- Sessions table
user_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

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
