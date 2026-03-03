export const dynamic = 'force-dynamic';

import { fetchOrgUsageData } from "@/lib/github";
import { OrgUsageReport, OrgDayTotals } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/cards/MetricCard";
import { PRMetricsChart } from "@/components/charts/PRMetricsChart";
import { GitPullRequest, GitMerge, Clock, Bot, Code2, TrendingUp } from "lucide-react";

function aggregatePRMetrics(dayTotals: OrgDayTotals[]) {
  let totalCreated = 0;
  let totalMerged = 0;
  let totalReviewed = 0;
  let totalCreatedByCopilot = 0;
  let totalReviewedByCopilot = 0;
  const mergeMinutes: number[] = [];

  const chartData: {
    date: string;
    created: number;
    merged: number;
    medianMinutesToMerge: number;
    copilotCreated: number;
    copilotReviewed: number;
  }[] = [];

  for (const day of dayTotals) {
    const pr = day.pull_requests;
    if (!pr) continue;

    totalCreated += pr.total_created;
    totalMerged += pr.total_merged;
    totalReviewed += pr.total_reviewed;
    totalCreatedByCopilot += pr.total_created_by_copilot;
    totalReviewedByCopilot += pr.total_reviewed_by_copilot;
    if (pr.median_minutes_to_merge > 0) {
      mergeMinutes.push(pr.median_minutes_to_merge);
    }

    chartData.push({
      date: day.day,
      created: pr.total_created,
      merged: pr.total_merged,
      medianMinutesToMerge: pr.median_minutes_to_merge,
      copilotCreated: pr.total_created_by_copilot,
      copilotReviewed: pr.total_reviewed_by_copilot,
    });
  }

  const medianMergeTime =
    mergeMinutes.length > 0
      ? mergeMinutes.sort((a, b) => a - b)[Math.floor(mergeMinutes.length / 2)]
      : 0;

  return {
    totalCreated,
    totalMerged,
    totalReviewed,
    totalCreatedByCopilot,
    totalReviewedByCopilot,
    medianMergeTime,
    chartData,
  };
}

function getAgentEditMetrics(dayTotals: OrgDayTotals[]) {
  let totalLocAdded = 0;
  let totalLocDeleted = 0;
  const dailyData: { date: string; locAdded: number; locDeleted: number }[] = [];

  for (const day of dayTotals) {
    const agentEdit = day.totals_by_feature?.find(
      (f) => f.feature === "agent_edit"
    );
    if (!agentEdit) continue;

    totalLocAdded += agentEdit.loc_added_sum;
    totalLocDeleted += agentEdit.loc_deleted_sum;
    dailyData.push({
      date: day.day,
      locAdded: agentEdit.loc_added_sum,
      locDeleted: agentEdit.loc_deleted_sum,
    });
  }

  return { totalLocAdded, totalLocDeleted, dailyData };
}

export default async function PullRequestsPage() {
  let report: OrgUsageReport | null = null;
  let error: string | null = null;

  try {
    report = await fetchOrgUsageData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch usage data";
  }

  if (error || !report) {
    return (
      <div>
        <Header
          title="Pull Requests"
          description="Copilot PR lifecycle metrics across your organization"
        />
        <div className="p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            Error loading metrics: {error ?? "No data available"}
          </div>
        </div>
      </div>
    );
  }

  const dayTotals = report.day_totals ?? [];
  const hasPRData = dayTotals.some((d) => d.pull_requests);

  if (hasPRData) {
    const {
      totalCreated,
      totalMerged,
      totalCreatedByCopilot,
      totalReviewedByCopilot,
      medianMergeTime,
      chartData,
    } = aggregatePRMetrics(dayTotals);

    return (
      <div>
        <Header
          title="Pull Requests"
          description="Copilot PR lifecycle metrics across your organization"
        />
        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total PRs Created"
              value={totalCreated.toLocaleString()}
              description="Pull requests created during the period"
              icon={GitPullRequest}
            />
            <MetricCard
              title="Total PRs Merged"
              value={totalMerged.toLocaleString()}
              description="Pull requests merged during the period"
              icon={GitMerge}
            />
            <MetricCard
              title="Median Time to Merge"
              value={`${medianMergeTime.toLocaleString()} min`}
              description="Median minutes from creation to merge"
              icon={Clock}
            />
            <MetricCard
              title="Copilot-Created PRs"
              value={totalCreatedByCopilot.toLocaleString()}
              description="Pull requests created by Copilot"
              icon={Bot}
            />
            <MetricCard
              title="Copilot-Reviewed PRs"
              value={totalReviewedByCopilot.toLocaleString()}
              description="Pull requests reviewed by Copilot"
              icon={Bot}
            />
          </div>

          <PRMetricsChart data={chartData} />
        </div>
      </div>
    );
  }

  // Fallback: show agent_edit code generation metrics
  const { totalLocAdded, totalLocDeleted, dailyData } =
    getAgentEditMetrics(dayTotals);
  const hasAgentData = dailyData.length > 0;

  return (
    <div>
      <Header
        title="Pull Requests"
        description="Copilot PR lifecycle metrics across your organization"
      />
      <div className="space-y-6 p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            PR Lifecycle Metrics Not Available
          </p>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
            Pull request lifecycle data (created, merged, median time to merge)
            is not available for this organization. Below are Copilot code
            generation metrics from the <strong>agent_edit</strong> feature
            instead.
          </p>
        </div>

        {hasAgentData ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Total LoC Added by Agent"
                value={totalLocAdded.toLocaleString()}
                description="Lines of code added via Copilot agent edits"
                icon={Code2}
              />
              <MetricCard
                title="Total LoC Deleted by Agent"
                value={totalLocDeleted.toLocaleString()}
                description="Lines of code deleted via Copilot agent edits"
                icon={Code2}
              />
              <MetricCard
                title="Net Lines Changed"
                value={(totalLocAdded - totalLocDeleted).toLocaleString()}
                description="Net lines of code change (added − deleted)"
                icon={TrendingUp}
              />
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-4 text-sm font-medium">
                Daily Agent-Generated Code
              </h3>
              <div className="space-y-2">
                {dailyData.map((d) => (
                  <div
                    key={d.date}
                    className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{d.date}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600 dark:text-green-400">
                        +{d.locAdded.toLocaleString()}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        −{d.locDeleted.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No agent edit data is available for this period either.
          </p>
        )}
      </div>
    </div>
  );
}
