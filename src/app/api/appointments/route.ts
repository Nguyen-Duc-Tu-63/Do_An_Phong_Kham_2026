import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const phone = searchParams.get('phone');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const specialtyId = searchParams.get('specialtyId');
    const date = searchParams.get('date');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (phone) {
      where.patient = { phone: phone.trim() };
    }
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;
    if (specialtyId) where.specialtyId = specialtyId;
    if (date) where.appointmentDate = date;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true },
        },
        doctor: {
          include: {
            user: { select: { fullName: true, email: true, phone: true, avatarUrl: true } },
            specialty: true,
          },
        },
        specialty: true,
        medicalRecord: {
          include: {
            prescriptions: true,
          },
        },
      },
      orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }],
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser();

    const targetApptId = body.appointmentId || body.id;
    if (targetApptId && body.status) {
      const updatedAppt = await prisma.appointment.update({
        where: { id: targetApptId },
        data: { status: body.status },
        include: {
          specialty: true,
          patient: { select: { fullName: true } },
          doctor: { include: { user: true } },
        },
      });
      return NextResponse.json(updatedAppt);
    }

    let targetPatientId = body.patientId || currentUser?.id;

    if (!targetPatientId) {
      const cleanPhone = body.phone?.trim();
      const cleanEmail = body.email?.trim();

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
            ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ],
        },
      });

      if (existingUser) {
        targetPatientId = existingUser.id;
      } else {
        const hash = await bcrypt.hash('password123', 10);
        const newUser = await prisma.user.create({
          data: {
            fullName: body.fullName?.trim() || 'Bệnh nhân',
            email: cleanEmail || `patient_${cleanPhone || Date.now()}@careplus.vn`,
            phone: cleanPhone || '',
            passwordHash: hash,
            role: 'PATIENT',
          },
        });
        targetPatientId = newUser.id;
      }
    }

    const bookingType = body.bookingType || (body.doctorId ? 'SELF_SELECTED' : 'AUTO_ASSIGN');

    const newAppt = await prisma.appointment.create({
      data: {
        patientId: targetPatientId,
        doctorId: body.doctorId || null,
        specialtyId: body.specialtyId,
        appointmentDate: body.appointmentDate,
        appointmentTime: body.appointmentTime,
        bookingType,
        patientNotes: body.patientNotes || null,
        status: 'PENDING',
      },
      include: {
        specialty: true,
        patient: { select: { fullName: true } },
      },
    });

    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminUser) {
      await prisma.notification.create({
        data: {
          userId: adminUser.id,
          appointmentId: newAppt.id,
          message: `New booking request from ${newAppt.patient.fullName} for ${newAppt.specialty.name} on ${newAppt.appointmentDate} at ${newAppt.appointmentTime}.`,
          type: 'NEW_BOOKING',
        },
      });
    }

    return NextResponse.json(newAppt, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const targetId = body.appointmentId || body.id;

    if (!targetId) {
      return NextResponse.json({ error: 'Thiếu mã lịch hẹn (appointmentId)' }, { status: 400 });
    }

    const existingAppt = await prisma.appointment.findUnique({
      where: { id: targetId },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        specialty: true,
      },
    });

    if (!existingAppt) {
      return NextResponse.json({ error: 'Không tìm thấy lịch hẹn' }, { status: 404 });
    }

    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.patientNotes !== undefined) updateData.patientNotes = body.patientNotes;
    if (body.appointmentDate !== undefined) updateData.appointmentDate = body.appointmentDate;
    if (body.appointmentTime !== undefined) updateData.appointmentTime = body.appointmentTime;

    const updatedAppt = await prisma.appointment.update({
      where: { id: targetId },
      data: updateData,
      include: {
        patient: {
          select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true },
        },
        doctor: {
          include: {
            user: { select: { fullName: true, email: true, phone: true, avatarUrl: true } },
            specialty: true,
          },
        },
        specialty: true,
        medicalRecord: {
          include: {
            prescriptions: true,
          },
        },
      },
    });

    // If cancelled, send notification to admin and assigned doctor
    if (body.status === 'CANCELLED') {
      const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (adminUser) {
        await prisma.notification.create({
          data: {
            userId: adminUser.id,
            appointmentId: updatedAppt.id,
            message: `Lịch hẹn của bệnh nhân ${existingAppt.patient.fullName} (${existingAppt.specialty?.name || ''}) ngày ${existingAppt.appointmentDate} lúc ${existingAppt.appointmentTime} đã bị hủy.`,
            type: 'CANCELLED',
          },
        });
      }

      if (existingAppt.doctor?.userId) {
        await prisma.notification.create({
          data: {
            userId: existingAppt.doctor.userId,
            appointmentId: updatedAppt.id,
            message: `Bệnh nhân ${existingAppt.patient.fullName} đã hủy lịch hẹn ngày ${existingAppt.appointmentDate} lúc ${existingAppt.appointmentTime}.`,
            type: 'CANCELLED',
          },
        });
      }
    }

    return NextResponse.json(updatedAppt);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
