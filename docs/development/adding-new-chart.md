# 新しいチャートの追加方法

## 概要

チャートは Client Component として `src/components/charts/` に配置します。Recharts を使用し、`"use client"` ディレクティブを宣言します。データは props として受け取り、自身でのデータフェッチは行いません。

## ステップ1: チャートコンポーネントの作成

`src/components/charts/MyNewChart.tsx` を作成する。

```tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";

interface DataPoint {
  date: string;
  value: number;
}

interface MyNewChartProps {
  data: DataPoint[];
}

export function MyNewChart({ data }: MyNewChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My New Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={CHART_COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## ステップ2: Recharts の設定

- `ResponsiveContainer` を使って親要素に追従するレスポンシブレイアウトにする。
- カラーパレットは `src/lib/constants.ts` の `CHART_COLORS` 配列を使用する。
- エディタ色は `EDITOR_COLORS` を使用する（`EditorBreakdownChart` を参照）。

## ステップ3: ページへの組み込み

対象ページ (`src/app/*/page.tsx`) でコンポーネントをインポートし、Server Component で変換した表示用データを props として渡す。

```tsx
// src/app/mypage/page.tsx
import { MyNewChart } from "@/components/charts/MyNewChart";

export default async function MyPage() {
  const report = await fetchOrgUsageData();

  const chartData = report.day_totals.map((d) => ({
    date: d.day,
    value: d.daily_active_users,
  }));

  return (
    <div>
      <MyNewChart data={chartData} />
    </div>
  );
}
```

## 既存チャートの参考例

| チャート | ファイル | 使用 Recharts コンポーネント |
|---------|---------|---------------------------|
| アクティブユーザー推移 | `ActiveUsersChart.tsx` | `LineChart` |
| コード補完トレンド | `CompletionsTrendChart.tsx` | `BarChart` |
| 受入率トレンド | `AcceptanceRateChart.tsx` | `AreaChart` |
| 言語別内訳 | `LanguageBreakdownChart.tsx` | `BarChart` |
