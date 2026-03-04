# Copilot Metrics Dashboard

組織の GitHub Copilot 利用状況を可視化する Web ダッシュボードです。Next.js、TypeScript、Recharts、Tailwind CSS で構築されています。

## 機能

- **組織概要**: 日次アクティブユーザー/エンゲージユーザー、機能採用トレンド
- **コード補完**: 言語別・エディタ別の提案数、受け入れ数、受け入れ率
- **チャット分析**: IDE チャットと GitHub.com チャットのメトリクス、チャットモード別の内訳
- **プルリクエスト**: リポジトリ別の PR サマリーメトリクス
- **メンバーメトリクス**: ユーザー毎の利用状況の内訳（検索・ソート機能付き）

## 前提条件

- Node.js 18 以上
- npm
- 適切な権限を持つ GitHub Personal Access Token（後述）

## セットアップ

1. リポジトリをクローンします:
   ```bash
   git clone <repository-url>
   cd copilot-metrics-dashboard
   ```
2. 依存関係をインストールします:
   ```bash
   npm install
   ```
3. `.env.local.example` を `.env.local` にコピーします:
   ```bash
   cp .env.local.example .env.local
   ```
4. `.env.local` を編集して、GitHub トークンと組織名を設定します。
5. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```
6. ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 環境変数

| 変数名 | 必須 | 説明 |
|---|---|---|
| `GITHUB_TOKEN` | はい | GitHub Personal Access Token |
| `GITHUB_ORG` | はい | 対象組織のスラッグ（デフォルト: `octodemo`） |
| `NEXT_PUBLIC_ORG_NAME` | いいえ | UI に表示する組織名 |

## 必要なトークン権限

### Fine-grained PAT

- **Organization Copilot metrics** — 読み取り
- **Members** — 読み取り

### Classic PAT

- `read:org`
- `manage_billing:copilot`

## 使用する API エンドポイント

このダッシュボードは以下の GitHub REST API エンドポイントを使用します:

| エンドポイント | 説明 |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Copilot 利用メトリクス（日次時系列） |
| `GET /orgs/{org}/copilot/metrics/reports/organization-1-day` | 組織レベルの 1 日間利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織レベルの 28 日間利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-1-day` | ユーザー毎の 1 日間利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー毎の 28 日間利用レポート |
| `GET /orgs/{org}/copilot/billing/seats` | Copilot シート割り当て |
| `GET /orgs/{org}/members` | 組織メンバーリスト |

## 技術スタック

- **Next.js 15** (App Router, React Server Components)
- **TypeScript**
- **Recharts** — チャートライブラリ
- **Tailwind CSS** — ユーティリティファーストスタイリング
- **shadcn/ui** — UI コンポーネントプリミティブ（Card、Table、Tabs、Badge など）
- **Lucide React** — アイコンライブラリ
- **date-fns** — 日付ユーティリティ

## 開発

```bash
npm run dev     # 開発サーバーを起動 (http://localhost:3000)
npm run build   # 本番ビルド
npm run start   # 本番サーバーを起動
npm run lint    # ESLint を実行
```

## アーキテクチャ

```
src/
├── app/
│   ├── api/              # API ルートハンドラー（GitHub API 呼び出しのプロキシ）
│   │   ├── members/
│   │   ├── metrics/
│   │   ├── seats/
│   │   └── usage-reports/
│   ├── chat/             # チャット分析ページ
│   ├── completions/      # コード補完ページ
│   ├── members/          # メンバーメトリクスページ
│   ├── pull-requests/    # PR メトリクスページ
│   ├── layout.tsx        # サイドバーナビゲーション付きルートレイアウト
│   └── page.tsx          # 組織概要（ホーム）
├── components/
│   ├── cards/            # メトリクスサマリーカード
│   ├── charts/           # Recharts ベースのチャートコンポーネント
│   ├── layout/           # Header、Sidebar
│   ├── tables/           # データテーブル（メンバー）
│   └── ui/               # shadcn/ui プリミティブ
└── lib/
    ├── github.ts         # GitHub API クライアント関数
    ├── types.ts          # TypeScript 型定義
    ├── constants.ts      # アプリ定数
    └── utils.ts          # ユーティリティ関数
```

- **Server Components**（ページ）はレンダリング時に内部 API ルートからデータを取得します。
- **API Routes**（`src/app/api/`）は GitHub REST API へのリクエストをプロキシし、トークンをサーバーサイドに保持します。
- **Client Components**（チャート、テーブル）はデータを props として受け取り、インタラクティブな可視化をレンダリングします。

## ドキュメント

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

## ライセンス

MIT
