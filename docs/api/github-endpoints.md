# GitHub API エンドポイント一覧

## エンドポイント一覧

| メソッド | エンドポイント | 関数名 | 用途 |
|---------|--------------|--------|------|
| GET | `/orgs/{org}/copilot/metrics` | `fetchOrgMetrics` | 日次 Copilot メトリクス |
| GET | `/orgs/{org}/team/{teamSlug}/copilot/metrics` | `fetchTeamMetrics` | チーム別 Copilot メトリクス |
| GET | `/orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | `fetchOrgUsageReport` | 直近28日の組織利用レポートリンク |
| GET | `/orgs/{org}/copilot/metrics/reports/organization-1-day?day={YYYY-MM-DD}` | `fetchOrgUsageReport(day)` | 特定日の組織利用レポートリンク |
| GET | `/orgs/{org}/copilot/metrics/reports/users-28-day/latest` | `fetchUserUsageReport` | 直近28日のユーザー別利用レポートリンク |
| GET | `/orgs/{org}/copilot/metrics/reports/users-1-day?day={YYYY-MM-DD}` | `fetchUserUsageReport(day)` | 特定日のユーザー別利用レポートリンク |
| GET | `{download_link}` (NDJSON) | `downloadAndParseNDJSON` | レポートの実データダウンロード |
| GET | `/orgs/{org}/copilot/billing/seats` | `fetchAllSeats` | Copilot シート一覧 |
| GET | `/orgs/{org}/members` | `fetchAllMembers` | 組織メンバー一覧 |

## 認証方法

すべてのリクエストに以下のヘッダーを付与する。

```http
Authorization: Bearer {GITHUB_TOKEN}
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

`GITHUB_TOKEN` は `.env.local` の環境変数として設定する（詳細は [環境変数設定](../getting-started/configuration.md) を参照）。

## レート制限

GitHub REST API のレート制限は認証済みリクエストで **5,000 回/時**。  
ダッシュボードは `next: { revalidate: 3600 }` による ISR キャッシュおよび `Cache-Control: s-maxage=3600` で不要なリクエストを削減している。

## レスポンス形式（JSON / NDJSON）

- **`/orgs/{org}/copilot/metrics`** — JSON 配列 (`CopilotMetricsDay[]`)
- **`/orgs/{org}/copilot/billing/seats`** — JSON オブジェクト (`CopilotSeatsResponse`)
- **`/orgs/{org}/members`** — JSON 配列 (`OrgMember[]`)
- **使用レポート（download_links 経由）** — NDJSON（1 行 1 JSON オブジェクト）。`downloadAndParseNDJSON<T>()` で行ごとにパースする。

## ページネーション

`fetchAllSeats` と `fetchAllMembers` はページネーションを自動処理する。

```typescript
// 例: fetchAllSeats の内部ループ
while (true) {
  const url = `.../seats?page=${page}&per_page=100`;
  const data = await fetch(url).json();
  allSeats.push(...data.seats);
  if (allSeats.length >= data.total_seats || data.seats.length < 100) break;
  page++;
}
```

`fetchOrgMetrics` はページ番号と件数を引数で受け取る（デフォルト: `page=1`, `per_page=28`）。
