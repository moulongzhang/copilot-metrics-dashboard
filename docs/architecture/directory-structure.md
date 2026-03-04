# ディレクトリ構成

## 全体構成

```
copilot-metrics-dashboard/
├── src/
│   ├── app/              # Next.js App Router ページ・API Routes
│   ├── components/       # React コンポーネント
│   ├── hooks/            # カスタム React Hooks
│   └── lib/              # ユーティリティ・型定義・API クライアント
├── docs/                 # プロジェクトドキュメント（日本語）
├── public/               # 静的アセット
├── next.config.ts        # Next.js 設定
├── tsconfig.json         # TypeScript 設定
├── components.json       # shadcn/ui 設定（new-york スタイル）
└── package.json
```

## `src/app/` — ページ・ルーティング

```
src/app/
├── layout.tsx            # ルートレイアウト（Sidebar + main + ChatPanel）
├── page.tsx              # / (Overview)
├── loading.tsx           # / のローディング UI
├── error.tsx             # エラー境界
├── globals.css           # グローバルスタイル
├── favicon.ico
├── completions/
│   ├── page.tsx          # /completions (Code Completions)
│   └── loading.tsx
├── chat/
│   ├── page.tsx          # /chat (Chat Analytics)
│   └── loading.tsx
├── pull-requests/
│   ├── page.tsx          # /pull-requests (Pull Requests)
│   └── loading.tsx
└── members/
    ├── page.tsx          # /members (Member Metrics)
    └── loading.tsx
```

## `src/app/api/` — API Routes

```
src/app/api/
├── metrics/route.ts           # GET /api/metrics
├── members/route.ts           # GET /api/members
├── seats/route.ts             # GET /api/seats
├── copilot-chat/route.ts      # POST /api/copilot-chat (SSE)
└── usage-reports/
    ├── org/route.ts           # GET /api/usage-reports/org
    └── users/route.ts         # GET /api/usage-reports/users
```

## `src/components/` — UI コンポーネント

```
src/components/
├── ChatPanel.tsx              # 右側フローティングチャットパネル
├── DateRangePicker.tsx        # 日付範囲選択
├── EmptyState.tsx             # データなし状態の表示
├── ErrorState.tsx             # エラー状態の表示
├── cards/
│   └── MetricCard.tsx         # KPI サマリーカード
├── charts/
│   ├── AcceptanceRateChart.tsx    # 受入率トレンド
│   ├── ActiveUsersChart.tsx       # アクティブユーザー推移
│   ├── ChatMetricsChart.tsx       # チャットモード別集計
│   ├── ChatTrendChart.tsx         # チャット日次トレンド
│   ├── CompletionsTrendChart.tsx  # コード補完日次トレンド
│   ├── DotcomChatChart.tsx        # モデル別チャット使用量
│   ├── EditorBreakdownChart.tsx   # エディタ別内訳
│   ├── FeatureEngagementChart.tsx # 機能別エンゲージメント
│   ├── LanguageBreakdownChart.tsx # 言語別内訳
│   ├── PRMetricsChart.tsx         # PR メトリクスチャート
│   └── PRSummaryTable.tsx         # PR サマリーテーブル
├── layout/
│   ├── Header.tsx             # ページヘッダー（タイトル・説明）
│   └── Sidebar.tsx            # 左サイドバーナビゲーション
├── tables/
│   └── MembersTable.tsx       # メンバー一覧テーブル
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

## `src/hooks/` — カスタム Hooks

現時点ではカスタム Hooks は実装されていません（将来拡張予定）。

## `src/lib/` — ライブラリ・ユーティリティ

```
src/lib/
├── types.ts           # GitHub API レスポンス型・集計型の定義
├── github.ts          # GitHub REST API クライアント関数
├── copilot-client.ts  # @github/copilot-sdk ラッパー（チャット用）
├── chat-tools.ts      # AI チャット用ツール定義（get_seat_info 等）
├── tool-logger.ts     # ツール実行ログ（tool-execution.log への記録）
├── constants.ts       # カラーパレット・ナビゲーション定数
└── utils.ts           # cn() ユーティリティ（clsx + tailwind-merge）
```
