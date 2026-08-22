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
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

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

export function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'COMPLETED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'NEEDS_REASSIGNMENT':
      return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'COMPLETED':
      return 'Đã hoàn thành khám';
    case 'PENDING':
      return 'Chờ sắp xếp bác sĩ';
    case 'CANCELLED':
      return 'Đã hủy lịch';
    case 'NEEDS_REASSIGNMENT':
      return 'Cần đổi bác sĩ gấp';
    default:
      return status;
  }
}
