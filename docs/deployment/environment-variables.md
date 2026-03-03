# 本番環境の環境変数設定

## 環境変数一覧

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `GITHUB_TOKEN` | ✅ | GitHub Personal Access Token（Copilot メトリクス読み取り権限） |
| `GITHUB_ORG` | ✅ | 対象の GitHub 組織名（例: `my-company`） |
| `NEXT_PUBLIC_ORG_NAME` | 任意 | UI に表示する組織の表示名 |

## セキュリティに関する注意事項

- `GITHUB_TOKEN` は **サーバーサイド専用** の環境変数です。`NEXT_PUBLIC_` プレフィックスを付けないでください（ブラウザに露出します）。
- トークンは Fine-grained tokens を使用し、必要最小限の権限のみを付与してください。
- 定期的にトークンをローテーションしてください。
- CI/CD 環境では Secrets 機能（GitHub Actions Secrets、Vercel Environment Variables 等）を使用し、コードにハードコードしないでください。

## 各デプロイ先での設定方法

### Vercel

Vercel ダッシュボード → Project Settings → Environment Variables から設定します。詳細は [Vercel デプロイ](vercel.md) を参照してください。

### Docker / セルフホスト

```bash
docker run \
  -e GITHUB_TOKEN=ghp_xxxx \
  -e GITHUB_ORG=my-company \
  -p 3000:3000 \
  copilot-metrics-dashboard
```

または `docker-compose.yml` の `environment` セクションで設定します。

### GitHub Actions

```yaml
- name: Deploy
  env:
    GITHUB_TOKEN: ${{ secrets.COPILOT_METRICS_TOKEN }}
    GITHUB_ORG: ${{ vars.GITHUB_ORG }}
```
