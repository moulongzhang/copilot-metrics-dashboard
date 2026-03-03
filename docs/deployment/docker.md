# Docker デプロイ

## 概要

このアプリケーションは Next.js 標準の Docker サポートを使用してコンテナ化できます。現時点では `Dockerfile` はリポジトリに含まれていませんが、以下を参考に作成できます。

## Dockerfile の構成案

```dockerfile
FROM node:20-alpine AS base

# 依存インストール
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ビルド時の環境変数（NEXT_PUBLIC_ のみ）
ARG NEXT_PUBLIC_ORG_NAME
ENV NEXT_PUBLIC_ORG_NAME=${NEXT_PUBLIC_ORG_NAME}

RUN npm run build

# 実行
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

> **注意**: standalone モードを使用する場合は `next.config.ts` に `output: 'standalone'` を追加してください。

## docker-compose の構成案

```yaml
version: '3.8'

services:
  copilot-dashboard:
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

実行時に環境変数を渡します（`GITHUB_TOKEN` をイメージに含めないよう注意）:

```bash
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=ghp_xxx \
  -e GITHUB_ORG=your-org \
  copilot-metrics-dashboard
```

または `.env` ファイルを使用:

```bash
docker run -p 3000:3000 --env-file .env copilot-metrics-dashboard
```
