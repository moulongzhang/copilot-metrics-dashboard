# インストール手順

## 前提条件

- **Node.js** 18.17.0 以上（または LTS 最新版）
- **npm** 9 以上（Node.js に同梱）
- **GitHub Personal Access Token**（Copilot メトリクス読み取り権限が必要）

## リポジトリのクローン

```bash
git clone https://github.com/<your-org>/copilot-metrics-dashboard.git
cd copilot-metrics-dashboard
```

## 依存パッケージのインストール

```bash
npm install
```

## 動作確認

```bash
# 環境変数を設定した後に実行
npm run dev
```

ブラウザで `http://localhost:3000` を開き、ダッシュボードが表示されれば成功です。

## 次のステップ

- [環境変数設定](configuration.md) — GitHub トークンと組織名を設定する
- [クイックスタート](quick-start.md) — 最短手順でダッシュボードを起動する
