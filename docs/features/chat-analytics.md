# Chat Analytics ページ

## 概要

`/chat` ルートに対応するページ (`src/app/chat/page.tsx`) は、Copilot Chat の利用状況をモード別・モデル別に分析します。チャット機能は `chat_panel_ask_mode`、`chat_panel_edit_mode`、`chat_panel_agent_mode` などのフィーチャーで分類されます。

## IDE Chat メトリクス

| カード | 内容 |
|--------|------|
| Total Chat Interactions | 全チャットモードの `user_initiated_interaction_count` 合計 |
| Monthly Active Chat Users | 最新日の `monthly_active_chat_users` |
| Monthly Active Agent Users | 最新日の `monthly_active_agent_users` |
| Code from Chat | チャット経由のコード生成アクティビティ数合計 |

対象フィーチャー: `chat_panel_ask_mode`, `chat_panel_edit_mode`, `chat_panel_agent_mode`, `chat_panel_custom_mode`, `chat_panel_unknown_mode`, `inline_chat`

## GitHub.com Chat メトリクス

モデル別のチャット使用量を `totals_by_model_feature` から集計し、`DotcomChatChart` で棒グラフ表示します。

## チャットモード別の内訳

`ChatMetricsChart` により、各チャットモードのインタラクション数・コード挿入数を棒グラフで比較できます。

| フィーチャーキー | 表示ラベル |
|----------------|-----------|
| `chat_panel_ask_mode` | Ask Mode |
| `chat_panel_edit_mode` | Edit Mode |
| `chat_panel_agent_mode` | Agent Mode |
| `chat_panel_custom_mode` | Custom Agent |
| `chat_panel_unknown_mode` | Unknown Mode |
| `inline_chat` | Inline Chat |

## 使用コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| `MetricCard` | KPI サマリーカード（4 枚） |
| `ChatMetricsChart` | チャットモード別集計（棒グラフ） |
| `DotcomChatChart` | モデル別チャット使用量（棒グラフ） |
| `ChatTrendChart` | 日次チャットトレンド（折れ線グラフ） |

## データソース

- 関数: `fetchOrgUsageData()` → `src/lib/github.ts`
- API: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest` → NDJSON
- 型: `OrgUsageReport`, `OrgDayTotals`, `TotalsByFeature`, `TotalsByModelFeature`
