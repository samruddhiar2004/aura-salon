import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const availability = await db.availability.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    const blackoutDates = await db.blackoutDate.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ availability, blackoutDates });
  } catch (error) {
    console.error('Fetch availability error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule availability' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { schedules } = body; // Array of { dayOfWeek, isOpen, openTime, closeTime, breakStartTime, breakEndTime }

    if (!Array.isArray(schedules)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    for (const sched of schedules) {
      await db.availability.upsert({
        where: { dayOfWeek: sched.dayOfWeek },
        update: {
          isOpen: Boolean(sched.isOpen),
          openTime: sched.openTime,
          closeTime: sched.closeTime,
          breakStartTime: sched.breakStartTime || null,
          breakEndTime: sched.breakEndTime || null,
        },
        create: {
          dayOfWeek: sched.dayOfWeek,
          isOpen: Boolean(sched.isOpen),
          openTime: sched.openTime,
          closeTime: sched.closeTime,
          breakStartTime: sched.breakStartTime || null,
          breakEndTime: sched.breakEndTime || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update availability error:', error);
    return NextResponse.json({ error: 'Failed to update availability schedule' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Add blackout date
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { date, reason } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const blackout = await db.blackoutDate.create({
      data: { date, reason: reason || 'Salon Closed' },
    });

    return NextResponse.json({ success: true, blackout });
  } catch (error) {
    console.error('Add blackout date error:', error);
    return NextResponse.json({ error: 'Failed to add blackout date' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // Delete blackout date
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.blackoutDate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blackout date error:', error);
    return NextResponse.json({ error: 'Failed to remove blackout date' }, { status: 500 });
  }
}
