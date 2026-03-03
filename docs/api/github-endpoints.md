# GitHub API エンドポイント一覧

## エンドポイント一覧

| 関数 | メソッド | エンドポイント | 説明 |
|------|---------|--------------|------|
| `fetchOrgMetrics()` | GET | `/orgs/{org}/copilot/metrics` | Copilot 組織メトリクス（GA API） |
| `fetchOrgUsageReport()` | GET | `/orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織利用レポート（ダウンロードリンク取得） |
| `fetchOrgUsageReport(day)` | GET | `/orgs/{org}/copilot/metrics/reports/organization-1-day?day={day}` | 特定日の組織利用レポート |
| `fetchUserUsageReport()` | GET | `/orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー利用レポート（ダウンロードリンク取得） |
| `fetchUserUsageReport(day)` | GET | `/orgs/{org}/copilot/metrics/reports/users-1-day?day={day}` | 特定日のユーザー利用レポート |
| `fetchAllSeats()` | GET | `/orgs/{org}/copilot/billing/seats` | Copilot シート情報（ページネーション） |
| `fetchAllMembers()` | GET | `/orgs/{org}/members` | 組織メンバー一覧（ページネーション） |

## 認証方法

すべてのリクエストに以下のヘッダーを付与します（`src/lib/github.ts` の `getHeaders()` 関数）。

```http
Accept: application/vnd.github+json
Authorization: Bearer {GITHUB_TOKEN}
X-GitHub-Api-Version: 2022-11-28
```

`GITHUB_TOKEN` は環境変数から取得します。設定されていない場合は `Error: GITHUB_TOKEN environment variable is not set` をスローします。

## レート制限

GitHub API のレート制限は認証済みリクエストで **5,000 req/h**（Enterprise は上限が異なる場合あり）。

ダッシュボードは `export const dynamic = 'force-dynamic'` を使用しているため、ページアクセスごとに API を呼び出します。本番環境では内部 API Routes の `Cache-Control` ヘッダー（`s-maxage=3600`）を活用してリクエスト数を削減してください。

## レスポンス形式（JSON / NDJSON）

### JSON 形式

`/orgs/{org}/copilot/metrics` および `/orgs/{org}/copilot/billing/seats` は通常の JSON 配列を返します。

### NDJSON ダウンロード形式（Usage Reports）

Usage Reports API は 2 ステップで動作します。

1. **ダウンロードリンク取得**: `/orgs/{org}/copilot/metrics/reports/...` が `download_links` 配列を含む JSON を返す
2. **NDJSON ダウンロード**: `download_links` の各 URL から NDJSON（改行区切り JSON）をダウンロードして解析

`downloadAndParseNDJSON<T>(downloadLinks)` 関数がこの処理を担当します。

```typescript
// UsageReportResponse の形式
{
  "download_links": ["https://..."],
  "report_start_day": "2026-02-01",
  "report_end_day": "2026-03-01"
}
```

## ページネーション

`fetchAllSeats()` と `fetchAllMembers()` は自動的にページネーションを処理します。

```typescript
// ページネーションのパターン
while (true) {
  const url = `...?page=${page}&per_page=${perPage}`;
  const data = await fetch(url, { headers });
  allItems.push(...data);
  if (data.length < perPage) break;
  page++;
}
```

`fetchOrgMetrics()` は `page` と `per_page` パラメータを引数で受け取ります（デフォルト: page=1, perPage=28）。
