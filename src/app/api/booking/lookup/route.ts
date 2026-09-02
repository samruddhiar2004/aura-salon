import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    let appointments: any[] = [];

    if (query.toUpperCase().startsWith('AUR-')) {
      // Lookup by appointment code
      const app = await db.appointment.findUnique({
        where: { appointmentCode: query.toUpperCase() },
        include: {
          customer: true,
          service: true,
          staff: true,
        },
      });
      if (app) appointments.push(app);
    } else {
      // Lookup by phone number
      const cleanPhone = query.replace(/[^\d+]/g, '');
      const customer = await db.customer.findUnique({
        where: { phone: cleanPhone },
        include: {
          appointments: {
            orderBy: { date: 'desc' },
            include: {
              service: true,
              staff: true,
            },
          },
        },
      });
      if (customer) {
        appointments = customer.appointments.map((a) => ({
          ...a,
          customer: {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
          },
        }));
      }
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Appointment lookup error:', error);
    return NextResponse.json({ error: 'Failed to look up appointment' }, { status: 500 });
  }
}
