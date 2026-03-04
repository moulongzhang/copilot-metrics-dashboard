# Organization Overview ページ

## 概要

`/` ルートに対応する Overview ページ (`src/app/page.tsx`) は、組織全体の Copilot 利用状況を一目で把握できるダッシュボードです。`fetchOrgUsageData()` で取得した組織利用レポート（NDJSON）を集計して表示します。

## 表示されるメトリクス

| カード | 内容 | 取得元 |
|--------|------|--------|
| Daily Active Users | 最新日の `daily_active_users` | `OrgDayTotals.daily_active_users` |
| Monthly Active Users | 最新日の `monthly_active_users` | `OrgDayTotals.monthly_active_users` |
| Acceptance Rate | 全期間のコード生成数に対する受入数の割合 | `code_generation_activity_count` / `code_acceptance_activity_count` |
| Total Interactions | 全期間の `user_initiated_interaction_count` 合計 | `OrgDayTotals.user_initiated_interaction_count` |

## 使用コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| `MetricCard` | KPI サマリーカード（4 枚） |
| `ActiveUsersChart` | 日次アクティブユーザー推移（折れ線グラフ） |
| `FeatureEngagementChart` | 機能別エンゲージメント（棒グラフ）|

`FeatureEngagementChart` は `totals_by_feature` を使い、最新日における各機能（`code_completion`, `agent_edit`, `chat_panel_*`）のコード生成アクティビティ数を表示します。

## データソース

- 関数: `fetchOrgUsageData()` → `src/lib/github.ts`
- API: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` → NDJSON ダウンロード
- 型: `OrgUsageReport`, `OrgDayTotals`
