# コントリビューションガイド

## はじめに

このプロジェクトへの貢献を歓迎します。バグ報告、機能提案、プルリクエストなど、どのような形でも歓迎します。

## 開発環境のセットアップ

[開発環境セットアップガイド](../development/setup.md) を参照してください。

## ブランチ戦略

| ブランチ | 用途 |
|---------|------|
| `main` | 本番リリース用の安定ブランチ |
| `feat/<name>` | 新機能開発 |
| `fix/<name>` | バグ修正 |
| `docs/<name>` | ドキュメント更新 |
| `chore/<name>` | 依存更新・設定変更など |

## コミットメッセージの規約

[Conventional Commits](https://www.conventionalcommits.org/) 形式を推奨します:

```
<type>(<scope>): <summary>

[optional body]
```

**type の例**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `refactor`: リファクタリング
- `chore`: ビルドプロセス・ツールの変更

**例**:
```
feat(chat): add model usage breakdown chart
fix(members): handle missing user activity data
docs: update API route documentation
```

## Pull Request のルール

1. `main` ブランチに対して PR を作成してください
2. PR タイトルは Conventional Commits 形式を推奨します
3. 変更内容の説明（何を・なぜ変更したか）を記述してください
4. 既存の動作を壊していないことを確認してください（`npm run build` と `npm run lint` が通ること）
5. 新しいページ・機能を追加した場合はドキュメントも更新してください

## コードレビューのプロセス

- PR を作成するとレビューが開始されます
- 変更の大きさに応じて 1〜2 名のレビュアーが確認します
- フィードバックへの対応後、承認されたらマージします

## Issue の報告方法

バグや機能要望は GitHub Issues で受け付けています。

**バグ報告に含める情報**:
- 再現手順
- 期待する動作
- 実際の動作
- 環境情報（Node.js バージョン、ブラウザなど）
- エラーメッセージ（あれば）
