import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();

    let whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const customers = await db.customer.findMany({
      where: whereClause,
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          include: { service: true, staff: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = customers.map((c) => {
      const completedApps = c.appointments.filter((a) => a.status === 'COMPLETED');
      const totalSpent = completedApps.reduce((sum, a) => sum + a.price, 0);
      const lastAppointment = c.appointments[0] ? c.appointments[0].date : null;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        notes: c.notes,
        totalAppointments: c.appointments.length,
        completedAppointments: completedApps.length,
        totalSpent,
        lastAppointment,
        appointments: c.appointments,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error) {
    console.error('Fetch customers error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer directory' }, { status: 500 });
  }
}
