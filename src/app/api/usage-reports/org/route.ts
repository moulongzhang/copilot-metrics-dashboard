import { NextRequest, NextResponse } from 'next/server';
import { fetchOrgUsageReport, downloadAndParseNDJSON } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day') || undefined;

    const report = await fetchOrgUsageReport(day);

    if (report.download_links && report.download_links.length > 0) {
      const data = await downloadAndParseNDJSON<Record<string, unknown>>(report.download_links);
      return NextResponse.json({
        ...report,
        data,
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('not set') ? 401 :
                   message.includes('403') ? 403 :
                   message.includes('404') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
