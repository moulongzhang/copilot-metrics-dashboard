import { CopilotClient, CopilotSession, approveAll } from "@github/copilot-sdk";
import { execSync } from "node:child_process";
import { fetchOrgUsageData } from "./github";
import { OrgUsageReport } from "./types";
import { logToolExecution } from "./tool-logger";
import { createChatTools } from "./chat-tools";

// Singleton CopilotClient managed via globalThis to survive hot reloads
const globalForCopilot = globalThis as unknown as {
  copilotClient?: CopilotClient;
};

function resolveCopilotCliPath(): string {
  try {
    return execSync("which copilot", { encoding: "utf-8" }).trim();
  } catch {
    return "copilot";
  }
}

export async function getCopilotClient(): Promise<CopilotClient> {
  if (!globalForCopilot.copilotClient) {
    globalForCopilot.copilotClient = new CopilotClient({
      cliPath: resolveCopilotCliPath(),
      autoStart: true,
      autoRestart: true,
    });
    await globalForCopilot.copilotClient.start();
  }
  return globalForCopilot.copilotClient;
}

function buildMetricsSummary(report: OrgUsageReport): string {
  const days = report.day_totals;
  if (!days || days.length === 0) return "No metrics data available.";

  const sorted = [...days].sort((a, b) => a.day.localeCompare(b.day));
  const latest = sorted[sorted.length - 1];
  const periodStart = sorted[0].day;
  const periodEnd = latest.day;

  let totalInteractions = 0;
  let totalCodeGen = 0;
  let totalCodeAccept = 0;
  for (const d of days) {
    totalInteractions += d.user_initiated_interaction_count;
    totalCodeGen += d.code_generation_activity_count;
    totalCodeAccept += d.code_acceptance_activity_count;
  }
  const acceptanceRate =
    totalCodeGen > 0
      ? Math.round((totalCodeAccept / totalCodeGen) * 1000) / 10
      : 0;

  const featureSummary = latest.totals_by_feature
    .map(
      (f) =>
        `  - ${f.feature}: interactions=${f.user_initiated_interaction_count}, code_gen=${f.code_generation_activity_count}, code_accept=${f.code_acceptance_activity_count}`
    )
    .join("\n");

  const ideSummary = latest.totals_by_ide
    .map(
      (ide) =>
        `  - ${ide.ide}: interactions=${ide.user_initiated_interaction_count}, code_gen=${ide.code_generation_activity_count}`
    )
    .join("\n");

  return `
## Copilot Metrics Dashboard Data
Period: ${periodStart} to ${periodEnd} (${days.length} days)

### Latest Day (${latest.day})
- Daily Active Users: ${latest.daily_active_users}
- Weekly Active Users: ${latest.weekly_active_users}
- Monthly Active Users: ${latest.monthly_active_users}
- Monthly Active Chat Users: ${latest.monthly_active_chat_users}
- Monthly Active Agent Users: ${latest.monthly_active_agent_users}

### Period Totals
- Total Interactions: ${totalInteractions}
- Total Code Generations: ${totalCodeGen}
- Total Code Acceptances: ${totalCodeAccept}
- Acceptance Rate: ${acceptanceRate}%
- Total LOC Suggested (add): ${days.reduce((s, d) => s + d.loc_suggested_to_add_sum, 0)}
- Total LOC Added: ${days.reduce((s, d) => s + d.loc_added_sum, 0)}

### Feature Breakdown (Latest Day)
${featureSummary}

### IDE Breakdown (Latest Day)
${ideSummary}

### Daily Active Users Trend
${sorted.map((d) => `  ${d.day}: DAU=${d.daily_active_users}, MAU=${d.monthly_active_users}`).join("\n")}
`.trim();
}

const toolStartTimes = new Map<string, number>();

let latestUsage: {
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
  premiumRequestsUsed?: number;
  premiumRequestsRemaining?: number;
  remainingPercentage?: number;
} | undefined;

export async function createChatSession(): Promise<{
  session: CopilotSession;
  sessionId: string;
}> {
  const client = await getCopilotClient();

  let metricsContext = "";
  try {
    const report = await fetchOrgUsageData();
    metricsContext = buildMetricsSummary(report);
  } catch {
    metricsContext = "Metrics data could not be loaded.";
  }


  const session = await client.createSession({
    model: "claude-sonnet-4.6",
    streaming: true,
    onPermissionRequest: approveAll,
    tools: createChatTools(),
    hooks: {
      onPreToolUse: (input, invocation) => {
        const key = input.toolName + "_" + input.timestamp;
        toolStartTimes.set(key, Date.now());
        logToolExecution({
          timestamp: new Date().toISOString(),
          sessionId: invocation.sessionId,
          toolName: input.toolName,
          args: input.toolArgs,
        });
        console.log(`[hook] Tool START: ${input.toolName}`);
        return { permissionDecision: "allow" as const };
      },
      onPostToolUse: (input, invocation) => {
        const key = input.toolName + "_" + input.timestamp;
        const startTime = toolStartTimes.get(key);
        const durationMs = startTime ? Date.now() - startTime : undefined;
        toolStartTimes.delete(key);
        const status = input.toolResult.resultType === "failure" ? "failure" : "success";
        const summary = input.toolResult.textResultForLlm.slice(0, 200);
        logToolExecution({
          timestamp: new Date().toISOString(),
          sessionId: invocation.sessionId,
          toolName: input.toolName,
          args: input.toolArgs,
          result: { status, summary },
          durationMs,
          usage: latestUsage,
        });
        console.log(`[hook] Tool END: ${input.toolName} (${durationMs}ms) [${status}]`);
        return {};
      },
    },
    systemMessage: {
      content: `You are a helpful assistant for the GitHub Copilot Metrics Dashboard. Answer questions about the dashboard data and Copilot usage metrics. Below is the current dashboard data:\n\n${metricsContext}\n\nYou also have access to tools that can fetch additional data at runtime:\n- get_seat_info: Get Copilot license/seat assignments and activity status\n- get_user_metrics: Get per-user usage metrics (optionally filtered by user_login)\n- get_metrics_by_date_range: Get detailed metrics for a custom date range\n- get_team_metrics: Get metrics scoped to a specific team\n- get_org_members: Get organization member list\n\nUse the pre-loaded data above for general questions. Call tools when the user asks about specific users, teams, date ranges, seats/licenses, or needs data not in the pre-loaded summary. Respond concisely and in the same language the user writes in.`,
    },
  });

  session.on("assistant.usage", (event) => {
    const data = event.data;
    const quotaKeys = data.quotaSnapshots ? Object.keys(data.quotaSnapshots) : [];
    const quota = quotaKeys.length > 0 ? data.quotaSnapshots![quotaKeys[0]] : undefined;
    latestUsage = {
      model: data.model,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      cost: data.cost,
      premiumRequestsUsed: quota?.usedRequests,
      premiumRequestsRemaining: quota ? quota.entitlementRequests - quota.usedRequests : undefined,
      remainingPercentage: quota?.remainingPercentage,
    };
    console.log(`[hook] Usage: model=${data.model} cost=${data.cost} tokens=${data.inputTokens}+${data.outputTokens}`);
  });

  return { session, sessionId: session.sessionId };
}

// Session cache for reuse
const sessionCache = new Map<string, CopilotSession>();

export async function getOrCreateSession(
  sessionId?: string
): Promise<{ session: CopilotSession; sessionId: string }> {
  if (sessionId && sessionCache.has(sessionId)) {
    return { session: sessionCache.get(sessionId)!, sessionId };
  }

  const result = await createChatSession();
  sessionCache.set(result.sessionId, result.session);
  return result;
}

export function getCachedSession(
  sessionId: string
): CopilotSession | undefined {
  return sessionCache.get(sessionId);
}
