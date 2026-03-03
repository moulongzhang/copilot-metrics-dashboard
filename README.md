# Copilot Metrics Dashboard

A web dashboard for visualizing GitHub Copilot usage metrics for your organization. Built with Next.js, TypeScript, Recharts, and Tailwind CSS.

<!-- 組織の GitHub Copilot 利用状況を可視化するダッシュボードです。 -->

## Features

- **Organization Overview**: Daily active/engaged users, feature adoption trends
- **Code Completions**: Suggestions, acceptances, acceptance rates by language and editor
- **Chat Analytics**: IDE Chat and GitHub.com Chat metrics, chat modes breakdown
- **Pull Requests**: PR summary metrics by repository
- **Member Metrics**: Per-user usage breakdown with search and sort

## Prerequisites

- Node.js 18+
- npm
- GitHub Personal Access Token with appropriate permissions (see below)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd copilot-metrics-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
4. Edit `.env.local` and set your GitHub token and organization name.
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token |
| `GITHUB_ORG` | Yes | Target organization slug (default: `octodemo`) |
| `NEXT_PUBLIC_ORG_NAME` | No | Organization display name for the UI |

## Required Token Permissions

### Fine-grained PAT

- **Organization Copilot metrics** — read
- **Members** — read

### Classic PAT

- `read:org`
- `manage_billing:copilot`

## API Endpoints Used

The dashboard consumes the following GitHub REST API endpoints:

| Endpoint | Description |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Copilot usage metrics (daily time-series) |
| `GET /orgs/{org}/copilot/metrics/reports/organization-1-day` | Organization-level 1-day usage report |
| `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | Organization-level 28-day usage report |
| `GET /orgs/{org}/copilot/metrics/reports/users-1-day` | Per-user 1-day usage report |
| `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` | Per-user 28-day usage report |
| `GET /orgs/{org}/copilot/billing/seats` | Copilot seat assignments |
| `GET /orgs/{org}/members` | Organization members list |

## Tech Stack

- **Next.js 15** (App Router, React Server Components)
- **TypeScript**
- **Recharts** — chart library
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — UI component primitives (Card, Table, Tabs, Badge, etc.)
- **Lucide React** — icon library
- **date-fns** — date utilities

## Development

```bash
npm run dev     # Start development server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Architecture

```
src/
├── app/
│   ├── api/              # API route handlers (proxy GitHub API calls)
│   │   ├── members/
│   │   ├── metrics/
│   │   ├── seats/
│   │   └── usage-reports/
│   ├── chat/             # Chat analytics page
│   ├── completions/      # Code completions page
│   ├── members/          # Member metrics page
│   ├── pull-requests/    # PR metrics page
│   ├── layout.tsx        # Root layout with sidebar navigation
│   └── page.tsx          # Organization overview (home)
├── components/
│   ├── cards/            # Metric summary cards
│   ├── charts/           # Recharts-based chart components
│   ├── layout/           # Header, Sidebar
│   ├── tables/           # Data tables (members)
│   └── ui/               # shadcn/ui primitives
└── lib/
    ├── github.ts         # GitHub API client functions
    ├── types.ts          # TypeScript type definitions
    ├── constants.ts      # App constants
    └── utils.ts          # Utility functions
```

- **Server Components** (pages) fetch data from internal API routes at render time.
- **API Routes** (`src/app/api/`) proxy requests to the GitHub REST API, keeping the token server-side.
- **Client Components** (charts, tables) receive data as props and render interactive visualizations.

## Documentation

詳細なドキュメントは [`docs/`](./docs/) ディレクトリを参照してください。

| カテゴリ | 内容 |
|---|---|
| [Getting Started](./docs/getting-started/) | インストール、環境変数設定、クイックスタート |
| [Architecture](./docs/architecture/) | アーキテクチャ全体像、データフロー、ディレクトリ構成 |
| [Features](./docs/features/) | 各ダッシュボードページの機能説明 |
| [API Reference](./docs/api/) | GitHub API エンドポイント、内部 API ルート、型定義 |
| [Development](./docs/development/) | 開発環境、コーディング規約、ページ/チャート追加ガイド |
| [Deployment](./docs/deployment/) | Vercel / Docker デプロイ手順 |
| [Contributing](./docs/contributing/) | コントリビューションガイド、行動規範 |

## License

MIT
