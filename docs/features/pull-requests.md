# Pull Requests ページ

## 概要

`/pull-requests` ルートに対応するページ (`src/app/pull-requests/page.tsx`) は、Copilot が関与した PR のライフサイクルメトリクスを表示します。データは `OrgDayTotals.pull_requests` から取得します。

PR データが利用できない組織では、`agent_edit` フィーチャーのコード生成メトリクス（LoC 追加/削除）をフォールバックとして表示します。

## PR サマリーメトリクス

PR データが利用可能な場合に表示されるカード:

| カード | 内容 |
|--------|------|
| Total PRs Created | 期間中に作成された PR 数の合計 |
| Total PRs Merged | 期間中にマージされた PR 数の合計 |
| Median Time to Merge | マージまでの中央値（分） |
| Copilot-Created PRs | Copilot が作成した PR 数の合計 |
| Copilot-Reviewed PRs | Copilot がレビューした PR 数の合計 |

PR データが利用できない場合は `agent_edit` フィーチャーの LoC Added / LoC Deleted / 正味変更行数を表示します。

## リポジトリ別の集計

`PRMetricsChart` で日次の PR 作成数・マージ数・Copilot 関与数をグラフ化します。

## 使用コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| `MetricCard` | KPI サマリーカード |
| `PRMetricsChart` | 日次 PR メトリクスチャート（棒グラフ） |

## データソース

- 関数: `fetchOrgUsageData()` → `src/lib/github.ts`
- API: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` → NDJSON
- 型: `OrgUsageReport`, `OrgDayTotals`, `PullRequestMetrics`
