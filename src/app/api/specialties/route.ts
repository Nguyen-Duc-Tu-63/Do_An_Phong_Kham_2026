import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const specialties = await prisma.specialty.findMany({
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });
    return NextResponse.json(specialties);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, iconUrl } = body;
    const specialty = await prisma.specialty.create({
      data: { name, description, iconUrl: iconUrl || 'Stethoscope' },
    });
    return NextResponse.json(specialty, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
