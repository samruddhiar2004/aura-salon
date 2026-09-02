import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, bio, image, isAvailable, workDays, startTime, endTime, serviceIds } = body;

    // First delete existing staff-service mappings
    await db.staffService.deleteMany({
      where: { staffId: params.id },
    });

    const updated = await db.staff.update({
      where: { id: params.id },
      data: {
        name,
        role,
        bio,
        image,
        isAvailable: Boolean(isAvailable),
        workDays: workDays || '1,2,3,4,5,6',
        startTime: startTime || '10:00',
        endTime: endTime || '20:00',
        staffServices: {
          create: (serviceIds || []).map((serviceId: string) => ({
            serviceId,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (error) {
    console.error('Update staff error:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.staff.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
