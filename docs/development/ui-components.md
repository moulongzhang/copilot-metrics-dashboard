# UI コンポーネントガイド

## shadcn/ui の概要

このプロジェクトは [shadcn/ui](https://ui.shadcn.com/) の **new-york** スタイルを採用しています。コンポーネントのソースは `src/components/ui/` に直接配置されており、自由にカスタマイズできます。

設定ファイル: `components.json`（スタイル: `new-york`、Tailwind CSS v4）

## 利用可能なコンポーネント一覧

現在 `src/components/ui/` に含まれるコンポーネント:

| ファイル | コンポーネント | 主な用途 |
|---------|--------------|---------|
| `badge.tsx` | `Badge` | ラベル・ステータス表示 |
| `button.tsx` | `Button` | アクションボタン |
| `card.tsx` | `Card`, `CardHeader`, `CardContent` 等 | コンテンツカード |
| `input.tsx` | `Input` | テキスト入力 |
| `select.tsx` | `Select` 等 | ドロップダウン選択 |
| `separator.tsx` | `Separator` | 区切り線 |
| `skeleton.tsx` | `Skeleton` | ローディングスケルトン |
| `table.tsx` | `Table` 等 | データテーブル |
| `tabs.tsx` | `Tabs` 等 | タブ切り替え |

## 新しいコンポーネントの追加方法

```bash
npx shadcn@latest add <component-name>
# 例:
npx shadcn@latest add dialog
npx shadcn@latest add tooltip
```

コマンド実行後、`src/components/ui/<component-name>.tsx` が生成されます。

## カスタマイズ方法

shadcn/ui コンポーネントはソースが直接配置されているため、`src/components/ui/` 内のファイルを直接編集してカスタマイズできます。

- カラーは CSS 変数（`src/app/globals.css`）で管理されています。
- Tailwind のクラス名は `cn()` ユーティリティを使って条件付きマージします。

```tsx
import { cn } from "@/lib/utils";

<Button className={cn("base-class", isActive && "active-class")} />
```
