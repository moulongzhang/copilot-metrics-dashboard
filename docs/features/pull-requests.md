# Pull Requests ページ

## 概要

`/pull-requests` ルート（`src/app/pull-requests/page.tsx`）は、Copilot に関連する PR ライフサイクルメトリクスを表示します。

`OrgDayTotals.pull_requests` フィールドにデータが存在する場合は PR ライフサイクルメトリクスを、存在しない場合は `agent_edit` 機能によるコード生成メトリクスをフォールバックとして表示します。

## PR サマリーメトリクス

`pull_requests` データが利用可能な場合、以下のカードを表示します。

| カード | 値の計算方法 |
|-------|------------|
| **Total PRs Created** | `pull_requests.total_created` の合計 |
| **Total PRs Merged** | `pull_requests.total_merged` の合計 |
| **Median Time to Merge** | `median_minutes_to_merge` の中央値（分） |
| **Copilot-Created PRs** | `pull_requests.total_created_by_copilot` の合計 |
| **Copilot-Reviewed PRs** | `pull_requests.total_reviewed_by_copilot` の合計 |

## フォールバック表示（agent_edit メトリクス）

`pull_requests` データが利用できない場合、`agent_edit` 機能のコード生成データを代わりに表示します。

| カード | 値の計算方法 |
|-------|------------|
| **Total LoC Added by Agent** | `agent_edit` の `loc_added_sum` 合計 |
| **Total LoC Deleted by Agent** | `agent_edit` の `loc_deleted_sum` 合計 |
| **Net Lines Changed** | `loc_added_sum - loc_deleted_sum` |

`agent_edit` データも存在しない場合は "No agent edit data is available" メッセージを表示します。

## 使用コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `MetricCard` | サマリーカード |
| `PRMetricsChart` | PR 日別推移チャート（作成数・マージ数・Copilot 関与数） |

## データソース

- **取得関数**: `fetchOrgUsageData()` (`src/lib/github.ts`)
- **API**: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest`
- **型**: `OrgUsageReport` → `OrgDayTotals[]`
- **集計対象フィールド**: `pull_requests`, `totals_by_feature` (feature: `agent_edit`)
