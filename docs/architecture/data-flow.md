# データフロー

## 全体のデータフロー図

```
ブラウザ (SSR リクエスト)
    │
    ▼
Next.js Server (App Router)
    │
    ├─ src/app/page.tsx  (Server Component)
    │       │
    │       └─ fetchOrgUsageData()   ← src/lib/github.ts
    │               │
    │               ├─ fetchOrgUsageReport()
    │               │       └─ GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest
    │               └─ downloadAndParseNDJSON()
    │                       └─ GET {download_link}  (NDJSON ストリーム)
    │
    └─ Client Component (charts, ChatPanel)
            │
            └─ POST /api/copilot-chat  (SSE ストリーミング)
                    └─ @github/copilot-sdk
```

## GitHub API からのデータ取得

`src/lib/github.ts` がすべての GitHub API 呼び出しを担う。

| 関数 | エンドポイント | 用途 |
|------|--------------|------|
| `fetchOrgMetrics` | `GET /orgs/{org}/copilot/metrics` | 日次メトリクス (GA API) |
| `fetchOrgUsageReport` | `GET /orgs/{org}/copilot/metrics/reports/organization-{N}-day/...` | 組織利用レポートのダウンロードリンク取得 |
| `fetchUserUsageReport` | `GET /orgs/{org}/copilot/metrics/reports/users-{N}-day/...` | ユーザー別利用レポートのダウンロードリンク取得 |
| `downloadAndParseNDJSON` | 上記で得たダウンロード URL | NDJSON テキストを行ごとにパース |
| `fetchOrgUsageData` | 上記 2 つを組み合わせ | 組織レポート全体を返す便利関数 |
| `fetchUserUsageData` | 上記 2 つを組み合わせ | ユーザーレコード配列を返す便利関数 |
| `fetchAllSeats` | `GET /orgs/{org}/copilot/billing/seats` | シート情報（ページネーション付き） |
| `fetchAllMembers` | `GET /orgs/{org}/members` | 組織メンバー一覧（ページネーション付き） |

認証には `GITHUB_TOKEN` 環境変数を使用。ヘッダーに `Authorization: Bearer <token>` および `X-GitHub-Api-Version: 2022-11-28` を付与する。

## API Routes でのプロキシ

`src/app/api/` 配下のルートは `lib/github` を呼び出した結果を JSON で返す薄いプロキシ。

- トークンをブラウザに渡さずにサーバー側に秘匿する目的で存在する。
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` を付与し、CDN・ブラウザキャッシュを活用。
- `/api/copilot-chat` のみ SSE ストリームを返す（`Content-Type: text/event-stream`）。

## Server Component でのデータ変換

ページ (`src/app/*/page.tsx`) は Async Server Component として実装されており、`lib/github` 関数を直接インポートしてデータを取得・変換する。

- 変換済みの「表示用配列」を Client Component に props として渡す。
- 重い計算（集計・ソート・フィルタ）はすべてサーバー側で完結する。
- `export const dynamic = 'force-dynamic'` によりリクエスト毎に最新データを取得する。

## Client Component での表示

グラフコンポーネント (`src/components/charts/`) は `"use client"` ディレクティブを持ち、渡された表示用データを Recharts で描画する。

- データのフェッチは行わない（props のみに依存）。
- `ChatPanel.tsx` のみ例外的に `POST /api/copilot-chat` への fetch を行う。
