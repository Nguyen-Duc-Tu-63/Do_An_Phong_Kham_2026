import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorId: bodyDocId, reason } = body;

    const user = await getCurrentUser();
    const targetDoctorId = bodyDocId || user?.doctorId;

    if (!targetDoctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const doctorInfo = await prisma.doctorInfo.findUnique({
      where: { id: targetDoctorId },
      include: { user: true },
    });

    if (!doctorInfo) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Find remaining scheduled/confirmed appointments for today
    const remainingAppts = await prisma.appointment.findMany({
      where: {
        doctorId: targetDoctorId,
        appointmentDate: todayStr,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    });

    if (remainingAppts.length === 0) {
      return NextResponse.json({
        message: 'No active appointments remaining for today to flag.',
        affectedCount: 0,
      });
    }

    // Update appointments to NEEDS_REASSIGNMENT
    await prisma.appointment.updateMany({
      where: {
        id: { in: remainingAppts.map((a) => a.id) },
      },
      data: {
        status: 'NEEDS_REASSIGNMENT',
      },
    });

    // Create notifications for Admins
    const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of adminUsers) {
      for (const appt of remainingAppts) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            appointmentId: appt.id,
            message: `URGENT: ${doctorInfo.user.fullName} reported sudden unavailability ("${reason}"). Appointment at ${appt.appointmentTime} needs reassignment!`,
            type: 'URGENT_DOCTOR_BUSY',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully reported unavailability. ${remainingAppts.length} appointments flagged for urgent reassignment.`,
      affectedCount: remainingAppts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
