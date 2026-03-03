import { NextResponse } from 'next/server';
import { fetchAllMembers } from '@/lib/github';

export async function GET() {
  try {
    const members = await fetchAllMembers();
    return NextResponse.json({ members, total: members.length }, {
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
