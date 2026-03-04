# 内部 API ルート仕様

## ルート一覧

| メソッド | パス | ソースファイル | 概要 |
|---------|------|--------------|------|
| GET | `/api/metrics` | `src/app/api/metrics/route.ts` | 日次 Copilot メトリクス |
| GET | `/api/members` | `src/app/api/members/route.ts` | 組織メンバー一覧 |
| GET | `/api/seats` | `src/app/api/seats/route.ts` | Copilot シート一覧 |
| GET | `/api/usage-reports/org` | `src/app/api/usage-reports/org/route.ts` | 組織利用レポート |
| GET | `/api/usage-reports/users` | `src/app/api/usage-reports/users/route.ts` | ユーザー別利用レポート |
| POST | `/api/copilot-chat` | `src/app/api/copilot-chat/route.ts` | AI チャット (SSE ストリーミング) |
| GET | `/api/tool-logs` | `src/app/api/tool-logs/route.ts` | AI ツール実行ログ取得 |

## 各ルートのリクエスト/レスポンス仕様

### GET /api/metrics

| パラメータ | 型 | 説明 |
|-----------|----|------|
| `since` | string (YYYY-MM-DD) | 集計開始日（任意） |
| `until` | string (YYYY-MM-DD) | 集計終了日（任意） |
| `page` | number | ページ番号（デフォルト: 1） |
| `per_page` | number | 1 ページあたりの件数（デフォルト: 28） |

レスポンス: `CopilotMetricsDay[]`

### GET /api/members

パラメータなし。レスポンス: `{ members: OrgMember[], total: number }`

### GET /api/seats

パラメータなし。レスポンス: `{ seats: CopilotSeat[], total: number }`

### GET /api/usage-reports/org

| パラメータ | 型 | 説明 |
|-----------|----|------|
| `day` | string (YYYY-MM-DD) | 特定日のレポート（省略時: 直近28日） |

レスポンス: `UsageReportResponse & { data: OrgUsageReport[] }`

### GET /api/usage-reports/users

| パラメータ | 型 | 説明 |
|-----------|----|------|
| `day` | string (YYYY-MM-DD) | 特定日のレポート（省略時: 直近28日） |

レスポンス: `UsageReportResponse & { data: UserMetricsRecord[] }`

### POST /api/copilot-chat

リクエストボディ: `{ message: string, sessionId?: string }`

レスポンス: `text/event-stream` (SSE)

SSE イベント形式:
```
data: {"type":"session","sessionId":"<id>"}

data: {"type":"delta","content":"<text chunk>"}

data: {"type":"done"}
```

### GET /api/tool-logs

| パラメータ | 型 | 説明 |
|-----------|----|------|
| `limit` | number | 取得件数（デフォルト: 50） |

レスポンス: `ToolLogEntry[]`（新しい順）

`Cache-Control: no-store`（キャッシュ無効）

## キャッシュ制御（Cache-Control ヘッダー）

`/api/copilot-chat` 以外のすべての GET ルートに以下を付与:

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=600
```

`/api/copilot-chat` は SSE ストリームのため:
```
Cache-Control: no-cache
```

## エラーハンドリング

すべてのルートは以下の HTTP ステータスコードを返す:

| 条件 | ステータス |
|------|-----------|
| `GITHUB_TOKEN` が未設定 | 401 |
| 403 エラー (権限不足) | 403 |
| 404 エラー (リソース不存在) | 404 |
| その他の例外 | 500 |

エラーレスポンス形式: `{ "error": "<メッセージ>" }`
