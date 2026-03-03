# コーディング規約

## Server/Client Component の分離ルール

- **Server Component** (`src/app/*/page.tsx`): データ取得・集計・変換を担当。`async` 関数として実装し、`lib/github.ts` の関数を直接呼び出す。
- **Client Component** (`src/components/charts/`, `src/components/ChatPanel.tsx`): ファイル先頭に `"use client"` を宣言。インタラクティブな UI・Recharts グラフを担当。データは props のみから受け取り、自身でフェッチしない（ChatPanel 除く）。

## 命名規則

| 種別 | 規則 | 例 |
|------|------|----|
| API クライアント関数 | `fetchXxx()` | `fetchOrgMetrics`, `fetchAllSeats` |
| チャートコンポーネント | `XxxChart` | `ActiveUsersChart`, `PRMetricsChart` |
| カードコンポーネント | `XxxCard` または `MetricCard` | `MetricCard` |
| 型定義 | PascalCase | `CopilotMetricsDay`, `OrgDayTotals` |
| 定数 | UPPER_SNAKE_CASE | `CHART_COLORS`, `NAV_ITEMS` |
| ユーティリティ関数 | camelCase | `cn`, `computeAcceptanceRate` |

## パスエイリアス

`tsconfig.json` で以下のエイリアスが設定されています:

```json
{
  "@/components": "src/components",
  "@/lib":        "src/lib",
  "@/hooks":      "src/hooks",
  "@/components/ui": "src/components/ui"
}
```

相対パスではなく `@/` から始まるエイリアスを使用してください。

## 日付の取り扱い

- データ内部では `YYYY-MM-DD` 文字列で保持する。
- 表示時のみ `date-fns` を使ってフォーマットする。
- `new Date()` で変換するのは表示層のみ。

## スタイリング（Tailwind CSS）

- Tailwind CSS v4 を使用。クラス名のマージには `cn()` ユーティリティ（`src/lib/utils.ts`）を使用する。
- レスポンシブ対応は `sm:`, `md:`, `lg:` プレフィックスで行う。
- カラーパレットは `src/lib/constants.ts` の `CHART_COLORS` を参照。

## コンポーネント追加方法（shadcn/ui）

新しい shadcn/ui コンポーネントを追加するには以下を実行:

```bash
npx shadcn@latest add <component-name>
```

コンポーネントは `src/components/ui/` に生成されます。`components.json` で `new-york` スタイルが設定されています。
