export const dynamic = 'force-dynamic';

import { fetchUserUsageData } from "@/lib/github";
import { UserUsageRecord } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/cards/MetricCard";
import { MembersTable, MemberRow } from "@/components/tables/MembersTable";
import { Users, UserCheck, UserX } from "lucide-react";

const CHAT_FEATURES = new Set([
  "chat_panel_ask_mode",
  "chat_panel_edit_mode",
  "chat_panel_agent_mode",
  "chat_panel_custom_mode",
]);

function isActiveInLast7Days(lastDay: string): boolean {
  const last = new Date(lastDay);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return last >= sevenDaysAgo;
}

interface AggregatedUser {
  totalInteractions: number;
  codeGenerations: number;
  codeAcceptances: number;
  locAdded: number;
  locDeleted: number;
  chatRequests: number;
  lastDay: string;
}

function aggregateByUser(records: UserUsageRecord[]): Map<string, AggregatedUser> {
  const map = new Map<string, AggregatedUser>();

  for (const r of records) {
    const existing = map.get(r.user_login) || {
      totalInteractions: 0, codeGenerations: 0, codeAcceptances: 0,
      locAdded: 0, locDeleted: 0, chatRequests: 0, lastDay: r.day,
    };

    existing.totalInteractions += r.user_initiated_interaction_count || 0;
    existing.codeGenerations += r.code_generation_activity_count || 0;
    existing.codeAcceptances += r.code_acceptance_activity_count || 0;
    existing.locAdded += r.loc_added_sum || 0;
    existing.locDeleted += r.loc_deleted_sum || 0;

    // Sum chat interactions from totals_by_feature
    if (r.totals_by_feature) {
      for (const f of r.totals_by_feature) {
        if (CHAT_FEATURES.has(f.feature)) {
          existing.chatRequests += f.user_initiated_interaction_count || 0;
        }
      }
    }

    if (r.day > existing.lastDay) {
      existing.lastDay = r.day;
    }

    map.set(r.user_login, existing);
  }

  return map;
}

export default async function MembersPage() {
  let usageRecords: UserUsageRecord[] = [];
  let error: string | null = null;

  try {
    usageRecords = await fetchUserUsageData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch user usage data";
  }

  const aggregated = aggregateByUser(usageRecords);

  const members: MemberRow[] = Array.from(aggregated.entries()).map(([login, agg]) => ({
    login,
    avatarUrl: `https://github.com/${login}.png?size=64`,
    lastActivityAt: agg.lastDay,
    lastActivityEditor: null,
    totalInteractions: agg.totalInteractions,
    codeGenerations: agg.codeGenerations,
    codeAcceptances: agg.codeAcceptances,
    locAdded: agg.locAdded,
    locDeleted: agg.locDeleted,
    chatRequests: agg.chatRequests,
    isActive: isActiveInLast7Days(agg.lastDay),
  }));

  const totalUsers = members.length;
  const activeUsers = members.filter((m) => m.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Members"
        description="Per-user Copilot activity from usage metrics"
      />
      <main className="flex-1 space-y-6 p-6">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Users"
            value={totalUsers}
            description="Unique users with Copilot activity"
            icon={Users}
          />
          <MetricCard
            title="Active Users"
            value={activeUsers}
            description="Active in the last 7 days"
            icon={UserCheck}
          />
          <MetricCard
            title="Inactive Users"
            value={inactiveUsers}
            description="No activity in the last 7 days"
            icon={UserX}
          />
        </div>

        <MembersTable data={members} />
      </main>
    </div>
  );
}
