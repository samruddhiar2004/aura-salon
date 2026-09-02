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
    const { name, categoryId, description, price, durationMinutes, image, isFeatured, isActive } = body;

    const updated = await db.service.update({
      where: { id: params.id },
      data: {
        name,
        categoryId,
        description,
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes, 10),
        image,
        isFeatured: Boolean(isFeatured),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
