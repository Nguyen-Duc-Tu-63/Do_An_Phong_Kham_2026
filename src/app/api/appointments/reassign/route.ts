import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { appointmentId, doctorId, appointmentDate, appointmentTime } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json({ error: 'appointmentId and doctorId required' }, { status: 400 });
    }

    const appt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const targetDate = appointmentDate || appt.appointmentDate;
    const targetTime = appointmentTime || appt.appointmentTime;

    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: targetDate,
        appointmentTime: targetTime,
        status: { notIn: ['CANCELLED'] },
        id: { not: appointmentId },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Selected doctor is busy at this target time slot.' },
        { status: 409 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        doctorId,
        appointmentDate: targetDate,
        appointmentTime: targetTime,
        status: 'CONFIRMED',
      },
      include: {
        doctor: { include: { user: true } },
        patient: true,
        specialty: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
