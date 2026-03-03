# インストール手順

## 前提条件

- **Node.js** 18.17 以上
- **npm** 9 以上
- GitHub 組織の管理者権限または Copilot API アクセス権限
- GitHub Personal Access Token（後述）

## リポジトリのクローン

```bash
git clone https://github.com/<org>/copilot-metrics-dashboard.git
cd copilot-metrics-dashboard
```

## 依存パッケージのインストール

```bash
npm install
```

主なインストール内容:
- `next` 16 — フレームワーク
- `recharts` — チャートライブラリ
- `@github/copilot-sdk` — AI チャット統合
- `shadcn` 関連パッケージ — UI コンポーネント

## 動作確認

インストール後、環境変数を設定してから開発サーバーを起動します:

```bash
cp .env.local.example .env.local
# .env.local を編集
npm run dev
```

`http://localhost:3000` にアクセスしてダッシュボードが表示されれば成功です。

## 次のステップ

- [環境変数設定](configuration.md) — `GITHUB_TOKEN` と `GITHUB_ORG` の設定方法
- [クイックスタート](quick-start.md) — セットアップ全体の手順
