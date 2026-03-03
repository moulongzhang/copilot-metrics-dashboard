# UI コンポーネントガイド

## shadcn/ui の概要

このプロジェクトは [shadcn/ui](https://ui.shadcn.com/) の **new-york** スタイルを採用しています。shadcn/ui はコンポーネントをソースコードとして `src/components/ui/` にコピーする方式を取るため、直接カスタマイズが可能です。

設定ファイル: `components.json`

## 利用可能なコンポーネント一覧

現在 `src/components/ui/` に導入済みのコンポーネント:

| コンポーネント | 用途 |
|--------------|------|
| `badge` | ステータスラベル・タグ |
| `button` | ボタン（variant: `default`, `ghost`, `outline`, `icon`, `icon-sm`） |
| `card` | コンテンツカード（`Card`, `CardHeader`, `CardTitle`, `CardContent` など） |
| `input` | テキスト入力フィールド |
| `select` | ドロップダウン選択 |
| `separator` | 区切り線 |
| `skeleton` | ローディングスケルトン |
| `table` | データテーブル（`Table`, `TableHeader`, `TableRow`, `TableCell` など） |
| `tabs` | タブナビゲーション |

## 新しいコンポーネントの追加方法

```bash
npx shadcn@latest add <component-name>
```

例:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add tooltip
npx shadcn@latest add sheet
```

コンポーネントは `src/components/ui/<component-name>.tsx` に生成されます。

## カスタマイズ方法

### カラーテーマ

`src/app/globals.css` で CSS カスタムプロパティを変更することでテーマをカスタマイズできます。

### チャートカラー

`src/lib/constants.ts` の `CHART_COLORS` 配列でチャートの配色を管理しています。

```typescript
export const CHART_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c',
  '#16a34a', '#0891b2', '#4f46e5', '#c026d3',
  // ...
];
```

エディタ別の配色は `EDITOR_COLORS` オブジェクトで管理します。

## カスタムコンポーネント

プロジェクト独自のコンポーネント（`src/components/` 直下・サブフォルダ）:

| コンポーネント | パス | 説明 |
|--------------|------|------|
| `MetricCard` | `cards/MetricCard.tsx` | アイコン・タイトル・値・説明を表示するカード |
| `Header` | `layout/Header.tsx` | ページヘッダー（`title`, `description`, 任意の `children`） |
| `Sidebar` | `layout/Sidebar.tsx` | ナビゲーションサイドバー（`usePathname()` でアクティブ状態管理） |
| `ChatPanel` | `ChatPanel.tsx` | AI チャットのフローティングパネル（右下のトグルボタン付き） |
| `EmptyState` | `EmptyState.tsx` | データなし時のプレースホルダー表示 |
| `ErrorState` | `ErrorState.tsx` | エラー時の表示 |
