import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    let whereClause: any = { isAvailable: true };

    if (serviceId) {
      whereClause.staffServices = {
        some: { serviceId },
      };
    }

    const staff = await db.staff.findMany({
      where: whereClause,
      include: {
        staffServices: {
          include: { service: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Fetch staff error:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, bio, image, isAvailable, workDays, startTime, endTime, serviceIds } = body;

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    const newStaff = await db.staff.create({
      data: {
        name,
        role,
        bio: bio || '',
        image: image || null,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        workDays: workDays || '1,2,3,4,5,6',
        startTime: startTime || '10:00',
        endTime: endTime || '20:00',
        staffServices: {
          create: (serviceIds || []).map((serviceId: string) => ({
            serviceId,
          })),
        },
      },
      include: { staffServices: true },
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
