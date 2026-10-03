import { prisma } from '@/database/prisma';

export const AppointmentService = {
  /**
   * Lấy danh sách lịch hẹn theo điều kiện lọc
   */
  async getAppointments(filters: {
    phone?: string | null;
    doctorId?: string | null;
    date?: string | null;
    status?: string | null;
  }) {
    const where: any = {};

    if (filters.phone) {
      where.patientPhone = filters.phone;
    }
    if (filters.doctorId) {
      where.doctorId = filters.doctorId;
    }
    if (filters.date) {
      where.appointmentDate = filters.date;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    return prisma.appointment.findMany({
      where,
      include: {
        specialty: true,
        doctor: {
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
          },
        },
        medicalRecord: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });
  },

  /**
   * Cập nhật trạng thái lịch hẹn
   */
  async updateStatus(appointmentId: string, status: string) {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: status as any },
    });
  },
};
