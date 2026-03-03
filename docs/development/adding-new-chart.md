# 新しいチャートの追加方法

## 概要

チャートコンポーネントは `src/components/charts/` に配置します。すべてのチャートは `"use client"` を宣言した Client Component として実装します。

## ステップ1: チャートコンポーネントの作成

```typescript
// src/components/charts/MyChart.tsx
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";

interface MyChartProps {
  data: { date: string; value: number }[];
}

export function MyChart({ data }: MyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## ステップ2: Recharts の設定

よく使うチャートタイプと Recharts コンポーネントの対応:

| チャートタイプ | Recharts コンポーネント |
|--------------|----------------------|
| 折れ線グラフ | `LineChart` + `Line` |
| 棒グラフ | `BarChart` + `Bar` |
| 面グラフ | `AreaChart` + `Area` |
| レーダーチャート | `RadarChart` + `Radar` |

すべてのチャートは `ResponsiveContainer` でラップして、レスポンシブ対応にします。

### カラーの使い方

```typescript
import { CHART_COLORS, EDITOR_COLORS } from "@/lib/constants";

// 汎用カラー（インデックスで指定）
stroke={CHART_COLORS[0]}

// エディタ別カラー
fill={EDITOR_COLORS[editorName.toLowerCase()] ?? CHART_COLORS[i]}
```

## ステップ3: ページへの組み込み

Server Component（`page.tsx`）でデータを変換して props として渡します。

```typescript
// src/app/my-page/page.tsx（Server Component）
import { MyChart } from "@/components/charts/MyChart";

// データ変換（サーバー側）
const chartData = rawData.map((d) => ({
  date: d.day,
  value: d.some_metric,
}));

// Client Component に渡す
return <MyChart data={chartData} />;
```

## 既存チャートの参考例

| チャート | ファイル | 特徴 |
|---------|---------|------|
| 折れ線 + 複数系列 | `ActiveUsersChart.tsx` | 複数 `Line` コンポーネント |
| 承認率トレンド | `AcceptanceRateChart.tsx` | パーセント表示の `YAxis` |
| 言語別棒グラフ | `LanguageBreakdownChart.tsx` | 積み上げ棒グラフ |
| モデル別使用状況 | `DotcomChatChart.tsx` | 水平棒グラフ |
| PR メトリクス | `PRMetricsChart.tsx` | 複数系列の棒グラフ + 折れ線の組み合わせ |
