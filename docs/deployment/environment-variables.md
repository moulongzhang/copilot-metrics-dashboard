# 本番環境の環境変数設定

## 環境変数一覧

| 変数名 | 必須 | 説明 |
|-------|------|------|
| `GITHUB_TOKEN` | **必須** | GitHub Personal Access Token（サーバーサイドのみ） |
| `GITHUB_ORG` | **必須** | 対象組織名 |
| `NEXT_PUBLIC_ORG_NAME` | 任意 | UI に表示する組織名（`NEXT_PUBLIC_` プレフィックスのためクライアントに露出） |

## セキュリティに関する注意事項

- `GITHUB_TOKEN` は **サーバーサイドのみ** で使用されます。`NEXT_PUBLIC_` プレフィックスを付けないでください。
- トークンは最小権限の原則に従い、必要な読み取り権限のみを付与してください。
- 本番環境ではトークンの有効期限を設定し、定期的にローテーションしてください。
- `NEXT_PUBLIC_ORG_NAME` はクライアント（ブラウザ）に公開されます。機密情報を含めないようにしてください。

## 各デプロイ先での設定方法

### Vercel

Vercel ダッシュボードの **Project Settings** → **Environment Variables** で設定します。

詳細は [Vercel デプロイ手順](vercel.md) を参照してください。

### Docker

`docker run` コマンドの `-e` フラグまたは `docker-compose.yml` の `environment` セクションで設定します。

詳細は [Docker デプロイ](docker.md) を参照してください。

### その他の環境

Next.js の環境変数の仕組みに従い、`.env.production` または OS の環境変数として設定してください。
