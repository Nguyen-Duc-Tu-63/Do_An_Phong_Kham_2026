import { prisma } from '@/database/prisma';

export const AdminService = {
  /**
   * Tính toán các chỉ số thống kê tổng hợp cho ban quản trị
   */
  async getDashboardStats() {
    const [totalAppointments, totalDoctors, totalPatients, appointments] = await Promise.all([
      prisma.appointment.count(),
      prisma.doctorInfo.count(),
      prisma.user.count({ where: { role: 'PATIENT' } }),
      prisma.appointment.findMany({
        select: {
          id: true,
          status: true,
          appointmentDate: true,
          doctor: {
            select: {
              consultationFee: true,
            },
          },
        },
      }),
    ]);

    const totalRevenue = appointments
      .filter((a) => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + (a.doctor?.consultationFee || 350000), 0);

    const statusCounts = appointments.reduce(
      (acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalAppointments,
      totalDoctors,
      totalPatients,
      totalRevenue,
      statusCounts,
    };
  },
};
