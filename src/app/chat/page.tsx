export const dynamic = 'force-dynamic';

import { fetchOrgUsageData } from "@/lib/github";
import { OrgUsageReport, OrgDayTotals, TotalsByFeature, TotalsByModelFeature } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/cards/MetricCard";
import { ChatMetricsChart } from "@/components/charts/ChatMetricsChart";
import { ChatTrendChart } from "@/components/charts/ChatTrendChart";
import { DotcomChatChart } from "@/components/charts/DotcomChatChart";
import { MessageSquare, Users, Bot, Code } from "lucide-react";

const CHAT_FEATURES = new Set([
  "chat_panel_ask_mode",
  "chat_panel_edit_mode",
  "chat_panel_agent_mode",
  "chat_panel_custom_mode",
  "chat_panel_unknown_mode",
  "inline_chat",
]);

const FEATURE_LABELS: Record<string, string> = {
  chat_panel_ask_mode: "Ask Mode",
  chat_panel_edit_mode: "Edit Mode",
  chat_panel_agent_mode: "Agent Mode",
  chat_panel_custom_mode: "Custom Agent",
  chat_panel_unknown_mode: "Unknown Mode",
  inline_chat: "Inline Chat",
};

function isChatFeature(f: TotalsByFeature) {
  return CHAT_FEATURES.has(f.feature);
}

function aggregateChatData(report: OrgUsageReport) {
  const days = report.day_totals;
  let totalInteractions = 0;
  let totalCodeGen = 0;

  const featureMap = new Map<string, { chats: number; insertions: number; copies: number }>();
  const modelMap = new Map<string, number>();
  const dailyData: { date: string; chats: number; insertions: number; copies: number }[] = [];

  // Latest day for MAU metrics
  const sortedDays = [...days].sort((a, b) => a.day.localeCompare(b.day));
  const latestDay = sortedDays[sortedDays.length - 1];

  for (const day of days) {
    let dayChats = 0;
    let dayInsertions = 0;

    // Aggregate by feature
    for (const f of day.totals_by_feature) {
      if (!isChatFeature(f)) continue;
      const existing = featureMap.get(f.feature) || { chats: 0, insertions: 0, copies: 0 };
      existing.chats += f.user_initiated_interaction_count;
      existing.insertions += f.code_acceptance_activity_count;
      featureMap.set(f.feature, existing);

      totalInteractions += f.user_initiated_interaction_count;
      totalCodeGen += f.code_generation_activity_count;
      dayChats += f.user_initiated_interaction_count;
      dayInsertions += f.code_acceptance_activity_count;
    }

    // Aggregate model usage for chat features
    for (const mf of day.totals_by_model_feature) {
      if (!CHAT_FEATURES.has(mf.feature)) continue;
      modelMap.set(mf.model, (modelMap.get(mf.model) || 0) + mf.user_initiated_interaction_count);
    }

    dailyData.push({ date: day.day, chats: dayChats, insertions: dayInsertions, copies: 0 });
  }

  const featureData = Array.from(featureMap.entries()).map(([feature, v]) => ({
    name: FEATURE_LABELS[feature] || feature,
    ...v,
  }));

  const modelData = Array.from(modelMap.entries())
    .map(([name, chats]) => ({ name, chats }))
    .sort((a, b) => b.chats - a.chats);

  const dailyTrend = dailyData.sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalInteractions,
    totalCodeGen,
    monthlyActiveChatUsers: latestDay?.monthly_active_chat_users ?? 0,
    monthlyActiveAgentUsers: latestDay?.monthly_active_agent_users ?? 0,
    featureData,
    modelData,
    dailyTrend,
  };
}

export default async function ChatPage() {
  let report: OrgUsageReport;
  try {
    report = await fetchOrgUsageData();
  } catch (error) {
    return (
      <div>
        <Header
          title="Chat"
          description="Copilot Chat usage by mode and model"
        />
        <div className="p-6">
          <p className="text-destructive">
            Failed to load metrics: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!report.day_totals || report.day_totals.length === 0) {
    return (
      <div>
        <Header
          title="Chat"
          description="Copilot Chat usage by mode and model"
        />
        <div className="p-6">
          <p className="text-muted-foreground">No metrics data available.</p>
        </div>
      </div>
    );
  }

  const {
    totalInteractions,
    totalCodeGen,
    monthlyActiveChatUsers,
    monthlyActiveAgentUsers,
    featureData,
    modelData,
    dailyTrend,
  } = aggregateChatData(report);

  return (
    <div>
      <Header
        title="Chat"
        description="Copilot Chat usage by mode and model"
      />
      <div className="space-y-6 p-6">
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Chat Interactions"
            value={totalInteractions.toLocaleString()}
            icon={MessageSquare}
            description="Sum of interactions across all chat modes"
          />
          <MetricCard
            title="Monthly Active Chat Users"
            value={monthlyActiveChatUsers.toLocaleString()}
            icon={Users}
            description="Active chat users (latest day)"
          />
          <MetricCard
            title="Monthly Active Agent Users"
            value={monthlyActiveAgentUsers.toLocaleString()}
            icon={Bot}
            description="Active agent users (latest day)"
          />
          <MetricCard
            title="Code from Chat"
            value={totalCodeGen.toLocaleString()}
            icon={Code}
            description="Code generation activities from chat"
          />
        </div>

        {/* Chat by Mode */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Chat by Mode</h2>
          <ChatMetricsChart data={featureData} />
        </section>

        {/* Model Usage for Chat */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Model Usage for Chat</h2>
          <DotcomChatChart data={modelData} />
        </section>

        {/* Daily Chat Trend */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Daily Chat Trend</h2>
          <ChatTrendChart data={dailyTrend} />
        </section>
      </div>
    </div>
  );
}
