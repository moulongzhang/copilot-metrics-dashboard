# 開発環境セットアップ

## 必要なツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | 18.17+ | JavaScript ランタイム |
| npm | 9+ | パッケージ管理 |
| Git | 2.x+ | バージョン管理 |

## 環境構築手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/<your-org>/copilot-metrics-dashboard.git
cd copilot-metrics-dashboard

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数を設定
cp .env.local.example .env.local
# .env.local に GITHUB_TOKEN と GITHUB_ORG を設定する

# 4. 開発サーバーを起動
npm run dev
```

主なスクリプト:

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動（`http://localhost:3000`） |
| `npm run build` | プロダクションビルドを生成 |
| `npm start` | プロダクションサーバーを起動 |
| `npm run lint` | ESLint を実行 |

## IDE 設定（VS Code 推奨拡張機能）

| 拡張機能 | 用途 |
|---------|------|
| ESLint | リアルタイムのリント |
| Prettier | コードフォーマット |
| Tailwind CSS IntelliSense | Tailwind クラス名の補完 |
| TypeScript (built-in) | 型チェック |

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| `npm install` が失敗する | Node.js のバージョンを確認し、18.17 以上にアップデートする |
| `GITHUB_TOKEN is not set` エラー | `.env.local` が存在し、トークンが設定されているか確認する |
| ポート 3000 が使用中 | `npm run dev -- -p 3001` で別ポートを指定する |
