import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Fetch gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, category, imageUrl, displayOrder } = body;

    if (!title || !category || !imageUrl) {
      return NextResponse.json({ error: 'Title, category, and image URL are required' }, { status: 400 });
    }

    const newImage = await db.galleryImage.create({
      data: {
        title,
        category,
        imageUrl,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Create gallery image error:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
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
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    await db.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
