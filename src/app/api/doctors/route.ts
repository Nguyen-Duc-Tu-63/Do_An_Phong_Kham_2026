import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialtyId = searchParams.get('specialtyId');

    const whereClause: any = {};
    if (specialtyId) {
      whereClause.specialtyId = specialtyId;
    }

    const doctors = await prisma.doctorInfo.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        specialty: true,
        schedules: true,
      },
    });

    return NextResponse.json(doctors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      specialtyId,
      degree,
      experienceYears,
      bio,
      consultationFee,
      avatarUrl,
    } = body;

    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash: defaultPasswordHash,
        role: 'DOCTOR',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      },
    });

    const doctorInfo = await prisma.doctorInfo.create({
      data: {
        userId: user.id,
        specialtyId,
        degree,
        experienceYears: Number(experienceYears),
        bio,
        consultationFee: Number(consultationFee),
      },
    });

    for (let day = 1; day <= 5; day++) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doctorInfo.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '17:00',
          slotDurationMinutes: 30,
        },
      });
    }

    return NextResponse.json(doctorInfo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
