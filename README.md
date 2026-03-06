# Copilot Metrics Dashboard

組織の GitHub Copilot 利用状況を可視化する Web ダッシュボードです。Next.js・TypeScript・Recharts・Tailwind CSS を使用して構築されています。

## 機能

- **組織概要**: 日別のアクティブユーザー数・エンゲージドユーザー数、機能の採用トレンド
- **コード補完**: 提案数・承認数・言語別およびエディター別の承認率
- **チャット分析**: IDE チャットおよび GitHub.com チャットのメトリクス、チャットモードの内訳
- **プルリクエスト**: リポジトリ別の PR サマリーメトリクス
- **メンバーメトリクス**: ユーザー別の利用状況（検索・ソート機能付き）

## 前提条件

- Node.js 18 以上
- npm
- 適切な権限を持つ GitHub Personal Access Token（詳細は下記参照）

## セットアップ

1. リポジトリをクローンします:
   ```bash
   git clone <repository-url>
   cd copilot-metrics-dashboard
   ```
2. 依存パッケージをインストールします:
   ```bash
   npm install
   ```
3. `.env.local.example` を `.env.local` にコピーします:
   ```bash
   cp .env.local.example .env.local
   ```
4. `.env.local` を編集し、GitHub トークンと組織名を設定します。
5. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```
6. ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 環境変数

| 変数名 | 必須 | 説明 |
|---|---|---|
| `GITHUB_TOKEN` | 必須 | GitHub Personal Access Token |
| `GITHUB_ORG` | 必須 | 対象組織のスラッグ（デフォルト: `octodemo`） |
| `NEXT_PUBLIC_ORG_NAME` | 任意 | UI に表示する組織の表示名 |

## 必要なトークン権限

### Fine-grained PAT

- **Organization Copilot metrics** — 読み取り
- **Members** — 読み取り

### Classic PAT

- `read:org`
- `manage_billing:copilot`

## 使用する API エンドポイント

ダッシュボードは以下の GitHub REST API エンドポイントを使用します:

| エンドポイント | 説明 |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Copilot 利用メトリクス（日別時系列） |
| `GET /orgs/{org}/copilot/metrics/reports/organization-1-day` | 組織レベルの 1 日分利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織レベルの 28 日分利用レポート（最新） |
| `GET /orgs/{org}/copilot/metrics/reports/users-1-day` | ユーザー別 1 日分利用レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー別 28 日分利用レポート（最新） |
| `GET /orgs/{org}/copilot/billing/seats` | Copilot シートの割り当て情報 |
| `GET /orgs/{org}/members` | 組織メンバー一覧 |

## 技術スタック

- **Next.js 15**（App Router、React Server Components）
- **TypeScript**
- **Recharts** — グラフライブラリ
- **Tailwind CSS** — ユーティリティファーストの CSS フレームワーク
- **shadcn/ui** — UI コンポーネントプリミティブ（Card・Table・Tabs・Badge など）
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
│   ├── charts/           # Recharts ベースのグラフコンポーネント
│   ├── layout/           # ヘッダー、サイドバー
│   ├── tables/           # データテーブル（メンバー）
│   └── ui/               # shadcn/ui プリミティブ
└── lib/
    ├── github.ts         # GitHub API クライアント関数
    ├── types.ts          # TypeScript 型定義
    ├── constants.ts      # アプリ定数
    └── utils.ts          # ユーティリティ関数
```

- **サーバーコンポーネント**（ページ）はレンダリング時に内部 API ルートからデータを取得します。
- **API ルート**（`src/app/api/`）はトークンをサーバーサイドに保持しつつ、GitHub REST API へのリクエストをプロキシします。
- **クライアントコンポーネント**（グラフ・テーブル）はデータを props として受け取り、インタラクティブな可視化を描画します。

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
