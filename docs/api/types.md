# 型定義リファレンス

## 概要（types.ts の役割）

`src/lib/types.ts` はこのプロジェクトで使用するすべての TypeScript 型を一元管理するファイルです。GitHub API のレスポンス形状に合わせた型と、表示用に集計された型の 2 種類が含まれています。

## 主要な型一覧

### GitHub Copilot メトリクス API（GA API）

| 型名 | 説明 |
|------|------|
| `CopilotMetricsDay` | 1 日分の Copilot メトリクス（GA API レスポンスの要素） |
| `CopilotIdeCodeCompletions` | IDE コード補完の集計 |
| `CopilotIdeChat` | IDE チャットの集計 |
| `CopilotDotcomChat` | GitHub.com チャットの集計 |
| `CopilotDotcomPullRequests` | GitHub.com PR の集計 |
| `EditorCompletions` | エディタ別コード補完データ |
| `CompletionModel` | モデル別補完データ |
| `LanguageCompletionMetrics` | 言語別補完メトリクス |
| `EditorChat` | エディタ別チャットデータ |
| `ChatModel` | モデル別チャットデータ |
| `DotcomChatModel` | GitHub.com チャットのモデルデータ |
| `RepositoryPRMetrics` | リポジトリ別 PR メトリクス |
| `PRModel` | PR のモデル別データ |

### 使用レポート API（NDJSON）

| 型名 | 説明 |
|------|------|
| `UsageReportResponse` | ダウンロードリンクレスポンス |
| `OrgUsageReport` | 組織レベルの利用レポート全体 |
| `OrgDayTotals` | 1 日分の組織集計データ |
| `TotalsByIde` | IDE 別集計 |
| `TotalsByFeature` | 機能別集計 |
| `TotalsByLanguageFeature` | 言語×機能の集計 |
| `TotalsByLanguageModel` | 言語×モデルの集計 |
| `TotalsByModelFeature` | モデル×機能の集計 |
| `UserUsageRecord` | ユーザー別 1 日分の利用レコード |
| `UserMetricsRecord` | （旧形式）ユーザーメトリクスレコード |
| `PullRequestMetrics` | PR ライフサイクルメトリクス |

### シート・メンバー API

| 型名 | 説明 |
|------|------|
| `CopilotSeatsResponse` | シート一覧 API レスポンス |
| `CopilotSeat` | 個別シート情報 |
| `GitHubUser` | GitHub ユーザー情報 |
| `OrgMember` | 組織メンバー情報 |

### 表示用集計型

| 型名 | 説明 |
|------|------|
| `AggregatedCompletionMetrics` | コード補完の集計結果（受入率を含む） |
| `DailyTrend` | 日次トレンドデータ（グラフ用） |

## GitHub API レスポンスとの対応関係

```
GET /orgs/{org}/copilot/metrics
  → CopilotMetricsDay[]
      ├── copilot_ide_code_completions: CopilotIdeCodeCompletions
      ├── copilot_ide_chat: CopilotIdeChat
      ├── copilot_dotcom_chat: CopilotDotcomChat
      └── copilot_dotcom_pull_requests: CopilotDotcomPullRequests

GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest
  → UsageReportResponse { download_links: string[] }
      └── downloadAndParseNDJSON → OrgUsageReport
              └── day_totals: OrgDayTotals[]
                      ├── totals_by_ide: TotalsByIde[]
                      ├── totals_by_feature: TotalsByFeature[]
                      ├── totals_by_language_feature: TotalsByLanguageFeature[]
                      ├── totals_by_language_model: TotalsByLanguageModel[]
                      ├── totals_by_model_feature: TotalsByModelFeature[]
                      └── pull_requests?: PullRequestMetrics

GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest
  → UsageReportResponse { download_links: string[] }
      └── downloadAndParseNDJSON → UserUsageRecord[]
```
