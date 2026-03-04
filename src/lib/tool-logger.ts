import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "tool-execution.log");
const MAX_ARG_LENGTH = 500;
const MAX_SUMMARY_LENGTH = 200;

export interface ToolLogEntry {
  timestamp: string;
  sessionId: string;
  toolName: string;
  args: unknown;
  result?: {
    status: "success" | "failure";
    summary: string;
  };
  durationMs?: number;
  // Premium request / usage tracking
  usage?: {
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    cost?: number;
    premiumRequestsUsed?: number;
    premiumRequestsRemaining?: number;
    remainingPercentage?: number;
  };
}

export function truncateArgs(args: unknown): unknown {
  if (typeof args === "string") {
    return args.length > MAX_ARG_LENGTH
      ? args.slice(0, MAX_ARG_LENGTH) + "..."
      : args;
  }
  if (Array.isArray(args)) {
    return args.map(truncateArgs);
  }
  if (args !== null && typeof args === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args)) {
      out[key] = truncateArgs(value);
    }
    return out;
  }
  return args;
}

export function logToolExecution(entry: ToolLogEntry): void {
  const sanitized: ToolLogEntry = {
    ...entry,
    args: truncateArgs(entry.args),
    result: entry.result
      ? {
          ...entry.result,
          summary: entry.result.summary.slice(0, MAX_SUMMARY_LENGTH),
        }
      : undefined,
    usage: entry.usage,
  };
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(sanitized) + "\n");
  } catch {
    console.error("[tool-logger] Failed to write log entry");
  }
}

export function getToolLogs(limit?: number): ToolLogEntry[] {
  let content: string;
  try {
    content = fs.readFileSync(LOG_FILE, "utf-8");
  } catch {
    return [];
  }

  const entries = content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line) as ToolLogEntry;
      } catch {
        return null;
      }
    })
    .filter((e): e is ToolLogEntry => e !== null)
    .reverse();

  return limit !== undefined ? entries.slice(0, limit) : entries;
}
