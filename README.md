# Copilot Metrics Dashboard

GitHub Copilot の組織向け利用状況を可視化する Next.js 製ダッシュボードです。TypeScript、Recharts、Tailwind CSS などで構築されています。

## 特徴

- **組織サマリ**: 日次アクティブ/エンゲージドユーザー、機能採用の推移
- **コード補完**: 提案数・受諾数・言語/エディター別の受諾率
- **チャット分析**: IDE Chat / GitHub.com Chat の利用状況、モード別内訳
- **Pull Request**: リポジトリ単位の PR サマリ指標
- **メンバー指標**: ユーザーごとの利用状況を検索・ソート付きで表示

## 前提条件

- Node.js 18 以上
- npm
- 適切な権限を付与した GitHub Personal Access Token（詳細は後述）

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
4. `.env.local` を編集し、GitHub トークンと組織名を設定します。
5. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```
6. ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 環境変数

| 変数 | 必須 | 説明 |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token |
| `GITHUB_ORG` | Yes | 対象組織のスラッグ（デフォルト: `octodemo`） |
| `NEXT_PUBLIC_ORG_NAME` | No | UI 上での組織表示名 |

## 必要なトークン権限

### Fine-grained PAT

- **Organization Copilot metrics** — read
- **Members** — read

### Classic PAT

- `read:org`
- `manage_billing:copilot`

## 利用している API エンドポイント

ダッシュボードは以下の GitHub REST API を利用します。

| Endpoint | 説明 |
|---|---|
| `GET /orgs/{org}/copilot/metrics` | Copilot 利用状況（日次時系列） |
| `GET /orgs/{org}/copilot/metrics/reports/organization-1-day` | 組織全体の 1 日レポート |
| `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織全体の 28 日レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-1-day` | ユーザー別 1 日レポート |
| `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー別 28 日レポート |
| `GET /orgs/{org}/copilot/billing/seats` | Copilot シート割り当て |
| `GET /orgs/{org}/members` | 組織メンバー一覧 |

## 技術スタック

- **Next.js 15**（App Router, React Server Components）
- **TypeScript**
- **Recharts** — チャートライブラリ
- **Tailwind CSS** — ユーティリティファーストなスタイリング
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

## アーキテクチャ

```
src/
├── app/
│   ├── api/              # API ルート（GitHub API へのプロキシ）
│   │   ├── members/
│   │   ├── metrics/
│   │   ├── seats/
│   │   └── usage-reports/
│   ├── chat/             # チャット分析ページ
│   ├── completions/      # コード補完ページ
│   ├── members/          # メンバー指標ページ
│   ├── pull-requests/    # PR 指標ページ
│   ├── layout.tsx        # サイドバー付きのルートレイアウト
│   └── page.tsx          # 組織概要ページ（ホーム）
├── components/
│   ├── cards/            # メトリクスサマリーカード
│   ├── charts/           # Recharts ベースのチャート
│   ├── layout/           # ヘッダー・サイドバー
│   ├── tables/           # データテーブル（メンバー）
│   └── ui/               # shadcn/ui プリミティブ
└── lib/
    ├── github.ts         # GitHub API クライアント
    ├── types.ts          # TypeScript 型定義
    ├── constants.ts      # 定数
    └── utils.ts          # ユーティリティ
```

- **Server Components**（ページ）はレンダー時に内部 API からデータを取得します。
- **API Routes**（`src/app/api/`）は GitHub REST API へのプロキシとして動作し、トークンをサーバー側に保持します。
- **Client Components**（チャートやテーブル）は props として渡されたデータを描画するだけで、フェッチを行いません。

## ドキュメント

詳細なドキュメントは [`docs/`](./docs/) ディレクトリを参照してください。

| カテゴリ | 概要 |
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
