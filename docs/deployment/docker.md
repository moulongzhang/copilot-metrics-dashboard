# Docker デプロイ（将来的）

## 概要

現時点ではこのプロジェクトに公式の `Dockerfile` は含まれていませんが、Next.js の標準的な Docker デプロイパターンで動作します。

## Dockerfile の構成案

```dockerfile
FROM node:20-alpine AS base

# 依存パッケージのインストール
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 本番イメージ
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

> **注意**: `output: 'standalone'` を `next.config.ts` に追加する必要があります。

## docker-compose の構成案

```yaml
version: '3.8'
services:
  dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_ORG=${GITHUB_ORG}
      - NEXT_PUBLIC_ORG_NAME=${NEXT_PUBLIC_ORG_NAME}
    restart: unless-stopped
```

## 環境変数の受け渡し

Docker コンテナへの環境変数は以下の方法で渡します:

```bash
# -e フラグで直接指定
docker run -e GITHUB_TOKEN=ghp_xxx -e GITHUB_ORG=my-org -p 3000:3000 copilot-metrics-dashboard

# .env ファイルから読み込み
docker run --env-file .env.production -p 3000:3000 copilot-metrics-dashboard
```
