# Member Metrics ページ

## 概要

`/members` ルートに対応するページ (`src/app/members/page.tsx`) は、ユーザー別の Copilot 利用状況を一覧テーブルで表示します。データは `fetchUserUsageData()` で取得したユーザー別利用レポート（NDJSON）を集計して生成します。

## ユーザー別利用状況

各ユーザーについて以下の集計値を表示します:

| カラム | 内容 |
|--------|------|
| ユーザー名 | GitHub ログイン名（アバター付き） |
| 最終アクティビティ | 最後の記録日 |
| Total Interactions | `user_initiated_interaction_count` の合計 |
| Code Generations | `code_generation_activity_count` の合計 |
| Code Acceptances | `code_acceptance_activity_count` の合計 |
| LoC Added | `loc_added_sum` の合計 |
| LoC Deleted | `loc_deleted_sum` の合計 |
| Chat Requests | チャット系フィーチャー（`chat_panel_*`）のインタラクション数合計 |
| Active | 最終アクティビティが過去 7 日以内かどうか |

## 検索・ソート機能

`MembersTable` コンポーネント内で検索・ソートが実装されています（クライアントサイド）。

## 使用コンポーネント

| コンポーネント | 説明 |
|--------------|------|
| `MetricCard` | Total Users / Active Users / Inactive Users の KPI カード |
| `MembersTable` | ユーザー別データテーブル（検索・ソート付き） |

## データソース

- 関数: `fetchUserUsageData()` → `src/lib/github.ts`
- API: `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest` → NDJSON
- 型: `UserUsageRecord`

> **注意**: アバター画像は `https://github.com/{login}.png?size=64` を使用しており、シート API は呼び出していません。
