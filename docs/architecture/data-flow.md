# データフロー

## 全体のデータフロー図

```
ブラウザ
  │
  ├─ ページアクセス (GET /)
  │    └─ Server Component (page.tsx)
  │         └─ lib/github.ts → GitHub API (Usage Reports NDJSON)
  │              └─ データ集計・変換 → Client Component (props)
  │
  └─ チャットメッセージ (POST /api/copilot-chat)
       └─ API Route (route.ts)
            └─ copilot-client.ts → @github/copilot-sdk → SSE ストリーム
```

## GitHub API からのデータ取得

`src/lib/github.ts` がすべての GitHub API 通信を担当します。

### 主な取得関数

| 関数 | エンドポイント | 用途 |
|------|--------------|------|
| `fetchOrgUsageData()` | `/orgs/{org}/copilot/metrics/reports/organization-28-day/latest` | 組織利用レポート (NDJSON) |
| `fetchUserUsageData()` | `/orgs/{org}/copilot/metrics/reports/users-28-day/latest` | ユーザー利用レポート (NDJSON) |
| `fetchOrgMetrics()` | `/orgs/{org}/copilot/metrics` | Copilot メトリクス (GA API) |
| `fetchAllSeats()` | `/orgs/{org}/copilot/billing/seats` | Copilot シート情報（ページネーション付き） |
| `fetchAllMembers()` | `/orgs/{org}/members` | 組織メンバー一覧（ページネーション付き） |

### NDJSON レポートの取得フロー

```
fetchOrgUsageReport()        ← ダウンロードリンク一覧を取得
    ↓ download_links[]
downloadAndParseNDJSON()     ← 各リンクからダウンロードして NDJSON をパース
    ↓ T[]
fetchOrgUsageData()          ← OrgUsageReport オブジェクトを返す
```

## API Routes でのプロキシ

`src/app/api/` の Route Handlers は、`GITHUB_TOKEN` をサーバーサイドで保持したまま、クライアントに安全にデータを提供します。

- レスポンスに `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` を設定
- エラー時は HTTP ステータスコードを適切にマッピング（401 / 403 / 404 / 500）

## Server Component でのデータ変換

各ページの `page.tsx` は Server Component として実行され、`lib/github.ts` の関数を直接呼び出します。

```typescript
// 例: src/app/page.tsx
export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const report = await fetchOrgUsageData();   // ← サーバー側で実行
  const days = report.day_totals;

  // 集計・変換
  const activeUsersData = days.map((d) => ({
    date: d.day,
    activeUsers: d.daily_active_users,
  }));

  // Client Component に props として渡す
  return <ActiveUsersChart data={activeUsersData} />;
}
```

変換処理の例:
- `OrgDayTotals[]` → チャート用の `{ date, value }[]`
- `totals_by_feature` の集計 → 機能別エンゲージメントデータ
- 期間全体の合計・平均・承認率の計算

## Client Component での表示

チャートコンポーネントはすべて `"use client"` を宣言し、props として受け取ったデータのみを描画します。

```typescript
// 例: src/components/charts/ActiveUsersChart.tsx
"use client";

export function ActiveUsersChart({ data }: { data: ActiveUsersDataPoint[] }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        {/* Recharts による描画 */}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## AI チャットのデータフロー

`ChatPanel.tsx` → `/api/copilot-chat` → `copilot-client.ts` → `@github/copilot-sdk`

1. `ChatPanel.tsx` がユーザーメッセージを `POST /api/copilot-chat` に送信
2. API Route が `getOrCreateSession()` でセッションを取得または作成
3. セッション作成時、`fetchOrgUsageData()` でメトリクスデータを取得してシステムプロンプトに注入
4. `session.send()` でメッセージを送信し、`assistant.message_delta` イベントを SSE でストリーミング
5. `ChatPanel.tsx` が SSE を受信してリアルタイムに UI を更新
