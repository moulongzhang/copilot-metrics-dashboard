# コントリビューションガイド

## はじめに

このプロジェクトへのコントリビューションを歓迎します。バグ報告、機能提案、ドキュメント改善、コード変更など、あらゆる形での貢献を歓迎します。

## 開発環境のセットアップ

[開発環境セットアップ](../development/setup.md) を参照してください。

## ブランチ戦略

| ブランチ種別 | 命名規則 | 例 |
|------------|---------|-----|
| 機能追加 | `feat/<説明>` | `feat/add-language-chart` |
| バグ修正 | `fix/<説明>` | `fix/acceptance-rate-calculation` |
| ドキュメント | `docs/<説明>` | `docs/update-api-reference` |
| リファクタリング | `refactor/<説明>` | `refactor/extract-chart-utils` |

`main` ブランチへの直接プッシュは行わず、必ずブランチを作成して Pull Request を送ってください。

## コミットメッセージの規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠します。

```
<type>(<scope>): <subject>

例:
feat(charts): add language breakdown chart
fix(api): handle 403 error from GitHub API
docs(readme): update quick start instructions
refactor(github): extract pagination helper
```

主な `type`:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `refactor`: 動作を変えないコード改善
- `chore`: ビルド・設定ファイルの変更

## Pull Request のルール

1. **変更は最小限に**: 1 PR につき 1 つの目的（機能/バグ/ドキュメント）に絞ってください。
2. **説明を記載**: PR の説明欄に「何を・なぜ」変更したかを記載してください。
3. **lint を通す**: `npm run lint` がエラーなく通ることを確認してください。
4. **ビルドを確認**: `npm run build` が成功することを確認してください。

## コードレビューのプロセス

1. PR を作成するとメンテナーがレビューします。
2. コメントへの返答・修正を行い、承認されたらマージされます。
3. マージは Squash merge を基本とします。

## Issue の報告方法

バグや機能要望は GitHub Issues から報告してください。

- **バグ報告**: 再現手順・期待動作・実際の動作・環境情報を記載してください。
- **機能提案**: 背景・ユースケース・期待する動作を記載してください。
