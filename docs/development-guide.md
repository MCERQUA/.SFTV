# Development Guide

This guide outlines how to set up, run, and contribute to the SprayFoam TV project.

## Prerequisites
- Node.js 20.x (align with Next.js 15 requirements)
- pnpm (preferred package manager)
- Git

## Initial Setup
```bash
pnpm install
```

## Common Scripts
| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server on `http://localhost:3000`. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Run the production build locally. |
| `pnpm lint` | Execute the Next.js ESLint rules. |

## Environment Variables
No environment variables are currently required. As integrations are introduced (e.g., CMS, auth, analytics keys), document them here with sample `.env.local` entries.

## Styling Workflow
- Tailwind CSS drives all styling. Use utility classes and avoid inline styles.
- Shared primitives (Button, Card, Badge, etc.) live in `components/ui`. Prefer these before creating new bespoke elements.
- Fonts are configured in `app/layout.tsx`; add new fonts via the `next/font` API to ensure optimal loading.

## Asset Management
- Place static images in `public/` and reference them with root-relative paths (e.g., `/image.png`).
- Optimise image dimensions to match usage. Consider `next/image` when integrating real assets.

## Collaboration Conventions
- Reference [`roadmap.md`](./roadmap.md) for priority initiatives before picking up new work.
- Log updates in [`progress-tracker.md`](./progress-tracker.md) after each PR merges.
- Keep commits scoped and descriptive (e.g., `feat: add schedule API` or `docs: update roadmap`).
- When adding new sections, update [`project-overview.md`](./project-overview.md) and [`ui-component-catalog.md`](./ui-component-catalog.md) accordingly.

## Testing Strategy (Future)
- Introduce unit/component tests alongside new features.
- Add a CI pipeline to run `pnpm lint` and future test suites before merge.
