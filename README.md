# Copilot Metrics Dashboard

GitHub Copilot の組織利用状況を可視化する Web ダッシュボードです。Next.js、TypeScript、Recharts、Tailwind CSS で構築されています。

## 特長

- **Organization Overview**: 日次のアクティブ/エンゲージドユーザー、機能採用の推移
- **Code Completions**: サジェスト数、受け入れ数、言語・エディタ別の受け入れ率
- **Chat Analytics**: IDE Chat / GitHub.com Chat の利用状況、モード別の内訳
- **Pull Requests**: リポジトリ別の PR サマリーメトリクス
- **Member Metrics**: ユーザーごとの利用状況を検索・ソート付きで表示

## 前提条件

- Node.js 18 以上
- npm
- GitHub パーソナルアクセストークン（権限は後述）

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
4. `.env.local` を開き、GitHub トークンと組織名を設定します。
5. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```
6. ブラウザーで [http://localhost:3000](http://localhost:3000) を開きます。

## 環境変数

| 変数 | 必須 | 説明 |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub パーソナルアクセストークン |
| `GITHUB_ORG` | Yes | 対象組織のスラッグ（デフォルト: `octodemo`） |
| `NEXT_PUBLIC_ORG_NAME` | No | UI に表示する組織名 |

## 必要なトークン権限

### ファイングレインド PAT

- **Organization Copilot metrics** — read
- **Members** — read

### クラシック PAT

- `read:org`
- `manage_billing:copilot`

## 利用している API エンドポイント

このダッシュボードは以下の GitHub REST API を利用します。

| Endpoint | 説明 |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Copilot の日次メトリクス（時系列） |
| `GET /orgs/{org}/copilot/metrics/reports/organization-1-day` | 組織の 1 日利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織の 28 日利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-1-day` | ユーザー別の 1 日利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー別の 28 日利用レポート |
| `GET /orgs/{org}/copilot/billing/seats` | Copilot シート割り当て情報 |
| `GET /orgs/{org}/members` | 組織メンバー一覧 |

## 技術スタック

- **Next.js 15**（App Router, React Server Components）
- **TypeScript**
- **Recharts** — チャートライブラリ
- **Tailwind CSS** — ユーティリティファーストなスタイル
- **shadcn/ui** — UI コンポーネントプリミティブ（Card, Table, Tabs, Badge など）
- **Lucide React** — アイコンライブラリ
- **date-fns** — 日付ユーティリティ

## 開発コマンド

```bash
npm run dev     # 開発サーバー起動 (http://localhost:3000)
npm run build   # 本番ビルド
npm run start   # 本番サーバー起動
npm run lint    # ESLint 実行
```

## アーキテクチャ概要

```
src/
├── app/
│   ├── api/              # GitHub API をプロキシする API ルート
│   │   ├── members/
│   │   ├── metrics/
│   │   ├── seats/
│   │   └── usage-reports/
│   ├── chat/             # Chat 分析ページ
│   ├── completions/      # コード補完ページ
│   ├── members/          # メンバー別メトリクスページ
│   ├── pull-requests/    # PR メトリクスページ
│   ├── layout.tsx        # サイドバー付きルートレイアウト
│   └── page.tsx          # 組織概要トップ
├── components/
│   ├── cards/            # サマリーカード
│   ├── charts/           # Recharts ベースのチャート
│   ├── layout/           # Header, Sidebar
│   ├── tables/           # メンバー用テーブル
│   └── ui/               # shadcn/ui プリミティブ
└── lib/
    ├── github.ts         # GitHub API クライアント
    ├── types.ts          # TypeScript 型定義
    ├── constants.ts      # 定数
    └── utils.ts          # ユーティリティ
```

- **Server Components**（ページ）はレンダー時に内部 API からデータを取得します。
- **API Routes**（`src/app/api/`）は GitHub REST API をプロキシし、トークンをサーバー側に保持します。
- **Client Components**（チャートやテーブル）は表示用データを props で受け取り、インタラクティブに描画します。

## ドキュメント

詳細は [`docs/`](./docs/) ディレクトリを参照してください。

| カテゴリ | 内容 |
|---|---|
| [Getting Started](./docs/getting-started/) | インストール、環境変数設定、クイックスタート |
| [Architecture](./docs/architecture/) | アーキテクチャ概要、データフロー、ディレクトリ構成 |
| [Features](./docs/features/) | 各ダッシュボードページの機能説明 |
| [API Reference](./docs/api/) | GitHub API エンドポイント、内部 API ルート、型定義 |
| [Development](./docs/development/) | 開発環境、コーディング規約、ページ/チャート追加ガイド |
| [Deployment](./docs/deployment/) | Vercel / Docker デプロイ手順 |
| [Contributing](./docs/contributing/) | コントリビューションガイド、行動規範 |

## ライセンス

MIT
