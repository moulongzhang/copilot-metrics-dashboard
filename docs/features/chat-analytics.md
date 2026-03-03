# Chat Analytics ページ

## 概要

`/chat` ルート（`src/app/chat/page.tsx`）は、Copilot Chat の利用状況をモード別・モデル別に分析します。

対象の `feature` 値: `chat_panel_ask_mode`, `chat_panel_edit_mode`, `chat_panel_agent_mode`, `chat_panel_custom_mode`, `chat_panel_unknown_mode`, `inline_chat`

## チャットモード別メトリクス

### サマリーカード（4 枚）

| カード | 値の計算方法 |
|-------|------------|
| **Total Chat Interactions** | チャット機能全体の `user_initiated_interaction_count` 合計 |
| **Monthly Active Chat Users** | 最終日の `monthly_active_chat_users` |
| **Monthly Active Agent Users** | 最終日の `monthly_active_agent_users` |
| **Code from Chat** | チャット機能全体の `code_generation_activity_count` 合計 |

## チャットモード別の内訳

`ChatMetricsChart` でモード別のインタラクション数・コード挿入数を棒グラフで表示します。

| モード | feature 値 |
|-------|-----------|
| Ask Mode | `chat_panel_ask_mode` |
| Edit Mode | `chat_panel_edit_mode` |
| Agent Mode | `chat_panel_agent_mode` |
| Custom Agent | `chat_panel_custom_mode` |
| Unknown Mode | `chat_panel_unknown_mode` |
| Inline Chat | `inline_chat` |

## モデル別使用状況

`DotcomChatChart` で `totals_by_model_feature` からチャット機能に関するモデル別インタラクション数を表示します。インタラクション数の多い順に並びます。

## 日別チャットトレンド

`ChatTrendChart` で日別のチャット数とコード挿入数の推移を折れ線グラフで表示します。

## 使用コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `MetricCard` | 4 枚のサマリーカード |
| `ChatMetricsChart` | チャットモード別メトリクス（棒グラフ） |
| `DotcomChatChart` | モデル別チャット使用状況（棒グラフ） |
| `ChatTrendChart` | 日別チャットトレンド（折れ線グラフ） |

## データソース

- **取得関数**: `fetchOrgUsageData()` (`src/lib/github.ts`)
- **API**: `GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest`
- **型**: `OrgUsageReport` → `OrgDayTotals[]`
- **集計対象フィールド**: `totals_by_feature`, `totals_by_model_feature`
