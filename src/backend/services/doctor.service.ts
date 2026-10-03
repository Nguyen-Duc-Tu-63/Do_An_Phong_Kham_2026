import { prisma } from '@/database/prisma';

export const DoctorService = {
  /**
   * Lấy danh sách tất cả bác sĩ (kèm chuyên khoa và lịch trực)
   */
  async getAllDoctors(specialtyId?: string | null) {
    const whereClause: any = {};
    if (specialtyId) {
      whereClause.specialtyId = specialtyId;
    }

    return prisma.doctorInfo.findMany({
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
  },

  /**
   * Lấy chi tiết thông tin một bác sĩ theo ID
   */
  async getDoctorById(id: string) {
    return prisma.doctorInfo.findUnique({
      where: { id },
      include: {
        user: true,
        specialty: true,
        schedules: true,
      },
    });
  },

  /**
   * Lấy danh sách tất cả chuyên khoa
   */
  async getAllSpecialties() {
    return prisma.specialty.findMany({
      include: {
        _count: {
          select: { doctors: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  },
};
