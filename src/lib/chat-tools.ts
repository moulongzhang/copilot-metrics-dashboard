import { defineTool, type Tool } from "@github/copilot-sdk";
import {
  fetchAllSeats,
  fetchUserUsageData,
  fetchOrgMetrics,
  fetchTeamMetrics,
  fetchAllMembers,
} from "./github";
import type {
  CopilotSeat,
  UserUsageRecord,
  CopilotMetricsDay,
  OrgMember,
} from "./types";

function formatSeatInfo(seats: CopilotSeat[]): string {
  const active = seats.filter((s) => !s.pending_cancellation_date);
  const pending = seats.filter((s) => s.pending_cancellation_date);
  const lines = [
    `## Copilot Seats Summary`,
    `Total: ${seats.length} seats (${active.length} active, ${pending.length} pending cancellation)`,
    "",
    "| User | Plan | Last Active | Editor | Team |",
    "|------|------|-------------|--------|------|",
  ];
  for (const s of seats) {
    const team = s.assigning_team?.name ?? "—";
    const lastActive = s.last_activity_at
      ? s.last_activity_at.split("T")[0]
      : "Never";
    const editor = s.last_activity_editor ?? "—";
    const cancel = s.pending_cancellation_date
      ? ` (cancel: ${s.pending_cancellation_date})`
      : "";
    lines.push(
      `| ${s.assignee.login}${cancel} | ${s.plan_type} | ${lastActive} | ${editor} | ${team} |`
    );
  }
  return lines.join("\n");
}

function formatUserMetrics(
  records: UserUsageRecord[],
  filterLogin?: string
): string {
  let filtered = records;
  if (filterLogin) {
    filtered = records.filter(
      (r) => r.user_login.toLowerCase() === filterLogin.toLowerCase()
    );
    if (filtered.length === 0) {
      return `No metrics found for user "${filterLogin}".`;
    }
  }

  // Aggregate per user across days
  const byUser = new Map<
    string,
    {
      interactions: number;
      codeGen: number;
      codeAccept: number;
      locAdded: number;
      locSuggested: number;
      usedAgent: boolean;
      usedChat: boolean;
      days: number;
    }
  >();

  for (const r of filtered) {
    const existing = byUser.get(r.user_login) ?? {
      interactions: 0,
      codeGen: 0,
      codeAccept: 0,
      locAdded: 0,
      locSuggested: 0,
      usedAgent: false,
      usedChat: false,
      days: 0,
    };
    existing.interactions += r.user_initiated_interaction_count;
    existing.codeGen += r.code_generation_activity_count;
    existing.codeAccept += r.code_acceptance_activity_count;
    existing.locAdded += r.loc_added_sum;
    existing.locSuggested += r.loc_suggested_to_add_sum;
    existing.usedAgent = existing.usedAgent || r.used_agent;
    existing.usedChat = existing.usedChat || r.used_chat;
    existing.days += 1;
    byUser.set(r.user_login, existing);
  }

  const lines = [
    `## User Metrics (${byUser.size} users)`,
    "",
    "| User | Days | Interactions | Code Gen | Accepted | Rate | LOC Added | Agent | Chat |",
    "|------|------|-------------|----------|----------|------|-----------|-------|------|",
  ];

  const sorted = [...byUser.entries()].sort(
    (a, b) => b[1].interactions - a[1].interactions
  );
  for (const [login, m] of sorted) {
    const rate =
      m.codeGen > 0 ? Math.round((m.codeAccept / m.codeGen) * 1000) / 10 : 0;
    lines.push(
      `| ${login} | ${m.days} | ${m.interactions} | ${m.codeGen} | ${m.codeAccept} | ${rate}% | ${m.locAdded} | ${m.usedAgent ? "✓" : "—"} | ${m.usedChat ? "✓" : "—"} |`
    );
  }
  return lines.join("\n");
}

function formatMetricsDay(days: CopilotMetricsDay[]): string {
  if (days.length === 0) return "No metrics data for the specified range.";

  const lines = [
    `## Copilot Metrics (${days[0].date} to ${days[days.length - 1].date}, ${days.length} days)`,
    "",
  ];

  for (const d of days) {
    lines.push(`### ${d.date}`);
    lines.push(
      `Active: ${d.total_active_users}, Engaged: ${d.total_engaged_users}`
    );

    if (d.copilot_ide_code_completions) {
      const cc = d.copilot_ide_code_completions;
      lines.push(`Code Completions: ${cc.total_engaged_users} engaged users`);
      for (const editor of cc.editors) {
        for (const model of editor.models) {
          for (const lang of model.languages) {
            lines.push(
              `  ${editor.name}/${model.name}/${lang.name}: suggestions=${lang.total_code_suggestions}, accepted=${lang.total_code_acceptances}, lines_suggested=${lang.total_code_lines_suggested}, lines_accepted=${lang.total_code_lines_accepted}`
            );
          }
        }
      }
    }

    if (d.copilot_ide_chat) {
      lines.push(
        `IDE Chat: ${d.copilot_ide_chat.total_engaged_users} engaged users`
      );
      for (const editor of d.copilot_ide_chat.editors) {
        for (const model of editor.models) {
          lines.push(
            `  ${editor.name}/${model.name}: chats=${model.total_chats}, insertions=${model.total_chat_insertion_events}, copies=${model.total_chat_copy_events}`
          );
        }
      }
    }

    if (d.copilot_dotcom_chat) {
      lines.push(
        `Dotcom Chat: ${d.copilot_dotcom_chat.total_engaged_users} engaged users`
      );
    }

    if (d.copilot_dotcom_pull_requests) {
      lines.push(
        `PR Summaries: ${d.copilot_dotcom_pull_requests.total_engaged_users} engaged users`
      );
      for (const repo of d.copilot_dotcom_pull_requests.repositories) {
        lines.push(
          `  ${repo.name}: ${repo.models.reduce((s, m) => s + m.total_pr_summaries_created, 0)} summaries`
        );
      }
    }

    lines.push("");
  }
  return lines.join("\n");
}

function formatMembers(members: OrgMember[]): string {
  const lines = [
    `## Organization Members (${members.length} total)`,
    "",
    "| Login | Type | Profile |",
    "|-------|------|---------|",
  ];
  for (const m of members) {
    lines.push(`| ${m.login} | ${m.type} | ${m.html_url} |`);
  }
  return lines.join("\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createChatTools(): Tool<any>[] {
  return [
    defineTool("get_seat_info", {
      description:
        "Get Copilot seat/license information for the organization. Returns who has Copilot, their last activity date, editor, plan type, and team assignment. Use this for license management queries.",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        const seats = await fetchAllSeats();
        return formatSeatInfo(seats);
      },
    }),

    defineTool("get_user_metrics", {
      description:
        "Get per-user Copilot usage metrics for the past 28 days. Shows interactions, code generation/acceptance counts, LOC, and whether they used Agent or Chat features. Optionally filter by a specific user login.",
      parameters: {
        type: "object",
        properties: {
          user_login: {
            type: "string",
            description:
              "Optional GitHub login to filter results to a single user.",
          },
        },
      },
      handler: async (args: { user_login?: string }) => {
        const records = await fetchUserUsageData();
        return formatUserMetrics(records, args.user_login);
      },
    }),

    defineTool("get_metrics_by_date_range", {
      description:
        "Get detailed Copilot metrics for a custom date range. Returns editor-level, model-level, and language-level breakdown of code completions, chat usage, and PR summaries. Useful for period comparison and historical analysis.",
      parameters: {
        type: "object",
        properties: {
          since: {
            type: "string",
            description: "Start date in YYYY-MM-DD format.",
          },
          until: {
            type: "string",
            description: "End date in YYYY-MM-DD format.",
          },
        },
        required: ["since", "until"],
      },
      handler: async (args: { since: string; until: string }) => {
        const days = await fetchOrgMetrics(args.since, args.until);
        return formatMetricsDay(days);
      },
    }),

    defineTool("get_team_metrics", {
      description:
        "Get Copilot metrics for a specific team. Requires the team slug (URL-friendly team name). Returns the same detailed breakdown as org metrics but scoped to the team.",
      parameters: {
        type: "object",
        properties: {
          team_slug: {
            type: "string",
            description:
              "The slug (URL-friendly name) of the team to get metrics for.",
          },
          since: {
            type: "string",
            description: "Optional start date in YYYY-MM-DD format.",
          },
          until: {
            type: "string",
            description: "Optional end date in YYYY-MM-DD format.",
          },
        },
        required: ["team_slug"],
      },
      handler: async (args: {
        team_slug: string;
        since?: string;
        until?: string;
      }) => {
        const days = await fetchTeamMetrics(
          args.team_slug,
          args.since,
          args.until
        );
        return formatMetricsDay(days);
      },
    }),

    defineTool("get_org_members", {
      description:
        "Get the list of all organization members. Useful for cross-referencing with seat info to find members without Copilot access.",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        const members = await fetchAllMembers();
        return formatMembers(members);
      },
    }),
  ];
}
