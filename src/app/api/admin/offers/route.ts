import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const offers = await db.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Fetch offers error:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, code, discountPercent, fixedDiscount, validUntil, isActive, image } = body;

    if (!title || !description || !validUntil) {
      return NextResponse.json({ error: 'Title, description, and validity date are required' }, { status: 400 });
    }

    const newOffer = await db.offer.create({
      data: {
        title,
        description,
        code: code || null,
        discountPercent: discountPercent ? parseInt(discountPercent, 10) : null,
        fixedDiscount: fixedDiscount ? parseFloat(fixedDiscount) : null,
        validUntil,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, offer: newOffer });
  } catch (error) {
    console.error('Create offer error:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, code, discountPercent, fixedDiscount, validUntil, isActive, image } = body;

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }

    const updated = await db.offer.update({
      where: { id },
      data: {
        title,
        description,
        code: code || null,
        discountPercent: discountPercent ? parseInt(discountPercent, 10) : null,
        fixedDiscount: fixedDiscount ? parseFloat(fixedDiscount) : null,
        validUntil,
        isActive: Boolean(isActive),
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    console.error('Update offer error:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }

    await db.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete offer error:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
