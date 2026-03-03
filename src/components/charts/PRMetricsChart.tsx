"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
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

interface PRMetricsChartProps {
  data: {
    date: string;
    created: number;
    merged: number;
    medianMinutesToMerge: number;
    copilotCreated: number;
    copilotReviewed: number;
  }[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function PRMetricsChart({ data }: PRMetricsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pull Request Metrics</CardTitle>
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
        <CardTitle>Pull Request Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
              <YAxis yAxisId="left" fontSize={12} label={{ value: "Count", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} label={{ value: "Minutes", angle: 90, position: "insideRight" }} />
              <Tooltip
                labelFormatter={(label) => `Date: ${formatDate(String(label))}`}
                formatter={(value, name) => {
                  if (name === "medianMinutesToMerge") return [`${value} min`, "Median Time to Merge"];
                  const labels: Record<string, string> = {
                    created: "Created",
                    merged: "Merged",
                    copilotCreated: "Copilot Created",
                    copilotReviewed: "Copilot Reviewed",
                  };
                  return [value, labels[String(name)] ?? name];
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    created: "Created",
                    merged: "Merged",
                    medianMinutesToMerge: "Median Time to Merge",
                    copilotCreated: "Copilot Created",
                    copilotReviewed: "Copilot Reviewed",
                  };
                  return labels[value] ?? value;
                }}
              />
              <Bar yAxisId="left" dataKey="created" fill="#2563eb" name="created" />
              <Bar yAxisId="left" dataKey="merged" fill="#16a34a" name="merged" />
              <Bar yAxisId="left" dataKey="copilotCreated" fill="#0891b2" name="copilotCreated" />
              <Bar yAxisId="left" dataKey="copilotReviewed" fill="#db2777" name="copilotReviewed" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="medianMinutesToMerge"
                stroke="#ea580c"
                strokeWidth={2}
                dot={false}
                name="medianMinutesToMerge"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
