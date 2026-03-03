# Organization Overview ページ

## 概要

`/` ルート（`src/app/page.tsx`）で表示される Overview ページは、組織全体の Copilot 利用状況をハイレベルにまとめたダッシュボードです。

データソースは **Usage Reports API**（NDJSON）の組織レポートです。`fetchOrgUsageData()` を呼び出し、`OrgUsageReport.day_totals` から集計します。

## 表示されるメトリクス

### サマリーカード（4 枚）

| カード | 値の計算方法 |
|-------|------------|
| **Daily Active Users** | `day_totals` の最終日の `daily_active_users` |
| **Monthly Active Users** | `day_totals` の最終日の `monthly_active_users` |
| **Acceptance Rate** | 期間全体の `code_acceptance_activity_count / code_generation_activity_count × 100` |
| **Total Interactions** | 期間全体の `user_initiated_interaction_count` の合計 |

## 使用コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `MetricCard` | 4 枚のサマリーカード |
| `ActiveUsersChart` | 日別アクティブユーザー推移（折れ線グラフ） |
| `FeatureEngagementChart` | 機能別エンゲージメント（棒グラフ） |

### ActiveUsersChart のデータ形式

```typescript
{ date: string; activeUsers: number; engagedUsers: number }[]
```

### FeatureEngagementChart のデータ形式

最終日の `totals_by_feature` から `code_generation_activity_count` を機能別に集計します。

表示される機能ラベル:

| feature 値 | 表示ラベル |
|-----------|----------|
| `code_completion` | Code Completion |
| `agent_edit` | Agent/Edit |
| `chat_panel_ask_mode` | Chat (Ask) |
| `chat_panel_edit_mode` | Chat (Edit) |
| `chat_panel_agent_mode` | Chat (Agent) |
| `chat_panel_custom_mode` | Chat (Custom) |

## データソース

- **取得関数**: `fetchOrgUsageData()` (`src/lib/github.ts`)
- **API**: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest`
- **型**: `OrgUsageReport` → `OrgDayTotals[]`
