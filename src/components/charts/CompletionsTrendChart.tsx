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

interface CompletionsTrendChartProps {
  data: { date: string; suggestions: number; acceptances: number }[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function CompletionsTrendChart({ data }: CompletionsTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Suggestions vs Acceptances</CardTitle>
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
        <CardTitle>Daily Suggestions vs Acceptances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                labelFormatter={(label) => `Date: ${formatDate(String(label))}`}
                formatter={(value, name) => [
                  value,
                  name === "suggestions" ? "Suggestions" : "Acceptances",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "suggestions" ? "Suggestions" : "Acceptances"
                }
              />
              <Line
                type="monotone"
                dataKey="suggestions"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="acceptances"
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
