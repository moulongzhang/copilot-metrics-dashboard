# 技術スタック

## フレームワーク — Next.js 16

Next.js 16 の **App Router** を採用しています。

- `src/app/` 配下の `page.tsx` が各ルートのエントリポイント
- Server Components によるサーバーサイドデータ取得
- `export const dynamic = 'force-dynamic'` で動的レンダリングを強制
- `src/app/api/` に Route Handlers を配置してプロキシ API を実装

## 言語 — TypeScript 5

全ファイルが TypeScript で記述されています。

- `src/lib/types.ts` に GitHub API レスポンス型と集計型を集約
- strict モードは `tsconfig.json` で設定
- パスエイリアス: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`

## チャートライブラリ — Recharts 3

`recharts` を使用してすべてのグラフを描画しています。

- `LineChart`, `BarChart`, `AreaChart`, `RadarChart` などを用途に応じて使い分け
- `ResponsiveContainer` でレスポンシブ対応
- チャートコンポーネントは `src/components/charts/` に配置し、すべて `"use client"` を宣言

## UI ライブラリ

### shadcn/ui

[shadcn/ui](https://ui.shadcn.com/) の **new-york** スタイルを採用。

- コンポーネントは `src/components/ui/` にコピーして管理
- 追加方法: `npx shadcn@latest add <component>`
- 設定ファイル: `components.json`

現在導入済みのコンポーネント: `badge`, `button`, `card`, `input`, `select`, `separator`, `skeleton`, `table`, `tabs`

### Tailwind CSS v4

CSS ユーティリティクラスのスタイリング。

- `tailwind-merge` + `clsx` を組み合わせた `cn()` ユーティリティ関数でクラス結合
- `tw-animate-css` でアニメーション
- `@tailwindcss/postcss` プラグイン経由で設定

### Radix UI

shadcn/ui の基盤として `radix-ui` を使用。アクセシビリティ対応のプリミティブコンポーネントを提供します。

## AI チャット — @github/copilot-sdk

`@github/copilot-sdk` を使用して、ダッシュボード組み込みの AI チャットアシスタントを実装。

- `src/lib/copilot-client.ts` でシングルトン管理
- `createChatSession()` で Copilot セッションを作成し、メトリクスデータをシステムプロンプトに注入
- `/api/copilot-chat` Route Handler で Server-Sent Events (SSE) によるストリーミングを提供
- `ChatPanel.tsx` クライアントコンポーネントがフローティングパネルとして表示

## その他のライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| `lucide-react` | ^0.576.0 | アイコン |
| `date-fns` | ^4.1.0 | 日付フォーマット |
| `class-variance-authority` | ^0.7.1 | コンポーネントバリアント管理 |
| `clsx` | ^2.1.1 | 条件付きクラス結合 |
| `tailwind-merge` | ^3.5.0 | Tailwind クラスのマージ |

## 選定理由

| 技術 | 理由 |
|------|------|
| Next.js App Router | Server Components によるセキュアなトークン管理と高速なデータ取得 |
| TypeScript | GitHub API の複雑なネスト型を安全に扱うため |
| Recharts | React との親和性が高く、豊富なチャート種別に対応 |
| shadcn/ui | カスタマイズ性が高く、デザインの一貫性を保ちやすい |
| @github/copilot-sdk | GitHub Copilot のネイティブ統合でコンテキスト付きチャットを実現 |
