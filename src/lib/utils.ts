import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Format as USD or VND nicely
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount * 25000); // 1 USD ~ 25,000 VND for display
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  // Chuỗi date YYYY-MM-DD nếu tạo new Date('YYYY-MM-DD') có thể bị lệch múi giờ UTC
  // Sử dụng cắt chuỗi hoặc format an toàn
  const parts = dateString.split('-');
  let date: Date;
  if (parts.length === 3) {
    // Năm, Tháng (0-indexed), Ngày theo giờ địa phương
    date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Trả về chuỗi ngày hôm nay YYYY-MM-DD theo múi giờ Việt Nam (Asia/Ho_Chi_Minh)
 */
export function getVietnamDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Trả về chuỗi ngày mai YYYY-MM-DD theo múi giờ Việt Nam
 */
export function getVietnamTomorrowString(): string {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return getVietnamDateString(tomorrow);
}

/**
 * Lấy danh sách N ngày gần nhất tính đến hôm nay theo múi giờ Việt Nam
 */
export function getRecentDaysVN(numDays: number = 7): { dateStr: string; label: string; shortLabel: string }[] {
  const days: { dateStr: string; label: string; shortLabel: string }[] = [];
  const now = new Date();

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = getVietnamDateString(d);

    const label = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }).format(d);

    const shortLabel = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
    }).format(d);

    days.push({ dateStr, label, shortLabel });
  }
  return days;
}

export const STANDARD_MORNING_SLOTS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
];

export const STANDARD_AFTERNOON_SLOTS = [
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

export const ALL_STANDARD_SLOTS = [
  ...STANDARD_MORNING_SLOTS,
  ...STANDARD_AFTERNOON_SLOTS,
];

export function generateTimeSlots(
  startTime: string = '08:00',
  endTime: string = '17:00',
  durationMinutes: number = 30
): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentMinute = startH * 60 + startM;
  const endMinute = endH * 60 + endM;

  while (currentMinute + durationMinutes <= endMinute) {
    const h = Math.floor(currentMinute / 60);
    const m = currentMinute % 60;
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    currentMinute += durationMinutes;
  }

  return slots;
}

export function getStatusBadgeStyle(status: string, apptOrHasDoctor?: any) {
  let hasDoctor = false;
  if (typeof apptOrHasDoctor === 'boolean') {
    hasDoctor = apptOrHasDoctor;
  } else if (apptOrHasDoctor && typeof apptOrHasDoctor === 'object') {
    hasDoctor = Boolean(apptOrHasDoctor.doctorId || apptOrHasDoctor.doctor);
  }

  switch (status) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'COMPLETED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PENDING':
      return hasDoctor
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'NEEDS_REASSIGNMENT':
      return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getStatusLabel(status: string, apptOrHasDoctor?: any) {
  let hasDoctor = false;
  if (typeof apptOrHasDoctor === 'boolean') {
    hasDoctor = apptOrHasDoctor;
  } else if (apptOrHasDoctor && typeof apptOrHasDoctor === 'object') {
    hasDoctor = Boolean(apptOrHasDoctor.doctorId || apptOrHasDoctor.doctor);
  }

  switch (status) {
    case 'CONFIRMED':
      return 'Đã xác nhận (Chờ khám)';
    case 'COMPLETED':
      return 'Đã hoàn thành khám';
    case 'PENDING':
      return hasDoctor ? 'Đã xác nhận (Chờ khám)' : 'Chờ sắp xếp bác sĩ';
    case 'CANCELLED':
      return 'Đã hủy lịch';
    case 'NEEDS_REASSIGNMENT':
      return 'Cần đổi bác sĩ gấp';
    default:
      return status;
  }
}
