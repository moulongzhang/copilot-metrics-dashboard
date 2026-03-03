# アーキテクチャ概要

## 設計思想

このダッシュボードは、GitHub Copilot の組織利用状況を可視化するために設計されており、以下の原則に基づいています。

- **セキュリティ優先**: `GITHUB_TOKEN` はサーバーサイドのみで使用し、クライアントに露出しない
- **パフォーマンス**: サーバーコンポーネントでデータ取得・変換を行い、クライアントには表示に必要なデータのみ渡す
- **シンプルさ**: データベースや外部ストアを持たず、GitHub API から直接取得する

## 3層アーキテクチャ

```
GitHub API
    ↓
src/lib/github.ts        ← データ取得層（fetch + token auth）
    ↓
src/app/*/page.tsx       ← データ変換層（Server Components）
    ↓
src/components/**        ← 表示層（Client Components）
```

### 層ごとの役割

| 層 | ファイル | 役割 |
|----|---------|------|
| データ取得 | `src/lib/github.ts` | GitHub REST API の呼び出し、ページネーション、NDJSON 解析 |
| プロキシ API | `src/app/api/*/route.ts` | サーバーサイドで token を保持したまま JSON を返す内部 API |
| データ変換 | `src/app/*/page.tsx` | 取得データを集計・変換してコンポーネントに props として渡す |
| 表示 | `src/components/**` | グラフ・カード・テーブルの描画（Recharts / shadcn/ui） |

## Server Component と Client Component の分離パターン

**Server Components**（`src/app/*/page.tsx`）:
- `async` 関数で直接 `lib/github.ts` の関数を呼び出す
- データの集計・フォーマットを行い、表示用の配列・オブジェクトを生成
- `export const dynamic = 'force-dynamic'` を宣言してキャッシュを無効化
- `"use client"` ディレクティブを持たない

**Client Components**（`src/components/charts/`, `src/components/cards/` など）:
- `"use client"` ディレクティブを持つ
- データ取得を一切行わず、props として受け取った表示用データを描画する
- Recharts や DOM イベントを使用するためクライアント側で動作

## データキャッシュ戦略

ページはすべて `export const dynamic = 'force-dynamic'` を宣言しており、リクエストごとに最新データを GitHub API から取得します。

内部 API Routes（`src/app/api/`）では `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` を設定し、CDN レベルのキャッシュを活用します。
