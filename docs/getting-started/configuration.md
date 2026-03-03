# 環境変数設定

## .env.local の作成

```bash
cp .env.local.example .env.local
```

`.env.local` は Git にコミットしません（`.gitignore` で除外されています）。

## 環境変数一覧

| 変数名 | 必須 | 説明 |
|-------|------|------|
| `GITHUB_TOKEN` | **必須** | GitHub Personal Access Token |
| `GITHUB_ORG` | **必須** | 組織名（例: `my-company`） |
| `NEXT_PUBLIC_ORG_NAME` | 任意 | サイドバーに表示する組織名（省略時: `octodemo`） |

## GitHub Personal Access Token の取得方法

1. GitHub.com にアクセスし、**Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** を開く
2. **Generate new token** をクリック
3. トークン名、有効期限、対象組織を設定
4. 以下の権限を付与して生成

## 必要な権限

Fine-grained Personal Access Token に必要な権限:

| 権限 | アクセスレベル | 用途 |
|------|-------------|------|
| `GitHub Copilot metrics for an organization` | Read | Copilot メトリクス・レポート取得 |
| `Members` | Read | 組織メンバー一覧取得 |
| `Copilot Business` | Read | Copilot シート情報取得 |

> **注意**: Classic Token を使用する場合は `copilot`, `read:org` スコープが必要です。

## 次のステップ

- [クイックスタート](quick-start.md) — 開発サーバーの起動
- [Vercel デプロイ](../deployment/vercel.md) — 本番環境の環境変数設定
