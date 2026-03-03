# 内部 API ルート仕様

## ルート一覧

| メソッド | パス | 説明 |
|---------|------|------|
| `GET` | `/api/metrics` | Copilot メトリクス（GA API プロキシ） |
| `GET` | `/api/seats` | Copilot シート情報 |
| `GET` | `/api/members` | 組織メンバー一覧 |
| `GET` | `/api/usage-reports/org` | 組織利用レポート（NDJSON 解析済み） |
| `GET` | `/api/usage-reports/users` | ユーザー利用レポート（NDJSON 解析済み） |
| `POST` | `/api/copilot-chat` | AI チャットアシスタント（SSE ストリーミング） |

## 各ルートのリクエスト/レスポンス仕様

### `GET /api/metrics`

**クエリパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `since` | `string` (YYYY-MM-DD) | 取得開始日（省略可） |
| `until` | `string` (YYYY-MM-DD) | 取得終了日（省略可） |
| `page` | `number` | ページ番号（デフォルト: 1） |
| `per_page` | `number` | 1ページあたりの件数（デフォルト: 28） |

**レスポンス**: `CopilotMetricsDay[]`（JSON 配列）

---

### `GET /api/seats`

**クエリパラメータ**: なし

**レスポンス**:
```json
{
  "seats": [CopilotSeat, ...],
  "total": 42
}
```

---

### `GET /api/members`

**クエリパラメータ**: なし

**レスポンス**:
```json
{
  "members": [OrgMember, ...],
  "total": 100
}
```

---

### `GET /api/usage-reports/org`

**クエリパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `day` | `string` (YYYY-MM-DD) | 特定日のレポート（省略時は最新 28 日） |

**レスポンス**: `UsageReportResponse & { data: OrgUsageReport[] }`

---

### `GET /api/usage-reports/users`

**クエリパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|---|------|
| `day` | `string` (YYYY-MM-DD) | 特定日のレポート（省略時は最新 28 日） |

**レスポンス**: `UsageReportResponse & { data: UserMetricsRecord[] }`

---

### `POST /api/copilot-chat`

**リクエストボディ**:
```json
{
  "message": "string (必須)",
  "sessionId": "string (省略可、既存セッションを継続する場合)"
}
```

**レスポンス**: `text/event-stream`（Server-Sent Events）

SSE イベント形式:
```
data: {"type": "session", "sessionId": "abc123"}

data: {"type": "delta", "content": "テキストの断片"}

data: {"type": "done"}
```

## キャッシュ制御（Cache-Control ヘッダー）

`GET` 系 API Routes（`/api/metrics`, `/api/seats`, `/api/members`, `/api/usage-reports/*`）は以下のヘッダーを返します。

```http
Cache-Control: public, s-maxage=3600, stale-while-revalidate=600
```

`POST /api/copilot-chat` は SSE ストリームのため以下を返します。

```http
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

## エラーハンドリング

すべての `GET` API Routes は以下のエラーマッピングを使用します。

| 条件 | HTTP ステータス |
|------|--------------|
| `GITHUB_TOKEN` 未設定 | `401 Unauthorized` |
| GitHub API から 403 | `403 Forbidden` |
| GitHub API から 404 | `404 Not Found` |
| その他のエラー | `500 Internal Server Error` |

エラーレスポンス形式:
```json
{
  "error": "エラーメッセージ"
}
```
