import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { appointmentId, doctorId } = await request.json();

    if (!appointmentId || !doctorId) {
      return NextResponse.json({ error: 'appointmentId and doctorId required' }, { status: 400 });
    }

    const appt = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Double check conflict
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        status: { notIn: ['CANCELLED'] },
        id: { not: appointmentId },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Selected doctor already has an appointment at this time slot.' },
        { status: 409 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        doctorId,
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
