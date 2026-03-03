# ディレクトリ構成

## 全体構成

```
copilot-metrics-dashboard/
├── src/
│   ├── app/                   # Next.js App Router ページ・API Routes
│   ├── components/            # React コンポーネント
│   └── lib/                   # ユーティリティ・型定義・API クライアント
├── docs/                      # プロジェクトドキュメント（日本語）
├── public/                    # 静的ファイル
├── package.json
├── next.config.ts
├── tsconfig.json
└── components.json            # shadcn/ui 設定
```

## `src/app/` — ページ・ルーティング

```
src/app/
├── layout.tsx                 # ルートレイアウト（Sidebar + ChatPanel を含む）
├── page.tsx                   # Overview ページ (/)
├── loading.tsx                # ルートローディング UI
├── error.tsx                  # エラーバウンダリ
├── globals.css                # グローバルスタイル
├── completions/
│   ├── page.tsx               # Code Completions ページ (/completions)
│   └── loading.tsx
├── chat/
│   ├── page.tsx               # Chat Analytics ページ (/chat)
│   └── loading.tsx
├── pull-requests/
│   ├── page.tsx               # Pull Requests ページ (/pull-requests)
│   └── loading.tsx
└── members/
    ├── page.tsx               # Members ページ (/members)
    └── loading.tsx
```

## `src/app/api/` — API Routes

```
src/app/api/
├── copilot-chat/
│   └── route.ts               # POST /api/copilot-chat — AI チャットアシスタント（SSE）
├── members/
│   └── route.ts               # GET /api/members — 組織メンバー一覧
├── metrics/
│   └── route.ts               # GET /api/metrics — Copilot メトリクス (GA API)
├── seats/
│   └── route.ts               # GET /api/seats — Copilot シート情報
└── usage-reports/
    ├── org/
    │   └── route.ts           # GET /api/usage-reports/org — 組織利用レポート (NDJSON)
    └── users/
        └── route.ts           # GET /api/usage-reports/users — ユーザー利用レポート (NDJSON)
```

## `src/components/` — UI コンポーネント

```
src/components/
├── ChatPanel.tsx              # AI チャットアシスタントのフローティングパネル
├── DateRangePicker.tsx        # 日付範囲選択コンポーネント
├── EmptyState.tsx             # データなし時の表示
├── ErrorState.tsx             # エラー時の表示
├── cards/
│   └── MetricCard.tsx         # メトリクス値を表示するカードコンポーネント
├── charts/
│   ├── AcceptanceRateChart.tsx        # 承認率トレンドチャート
│   ├── ActiveUsersChart.tsx           # アクティブユーザーチャート
│   ├── ChatMetricsChart.tsx           # チャットモード別メトリクスチャート
│   ├── ChatTrendChart.tsx             # チャット日別トレンドチャート
│   ├── CompletionsTrendChart.tsx      # コード補完トレンドチャート
│   ├── DotcomChatChart.tsx            # モデル別チャット使用状況チャート
│   ├── EditorBreakdownChart.tsx       # エディタ別内訳チャート
│   ├── FeatureEngagementChart.tsx     # 機能別エンゲージメントチャート
│   ├── LanguageBreakdownChart.tsx     # 言語別内訳チャート
│   ├── PRMetricsChart.tsx             # PR メトリクスチャート
│   └── PRSummaryTable.tsx             # PR サマリーテーブル
├── layout/
│   ├── Header.tsx             # ページヘッダー（タイトル・説明）
│   └── Sidebar.tsx            # ナビゲーションサイドバー
├── tables/
│   └── MembersTable.tsx       # メンバー利用状況テーブル
└── ui/                        # shadcn/ui コンポーネント
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── skeleton.tsx
    ├── table.tsx
    └── tabs.tsx
```

## `src/lib/` — ライブラリ・ユーティリティ

```
src/lib/
├── constants.ts               # 定数（チャートカラー、ナビゲーション項目など）
├── copilot-client.ts          # @github/copilot-sdk クライアント（AI チャット用）
├── github.ts                  # GitHub REST API クライアント関数
├── types.ts                   # TypeScript 型定義（API レスポンス・集計型）
└── utils.ts                   # ユーティリティ関数（cn など）
```
