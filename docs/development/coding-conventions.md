# コーディング規約

## Server/Client Component の分離ルール

**Server Components**（`src/app/*/page.tsx`）:
- `"use client"` ディレクティブを持たない
- `async` 関数として定義し、直接 `lib/github.ts` の関数を呼び出す
- データの集計・変換を行い、表示用の配列・オブジェクトを生成して props として渡す
- `export const dynamic = 'force-dynamic'` を必ず宣言する

**Client Components**（`src/components/charts/`, `src/components/cards/` など）:
- ファイル先頭に `"use client"` を宣言する
- データ取得を行わない（props で受け取ったデータのみ使用）
- Recharts, DOM イベント, `useState`, `useEffect` などはここで使用

## 命名規則

| 種類 | 規則 | 例 |
|------|------|---|
| データ取得関数 | `fetchXxx()` | `fetchOrgUsageData()`, `fetchAllSeats()` |
| チャートコンポーネント | `XxxChart` | `ActiveUsersChart`, `PRMetricsChart` |
| カードコンポーネント | `XxxCard` または `MetricCard` | `MetricCard` |
| テーブルコンポーネント | `XxxTable` | `MembersTable` |
| API 関数 | キャメルケース動詞 + 名詞 | `fetchOrgMetrics`, `downloadAndParseNDJSON` |

## パスエイリアス

`tsconfig.json` と `components.json` で以下のエイリアスが設定されています:

| エイリアス | 実パス |
|-----------|-------|
| `@/components` | `src/components` |
| `@/lib` | `src/lib` |
| `@/hooks` | `src/hooks` |
| `@/components/ui` | `src/components/ui` |

## 日付の取り扱い

- GitHub API / Usage Reports から来る日付は `YYYY-MM-DD` 文字列として扱う
- 表示時のみ `date-fns` でフォーマット
- `Date` オブジェクトへの変換はコンポーネント内の表示直前に行う

## スタイリング（Tailwind CSS）

- クラス名の結合には `cn()` ユーティリティ関数（`src/lib/utils.ts`）を使用する
  ```typescript
  import { cn } from "@/lib/utils";
  className={cn("base-class", condition && "conditional-class")}
  ```
- インラインスタイル（`style={{}}`）は使用しない
- Tailwind v4 の構文に従う

## コンポーネント追加方法（shadcn/ui）

新しい shadcn/ui コンポーネントを追加する場合:

```bash
npx shadcn@latest add <component>
```

コンポーネントは `src/components/ui/` に生成されます。`components.json` の設定（`style: "new-york"`）が適用されます。
