# クイックスタート

## ステップ 1: リポジトリをクローン

```bash
git clone https://github.com/<your-org>/copilot-metrics-dashboard.git
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

`.env.local` を開いて以下を設定する:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_ORG=your-organization-name
```

## ステップ 4: 開発サーバーを起動

```bash
npm run dev
```

## ステップ 5: ダッシュボードにアクセス

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

正常に起動すると以下のページが利用可能になります:

| URL | ページ |
|-----|--------|
| `/` | Overview（組織全体サマリー） |
| `/completions` | Code Completions（コード補完分析） |
| `/chat` | Chat Analytics（チャット利用分析） |
| `/pull-requests` | Pull Requests（PR ライフサイクル） |
| `/members` | Members（ユーザー別利用状況） |

## うまく動かない場合

| 症状 | 確認事項 |
|------|---------|
| ページが真っ白 | `GITHUB_TOKEN` と `GITHUB_ORG` が正しく設定されているか確認 |
| 401 エラー | トークンの有効期限・スコープを確認 |
| 403 エラー | 組織の Copilot 設定でメトリクス API へのアクセスが許可されているか確認 |
| データが表示されない | 対象組織に Copilot のライセンスが付与されているか確認 |

## 次のステップ

- [アーキテクチャ概要](../architecture/overview.md) — システム設計を理解する
- [開発環境セットアップ](../development/setup.md) — 開発に参加する
- [新しいページの追加方法](../development/adding-new-page.md) — ダッシュボードを拡張する
