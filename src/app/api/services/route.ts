import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await db.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        services: {
          orderBy: { name: 'asc' },
        },
      },
    });

    const services = await db.service.findMany({
      orderBy: { name: 'asc' },
      include: { category: true },
    });

    return NextResponse.json({ categories, services });
  } catch (error) {
    console.error('Fetch services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, categoryId, description, price, durationMinutes, image, isFeatured, isActive } = body;

    if (!name || !categoryId || !price || !durationMinutes) {
      return NextResponse.json({ error: 'Missing required service fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newService = await db.service.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description: description || '',
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes, 10),
        image: image || null,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        categoryId,
      },
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
