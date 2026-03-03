# Member Metrics ページ

## 概要

`/members` ルート（`src/app/members/page.tsx`）は、ユーザー別の Copilot 利用状況を一覧表示します。

**ユーザー利用レポート（NDJSON）** から取得した `UserUsageRecord[]` を `user_login` ごとに集計し、1 行 1 ユーザーのテーブルで表示します。

## ユーザー別利用状況

### サマリーカード（3 枚）

| カード | 値の計算方法 |
|-------|------------|
| **Total Users** | ユニークユーザー数 |
| **Active Users** | 最終活動日が過去 7 日以内のユーザー数 |
| **Inactive Users** | 最終活動日が 7 日以上前のユーザー数 |

### テーブルカラム

`MembersTable` コンポーネントが以下のカラムを表示します。

| カラム | 説明 |
|-------|------|
| ユーザー | アバター + ログイン名（GitHub プロフィールへのリンク） |
| Last Activity | 最終活動日 |
| Total Interactions | `user_initiated_interaction_count` の合計 |
| Code Generations | `code_generation_activity_count` の合計 |
| Code Acceptances | `code_acceptance_activity_count` の合計 |
| LoC Added | `loc_added_sum` の合計 |
| Chat Requests | チャット機能（ask/edit/agent/custom モード）の `user_initiated_interaction_count` 合計 |
| Status | 過去 7 日以内に活動があれば "Active"、なければ "Inactive" |

## 検索・ソート機能

`MembersTable` コンポーネントはクライアントサイドでフィルタリング・ソートをサポートしています（コンポーネント実装に依存）。

## 使用コンポーネント

| コンポーネント | 役割 |
|--------------|------|
| `MetricCard` | 3 枚のサマリーカード |
| `MembersTable` | ユーザー別利用状況テーブル（`src/components/tables/MembersTable.tsx`） |

## データソース

- **取得関数**: `fetchUserUsageData()` (`src/lib/github.ts`)
- **API**: `GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest`（NDJSON）
- **型**: `UserUsageRecord[]`
- **アバター画像**: `https://github.com/{login}.png?size=64`（GitHub プロフィール画像）
