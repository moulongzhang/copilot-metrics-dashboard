# クイックスタート

5 分でダッシュボードを起動するための手順です。

## ステップ 1: リポジトリをクローン

```bash
git clone https://github.com/<org>/copilot-metrics-dashboard.git
cd copilot-metrics-dashboard
```

## ステップ 2: 依存パッケージをインストール

```bash
npm install
```

## ステップ 3: 環境変数を設定

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて以下を設定します:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=your-organization-name
```

## ステップ 4: 開発サーバーを起動

```bash
npm run dev
```

## ステップ 5: ダッシュボードにアクセス

ブラウザで `http://localhost:3000` を開きます。

左のサイドバーから各ページに移動できます:
- **Overview** — 組織全体のサマリー
- **Code Completions** — コード補完メトリクス詳細
- **Chat** — チャット利用状況（モード・モデル別）
- **Pull Requests** — PR ライフサイクルメトリクス
- **Members** — ユーザー別利用状況

右下のチャットアイコンをクリックすると、メトリクスデータについて AI アシスタントに質問できます。

## うまく動かない場合

**ページが真っ白 / エラーが表示される**
- `.env.local` の `GITHUB_TOKEN` と `GITHUB_ORG` が正しいか確認
- トークンに必要な権限があるか確認（[設定ガイド](configuration.md) 参照）

**`403 Forbidden`**
- トークンの権限不足。`GitHub Copilot metrics for an organization` の Read 権限を追加してください

**`404 Not Found`**
- `GITHUB_ORG` の組織名が正しいか確認。または組織で Copilot が有効になっていない可能性があります

## 次のステップ

- [アーキテクチャ概要](../architecture/overview.md)
- [新しいページの追加方法](../development/adding-new-page.md)
- [Vercel へのデプロイ](../deployment/vercel.md)
