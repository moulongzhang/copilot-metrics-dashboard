# アーキテクチャ概要

## 設計思想

このダッシュボードは GitHub Copilot の組織利用状況をリアルタイムに近い形で可視化することを目的としています。以下の原則に基づいて設計されています。

- **サーバーサイドでのデータ取得**: `GITHUB_TOKEN` などの機密情報をサーバー外に露出しない
- **型安全性**: TypeScript の型定義を GitHub API レスポンスに合わせて厳密に管理する
- **シンプルな依存関係**: 外部状態管理ライブラリを使わず、Server Component でのデータ変換を基本とする

## 3層アーキテクチャ

```
GitHub REST API
      ↓
src/lib/github.ts  （API クライアント層）
      ↓
src/app/api/       （API Route 層：プロキシ・キャッシュ制御）
      ↓
src/app/*/page.tsx （Page 層：データ変換・Server Component）
      ↓
src/components/    （UI 層：Client Component でグラフ描画）
```

1. **`src/lib/github.ts`** — GitHub REST API への `fetch` 呼び出しをまとめたクライアント。トークン認証・ページネーション・NDJSON ダウンロード解析を担当。
2. **`src/app/api/`** — サーバーサイドトークンを保護しながら外部から叩けるプロキシルート。`Cache-Control` ヘッダーを付与。
3. **`src/app/*/page.tsx`** — 非同期 React Server Component。`lib/github` 関数を直接呼び出してデータを取得・集計し、表示用配列を Client Component へ渡す。
4. **`src/components/charts/`** — `"use client"` でマークされた Recharts ベースのグラフ。データを props として受け取るだけでフェッチは行わない。

## Server Component と Client Component の分離パターン

| 種別 | 場所 | 役割 |
|------|------|------|
| Server Component | `src/app/*/page.tsx` | データ取得・変換・集計 |
| Client Component | `src/components/charts/`, `src/components/ChatPanel.tsx` | インタラクティブな UI・グラフ描画 |

グラフコンポーネントは「表示用に整形されたデータ配列」だけを受け取るため、テストや再利用が容易です。

## データキャッシュ戦略

- **ページ**: `export const dynamic = 'force-dynamic'` を宣言し、リクエストごとに最新データを取得。
- **API クライアント**: `fetchOrgMetrics` は `next: { revalidate: 3600 }` を使い、1 時間のキャッシュを活用（ISR）。
- **API Routes**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` ヘッダーを付与し、CDN キャッシュを許可。
