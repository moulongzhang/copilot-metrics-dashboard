# 開発環境セットアップ

## 必要なツール

- **Node.js** 18.17 以上（Next.js 16 の要件）
- **npm** 9 以上
- **GitHub Personal Access Token**（Copilot API へのアクセス権限が必要）

## 環境構築手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/<org>/copilot-metrics-dashboard.git
cd copilot-metrics-dashboard

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数を設定
cp .env.local.example .env.local
# .env.local を編集して GITHUB_TOKEN と GITHUB_ORG を設定

# 4. 開発サーバーを起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

## 環境変数（開発用）

`.env.local` に以下を設定します:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_ORG=your-organization-name
NEXT_PUBLIC_ORG_NAME=Your Org Display Name   # 省略可
```

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（`http://localhost:3000`） |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動（`npm run build` 後） |
| `npm run lint` | ESLint の実行 |

## IDE 設定（VS Code 推奨拡張機能）

`.vscode/extensions.json` を作成して以下を推奨することを推奨します:

- `dbaeumer.vscode-eslint` — ESLint 統合
- `esbenp.prettier-vscode` — コードフォーマット
- `bradlc.vscode-tailwindcss` — Tailwind CSS IntelliSense

## トラブルシューティング

### `GITHUB_TOKEN environment variable is not set` エラー

`.env.local` ファイルが存在するか、`GITHUB_TOKEN` が正しく設定されているか確認してください。

### `403 Forbidden` エラー

`GITHUB_TOKEN` に Copilot API へのアクセス権限がありません。[環境変数設定ガイド](../getting-started/configuration.md) を参照してトークンの権限を確認してください。

### `404 Not Found` エラー

`GITHUB_ORG` に設定した組織名が正しいか確認してください。また、組織で GitHub Copilot が有効になっているか確認してください。
