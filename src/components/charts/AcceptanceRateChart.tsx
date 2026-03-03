"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AcceptanceRateChartProps {
  data: { date: string; acceptanceRate: number }[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function AcceptanceRateChart({ data }: AcceptanceRateChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acceptance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acceptance Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={12} />
              <Tooltip
                labelFormatter={(label) => `Date: ${formatDate(String(label))}`}
                formatter={(value) => [`${Number(value).toFixed(1)}%`, "Acceptance Rate"]}
              />
              <Legend formatter={() => "Acceptance Rate"} />
              <Line
                type="monotone"
                dataKey="acceptanceRate"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
