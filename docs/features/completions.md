# Code Completions ページ

## 概要

`/completions` ルートに対応するページ (`src/app/completions/page.tsx`) は、コード補完機能の利用状況を詳細に分析します。`fetchOrgUsageData()` から取得した組織レポートを集計し、コード生成・受入・行数などのメトリクスを表示します。

## 表示されるメトリクス

| カード | 内容 | 計算方法 |
|--------|------|---------|
| Total Code Generations | コード生成アクティビティ数の合計 | `totals_by_feature` の `code_completion` に絞って `code_generation_activity_count` を集計 |
| Total Acceptances | 受入アクティビティ数の合計 | 同上の `code_acceptance_activity_count` を集計 |
| Acceptance Rate | 受入率 (%) | Acceptances ÷ Generations × 100 |
| Lines of Code Added | 追加行数の合計 | `code_completion` フィーチャーの `loc_added_sum` を集計 |

## 言語別・エディタ別の内訳

**言語別内訳**:
- `totals_by_language_feature` から `feature === "code_completion"` に絞ってフィルタ。
- 言語ごとにコード生成数・受入数・受入率を集計。
- `LanguageBreakdownChart` で棒グラフ表示。

**エディタ別内訳**:
- `totals_by_ide` を IDE ごとに集計（全フィーチャー合算）。
- `EditorBreakdownChart` で棒グラフ表示。

## 使用コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| `MetricCard` | KPI サマリーカード（4 枚） |
| `CompletionsTrendChart` | 日次コード生成・受入トレンド（折れ線グラフ） |
| `AcceptanceRateChart` | 日次受入率トレンド（エリアグラフ） |
| `LanguageBreakdownChart` | 言語別コード補完内訳 |
| `EditorBreakdownChart` | エディタ別内訳 |

## データソース

- 関数: `fetchOrgUsageData()` → `src/lib/github.ts`
- API: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` → NDJSON
- 型: `OrgUsageReport`, `OrgDayTotals`, `TotalsByFeature`, `TotalsByLanguageFeature`, `TotalsByIde`
