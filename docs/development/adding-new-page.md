# 新しいページの追加方法

## 概要

新しいページは Next.js App Router の規約に従い `src/app/<route>/page.tsx` として作成します。ページは Async Server Component として実装し、`lib/github.ts` の関数を直接呼び出してデータを取得・集計します。

## ステップ1: ルートの作成

```bash
mkdir src/app/mypage
touch src/app/mypage/page.tsx
touch src/app/mypage/loading.tsx
```

`loading.tsx` はページのローディング UI を担います。Skeleton コンポーネントを使った実装を推奨します。

## ステップ2: データ取得関数の追加（必要な場合）

既存の `lib/github.ts` の関数で賄えない場合、新しい `fetchXxx()` 関数を追加する。

```typescript
// src/lib/github.ts に追加
export async function fetchMyData(): Promise<MyDataType[]> {
  const org = getOrg();
  const url = `${GITHUB_API_BASE}/orgs/${org}/copilot/...`;
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}
```

## ステップ3: Server Component の実装

```tsx
// src/app/mypage/page.tsx
export const dynamic = 'force-dynamic';

import { fetchMyData } from "@/lib/github";
import { Header } from "@/components/layout/Header";
import { MyNewChart } from "@/components/charts/MyNewChart";

export default async function MyPage() {
  let data;
  try {
    data = await fetchMyData();
  } catch (error) {
    return (
      <div>
        <Header title="My Page" description="説明" />
        <div className="p-6">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // データ変換（表示用配列の生成）
  const chartData = data.map((d) => ({ date: d.date, value: d.count }));

  return (
    <div>
      <Header title="My Page" description="説明" />
      <div className="space-y-6 p-6">
        <MyNewChart data={chartData} />
      </div>
    </div>
  );
}
```

**必須**: `export const dynamic = 'force-dynamic'` を宣言してリクエスト毎に最新データを取得する。

## ステップ4: サイドバーへの追加

`src/lib/constants.ts` の `NAV_ITEMS` 配列に新しいルートを追加する:

```typescript
export const NAV_ITEMS = [
  { href: '/',             label: 'Overview',        icon: 'LayoutDashboard' },
  { href: '/completions',  label: 'Code Completions', icon: 'Code' },
  { href: '/chat',         label: 'Chat',             icon: 'MessageSquare' },
  { href: '/pull-requests', label: 'Pull Requests',   icon: 'GitPullRequest' },
  { href: '/members',      label: 'Members',          icon: 'Users' },
  { href: '/mypage',       label: 'My Page',          icon: 'Star' }, // 追加
] as const;
```

アイコンは [Lucide React](https://lucide.dev/) のアイコン名を文字列で指定する。

## チェックリスト

- [ ] `src/app/<route>/page.tsx` を作成した
- [ ] `export const dynamic = 'force-dynamic'` を宣言した
- [ ] `src/app/<route>/loading.tsx` を作成した
- [ ] エラーハンドリングを実装した
- [ ] `NAV_ITEMS` にルートを追加した
- [ ] チャートコンポーネントは `"use client"` を宣言し、データフェッチをしていない
