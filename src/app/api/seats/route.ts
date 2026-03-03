import { NextResponse } from 'next/server';
import { fetchAllSeats } from '@/lib/github';

export async function GET() {
  try {
    const seats = await fetchAllSeats();
    return NextResponse.json({ seats, total: seats.length }, {
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
