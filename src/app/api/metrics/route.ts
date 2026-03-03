import { NextRequest, NextResponse } from 'next/server';
import { fetchOrgMetrics } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since') || undefined;
    const until = searchParams.get('until') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '28');

    const metrics = await fetchOrgMetrics(since, until, page, perPage);

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('not set') ? 401 :
                   message.includes('403') ? 403 :
                   message.includes('404') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
