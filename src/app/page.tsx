export const dynamic = 'force-dynamic';

import { fetchOrgUsageData } from "@/lib/github";
import { OrgDayTotals } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/cards/MetricCard";
import { ActiveUsersChart } from "@/components/charts/ActiveUsersChart";
import { FeatureEngagementChart } from "@/components/charts/FeatureEngagementChart";
import { Users, UserCheck, CheckCircle, MessageSquare } from "lucide-react";

const FEATURE_LABELS: Record<string, string> = {
  code_completion: "Code Completion",
  agent_edit: "Agent/Edit",
  chat_panel_ask_mode: "Chat (Ask)",
  chat_panel_edit_mode: "Chat (Edit)",
  chat_panel_agent_mode: "Chat (Agent)",
  chat_panel_custom_mode: "Chat (Custom)",
};

function computeAcceptanceRate(days: OrgDayTotals[]): number {
  let totalGeneration = 0;
  let totalAcceptance = 0;
  for (const day of days) {
    totalGeneration += day.code_generation_activity_count;
    totalAcceptance += day.code_acceptance_activity_count;
  }
  return totalGeneration > 0
    ? Math.round((totalAcceptance / totalGeneration) * 1000) / 10
    : 0;
}

export default async function OverviewPage() {
  let days: OrgDayTotals[];
  try {
    const report = await fetchOrgUsageData();
    days = report.day_totals;
  } catch (error) {
    return (
      <div>
        <Header
          title="Overview"
          description="GitHub Copilot usage metrics overview"
        />
        <div className="p-6">
          <p className="text-destructive">
            Failed to load metrics: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const lastDay = days.length > 0 ? days[days.length - 1] : null;
  const dailyActiveUsers = lastDay?.daily_active_users ?? 0;
  const monthlyActiveUsers = lastDay?.monthly_active_users ?? 0;
  const acceptanceRate = computeAcceptanceRate(days);
  const totalInteractions = days.reduce(
    (sum, d) => sum + d.user_initiated_interaction_count,
    0,
  );

  const activeUsersData = days.map((d) => ({
    date: d.day,
    activeUsers: d.daily_active_users,
    engagedUsers: d.monthly_active_users,
  }));

  const featureEngagementData: { feature: string; users: number }[] = [];
  if (lastDay) {
    for (const f of lastDay.totals_by_feature) {
      featureEngagementData.push({
        feature: FEATURE_LABELS[f.feature] ?? f.feature,
        users: f.code_generation_activity_count,
      });
    }
  }

  return (
    <div>
      <Header
        title="Overview"
        description="GitHub Copilot usage metrics overview"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Daily Active Users"
            value={dailyActiveUsers}
            description="From latest day"
            icon={Users}
          />
          <MetricCard
            title="Monthly Active Users"
            value={monthlyActiveUsers}
            description="From latest day"
            icon={UserCheck}
          />
          <MetricCard
            title="Acceptance Rate"
            value={`${acceptanceRate}%`}
            description="Across all days"
            icon={CheckCircle}
          />
          <MetricCard
            title="Total Interactions"
            value={totalInteractions.toLocaleString()}
            description="Across all days"
            icon={MessageSquare}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ActiveUsersChart data={activeUsersData} />
          <FeatureEngagementChart data={featureEngagementData} />
        </div>
      </div>
    </div>
  );
}
