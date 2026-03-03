# 型定義リファレンス

## 概要（types.ts の役割）

`src/lib/types.ts` にすべての TypeScript 型定義が集約されています。GitHub API レスポンス型と、表示用に集計した型の 2 種類があります。

## 主要な型一覧

### Copilot メトリクス API（GA API）

| 型名 | 説明 |
|-----|------|
| `CopilotMetricsDay` | 1 日分の Copilot メトリクス |
| `CopilotIdeCodeCompletions` | IDE コード補完メトリクス |
| `CopilotIdeChat` | IDE チャットメトリクス |
| `CopilotDotcomChat` | GitHub.com チャットメトリクス |
| `CopilotDotcomPullRequests` | GitHub.com PR メトリクス |
| `LanguageSummary` | 言語別集計 |
| `EditorCompletions` | エディタ別補完メトリクス |
| `CompletionModel` | 補完モデルメトリクス |
| `LanguageCompletionMetrics` | 言語別補完詳細 |
| `EditorChat` | エディタ別チャットメトリクス |
| `ChatModel` | チャットモデルメトリクス |
| `DotcomChatModel` | GitHub.com チャットモデル |
| `RepositoryPRMetrics` | リポジトリ別 PR メトリクス |
| `PRModel` | PR モデルメトリクス |

### Usage Reports API（NDJSON）

| 型名 | 説明 |
|-----|------|
| `UsageReportResponse` | ダウンロードリンク取得レスポンス |
| `OrgUsageReport` | 組織利用レポート全体 |
| `OrgDayTotals` | 日別組織集計 |
| `TotalsByIde` | IDE 別集計 |
| `TotalsByFeature` | 機能別集計 |
| `TotalsByLanguageFeature` | 言語×機能別集計 |
| `TotalsByLanguageModel` | 言語×モデル別集計 |
| `TotalsByModelFeature` | モデル×機能別集計 |
| `UserUsageRecord` | ユーザー別利用レコード |
| `UserMetricsRecord` | ユーザーメトリクスレコード（旧形式） |

### Seats / Members API

| 型名 | 説明 |
|-----|------|
| `CopilotSeatsResponse` | シート一覧レスポンス |
| `CopilotSeat` | 個別シート情報 |
| `GitHubUser` | GitHub ユーザー基本情報 |
| `OrgMember` | 組織メンバー情報 |

### 表示用集計型

| 型名 | 説明 |
|-----|------|
| `AggregatedCompletionMetrics` | コード補完集計（提案数・承認数・承認率） |
| `DailyTrend` | 日別トレンドデータ |
| `PullRequestMetrics` | PR ライフサイクルメトリクス |

## GitHub API レスポンスとの対応関係

### Usage Reports（NDJSON）の主要フィールド

`OrgDayTotals` の主要フィールド:

```typescript
interface OrgDayTotals {
  day: string;                           // "YYYY-MM-DD"
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  monthly_active_chat_users: number;
  monthly_active_agent_users: number;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_added_sum: number;
  totals_by_ide: TotalsByIde[];
  totals_by_feature: TotalsByFeature[];
  totals_by_language_feature: TotalsByLanguageFeature[];
  totals_by_language_model: TotalsByLanguageModel[];
  totals_by_model_feature: TotalsByModelFeature[];
  pull_requests?: PullRequestMetrics;    // 利用可能な場合のみ
}
```

`TotalsByFeature` の `feature` フィールドで使われる値:

| feature 値 | 説明 |
|-----------|------|
| `code_completion` | コード補完 |
| `agent_edit` | Agent による編集 |
| `chat_panel_ask_mode` | チャット Ask モード |
| `chat_panel_edit_mode` | チャット Edit モード |
| `chat_panel_agent_mode` | チャット Agent モード |
| `chat_panel_custom_mode` | チャット カスタムエージェントモード |
| `chat_panel_unknown_mode` | チャット 不明モード |
| `inline_chat` | インラインチャット |
