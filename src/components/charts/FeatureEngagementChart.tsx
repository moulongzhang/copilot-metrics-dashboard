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
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureEngagementChartProps {
  data: { feature: string; users: number }[];
}

export function FeatureEngagementChart({ data }: FeatureEngagementChartProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.users - a.users),
    [data]
  );

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Engagement</CardTitle>
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
        <CardTitle>Feature Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="feature" type="category" width={120} fontSize={12} />
              <Tooltip formatter={(value) => [value, "Users"]} />
              <Bar dataKey="users" fill="#2563eb" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
