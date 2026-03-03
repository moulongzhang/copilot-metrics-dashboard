"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

interface LanguageBreakdownChartProps {
  data: {
    name: string;
    suggestions: number;
    acceptances: number;
    acceptanceRate: number;
  }[];
}

export function LanguageBreakdownChart({ data }: LanguageBreakdownChartProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.suggestions - a.suggestions),
    [data]
  );

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Breakdown</CardTitle>
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
        <CardTitle>Language Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={100} fontSize={12} />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "suggestions" ? "Suggestions" : "Acceptances",
                ]}
              />
              <Legend />
              <Bar dataKey="suggestions" fill="#2563eb" name="Suggestions" />
              <Bar dataKey="acceptances" fill="#16a34a" name="Acceptances" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
