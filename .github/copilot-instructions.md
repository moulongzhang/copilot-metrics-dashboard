# Copilot Instructions

## Build & Run

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (Next.js core-web-vitals + typescript configs)
```

No test framework is configured.

## Environment

Requires `.env.local` with `GITHUB_TOKEN`, `GITHUB_ORG`, and optionally `NEXT_PUBLIC_ORG_NAME`. See `.env.local.example`.

## Architecture

This is a Next.js 16 App Router dashboard that visualizes GitHub Copilot usage metrics for an organization.

### Data flow

1. **Pages** (React Server Components) call functions from `src/lib/github.ts` to fetch data at render time
2. `src/lib/github.ts` calls the GitHub REST API directly using the server-side `GITHUB_TOKEN`
3. **API routes** (`src/app/api/`) also proxy GitHub API requests — used by client-side components (e.g., the chat panel)
4. All pages use `export const dynamic = 'force-dynamic'` to disable static generation

### Copilot SDK chat integration

`src/components/ChatPanel.tsx` is a client component that streams chat responses via SSE from `/api/copilot-chat`. The API route uses `@github/copilot-sdk` with `getOrCreateSession` and streams `delta` events back. The SDK is listed in `serverExternalPackages` in `next.config.ts`.

## Key Conventions

### Component patterns

- **Pages** are async Server Components that fetch data, compute aggregates, and pass props to child components
- **Charts** are `"use client"` components using Recharts, wrapped in shadcn Card components, with consistent `h-80` height and empty-state fallbacks
- **MetricCard** (`src/components/cards/MetricCard.tsx`) is the standard card for displaying a single KPI with optional trend indicator

### shadcn/ui

Uses the **new-york** style with **neutral** base color. Add components via:

```bash
npx shadcn@latest add <component>
```

Aliases: `@/components/ui`, `@/lib/utils`, `@/hooks`

### API routes

All GET route handlers follow the same pattern: try/catch, call a `src/lib/github.ts` function, return `NextResponse.json()` with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600`.

### Styling

Tailwind CSS v4 with `@tailwindcss/postcss`. Use the `cn()` utility from `@/lib/utils` for conditional class merging.

### Types

All GitHub API response types and display-oriented types are defined in `src/lib/types.ts`. API client functions are in `src/lib/github.ts`.

### Navigation

Add new dashboard pages by adding an entry to `NAV_ITEMS` in `src/lib/constants.ts` and creating the corresponding `src/app/<route>/page.tsx`.
