import { NextResponse } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const staffId = searchParams.get('staffId');

    if (!date || !serviceId) {
      return NextResponse.json({ error: 'Date and Service ID are required' }, { status: 400 });
    }

    const slots = await getAvailableTimeSlots(date, serviceId, staffId);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Fetch slots error:', error);
    return NextResponse.json({ error: 'Failed to calculate available slots' }, { status: 500 });
  }
}
