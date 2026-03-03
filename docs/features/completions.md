# Code Completions ページ

## 概要

`/completions` ルート（`src/app/completions/page.tsx`）は、Copilot のコード補完機能の詳細メトリクスを表示します。

`totals_by_feature` の `feature === "code_completion"` に該当するデータのみを抽出して集計します。

## 表示されるメトリクス

### サマリーカード（4 枚）

| カード | 値の計算方法 |
|-------|------------|
| **Total Code Generations** | `code_completion` の `code_generation_activity_count` 合計 |
| **Total Acceptances** | `code_completion` の `code_acceptance_activity_count` 合計 |
| **Acceptance Rate** | `total_acceptances / total_generations × 100` |
| **Lines of Code Added** | `code_completion` の `loc_added_sum` 合計 |

## 言語別・エディタ別の内訳

### 言語別内訳（LanguageBreakdownChart）

`totals_by_language_feature` の `feature === "code_completion"` のデータを言語ごとに集計します。

表示カラム: 言語名、提案数（`code_generation_activity_count`）、承認数（`code_acceptance_activity_count`）、承認率

### エディタ別内訳（EditorBreakdownChart）

`totals_by_ide` のデータを IDE ごとに集計します。

表示カラム: IDE 名、提案数、承認数

## 使用コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `MetricCard` | 4 枚のサマリーカード |
| `CompletionsTrendChart` | 日別補完トレンド（提案数・承認数の折れ線） |
| `AcceptanceRateChart` | 日別承認率トレンド（折れ線グラフ） |
| `LanguageBreakdownChart` | 言語別内訳（棒グラフ） |
| `EditorBreakdownChart` | エディタ別内訳（棒グラフ） |

## データソース

- **取得関数**: `fetchOrgUsageData()` (`src/lib/github.ts`)
- **API**: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest`
- **型**: `OrgUsageReport` → `OrgDayTotals[]`
- **集計対象フィールド**: `totals_by_feature`, `totals_by_language_feature`, `totals_by_ide`
