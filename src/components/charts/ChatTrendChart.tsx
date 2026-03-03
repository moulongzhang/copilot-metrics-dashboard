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

interface ChatTrendChartProps {
  data: { date: string; chats: number; insertions: number; copies: number }[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function ChatTrendChart({ data }: ChatTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Chat Trend</CardTitle>
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
        <CardTitle>Daily Chat Trend</CardTitle>
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
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="chats"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Chats"
              />
              <Line
                type="monotone"
                dataKey="insertions"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                name="Insertions"
              />
              <Line
                type="monotone"
                dataKey="copies"
                stroke="#ea580c"
                strokeWidth={2}
                dot={false}
                name="Copies"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
