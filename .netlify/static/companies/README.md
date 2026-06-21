# Company Assets Directory Structure

This directory contains all company-specific assets organized by company name.

## Directory Structure

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

## Each Company Directory Contains:

### `/hero/`
- Background images/videos for company hero sections
- Files: `hero-image.jpg`, `hero-video.mp4`, etc.
- Used on individual company pages

### `/logo/`
- Company logos and branding assets
- Files: `logo.png`, `logo.svg`, `logo-white.png`, etc.
- Used in company cards and headers

### `/videos/`
- Company-specific video content
- Files: `promo.mp4`, `testimonial.mp4`, etc.
- Featured videos for company channels

### `/thumbnails/`
- Generated thumbnails for company videos
- Files: `promo-thumb.jpg`, `testimonial-thumb.jpg`, etc.
- Auto-generated or custom thumbnails

## File Naming Conventions

- Use lowercase with hyphens: `company-name-here`
- Keep filenames descriptive: `hero-image.jpg`, `logo-white.png`
- Use web-optimized formats: `.jpg`, `.png`, `.webp`, `.mp4`

## Usage in Code

```typescript
// Hero background
const heroImage = `/companies/${companySlug}/hero/hero-image.jpg`

// Company logo
const logo = `/companies/${companySlug}/logo/logo.png`

// Company videos
const videos = `/companies/${companySlug}/videos/promo.mp4`
```

## Adding New Companies

1. Create directory: `mkdir public/companies/new-company-name`
2. Create subdirectories: `hero/`, `logo/`, `videos/`, `thumbnails/`
3. Add company assets to appropriate folders
4. Update company data in `/app/companies/page.tsx`