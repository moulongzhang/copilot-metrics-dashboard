# Copilot Metrics Dashboard ドキュメント

GitHub Copilot の組織利用状況をビジュアライズする Next.js ダッシュボードの公式ドキュメントです。

## 対象読者別クイックナビ

| 対象 | 推奨リンク |
|------|-----------|
| 初めて使う方 | [クイックスタート](getting-started/quick-start.md) |
| 開発者 | [開発環境セットアップ](development/setup.md) / [コーディング規約](development/coding-conventions.md) |
| 運用担当者 | [Vercel デプロイ](deployment/vercel.md) / [環境変数](deployment/environment-variables.md) |
| アーキテクチャを知りたい方 | [アーキテクチャ概要](architecture/overview.md) |

## ドキュメント一覧

### Getting Started
- [インストール手順](getting-started/installation.md)
- [環境変数設定](getting-started/configuration.md)
- [クイックスタート](getting-started/quick-start.md)

### アーキテクチャ
- [アーキテクチャ概要](architecture/overview.md)
- [ディレクトリ構成](architecture/directory-structure.md)
- [技術スタック](architecture/tech-stack.md)
- [データフロー](architecture/data-flow.md)

### 機能
- [Overview ダッシュボード](features/overview-dashboard.md)
- [Code Completions](features/completions.md)
- [Chat Analytics](features/chat-analytics.md)
- [Pull Requests](features/pull-requests.md)
- [Member Metrics](features/member-metrics.md)

### API
- [GitHub API エンドポイント](api/github-endpoints.md)
- [内部 API ルート](api/internal-routes.md)
- [型定義リファレンス](api/types.md)

### 開発
- [開発環境セットアップ](development/setup.md)
- [コーディング規約](development/coding-conventions.md)
- [UI コンポーネントガイド](development/ui-components.md)
- [新しいページの追加方法](development/adding-new-page.md)
- [新しいチャートの追加方法](development/adding-new-chart.md)

### デプロイ
- [環境変数設定（本番）](deployment/environment-variables.md)
- [Vercel デプロイ手順](deployment/vercel.md)
- [Docker デプロイ](deployment/docker.md)

### コントリビューション
- [コントリビューションガイド](contributing/CONTRIBUTING.md)
- [行動規範](contributing/code-of-conduct.md)

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | shadcn/ui + Tailwind CSS v4 |
| チャート | Recharts 3 |
| AI チャット | @github/copilot-sdk |
| アイコン | Lucide React |
