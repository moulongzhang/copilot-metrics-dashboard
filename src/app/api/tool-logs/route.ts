import { NextRequest, NextResponse } from "next/server";
import { getToolLogs } from "@/lib/tool-logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const logs = getToolLogs(limit ? parseInt(limit, 10) : 50);

  return NextResponse.json(logs, {
    headers: { "Cache-Control": "no-store" },
  });
}
