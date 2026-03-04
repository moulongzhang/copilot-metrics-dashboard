# Vercel デプロイ手順

## 前提条件

- Vercel アカウント（[vercel.com](https://vercel.com) で無料作成可能）
- GitHub リポジトリへのアクセス権
- `GITHUB_TOKEN` および `GITHUB_ORG` の値

## Vercel プロジェクトの作成

1. [Vercel ダッシュボード](https://vercel.com/dashboard) を開く
2. **Add New → Project** をクリック
3. GitHub リポジトリ `copilot-metrics-dashboard` をインポートする
4. **Framework Preset** が **Next.js** に自動設定されていることを確認する

## 環境変数の設定

**Project Settings → Environment Variables** から以下を設定する:

| 変数名 | 値 | 環境 |
|--------|----|------|
| `GITHUB_TOKEN` | `ghp_xxxx...` | Production, Preview, Development |
| `GITHUB_ORG` | `your-org-name` | Production, Preview, Development |
| `NEXT_PUBLIC_ORG_NAME` | `Your Organization` | Production, Preview（任意） |

## デプロイ手順

1. `main` ブランチへのプッシュで自動デプロイが開始されます。
2. Vercel ダッシュボードの **Deployments** タブでステータスを確認できます。
3. デプロイ完了後、発行された URL（例: `https://copilot-metrics-dashboard.vercel.app`）でアクセスできます。

手動デプロイ:
```bash
npx vercel --prod
```

## カスタムドメインの設定

**Project Settings → Domains** から任意のドメインを追加できます。

## トラブルシューティング

| 症状 | 確認事項 |
|------|---------|
| ビルドエラー | `npm run build` をローカルで実行して事前確認する |
| 環境変数が読めない | `GITHUB_TOKEN` が `NEXT_PUBLIC_` を付けずに設定されているか確認 |
| 401 エラー | トークンの有効期限と権限スコープを確認 |
| 関数タイムアウト | Vercel の関数実行時間制限（デフォルト 10 秒）を超えていないか確認。必要に応じて `maxDuration` を設定する |
