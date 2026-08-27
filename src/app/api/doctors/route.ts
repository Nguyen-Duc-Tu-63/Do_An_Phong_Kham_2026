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
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        specialty: true,
        schedules: true,
      },
      orderBy: { user: { fullName: 'asc' } },
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

    if (!fullName || !email || !specialtyId) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ Họ tên, Email và Chuyên khoa' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email này đã được sử dụng trong hệ thống' },
        { status: 409 }
      );
    }

    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        passwordHash: defaultPasswordHash,
        role: 'DOCTOR',
        avatarUrl:
          avatarUrl?.trim() ||
          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      },
    });

    const doctorInfo = await prisma.doctorInfo.create({
      data: {
        userId: user.id,
        specialtyId,
        degree: degree?.trim() || 'Bác sĩ chuyên khoa',
        experienceYears: Number(experienceYears) || 0,
        bio: bio?.trim() || 'Bác sĩ chuyên khoa tại CarePlus+.',
        consultationFee: Number(consultationFee) || 30,
      },
      include: {
        user: true,
        specialty: true,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id, // doctorInfo.id
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

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã bác sĩ (id)' }, { status: 400 });
    }

    const doctor = await prisma.doctorInfo.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin bác sĩ' }, { status: 404 });
    }

    // Check duplicate email if changed
    if (email && email.trim().toLowerCase() !== doctor.user.email.toLowerCase()) {
      const emailConflict = await prisma.user.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          id: { not: doctor.userId },
        },
      });
      if (emailConflict) {
        return NextResponse.json(
          { error: 'Email này đã được sử dụng bởi tài khoản khác' },
          { status: 409 }
        );
      }
    }

    // Update User
    await prisma.user.update({
      where: { id: doctor.userId },
      data: {
        ...(fullName ? { fullName: fullName.trim() } : {}),
        ...(email ? { email: email.trim().toLowerCase() } : {}),
        ...(phone !== undefined ? { phone: phone.trim() } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl: avatarUrl.trim() } : {}),
      },
    });

    // Update DoctorInfo
    const updated = await prisma.doctorInfo.update({
      where: { id },
      data: {
        ...(specialtyId ? { specialtyId } : {}),
        ...(degree !== undefined ? { degree: degree.trim() } : {}),
        ...(experienceYears !== undefined ? { experienceYears: Number(experienceYears) } : {}),
        ...(bio !== undefined ? { bio: bio.trim() } : {}),
        ...(consultationFee !== undefined ? { consultationFee: Number(consultationFee) } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
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

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let doctorId = searchParams.get('id');

    if (!doctorId) {
      try {
        const body = await request.json();
        doctorId = body?.id;
      } catch (e) {
        // No body
      }
    }

    if (!doctorId) {
      return NextResponse.json({ error: 'Thiếu mã bác sĩ cần xóa (id)' }, { status: 400 });
    }

    const doctor = await prisma.doctorInfo.findUnique({
      where: { id: doctorId },
      include: { user: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin bác sĩ' }, { status: 404 });
    }

    const doctorName = doctor.user.fullName;
    const userId = doctor.userId;

    // 1. Mark active appointments as NEEDS_REASSIGNMENT & detach doctorId
    await prisma.appointment.updateMany({
      where: {
        doctorId: doctorId,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      data: {
        status: 'NEEDS_REASSIGNMENT',
        doctorId: null,
      },
    });

    // 2. Detach doctorId from any remaining appointments (completed/cancelled)
    await prisma.appointment.updateMany({
      where: { doctorId: doctorId },
      data: { doctorId: null },
    });

    // 3. Delete doctor schedules
    await prisma.doctorSchedule.deleteMany({
      where: { doctorId: doctorId },
    });

    // 4. Delete prescriptions of doctor's medical records
    const records = await prisma.medicalRecord.findMany({
      where: { doctorId: doctorId },
      select: { id: true },
    });
    const recordIds = records.map((r) => r.id);

    if (recordIds.length > 0) {
      await prisma.prescription.deleteMany({
        where: { medicalRecordId: { in: recordIds } },
      });
      await prisma.medicalRecord.deleteMany({
        where: { id: { in: recordIds } },
      });
    }

    // 5. Delete doctorInfo record
    await prisma.doctorInfo.delete({
      where: { id: doctorId },
    });

    // 6. Delete User account
    await prisma.user.delete({
      where: { id: userId },
    });

    // 7. Send notification to admin
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          message: `Bác sĩ ${doctorName} đã được xóa/cho ngừng công tác. Các lịch hẹn liên quan đã được chuyển sang trạng thái chờ điều phối lại.`,
          type: 'GENERAL',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa hồ sơ bác sĩ ${doctorName} thành công.`,
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa bác sĩ:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
