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
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const staffId = searchParams.get('staffId');
    const search = searchParams.get('search')?.trim();

    let whereClause: any = {};

    if (date) {
      whereClause.date = date;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (staffId && staffId !== 'ALL') {
      whereClause.staffId = staffId;
    }

    if (search) {
      whereClause.OR = [
        { appointmentCode: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { service: { name: { contains: search } } },
      ];
    }

    const appointments = await db.appointment.findMany({
      where: whereClause,
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    // Calculate Summary Stats for Dashboard Overview
    const todayStr = new Date().toISOString().split('T')[0];

    const todayAppointments = await db.appointment.findMany({
      where: { date: todayStr },
      include: { customer: true, service: true, staff: true },
      orderBy: { startTime: 'asc' },
    });

    const totalCount = await db.appointment.count();
    const upcomingCount = await db.appointment.count({
      where: { date: { gte: todayStr }, status: { in: ['CONFIRMED', 'PENDING'] } },
    });
    const completedToday = todayAppointments.filter((a) => a.status === 'COMPLETED').length;
    const totalCustomers = await db.customer.count();

    const revenueSum = await db.appointment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { price: true },
    });

    return NextResponse.json({
      appointments,
      todayAppointments,
      stats: {
        todayTotal: todayAppointments.length,
        upcomingCount,
        completedToday,
        totalCustomers,
        totalRevenue: revenueSum._sum.price || 0,
      },
    });
  } catch (error) {
    console.error('Admin appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
