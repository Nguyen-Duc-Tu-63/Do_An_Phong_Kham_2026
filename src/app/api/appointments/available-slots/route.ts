import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTimeSlots } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const specialtyId = searchParams.get('specialtyId');
    const doctorId = searchParams.get('doctorId');

    if (!date || !specialtyId) {
      return NextResponse.json({ error: 'date and specialtyId are required' }, { status: 400 });
    }

    const dayOfWeek = new Date(date).getDay();

    if (doctorId && doctorId !== 'AUTO_ASSIGN') {
      const schedule = await prisma.doctorSchedule.findFirst({
        where: { doctorId, dayOfWeek },
      });

      if (!schedule) {
        return NextResponse.json({ availableSlots: [], message: 'Doctor is not working on this day' });
      }

      const candidateSlots = generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        schedule.slotDurationMinutes
      );

      const bookedAppts = await prisma.appointment.findMany({
        where: {
          doctorId,
          appointmentDate: date,
          status: { notIn: ['CANCELLED'] },
        },
        select: { appointmentTime: true },
      });

      const bookedSet = new Set(bookedAppts.map((a) => a.appointmentTime));
      const freeSlots = candidateSlots.filter((slot) => !bookedSet.has(slot));

      return NextResponse.json({ availableSlots: freeSlots });
    } else {
      const doctorsInSpecialty = await prisma.doctorInfo.findMany({
        where: { specialtyId },
        select: { id: true },
      });

      const doctorIds = doctorsInSpecialty.map((d) => d.id);
      if (doctorIds.length === 0) {
        return NextResponse.json({ availableSlots: [] });
      }

      const schedules = await prisma.doctorSchedule.findMany({
        where: {
          doctorId: { in: doctorIds },
          dayOfWeek,
        },
      });

      if (schedules.length === 0) {
        return NextResponse.json({ availableSlots: [], message: 'No doctors working in this specialty on this day' });
      }

      const allBookedAppts = await prisma.appointment.findMany({
        where: {
          doctorId: { in: doctorIds },
          appointmentDate: date,
          status: { notIn: ['CANCELLED'] },
        },
        select: { doctorId: true, appointmentTime: true },
      });

      const availableSlotsSet = new Set<string>();

      for (const schedule of schedules) {
        const slots = generateTimeSlots(
          schedule.startTime,
          schedule.endTime,
          schedule.slotDurationMinutes
        );

        const docBooked = new Set(
          allBookedAppts
            .filter((a) => a.doctorId === schedule.doctorId)
            .map((a) => a.appointmentTime)
        );

        slots.forEach((slot) => {
          if (!docBooked.has(slot)) {
            availableSlotsSet.add(slot);
          }
        });
      }

      const sortedAvailableSlots = Array.from(availableSlotsSet).sort();
      return NextResponse.json({ availableSlots: sortedAvailableSlots });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
