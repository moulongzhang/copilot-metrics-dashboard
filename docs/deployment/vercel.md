# Vercel デプロイ手順

## 前提条件

- [Vercel](https://vercel.com) アカウント
- GitHub リポジトリへのアクセス権
- `GITHUB_TOKEN`（本番用）と `GITHUB_ORG` の準備

## Vercel プロジェクトの作成

1. [Vercel ダッシュボード](https://vercel.com/dashboard) を開き **Add New Project** をクリック
2. GitHub リポジトリを選択してインポート
3. フレームワークが **Next.js** として自動検出されることを確認
4. **Deploy** をクリック（環境変数は次のステップで設定）

## 環境変数の設定

Vercel ダッシュボードの **Project Settings** → **Environment Variables** に以下を追加します:

| 変数名 | 値 | 環境 |
|-------|---|------|
| `GITHUB_TOKEN` | `ghp_xxx...` | Production, Preview |
| `GITHUB_ORG` | 組織名 | Production, Preview |
| `NEXT_PUBLIC_ORG_NAME` | 表示名（任意） | Production, Preview |

## デプロイ手順

### 自動デプロイ（推奨）

`main` ブランチへのプッシュで自動的にデプロイされます。

### 手動デプロイ

```bash
# Vercel CLI を使用する場合
npm install -g vercel
vercel --prod
```

## カスタムドメインの設定

1. Vercel ダッシュボードの **Project Settings** → **Domains** を開く
2. カスタムドメインを追加
3. DNS プロバイダーで CNAME レコードを設定

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドを確認
npm run build
```

### `GITHUB_TOKEN` が認識されない

環境変数が **Production** 環境に設定されているか確認してください。設定後は再デプロイが必要です。

### API が 403 を返す

Vercel のサーバーリージョンから GitHub API へのアクセスが可能か確認してください。また、`GITHUB_TOKEN` の有効期限が切れていないか確認してください。
