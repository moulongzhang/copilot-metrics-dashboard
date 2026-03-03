# 新しいページの追加方法

## 概要

Next.js App Router の規約に従い、`src/app/` 配下に新しいルートを作成します。

## ステップ1: ルートの作成

```bash
mkdir src/app/my-page
touch src/app/my-page/page.tsx
touch src/app/my-page/loading.tsx
```

## ステップ2: データ取得関数の追加（必要な場合）

新しい GitHub API エンドポイントが必要な場合は `src/lib/github.ts` に関数を追加します。

```typescript
// src/lib/github.ts に追加
export async function fetchMyData(): Promise<MyType[]> {
  const org = getOrg();
  const url = `${GITHUB_API_BASE}/orgs/${org}/...`;
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}
```

型定義が必要な場合は `src/lib/types.ts` に追加します。

## ステップ3: Server Component の実装

```typescript
// src/app/my-page/page.tsx
export const dynamic = 'force-dynamic';   // 必須

import { fetchMyData } from "@/lib/github";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/cards/MetricCard";
import { MyChart } from "@/components/charts/MyChart";

export default async function MyPage() {
  let data;
  try {
    data = await fetchMyData();
  } catch (error) {
    return (
      <div>
        <Header title="My Page" />
        <div className="p-6">
          <p className="text-destructive">
            Failed to load: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // データ変換・集計
  const chartData = data.map((item) => ({ /* ... */ }));

  return (
    <div>
      <Header title="My Page" description="説明文" />
      <div className="space-y-6 p-6">
        <MyChart data={chartData} />
      </div>
    </div>
  );
}
```

## ステップ4: サイドバーへの追加

`src/components/layout/Sidebar.tsx` の `navItems` 配列に追加します。

```typescript
const navItems = [
  // 既存のアイテム...
  { href: "/my-page", label: "My Page", icon: MyIcon },  // 追加
];
```

`src/lib/constants.ts` の `NAV_ITEMS` も合わせて更新します。

```typescript
export const NAV_ITEMS = [
  // 既存のアイテム...
  { href: '/my-page', label: 'My Page', icon: 'MyIcon' },  // 追加
] as const;
```

## チェックリスト

- [ ] `export const dynamic = 'force-dynamic'` を宣言した
- [ ] エラーハンドリングを実装した（try/catch + エラー表示）
- [ ] データなし時の表示を実装した
- [ ] `Header` コンポーネントを使用した
- [ ] Sidebar の `navItems` に追加した
- [ ] `src/lib/constants.ts` の `NAV_ITEMS` を更新した
- [ ] 新しい型定義を `src/lib/types.ts` に追加した（必要な場合）
