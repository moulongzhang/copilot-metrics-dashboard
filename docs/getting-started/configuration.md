# 環境変数設定

## .env.local の作成

プロジェクトルートに `.env.local` ファイルを作成します。

```bash
cp .env.local.example .env.local
# または手動で作成
```

## 環境変数一覧

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `GITHUB_TOKEN` | ✅ | GitHub Personal Access Token |
| `GITHUB_ORG` | ✅ | 対象の GitHub 組織名（例: `my-company`） |
| `NEXT_PUBLIC_ORG_NAME` | 任意 | UI に表示する組織名（省略時は `GITHUB_ORG` の値を使用） |

`.env.local` の例:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=my-company
NEXT_PUBLIC_ORG_NAME=My Company
```

## GitHub Personal Access Token の取得方法

1. GitHub にログインし、**Settings → Developer settings → Personal access tokens → Fine-grained tokens** を開く
2. **Generate new token** をクリック
3. **Resource owner** に対象組織を選択
4. 以下の権限を付与する

## 必要な権限

| スコープ / 権限 | 理由 |
|----------------|------|
| `read:org` | 組織メンバー一覧の取得 |
| `manage_billing:copilot` または `read:enterprise` | Copilot メトリクス・シート情報の取得 |
| Copilot metrics API へのアクセス権 | 利用レポートのダウンロードリンク取得 |

> **セキュリティ注意**: `.env.local` は `.gitignore` に含まれているため、Git にはコミットされません。`GITHUB_TOKEN` を公開リポジトリにコミットしないでください。

## 次のステップ

- [クイックスタート](quick-start.md) — ダッシュボードを起動する
