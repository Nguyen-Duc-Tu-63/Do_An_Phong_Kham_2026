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

    // Find remaining scheduled/confirmed appointments from today onwards
    const remainingAppts = await prisma.appointment.findMany({
      where: {
        doctorId: targetDoctorId,
        appointmentDate: { gte: todayStr },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      include: {
        patient: true,
        specialty: true,
      },
    });

    const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' } });

    if (remainingAppts.length === 0) {
      // Create a general notice to Admin even if no appointments are affected
      for (const admin of adminUsers) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            message: `THÔNG BÁO: ${doctorInfo.user.fullName} vừa báo bận đột xuất (Lý do: "${reason || 'Bận việc khẩn'}"). Bác sĩ hiện không có ca khám nào sắp tới.`,
            type: 'URGENT_DOCTOR_BUSY',
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Đã ghi nhận báo bận của Bác sĩ tới ban Quản lý. Bác sĩ hiện không có ca khám nào đang chờ điều phối.`,
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
    for (const admin of adminUsers) {
      for (const appt of remainingAppts) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            appointmentId: appt.id,
            message: `KHẨN CẤP: ${doctorInfo.user.fullName} báo bận đột xuất ("${reason || 'Việc khẩn'}"). Ca khám bệnh nhân ${appt.patient?.fullName || ''} lúc ${appt.appointmentTime} ngày ${appt.appointmentDate} cần đổi bác sĩ ngay!`,
            type: 'URGENT_DOCTOR_BUSY',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã kích hoạt báo bận thành công! Có ${remainingAppts.length} ca khám đã được chuyển sang Lễ tân / Quản lý để điều phối bác sĩ thay thế.`,
      affectedCount: remainingAppts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
