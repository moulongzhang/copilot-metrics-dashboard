# Copilot Metrics Dashboard ドキュメント

GitHub Copilot の組織利用状況を可視化する Next.js ダッシュボードの公式ドキュメントです。

## 対象読者別クイックナビ

| 対象 | リンク |
|------|--------|
| 初めて使う方 | [クイックスタート](getting-started/quick-start.md) |
| 環境構築したい方 | [インストール手順](getting-started/installation.md) / [環境変数設定](getting-started/configuration.md) |
| 機能を把握したい方 | [機能一覧](features/overview-dashboard.md) |
| 開発に参加したい方 | [コントリビューションガイド](contributing/CONTRIBUTING.md) |
| デプロイしたい方 | [Vercel デプロイ](deployment/vercel.md) |

## ドキュメント一覧

### はじめに
- [インストール手順](getting-started/installation.md)
- [環境変数設定](getting-started/configuration.md)
- [クイックスタート](getting-started/quick-start.md)

### アーキテクチャ
- [アーキテクチャ概要](architecture/overview.md)
- [技術スタック](architecture/tech-stack.md)
- [データフロー](architecture/data-flow.md)
- [ディレクトリ構成](architecture/directory-structure.md)

### 機能
- [Overview ダッシュボード](features/overview-dashboard.md)
- [Code Completions](features/completions.md)
- [Chat Analytics](features/chat-analytics.md)
- [Pull Requests](features/pull-requests.md)
- [Member Metrics](features/member-metrics.md)

### API
- [GitHub API エンドポイント](api/github-endpoints.md)
- [内部 API ルート仕様](api/internal-routes.md)
- [型定義リファレンス](api/types.md)

### 開発ガイド
- [開発環境セットアップ](development/setup.md)
- [コーディング規約](development/coding-conventions.md)
- [UI コンポーネントガイド](development/ui-components.md)
- [新しいチャートの追加方法](development/adding-new-chart.md)
- [新しいページの追加方法](development/adding-new-page.md)

### デプロイ
- [環境変数（本番）](deployment/environment-variables.md)
- [Vercel デプロイ](deployment/vercel.md)
- [Docker デプロイ](deployment/docker.md)

### コントリビューション
- [コントリビューションガイド](contributing/CONTRIBUTING.md)
- [行動規範](contributing/code-of-conduct.md)

## 技術スタック

| カテゴリ | 採用技術 |
|----------|----------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | shadcn/ui (new-york) + Tailwind CSS v4 |
| チャート | Recharts |
| アイコン | Lucide React |
| Chat AI | @github/copilot-sdk |
