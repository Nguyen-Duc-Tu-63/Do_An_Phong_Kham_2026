import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ALL_STANDARD_SLOTS,
  STANDARD_MORNING_SLOTS,
  STANDARD_AFTERNOON_SLOTS,
} from '@/lib/utils';

export const dynamic = 'force-dynamic';

export interface SlotStatus {
  time: string;
  available: boolean;
  period: 'MORNING' | 'AFTERNOON';
  bookedCount?: number;
  totalCapacity?: number;
  reason?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const specialtyId = searchParams.get('specialtyId');
    const doctorId = searchParams.get('doctorId');

    if (!date || !specialtyId) {
      return NextResponse.json({ error: 'date and specialtyId are required' }, { status: 400 });
    }

    // 1. If a specific doctor is chosen
    if (doctorId && doctorId !== 'AUTO_ASSIGN') {
      const bookedAppts = await prisma.appointment.findMany({
        where: {
          doctorId,
          appointmentDate: date,
          status: { notIn: ['CANCELLED'] },
        },
        select: { appointmentTime: true },
      });

      const bookedSet = new Set(bookedAppts.map((a) => a.appointmentTime));

      const allSlots: SlotStatus[] = ALL_STANDARD_SLOTS.map((time) => {
        const isMorning = STANDARD_MORNING_SLOTS.includes(time);
        const isBooked = bookedSet.has(time);
        return {
          time,
          available: !isBooked,
          period: isMorning ? 'MORNING' : 'AFTERNOON',
          reason: isBooked ? 'Bác sĩ đã kín lịch' : undefined,
        };
      });

      const availableSlots = allSlots.filter((s) => s.available).map((s) => s.time);
      const morningSlots = allSlots.filter((s) => s.period === 'MORNING');
      const afternoonSlots = allSlots.filter((s) => s.period === 'AFTERNOON');

      return NextResponse.json({
        allSlots,
        availableSlots,
        morningSlots,
        afternoonSlots,
      });
    }

    // 2. If AUTO_ASSIGN (Specialty-level booking)
    const doctorsInSpecialty = await prisma.doctorInfo.findMany({
      where: { specialtyId },
      select: { id: true },
    });

    const doctorIds = doctorsInSpecialty.map((d) => d.id);
    const totalDoctors = doctorIds.length || 1;

    const allBookedAppts = await prisma.appointment.findMany({
      where: {
        ...(doctorIds.length > 0 ? { doctorId: { in: doctorIds } } : { specialtyId }),
        appointmentDate: date,
        status: { notIn: ['CANCELLED'] },
      },
      select: { doctorId: true, appointmentTime: true },
    });

    // Count how many doctors are booked for each slot
    const slotBookingMap = new Map<string, number>();
    for (const appt of allBookedAppts) {
      const current = slotBookingMap.get(appt.appointmentTime) || 0;
      slotBookingMap.set(appt.appointmentTime, current + 1);
    }

    const allSlots: SlotStatus[] = ALL_STANDARD_SLOTS.map((time) => {
      const isMorning = STANDARD_MORNING_SLOTS.includes(time);
      const bookedCount = slotBookingMap.get(time) || 0;
      const isAvailable = bookedCount < totalDoctors;

      return {
        time,
        available: isAvailable,
        period: isMorning ? 'MORNING' : 'AFTERNOON',
        bookedCount,
        totalCapacity: totalDoctors,
        reason: isAvailable ? undefined : 'Đã kín lịch tất cả bác sĩ',
      };
    });

    const availableSlots = allSlots.filter((s) => s.available).map((s) => s.time);
    const morningSlots = allSlots.filter((s) => s.period === 'MORNING');
    const afternoonSlots = allSlots.filter((s) => s.period === 'AFTERNOON');

    return NextResponse.json({
      allSlots,
      availableSlots,
      morningSlots,
      afternoonSlots,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
