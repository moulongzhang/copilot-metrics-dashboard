# Copilot Metrics Dashboard

組織における GitHub Copilot の利用状況を可視化する Web ダッシュボードです。Next.js、TypeScript、Recharts、Tailwind CSS で構築しています。

## 機能

- **Organization Overview**: 日次アクティブ/エンゲージドユーザー、機能採用の推移
- **Code Completions**: 提案数、受諾数、言語・エディタ別の受諾率
- **Chat Analytics**: IDE Chat と GitHub.com Chat の利用状況、チャットモード別内訳
- **Pull Requests**: リポジトリ別の PR メトリクス概要
- **Member Metrics**: ユーザーごとの利用状況を検索・ソート付きで表示

## 前提条件

- Node.js 18 以上
- npm
- 適切な権限を持つ GitHub パーソナルアクセストークン（後述）

## セットアップ

1. リポジトリをクローン:
   ```bash
   git clone <repository-url>
   cd copilot-metrics-dashboard
   ```
2. 依存関係をインストール:
   ```bash
   npm install
   ```
3. `.env.local.example` を `.env.local` にコピー:
   ```bash
   cp .env.local.example .env.local
   ```
4. `.env.local` を編集し、GitHub トークンと組織名を設定。
5. 開発サーバーを起動:
   ```bash
   npm run dev
   ```
6. ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

## 環境変数

| 変数 | 必須 | 説明 |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub パーソナルアクセストークン |
| `GITHUB_ORG` | Yes | 対象組織のスラッグ（デフォルト: `octodemo`） |
| `NEXT_PUBLIC_ORG_NAME` | No | UI に表示する組織名 |

## トークン権限

### ファイングレインド PAT

- **Organization Copilot metrics** — read
- **Members** — read

### クラシック PAT

- `read:org`
- `manage_billing:copilot`

## 利用している API エンドポイント

このダッシュボードは以下の GitHub REST API を使用します。

| Endpoint | 説明 |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Copilot 利用メトリクス（日次時系列） |
| `GET /orgs/{org}/copilot/metrics/reports/organization-1-day` | 組織全体の 1 日レポート |
| `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織全体の直近 28 日レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-1-day` | ユーザー別 1 日レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー別の直近 28 日レポート |
| `GET /orgs/{org}/copilot/billing/seats` | Copilot シート割り当て |
| `GET /orgs/{org}/members` | 組織メンバー一覧 |

## 技術スタック

- **Next.js 15**（App Router, React Server Components）
- **TypeScript**
- **Recharts** — チャートライブラリ
- **Tailwind CSS** — ユーティリティファーストのスタイリング
- **shadcn/ui** — UI コンポーネント（Card, Table, Tabs, Badge など）
- **Lucide React** — アイコンライブラリ
- **date-fns** — 日付ユーティリティ

## 開発用スクリプト

```bash
npm run dev     # 開発サーバー起動 (http://localhost:3000)
npm run build   # 本番ビルド
npm run start   # 本番サーバー起動
npm run lint    # ESLint 実行
```

## アーキテクチャ

```
src/
├── app/                  # ページ (React Server Components)
│   ├── api/              # API ルート (GitHub API のプロキシ)
│   │   ├── members/
│   │   ├── metrics/
│   │   ├── seats/
│   │   └── usage-reports/
│   ├── chat/             # チャット分析ページ
│   ├── completions/      # コード補完ページ
│   ├── members/          # メンバーメトリクスページ
│   ├── pull-requests/    # PR メトリクスページ
│   ├── layout.tsx        # サイドバー付きのルートレイアウト
│   └── page.tsx          # 組織概要トップページ
├── components/
│   ├── cards/            # メトリクスカード
│   ├── charts/           # Recharts チャートコンポーネント
│   ├── layout/           # ヘッダーやサイドバー
│   ├── tables/           # データテーブル（メンバー）
│   └── ui/               # shadcn/ui プリミティブ
└── lib/
    ├── github.ts         # GitHub API クライアント関数
    ├── types.ts          # TypeScript 型定義
    ├── constants.ts      # アプリの定数
    └── utils.ts          # ユーティリティ関数
```

- **Server Components**（ページ）は描画時に内部 API からデータを取得します。
- **API Routes**（`src/app/api/`）は GitHub REST API へのリクエストをサーバー側でプロキシし、トークンを安全に保持します。
- **Client Components**（チャートやテーブル）は props として受け取ったデータをもとにインタラクティブな可視化を行います。

## ドキュメント

詳細なドキュメントは [`docs/`](./docs/) ディレクトリを参照してください。

| カテゴリ | 説明 |
|---|---|
| [Getting Started](./docs/getting-started/) | インストール手順、環境変数設定、クイックスタート |
| [Architecture](./docs/architecture/) | アーキテクチャ概要、データフロー、ディレクトリ構成 |
| [Features](./docs/features/) | 各ダッシュボードページの機能説明 |
| [API Reference](./docs/api/) | GitHub API エンドポイント、内部 API ルート、型定義 |
| [Development](./docs/development/) | 開発環境、コーディング規約、ページ/チャート追加ガイド |
| [Deployment](./docs/deployment/) | Vercel / Docker デプロイ手順 |
| [Contributing](./docs/contributing/) | コントリビューションガイド、行動規範 |

## ライセンス

MIT
