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
    const { status, date, startTime, staffId, notes } = body;

    const existing = await db.appointment.findUnique({
      where: { id: params.id },
      include: { service: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    let updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (date && startTime) {
      // Calculate end time
      const [h, m] = startTime.split(':').map(Number);
      const totalStartMins = h * 60 + m;
      const totalEndMins = totalStartMins + existing.service.durationMinutes;
      const endH = Math.floor(totalEndMins / 60);
      const endM = totalEndMins % 60;
      const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

      updateData.date = date;
      updateData.startTime = startTime;
      updateData.endTime = endTime;
    }

    if (staffId) {
      updateData.staffId = staffId;
    }

    const updated = await db.appointment.update({
      where: { id: params.id },
      data: updateData,
      include: { customer: true, service: true, staff: true },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.appointment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
