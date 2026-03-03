"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PRSummaryTableProps {
  data: { repository: string; summaries: number; users: number }[];
}

export function PRSummaryTable({ data }: PRSummaryTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PR Summaries by Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No PR summary data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...data].sort((a, b) => b.summaries - a.summaries);

  return (
    <Card>
      <CardHeader>
        <CardTitle>PR Summaries by Repository</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">
                  Repository
                </th>
                <th className="pb-2 text-right font-medium text-muted-foreground">
                  Summaries Created
                </th>
                <th className="pb-2 text-right font-medium text-muted-foreground">
                  Engaged Users
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.repository} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{row.repository}</td>
                  <td className="py-2 text-right">{row.summaries.toLocaleString()}</td>
                  <td className="py-2 text-right">{row.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
