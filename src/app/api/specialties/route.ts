import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const specialties = await prisma.specialty.findMany({
      include: {
        _count: {
          select: { doctors: true, appointments: true },
        },
      },
      orderBy: { name: 'asc' },
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

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Tên chuyên khoa không được để trống' }, { status: 400 });
    }

    // Check duplicate name
    const existing = await prisma.specialty.findFirst({
      where: { name: { equals: name.trim() } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Tên chuyên khoa này đã tồn tại trong hệ thống' },
        { status: 409 }
      );
    }

    const specialty = await prisma.specialty.create({
      data: {
        name: name.trim(),
        description: description?.trim() || 'Chuyên khoa khám và điều trị chuyên sâu.',
        iconUrl: iconUrl?.trim() || 'Stethoscope',
      },
      include: {
        _count: { select: { doctors: true, appointments: true } },
      },
    });

    return NextResponse.json(specialty, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, iconUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã chuyên khoa (id)' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Tên chuyên khoa không được để trống' }, { status: 400 });
    }

    const existing = await prisma.specialty.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy chuyên khoa' }, { status: 404 });
    }

    // Check duplicate name on another specialty
    const nameConflict = await prisma.specialty.findFirst({
      where: {
        name: name.trim(),
        id: { not: id },
      },
    });

    if (nameConflict) {
      return NextResponse.json(
        { error: 'Tên chuyên khoa này đã tồn tại trong hệ thống' },
        { status: 409 }
      );
    }

    const updated = await prisma.specialty.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description !== undefined ? description.trim() : existing.description,
        iconUrl: iconUrl !== undefined ? iconUrl.trim() : existing.iconUrl,
      },
      include: {
        _count: { select: { doctors: true, appointments: true } },
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
    let specialtyId = searchParams.get('id');

    if (!specialtyId) {
      try {
        const body = await request.json();
        specialtyId = body?.id;
      } catch (e) {
        // No body
      }
    }

    if (!specialtyId) {
      return NextResponse.json({ error: 'Thiếu mã chuyên khoa cần xóa (id)' }, { status: 400 });
    }

    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
      include: {
        doctors: { include: { user: true } },
        appointments: true,
      },
    });

    if (!specialty) {
      return NextResponse.json({ error: 'Không tìm thấy chuyên khoa' }, { status: 404 });
    }

    const specName = specialty.name;
    const doctorIds = specialty.doctors.map((d) => d.id);
    const userIds = specialty.doctors.map((d) => d.userId);

    // 1. Delete associated doctors' schedules & medical records
    if (doctorIds.length > 0) {
      await prisma.doctorSchedule.deleteMany({
        where: { doctorId: { in: doctorIds } },
      });

      const records = await prisma.medicalRecord.findMany({
        where: { doctorId: { in: doctorIds } },
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
    }

    // 2. Clean up appointments in this specialty
    const apptIds = specialty.appointments.map((a) => a.id);
    if (apptIds.length > 0) {
      await prisma.notification.deleteMany({
        where: { appointmentId: { in: apptIds } },
      });

      const apptMedRecords = await prisma.medicalRecord.findMany({
        where: { appointmentId: { in: apptIds } },
        select: { id: true },
      });
      const apptMedRecordIds = apptMedRecords.map((m) => m.id);
      if (apptMedRecordIds.length > 0) {
        await prisma.prescription.deleteMany({
          where: { medicalRecordId: { in: apptMedRecordIds } },
        });
        await prisma.medicalRecord.deleteMany({
          where: { id: { in: apptMedRecordIds } },
        });
      }

      await prisma.appointment.deleteMany({
        where: { id: { in: apptIds } },
      });
    }

    // 3. Delete DoctorInfo records
    if (doctorIds.length > 0) {
      await prisma.doctorInfo.deleteMany({
        where: { id: { in: doctorIds } },
      });
    }

    // 4. Delete Users of these doctors
    if (userIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });
    }

    // 5. Delete Specialty
    await prisma.specialty.delete({
      where: { id: specialtyId },
    });

    // 6. Notify Admin
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          message: `Chuyên khoa "${specName}" và các dữ liệu liên quan đã được xóa khỏi hệ thống.`,
          type: 'GENERAL',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa chuyên khoa "${specName}" thành công.`,
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa chuyên khoa:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
