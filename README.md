# SprayFoam TV

A YouTube-style video platform specifically designed for spray foam insulation contractors and professionals. Features comprehensive video content, company channels, submission systems, and modern tools to help grow the spray foam industry.

🌐 **Live Site**: https://sprayfoamtv.com

## ✨ Features

### 📺 Video Content Platform
- **Multiple video categories**: Commercial Shorts (10-17s), Longer Commercials (23s-1:47), Music Video Commercials (~1:30), Funny Clips, Educational Content
- **YouTube-style carousels** with hover preview, auto-play, and navigation controls
- **Video player modal** with full controls and sharing capabilities
- **View tracking and analytics** with PostgreSQL backend
- **Automatic thumbnail generation** using ffmpeg
- **Mobile-optimized video controls** always visible, desktop shows on hover

### 🏢 Contractor & Business Features
- **7 spray foam contractor channels** with individual branding
- **Company hero sections** with custom backgrounds and assets
- **Sponsor inquiry system** with dedicated modal forms
- **Contractor directory** (`/contractors`) to help customers find local professionals
- **Video submission system** (`/submit`) with admin review workflow
- **Admin panel** (`/admin/submissions`) for content management and approval

### 📅 Programming & Scheduling
- **Schedule page** (`/schedule`) for upcoming content
- **Shows listing** (`/shows`) for series and regular programming
- **Events page** (`/events`) for industry events and announcements
- **Live streaming integration** ready for future implementation

### 🎯 Industry-Specific Content
- **Educational content** for spray foam techniques and best practices
- **Equipment commercials** (Graco, Cortex Industries, etc.)
- **Contractor testimonials** and success stories
- **Industry news and updates**
- **Funny clips** including popular Cortex Rex series

### 🤖 AI Video Generation (Beta)
- **ChatGPT-style interface** at `/ai-video` for creating custom videos
- **Image + text prompt** workflow for professional video generation
- **HuggingFace Ovi model** integration (~40s generation time)
- **Private chat sessions** with browser localStorage persistence
- **Netlify Blobs storage** for efficient video serving

### 🎨 Professional UI/UX
- **Dark broadcast theme** with SprayFoam TV neon orange branding
- **Mobile-first responsive design** with collapsible hamburger navigation
- **Sticky header** with sponsor modal integration
- **Multi-column footer** with comprehensive site navigation
- **shadcn/ui component library** (60+ professional components)
- **Session-based analytics** with cookie tracking

## 🏗️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with React 19
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Netlify DB/Neon)
- **AI Integration**: HuggingFace Inference API
- **Storage**: Netlify Blobs for video content
- **Analytics**: @vercel/analytics
- **Fonts**: Geist Sans & Mono

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- HuggingFace API token
- PostgreSQL database (Netlify DB recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd .SFTV

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your HF_TOKEN and DATABASE_URL

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

```env
HF_TOKEN=your_huggingface_token
DATABASE_URL=your_postgresql_connection_string
NETLIFY=1  # Automatically set in Netlify environment
```

## 📁 Project Structure

```
app/
├── page.tsx                      # Homepage with video carousels
├── about/page.tsx               # About SprayFoam TV
├── schedule/page.tsx            # Programming schedule
├── shows/page.tsx               # Shows and series listing
├── events/page.tsx              # Industry events
├── submit/page.tsx              # Video submission form
├── contractors/page.tsx         # Contractor directory
├── contact/page.tsx             # Contact information
├── privacy/page.tsx             # Privacy policy
├── terms/page.tsx               # Terms of service
├── ai-video/page.tsx            # AI video generation (beta)
├── admin/submissions/page.tsx   # Admin content management
├── channel/[slug]/page.tsx      # Individual contractor channels
├── api/
│   ├── submissions/route.ts     # Video submission API
│   ├── video-views/route.ts     # View tracking API
│   ├── generate-video/route.ts  # AI video generation
│   ├── video-jobs/route.ts      # AI video status polling
│   └── video-blob/[jobId]/route.ts # AI video streaming
└── globals.css                  # Tailwind CSS configuration

components/
├── ui/                          # shadcn/ui component library (60+ components)
├── header.tsx                   # Navigation with sponsor modal
├── footer.tsx                   # Multi-column site navigation
├── live-hero.tsx               # Live streaming hero section
├── schedule-preview.tsx        # Daily schedule cards
├── content-carousel.tsx        # Video carousel with view tracking
├── cta-section.tsx             # Call-to-action cards
├── video-modal.tsx             # Video player with controls
├── video-thumbnail.tsx         # Dynamic thumbnail generation
├── sponsor-modal.tsx           # Sponsorship inquiry form
└── video-submission-form.tsx   # User video submission

lib/
├── db.ts                       # PostgreSQL database connection
├── video-data.ts               # Video content database
├── video-utils.ts              # Video processing utilities
└── utils.ts                    # General utility functions

public/
├── videos/                     # Video content by category
│   ├── commercial-shorts/      # 10-17 second commercials
│   ├── commercials-longer/     # Extended commercials (23s-1:47)
│   ├── music-video-commercials/ # Music-based commercials
│   ├── funny-clips/            # Entertainment content
│   └── shows-cartoons/         # Series and shows (coming soon)
├── thumbnails/                 # Auto-generated video thumbnails
├── companies/                  # Contractor-specific assets
│   ├── allstate-spray-foam/
│   ├── cortez-industries/
│   ├── insulation-contractors-of-arizona/
│   ├── kool-foam/
│   ├── mad-dog-sprayfoam/
│   ├── noble-insulation/
│   └── on-the-mark-spray-foam/
└── icons/                      # Site icons and branding

docs/
└── ai-video-implementation-notes.md # AI system technical docs
```

## 🎬 Video Content Categories

SprayFoam TV hosts comprehensive video content across multiple categories:

### Content Types
- **Commercial Shorts** (10-17 seconds): Quick, impactful commercials
- **Longer Commercials** (23 seconds - 1:47): Extended promotional content
- **Music Video Commercials** (~1:30): Music-driven advertising content
- **Funny Clips**: Entertainment including popular Cortex Rex series
- **Educational Content**: Spray foam techniques and best practices
- **Equipment Demonstrations**: Graco, Cortex Industries, and other manufacturers
- **Contractor Testimonials**: Success stories and case studies

### Featured Companies
- **Allstate Spray Foam**: Professional insulation services
- **Cortex Industries**: Equipment manufacturing and Rex entertainment series
- **Insulation Contractors of Arizona**: Regional spray foam specialists
- **Kool Foam**: "Fly South" themed marketing
- **Mad Dog Sprayfoam**: Bold branding and services
- **Noble Insulation**: Professional contractor services
- **On The Mark Spray Foam**: Precision application specialists

## 🗄️ Database Schema

### Core Tables
- `submissions` - Video submission tracking and admin review
- `video_views` - Aggregate video view counts
- `view_logs` - Detailed analytics with session tracking

### Connection
Uses pooled PostgreSQL connections via Netlify DB (Neon) with the `pg` library.

## 🎨 Video Content

### Categories
- **Commercial Shorts** (10-17 seconds)
- **Commercials Longer** (23s-1:47)
- **Music Video Commercials** (~1:30)
- **Funny Clips** (Entertainment content)
- **Shows/Cartoons** (Coming Soon)

### Company Channels
Seven spray foam contractor channels with:
- Custom hero sections with company branding
- Organized asset directories (`/public/companies/`)
- Company-specific videos and testimonials

## 🔧 Development

### Build Commands
```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
```

### Utility Scripts
```bash
node scripts/get-video-durations.sh     # Update video metadata
node scripts/regenerate-thumbnails.sh   # Generate video thumbnails
```

## 🚀 Deployment

### Netlify (Recommended)
The project is optimized for Netlify deployment with:
- **Netlify Blobs** for AI-generated video storage
- **Netlify Functions** for serverless API routes
- **Environment variables** managed in Netlify dashboard
- **Build command**: `pnpm build`

### Environment Setup
1. Set `HF_TOKEN` in Netlify environment variables
2. Configure `DATABASE_URL` for PostgreSQL connection
3. Deploy via GitHub integration or Netlify CLI

## 📊 Performance

- **Lighthouse Score**: Optimized for performance and accessibility
- **Image Optimization**: Next.js automatic image optimization
- **Video Streaming**: Efficient blob serving with proper headers
- **Caching**: CDN caching + browser caching strategies
- **Mobile Performance**: Responsive design with mobile-first approach

## 🛡️ Security

- **API Tokens**: Stored as environment variables
- **Private Videos**: AI-generated videos are user-specific
- **Input Validation**: Form validation and sanitization
- **CORS Headers**: Proper content-type and security headers

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for SprayFoam TV.

## 🆘 Support

- **Documentation**: `/docs/ai-video-implementation-notes.md`
- **Issues**: GitHub Issues
- **Contact**: [Contact information]

---

**SprayFoam TV** - Revolutionizing spray foam industry content with AI-powered video generation.