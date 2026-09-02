import { NextResponse } from 'next/server';
import { getAvailableDates } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dates = await getAvailableDates(30);
    return NextResponse.json({ dates });
  } catch (error) {
    console.error('Fetch available dates error:', error);
    return NextResponse.json({ dates: [] });
  }
}
