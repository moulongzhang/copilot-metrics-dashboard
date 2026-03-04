# 技術スタック

## フレームワーク — Next.js 16

- **バージョン**: Next.js 16.1.6
- App Router を採用。`src/app/` 配下のディレクトリがそのままルートになる。
- すべてのページは `export const dynamic = 'force-dynamic'` を宣言し、リクエスト毎にサーバーサイドでデータを取得する。
- レイアウトは `src/app/layout.tsx` で定義され、Sidebar・メインコンテンツ・ChatPanel の 3 カラム固定レイアウトを実現。

## 言語 — TypeScript 5

- strict モードを有効化。
- GitHub API のレスポンス型を `src/lib/types.ts` に集約管理。
- パスエイリアス `@/` を設定（`tsconfig.json` 参照）。

## チャートライブラリ — Recharts 3

- すべてのグラフは `src/components/charts/` に配置された Client Component として実装。
- `ResponsiveContainer` で親要素に追従するレスポンシブ対応。
- カラーパレットは `src/lib/constants.ts` の `CHART_COLORS` / `EDITOR_COLORS` で一元管理。

## UI ライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| shadcn/ui (new-york スタイル) | 3.x | カード、ボタン、テーブル等の基本 UI |
| Tailwind CSS | v4 | ユーティリティクラスによるスタイリング |
| Radix UI | 1.x | shadcn/ui の基盤プリミティブ |
| Lucide React | 0.576+ | アイコン |

新しい shadcn コンポーネントを追加するには `npx shadcn@latest add <component>` を実行する。

## その他のライブラリ

| ライブラリ | 用途 |
|-----------|------|
| `@github/copilot-sdk` | ChatPanel のストリーミング AI チャット |
| `date-fns` | 日付のフォーマット・計算 |
| `clsx` + `tailwind-merge` | 条件付きクラス名のマージ |

## 選定理由

- **Next.js App Router**: サーバーサイドでトークンを保護しながら ISR を活用できる。
- **Recharts**: React との親和性が高く、TypeScript 対応も充実している。
- **shadcn/ui**: コンポーネントのソースを直接 `src/components/ui/` に配置するため、自由なカスタマイズが可能。
- **@github/copilot-sdk**: GitHub Copilot のモデルを使ったストリーミングチャットを数行で実装できる。
