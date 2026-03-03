# Copilot Instructions

## Build & Run

```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint (flat config, next/core-web-vitals + next/typescript)
```

No test framework is configured.

## Environment

Requires `.env.local` with `GITHUB_TOKEN`, `GITHUB_ORG`, and optionally `NEXT_PUBLIC_ORG_NAME`. See `.env.local.example`.

## Architecture

Next.js App Router dashboard that visualizes GitHub Copilot usage metrics for an organization. Data flows through three layers:

1. **`src/lib/github.ts`** — GitHub REST API client. Uses raw `fetch` with token auth and API version header (`2022-11-28`). Handles pagination manually and parses NDJSON download streams via `downloadAndParseNDJSON<T>()`. Fetches use `next: { revalidate: 3600 }` for ISR.

2. **`src/app/api/`** — Thin proxy routes that call `lib/github` functions, add `Cache-Control` headers, and return JSON. These keep the token server-side.

3. **`src/app/*/page.tsx`** — Async React Server Components that import `lib/github` functions directly, aggregate/transform data, and pass pre-formatted arrays to client components. All pages use `export const dynamic = 'force-dynamic'`.

## Key Conventions

- **Server vs. Client split**: Pages are Server Components that do data fetching and transformation. Charts and interactive UI are Client Components (`"use client"`) that receive display-ready props — they never fetch data.
- **UI stack**: shadcn/ui (new-york style) + Tailwind CSS v4 + Recharts + Lucide icons. Add new shadcn components via `npx shadcn@latest add <component>`.
- **Type definitions**: All GitHub API response types live in `src/lib/types.ts`, structured to match the nested shape of the actual API responses.
- **Naming**: `fetchXxx()` for API client functions in `lib/github.ts`. Chart components are `XxxChart`, cards are `XxxCard` or `MetricCard`.
- **Layout**: Root layout uses a fixed `h-screen` 3-column flex: Sidebar | main content | ChatPanel. Sidebar navigation uses `usePathname()` for active state.
- **Date handling**: Dates flow as `YYYY-MM-DD` strings, formatted only at display time using `date-fns`.
- **Path aliases**: `@/components`, `@/lib`, `@/hooks`, `@/components/ui` (configured in `tsconfig.json` and `components.json`).
