import { NextResponse } from 'next/server';
import { getAvailableDates } from '@/lib/booking';

export async function GET() {
  try {
    const dates = await getAvailableDates(30);
    return NextResponse.json({ dates });
  } catch (error) {
    console.error('Fetch available dates error:', error);
    return NextResponse.json({ error: 'Failed to fetch available dates' }, { status: 500 });
  }
}
