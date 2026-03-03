export const dynamic = 'force-dynamic';

import { fetchOrgUsageData } from "@/lib/github";
import { OrgUsageReport, OrgDayTotals } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/cards/MetricCard";
import { CompletionsTrendChart } from "@/components/charts/CompletionsTrendChart";
import { AcceptanceRateChart } from "@/components/charts/AcceptanceRateChart";
import { LanguageBreakdownChart } from "@/components/charts/LanguageBreakdownChart";
import { EditorBreakdownChart } from "@/components/charts/EditorBreakdownChart";
import { Code, CheckCircle, Percent, FileCode } from "lucide-react";

function aggregateMetrics(dayTotals: OrgDayTotals[]) {
  let totalGenerations = 0;
  let totalAcceptances = 0;
  let totalLinesAdded = 0;

  const dailyTrend: { date: string; suggestions: number; acceptances: number }[] = [];
  const acceptanceRateTrend: { date: string; acceptanceRate: number }[] = [];

  const languageMap = new Map<string, { suggestions: number; acceptances: number }>();
  const editorMap = new Map<string, { users: number; suggestions: number; acceptances: number }>();

  for (const day of dayTotals) {
    const completionFeature = day.totals_by_feature?.find(
      (f) => f.feature === "code_completion"
    );

    const dayGenerations = completionFeature?.code_generation_activity_count ?? 0;
    const dayAcceptances = completionFeature?.code_acceptance_activity_count ?? 0;
    const dayLinesAdded = completionFeature?.loc_added_sum ?? 0;

    totalGenerations += dayGenerations;
    totalAcceptances += dayAcceptances;
    totalLinesAdded += dayLinesAdded;

    dailyTrend.push({ date: day.day, suggestions: dayGenerations, acceptances: dayAcceptances });
    acceptanceRateTrend.push({
      date: day.day,
      acceptanceRate: dayGenerations > 0 ? (dayAcceptances / dayGenerations) * 100 : 0,
    });

    // Language breakdown (code_completion only)
    if (day.totals_by_language_feature) {
      for (const lf of day.totals_by_language_feature) {
        if (lf.feature !== "code_completion") continue;
        const entry = languageMap.get(lf.language) ?? { suggestions: 0, acceptances: 0 };
        entry.suggestions += lf.code_generation_activity_count;
        entry.acceptances += lf.code_acceptance_activity_count;
        languageMap.set(lf.language, entry);
      }
    }

    // Editor breakdown (overall counts per IDE)
    if (day.totals_by_ide) {
      for (const ide of day.totals_by_ide) {
        const entry = editorMap.get(ide.ide) ?? { users: 0, suggestions: 0, acceptances: 0 };
        entry.suggestions += ide.code_generation_activity_count;
        entry.acceptances += ide.code_acceptance_activity_count;
        editorMap.set(ide.ide, entry);
      }
    }
  }

  const acceptanceRate = totalGenerations > 0 ? (totalAcceptances / totalGenerations) * 100 : 0;

  const languageBreakdown = Array.from(languageMap.entries()).map(([name, data]) => ({
    name,
    suggestions: data.suggestions,
    acceptances: data.acceptances,
    acceptanceRate: data.suggestions > 0 ? (data.acceptances / data.suggestions) * 100 : 0,
  }));

  const editorBreakdown = Array.from(editorMap.entries()).map(([name, data]) => ({
    name,
    users: data.users,
    suggestions: data.suggestions,
    acceptances: data.acceptances,
  }));

  return {
    totalGenerations,
    totalAcceptances,
    totalLinesAdded,
    acceptanceRate,
    dailyTrend,
    acceptanceRateTrend,
    languageBreakdown,
    editorBreakdown,
  };
}

export default async function CompletionsPage() {
  let report: OrgUsageReport | null = null;
  let error: string | null = null;

  try {
    report = await fetchOrgUsageData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch metrics";
  }

  if (error) {
    return (
      <div>
        <Header title="Code Completions" description="Copilot code completion metrics and trends" />
        <div className="p-6">
          <p className="text-destructive">Error loading metrics: {error}</p>
        </div>
      </div>
    );
  }

  if (!report || report.day_totals.length === 0) {
    return (
      <div>
        <Header title="Code Completions" description="Copilot code completion metrics and trends" />
        <div className="p-6">
          <p className="text-muted-foreground">No metrics data available.</p>
        </div>
      </div>
    );
  }

  const {
    totalGenerations,
    totalAcceptances,
    totalLinesAdded,
    acceptanceRate,
    dailyTrend,
    acceptanceRateTrend,
    languageBreakdown,
    editorBreakdown,
  } = aggregateMetrics(report.day_totals);

  return (
    <div>
      <Header title="Code Completions" description="Copilot code completion metrics and trends" />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Code Generations"
            value={totalGenerations.toLocaleString()}
            icon={Code}
            description="Code generation activities"
          />
          <MetricCard
            title="Total Acceptances"
            value={totalAcceptances.toLocaleString()}
            icon={CheckCircle}
            description="Code suggestions accepted"
          />
          <MetricCard
            title="Acceptance Rate"
            value={`${acceptanceRate.toFixed(1)}%`}
            icon={Percent}
            description="Overall acceptance rate"
          />
          <MetricCard
            title="Lines of Code Added"
            value={totalLinesAdded.toLocaleString()}
            icon={FileCode}
            description="Total lines added"
          />
        </div>

        <CompletionsTrendChart data={dailyTrend} />
        <AcceptanceRateChart data={acceptanceRateTrend} />
        <LanguageBreakdownChart data={languageBreakdown} />
        <EditorBreakdownChart data={editorBreakdown} />
      </div>
    </div>
  );
}
