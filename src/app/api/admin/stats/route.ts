import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getVietnamDateString, getRecentDaysVN } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const todayStr = getVietnamDateString();
    const recent7Days = getRecentDaysVN(7);
    const recent14Days = getRecentDaysVN(14);

    // 1. Fetch all appointments with details
    const [allAppointments, specialties, doctors, totalPatients] = await Promise.all([
      prisma.appointment.findMany({
        include: {
          doctor: {
            include: {
              user: { select: { fullName: true, email: true, avatarUrl: true } },
            },
          },
          specialty: true,
          patient: { select: { fullName: true, phone: true } },
        },
        orderBy: { appointmentDate: 'desc' },
      }),
      prisma.specialty.findMany({
        include: {
          _count: { select: { doctors: true, appointments: true } },
        },
      }),
      prisma.doctorInfo.findMany({
        include: {
          user: { select: { fullName: true, email: true, avatarUrl: true } },
          specialty: { select: { name: true } },
          _count: { select: { appointments: true } },
        },
      }),
      prisma.user.count({ where: { role: 'PATIENT' } }),
    ]);

    // 2. Calculate Key Metrics
    const todayAppointments = allAppointments.filter((a) => a.appointmentDate === todayStr);
    const totalToday = todayAppointments.length;
    const completedToday = todayAppointments.filter((a) => a.status === 'COMPLETED').length;
    const confirmedToday = todayAppointments.filter((a) => a.status === 'CONFIRMED').length;
    const pendingToday = todayAppointments.filter((a) => a.status === 'PENDING').length;
    const cancelledToday = todayAppointments.filter((a) => a.status === 'CANCELLED').length;
    const needsReassignmentToday = todayAppointments.filter(
      (a) => a.status === 'NEEDS_REASSIGNMENT'
    ).length;

    const totalAllTime = allAppointments.length;
    const completedTotal = allAppointments.filter((a) => a.status === 'COMPLETED').length;
    const confirmedTotal = allAppointments.filter((a) => a.status === 'CONFIRMED').length;
    const pendingCount = allAppointments.filter((a) => a.status === 'PENDING').length;
    const cancelledCount = allAppointments.filter((a) => a.status === 'CANCELLED').length;
    const needsReassignmentCount = allAppointments.filter(
      (a) => a.status === 'NEEDS_REASSIGNMENT'
    ).length;

    // Revenue calculations (based on doctor consultationFee)
    const todayRevenue = todayAppointments
      .filter((a) => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
      .reduce((sum, a) => sum + (a.doctor?.consultationFee || 35), 0);

    const totalRevenue = allAppointments
      .filter((a) => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + (a.doctor?.consultationFee || 35), 0);

    const completionRate =
      totalAllTime > 0
        ? Math.round((completedTotal / (totalAllTime - cancelledCount || 1)) * 100)
        : 0;

    const cancellationRate =
      totalAllTime > 0 ? Math.round((cancelledCount / totalAllTime) * 100) : 0;

    // 3. Specialty Distribution
    const specialtyDistribution = specialties
      .map((s) => {
        const specAppts = allAppointments.filter((a) => a.specialtyId === s.id);
        const specCompleted = specAppts.filter((a) => a.status === 'COMPLETED').length;
        const specRevenue = specAppts
          .filter((a) => a.status === 'COMPLETED')
          .reduce((sum, a) => sum + (a.doctor?.consultationFee || 35), 0);

        return {
          id: s.id,
          name: s.name,
          count: specAppts.length,
          completedCount: specCompleted,
          doctorCount: s._count.doctors,
          revenue: specRevenue,
        };
      })
      .sort((a, b) => b.count - a.count);

    // 4. Status Distribution
    const statusDistribution = [
      { name: 'Đã hoàn thành', status: 'COMPLETED', count: completedTotal, fill: '#10b981' },
      { name: 'Đã xác nhận', status: 'CONFIRMED', count: confirmedTotal, fill: '#3b82f6' },
      { name: 'Chờ phân bác sĩ', status: 'PENDING', count: pendingCount, fill: '#f59e0b' },
      {
        name: 'Cần đổi bác sĩ',
        status: 'NEEDS_REASSIGNMENT',
        count: needsReassignmentCount,
        fill: '#ef4444',
      },
      { name: 'Đã hủy lịch', status: 'CANCELLED', count: cancelledCount, fill: '#94a3b8' },
    ];

    // 5. Weekly Trend (7 days) & 14-day Trend
    const weeklyTrend = recent7Days.map((day) => {
      const dayAppts = allAppointments.filter((a) => a.appointmentDate === day.dateStr);
      return {
        date: day.label,
        shortDate: day.shortLabel,
        dateStr: day.dateStr,
        count: dayAppts.length,
        completed: dayAppts.filter((a) => a.status === 'COMPLETED').length,
        confirmed: dayAppts.filter((a) => a.status === 'CONFIRMED').length,
        cancelled: dayAppts.filter((a) => a.status === 'CANCELLED').length,
      };
    });

    const trend14Days = recent14Days.map((day) => {
      const dayAppts = allAppointments.filter((a) => a.appointmentDate === day.dateStr);
      return {
        date: day.label,
        shortDate: day.shortLabel,
        dateStr: day.dateStr,
        count: dayAppts.length,
        completed: dayAppts.filter((a) => a.status === 'COMPLETED').length,
        confirmed: dayAppts.filter((a) => a.status === 'CONFIRMED').length,
        cancelled: dayAppts.filter((a) => a.status === 'CANCELLED').length,
      };
    });

    // 6. Doctor Workload & Leaderboard
    const doctorWorkload = doctors
      .map((d) => {
        const docAppts = allAppointments.filter((a) => a.doctorId === d.id);
        const docCompleted = docAppts.filter((a) => a.status === 'COMPLETED').length;
        const docRevenue = docAppts
          .filter((a) => a.status === 'COMPLETED')
          .reduce((sum, a) => sum + (d.consultationFee || 35), 0);

        return {
          id: d.id,
          name: d.user.fullName,
          avatarUrl: d.user.avatarUrl,
          specialty: d.specialty.name,
          degree: d.degree,
          appointments: docAppts.length,
          completed: docCompleted,
          revenue: docRevenue,
          consultationFee: d.consultationFee,
        };
      })
      .filter((d) => d.appointments > 0 || true)
      .sort((a, b) => b.appointments - a.appointments || b.completed - a.completed);

    // 7. Time Slot Distribution (Morning vs Afternoon vs Hourly)
    const slotStats: Record<string, number> = {};
    let morningCount = 0;
    let afternoonCount = 0;

    allAppointments.forEach((a) => {
      const time = a.appointmentTime || '08:00';
      const hour = parseInt(time.split(':')[0], 10);
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      slotStats[hourKey] = (slotStats[hourKey] || 0) + 1;

      if (hour < 12) {
        morningCount++;
      } else {
        afternoonCount++;
      }
    });

    const hourlyDistribution = Object.entries(slotStats)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    return NextResponse.json({
      todayStr,
      kpis: {
        totalToday,
        completedToday,
        confirmedToday,
        pendingToday,
        cancelledToday,
        needsReassignmentToday,
        totalAllTime,
        completedTotal,
        confirmedTotal,
        pendingCount,
        cancelledCount,
        needsReassignmentCount,
        totalRevenue,
        todayRevenue,
        completionRate,
        cancellationRate,
        totalDoctors: doctors.length,
        totalSpecialties: specialties.length,
        totalPatients,
      },
      specialtyDistribution,
      statusDistribution,
      doctorWorkload: doctorWorkload.slice(0, 10), // Top 10 doctors with workload
      topDoctors: doctorWorkload.filter((d) => d.appointments > 0),
      weeklyTrend,
      trend14Days,
      timeSlotOverview: {
        morningCount,
        afternoonCount,
        hourlyDistribution,
      },
    });
  } catch (error: any) {
    console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
