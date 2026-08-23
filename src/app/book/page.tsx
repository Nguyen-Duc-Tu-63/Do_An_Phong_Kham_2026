'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormValues } from '@/lib/validations';
import { Specialty, DoctorInfo, UserSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  formatCurrency,
  formatDate,
  ALL_STANDARD_SLOTS,
  STANDARD_MORNING_SLOTS,
  STANDARD_AFTERNOON_SLOTS,
} from '@/lib/utils';

interface SlotItem {
  time: string;
  available: boolean;
  period: 'MORNING' | 'AFTERNOON';
  reason?: string;
}

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSpecialty = searchParams.get('specialtyId') || '';
  const initialDoctor = searchParams.get('doctorId') || '';

  const [step, setStep] = useState<number>(1);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorInfo[]>([]);
  const [allSlots, setAllSlots] = useState<SlotItem[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      specialtyId: initialSpecialty,
      doctorId: initialDoctor || null,
      bookingType: initialDoctor ? 'SELF_SELECTED' : 'AUTO_ASSIGN',
      appointmentDate: todayStr,
      appointmentTime: '',
      fullName: '',
      email: '',
      phone: '',
      patientNotes: '',
    },
  });

  const selectedSpecialtyId = form.watch('specialtyId');
  const selectedDoctorId = form.watch('doctorId');
  const selectedBookingType = form.watch('bookingType');
  const selectedDate = form.watch('appointmentDate');
  const selectedTime = form.watch('appointmentTime');
  const watchedFullName = form.watch('fullName');
  const watchedPhone = form.watch('phone');
  const watchedEmail = form.watch('email');
  const watchedPatientNotes = form.watch('patientNotes');

  useEffect(() => {
    async function initData() {
      try {
        const [specRes, meRes] = await Promise.all([
          fetch('/api/specialties'),
          fetch('/api/auth/me'),
        ]);
        const specData = await specRes.json();
        const meData = await meRes.json();

        setSpecialties(Array.isArray(specData) ? specData : []);
        if (meData.user) {
          setCurrentUser(meData.user);
          form.setValue('fullName', meData.user.fullName);
          form.setValue('email', meData.user.email);
          form.setValue('phone', meData.user.phone);
        }
      } catch (e) {
        console.error(e);
      }
    }
    initData();
  }, [form]);

  useEffect(() => {
    if (!selectedSpecialtyId) {
      setFilteredDoctors([]);
      return;
    }
    async function loadDoctors() {
      try {
        const res = await fetch(`/api/doctors?specialtyId=${selectedSpecialtyId}`);
        const data = await res.json();
        setFilteredDoctors(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    }
    loadDoctors();
  }, [selectedSpecialtyId]);

  useEffect(() => {
    if (!selectedSpecialtyId || !selectedDate) {
      setAllSlots([]);
      setAvailableSlots([]);
      return;
    }
    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const docParam =
          selectedBookingType === 'AUTO_ASSIGN' || !selectedDoctorId
            ? 'AUTO_ASSIGN'
            : selectedDoctorId;

        const res = await fetch(
          `/api/appointments/available-slots?date=${selectedDate}&specialtyId=${selectedSpecialtyId}&doctorId=${docParam}`
        );
        const data = await res.json();

        if (data.allSlots && Array.isArray(data.allSlots)) {
          setAllSlots(data.allSlots);
          const avList: string[] = data.availableSlots || [];
          setAvailableSlots(avList);
          if (selectedTime && !avList.includes(selectedTime)) {
            form.setValue('appointmentTime', '');
          }
        } else {
          const avSlots: string[] = data.availableSlots || [];
          const fullSlots: SlotItem[] = ALL_STANDARD_SLOTS.map((time) => ({
            time,
            available: avSlots.includes(time),
            period: STANDARD_MORNING_SLOTS.includes(time) ? 'MORNING' : 'AFTERNOON',
          }));
          setAllSlots(fullSlots);
          setAvailableSlots(avSlots);
          if (selectedTime && !avSlots.includes(selectedTime)) {
            form.setValue('appointmentTime', '');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedSpecialtyId, selectedDoctorId, selectedBookingType, selectedDate]);

  const handleNextStep = async () => {
    if (step === 1) {
      const validSpec = await form.trigger('specialtyId');
      if (!validSpec) {
        toast.error('Vui lòng chọn chuyên khoa khám');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const validDate = await form.trigger('appointmentDate');
      const validTime = await form.trigger('appointmentTime');
      if (!validDate || !validTime) {
        if (!selectedTime) toast.error('Vui lòng chọn khung giờ khám còn trống');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (values: BookingFormValues) => {
    if (step !== 3) {
      handleNextStep();
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        const phoneNum = values.phone.trim();
        try {
          localStorage.setItem('careplus_patient_phone', phoneNum);
        } catch (e) {}
        toast.success(`Đặt lịch khám thành công! Bạn có thể dùng SĐT ${phoneNum} để theo dõi hồ sơ.`);
        router.push(`/dashboard?phone=${encodeURIComponent(phoneNum)}`);
      } else {
        toast.error(data.error || 'Đặt lịch thất bại');
      }
    } catch (e: any) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNextStep();
      return;
    }
    form.handleSubmit(onSubmit)(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'textarea') {
        return;
      }
      e.preventDefault();
      if (step < 3) {
        handleNextStep();
      }
    }
  };

  const selectedSpecialtyObj = specialties.find((s) => s.id === selectedSpecialtyId);
  const selectedDoctorObj = filteredDoctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <Badge variant="emerald" className="px-3 py-1 text-xs font-semibold">
          Đặt Lịch Khám Đơn Giản 3 Bước
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900">Đặt Lịch Khám Bệnh Trực Tuyến</h1>
        <p className="text-slate-500 text-sm">
          Chọn chuyên khoa, thời gian khám và hoàn tất thông tin cá nhân.
        </p>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 max-w-2xl mx-auto">
        {[
          { num: 1, label: '1. Chọn Khoa & Bác Sĩ' },
          { num: 2, label: '2. Chọn Ngày & Giờ' },
          { num: 3, label: '3. Thông Tin & Xác Nhận' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s.num
                  ? 'bg-[#4fc3a1] text-white ring-4 ring-emerald-100'
                  : step > s.num
                  ? 'bg-emerald-100 text-[#4fc3a1]'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? 'text-slate-900 font-bold' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* FORM CARD */}
      <Card className="p-6 md:p-8 shadow-card">
        <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown} className="space-y-6">
          {/* BƯỚC 1: CHỌN KHOA & BÁC SĨ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Bước 1: Chọn Chuyên Khoa & Bác Sĩ</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn khoa muốn khám, sau đó chọn bác sĩ cụ thể hoặc để hệ thống tự động sắp xếp.
                </p>
              </div>

              {/* Danh sách Chuyên Khoa */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Chọn Chuyên Khoa Khám *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specialties.map((spec) => {
                    const isSelected = selectedSpecialtyId === spec.id;
                    return (
                      <div
                        key={spec.id}
                        onClick={() => form.setValue('specialtyId', spec.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-[#4fc3a1] bg-emerald-50/70 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                            isSelected
                              ? 'bg-[#4fc3a1] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{spec.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{spec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {form.formState.errors.specialtyId && (
                  <p className="text-xs text-rose-500 font-medium">
                    {form.formState.errors.specialtyId.message}
                  </p>
                )}
              </div>

              {/* Lựa Chọn Bác Sĩ (Nếu đã chọn Khoa) */}
              {selectedSpecialtyId && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Hình Thức Xếp Bác Sĩ *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Tùy chọn 1: Hệ thống tự động xếp bác sĩ */}
                    <div
                      onClick={() => {
                        form.setValue('bookingType', 'AUTO_ASSIGN');
                        form.setValue('doctorId', null);
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedBookingType === 'AUTO_ASSIGN'
                          ? 'border-[#4fc3a1] bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#4fc3a1]/20 text-[#4fc3a1] flex items-center justify-center font-bold">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Hệ Thống Tự Động Xếp</p>
                          <p className="text-[11px] text-slate-500">
                            Phòng khám tự chọn bác sĩ giỏi đang còn lịch trống phù hợp nhất.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tùy chọn 2: Tự chọn bác sĩ theo ý muốn */}
                    <div
                      onClick={() => form.setValue('bookingType', 'SELF_SELECTED')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedBookingType === 'SELF_SELECTED'
                          ? 'border-[#4fc3a1] bg-emerald-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Tự Chọn Bác Sĩ Cụ Thể</p>
                          <p className="text-[11px] text-slate-500">
                            Chọn bác sĩ bạn tin tưởng trong danh sách dưới đây.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách Bác Sĩ nếu chọn SELF_SELECTED */}
                  {selectedBookingType === 'SELF_SELECTED' && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold text-slate-700">
                        Danh sách bác sĩ thuộc khoa {selectedSpecialtyObj?.name}:
                      </p>
                      {filteredDoctors.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Chưa có bác sĩ nào thuộc chuyên khoa này.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredDoctors.map((doc) => {
                            const isDoctorSelected = selectedDoctorId === doc.id;
                            return (
                              <div
                                key={doc.id}
                                onClick={() => form.setValue('doctorId', doc.id)}
                                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                  isDoctorSelected
                                    ? 'border-[#4fc3a1] bg-emerald-50/70 shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                              >
                                <img
                                  src={
                                    doc.user.avatarUrl ||
                                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80'
                                  }
                                  alt={doc.user.fullName}
                                  className="w-12 h-12 rounded-xl object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-slate-800 text-xs truncate">
                                    {doc.user.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-500">{doc.degree}</p>
                                  <p className="text-[11px] font-semibold text-[#4fc3a1]">
                                    {formatCurrency(doc.consultationFee)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BƯỚC 2: CHỌN NGÀY & TẤT CẢ CÁC SUẤT KHÁM */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Bước 2: Chọn Ngày & Suất Khám Bệnh</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn ngày khám và khung giờ phù hợp. Toàn bộ các suất khám sáng và chiều đều được hiển thị đầy đủ.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột chọn ngày (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Ngày Khám Bệnh *
                    </label>
                    <Input
                      type="date"
                      min={todayStr}
                      {...form.register('appointmentDate')}
                      error={form.formState.errors.appointmentDate?.message}
                      icon={<CalendarIcon className="w-4 h-4" />}
                    />
                  </div>

                  {/* Quick Date Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Chọn nhanh ngày khám:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((offset) => {
                        const d = new Date(Date.now() + offset * 86400000);
                        const dStr = d.toISOString().split('T')[0];
                        const label = offset === 0 ? 'Hôm Nay' : offset === 1 ? 'Ngày Mai' : `+2 Ngày`;
                        const isSelected = selectedDate === dStr;
                        return (
                          <button
                            key={offset}
                            type="button"
                            onClick={() => form.setValue('appointmentDate', dStr)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="text-[11px]">{label}</div>
                            <div className="text-[10px] font-normal opacity-80">{d.getDate()}/{d.getMonth() + 1}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Thời gian phục vụ phòng khám:
                    </p>
                    <p className="text-[11px] leading-relaxed text-emerald-800">
                      • <strong>Ca Sáng:</strong> 08:00 – 11:30 (Khám 30 phút/suất)
                      <br />
                      • <strong>Ca Chiều:</strong> 13:30 – 17:00 (Khám 30 phút/suất)
                      <br />
                      • Phục vụ <strong>tất cả các ngày trong tuần</strong> (Thứ 2 – Chủ Nhật).
                    </p>
                  </div>
                </div>

                {/* Cột chọn suất khám (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Tất Cả Các Suất Khám ({allSlots.length} Khung Giờ) *
                    </label>
                    {selectedDate && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {formatDate(selectedDate)}
                      </span>
                    )}
                  </div>

                  {loadingSlots ? (
                    <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p>Đang tải danh sách các suất khám...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 1. CA SÁNG */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200/80 pb-2">
                          <span className="flex items-center gap-1.5 text-amber-700 font-extrabold">
                            <Sun className="w-4 h-4 text-amber-500" /> 🌅 Ca Sáng (08:00 – 11:30)
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {allSlots.filter((s) => s.period === 'MORNING' && s.available).length}/8 suất trống
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {allSlots
                            .filter((s) => s.period === 'MORNING')
                            .map((slot) => {
                              const isSelected = selectedTime === slot.time;
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => form.setValue('appointmentTime', slot.time)}
                                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                                    isSelected
                                      ? 'bg-[#10b981] text-white border-[#10b981] shadow-md ring-2 ring-emerald-300 scale-[1.02]'
                                      : slot.available
                                      ? 'bg-white text-slate-800 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 border-slate-200 shadow-xs'
                                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60 line-through'
                                  }`}
                                  title={slot.available ? `Suất khám lúc ${slot.time}` : slot.reason || 'Đã kín lịch'}
                                >
                                  <span className="flex items-center gap-1">
                                    {isSelected ? (
                                      <Check className="w-3 h-3 text-white" />
                                    ) : (
                                      <Clock className="w-3 h-3 text-slate-400" />
                                    )}
                                    {slot.time}
                                  </span>
                                  <span
                                    className={`text-[10px] font-normal ${
                                      isSelected
                                        ? 'text-emerald-100 font-semibold'
                                        : slot.available
                                        ? 'text-emerald-600'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {isSelected ? 'Đang chọn' : slot.available ? 'Còn chỗ' : 'Đã kín'}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* 2. CA CHIỀU */}
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200/80 pb-2">
                          <span className="flex items-center gap-1.5 text-teal-800 font-extrabold">
                            <Moon className="w-4 h-4 text-teal-600" /> 🌇 Ca Chiều (13:30 – 17:00)
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {allSlots.filter((s) => s.period === 'AFTERNOON' && s.available).length}/8 suất trống
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {allSlots
                            .filter((s) => s.period === 'AFTERNOON')
                            .map((slot) => {
                              const isSelected = selectedTime === slot.time;
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => form.setValue('appointmentTime', slot.time)}
                                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                                    isSelected
                                      ? 'bg-[#10b981] text-white border-[#10b981] shadow-md ring-2 ring-emerald-300 scale-[1.02]'
                                      : slot.available
                                      ? 'bg-white text-slate-800 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 border-slate-200 shadow-xs'
                                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60 line-through'
                                  }`}
                                  title={slot.available ? `Suất khám lúc ${slot.time}` : slot.reason || 'Đã kín lịch'}
                                >
                                  <span className="flex items-center gap-1">
                                    {isSelected ? (
                                      <Check className="w-3 h-3 text-white" />
                                    ) : (
                                      <Clock className="w-3 h-3 text-slate-400" />
                                    )}
                                    {slot.time}
                                  </span>
                                  <span
                                    className={`text-[10px] font-normal ${
                                      isSelected
                                        ? 'text-emerald-100 font-semibold'
                                        : slot.available
                                        ? 'text-emerald-600'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {isSelected ? 'Đang chọn' : slot.available ? 'Còn chỗ' : 'Đã kín'}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Chú thích Legend */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1 pt-1 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-md bg-[#10b981]" /> Đang chọn
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-md bg-white border border-slate-300" /> Còn trống
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300" /> Đã kín lịch
                          </span>
                        </div>

                        {selectedTime && (
                          <span className="text-emerald-700 font-bold">
                            ✓ Đã chọn: {selectedTime}
                          </span>
                        )}
                      </div>

                      {form.formState.errors.appointmentTime && (
                        <p className="text-xs text-rose-500 font-medium">
                          {form.formState.errors.appointmentTime.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 3: THÔNG TIN & XÁC NHẬN (ƯU TIÊN SỐ ĐIỆN THOẠI) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Bước 3: Điền Thông Tin & Xác Nhận</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kiểm tra thông tin cá nhân và khai báo triệu chứng / lý do khám trước khi hoàn tất đặt lịch.
                </p>
              </div>

              {/* LOGGED IN USER ALERT IF ANY */}
              {currentUser && (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-900 shadow-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      Đang sử dụng thông tin tài khoản: <strong>{currentUser.fullName}</strong> ({currentUser.phone})
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-700 bg-sky-100 px-2.5 py-1 rounded-lg font-medium self-start sm:self-auto">
                    💡 Bạn có thể chỉnh sửa nếu đặt lịch khám cho người thân
                  </span>
                </div>
              )}

              {/* PHONE HIGHLIGHT BANNER */}
              <div className="p-4 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                    Số Điện Thoại Là Khóa Định Danh Tra Cứu Quan Trọng Nhất
                  </h4>
                  <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed font-medium">
                    Sau khi đặt lịch thành công, bạn có thể tra cứu trạng thái lịch hẹn, đơn thuốc và hồ sơ bệnh án trực tuyến bất cứ lúc nào bằng <strong>chính Số Điện Thoại này</strong> mà không cần nhớ mật khẩu phức tạp!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Số Điện Thoại Nhận Tin & Tra Cứu Hồ Sơ (10 Số) *"
                  placeholder="Ví dụ: 0901234567"
                  {...form.register('phone')}
                  error={form.formState.errors.phone?.message}
                  icon={<Phone className="w-4 h-4 text-emerald-600 font-bold" />}
                  className="border-emerald-300 focus:border-emerald-500 font-bold text-slate-800"
                />

                <Input
                  label="Họ và Tên Bệnh Nhân *"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...form.register('fullName')}
                  error={form.formState.errors.fullName?.message}
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Email Nhận Thông Báo (Tùy chọn/Nếu có)"
                type="email"
                placeholder="benhnhan@example.com"
                {...form.register('email')}
                error={form.formState.errors.email?.message}
                icon={<Mail className="w-4 h-4" />}
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mô Tả Triệu Chứng / Lý Do Khám (Tùy chọn)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[11px] text-slate-500 font-medium self-center mr-1">Gợi ý nhanh:</span>
                  {['Sốt nhẹ, mệt mỏi', 'Đau đầu, chóng mặt', 'Ho dai dẳng', 'Đau bụng âm ỉ', 'Khám sức khỏe tổng quát', 'Tái khám định kỳ'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const current = form.getValues('patientNotes') || '';
                        const updated = current ? `${current}, ${chip}` : chip;
                        form.setValue('patientNotes', updated);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-[#0d9488] hover:border-emerald-300 border border-slate-200 text-slate-600 text-[11px] rounded-lg transition-all"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                  placeholder="Ví dụ: Đau đầu kéo dài 2 ngày, sốt nhẹ, người mệt mỏi..."
                  {...form.register('patientNotes')}
                />
              </div>

              {/* Tóm tắt phiếu đặt */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                  <span>Tóm Tắt Thông Tin Phiếu Đặt Lịch:</span>
                  <Badge variant="emerald" className="text-[10px]">Sẵn sàng đặt</Badge>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <p><strong>Chuyên Khoa:</strong> <span className="text-slate-800 font-semibold">{selectedSpecialtyObj?.name || 'Chưa chọn'}</span></p>
                  <p>
                    <strong>Bác Sĩ:</strong>{' '}
                    <span className="text-slate-800 font-semibold">
                      {selectedBookingType === 'AUTO_ASSIGN' || !selectedDoctorObj
                        ? 'Hệ thống tự xếp bác sĩ'
                        : selectedDoctorObj.user.fullName}
                    </span>
                  </p>
                  <p className="text-emerald-700 font-bold">
                    <strong>Thời Gian Khám:</strong> {formatDate(selectedDate)} lúc {selectedTime || 'Chưa chọn giờ'}
                  </p>
                  <p>
                    <strong>Bệnh Nhân:</strong>{' '}
                    <span className="text-slate-800 font-semibold">
                      {watchedFullName || 'Chưa nhập tên'} ({watchedPhone || 'Chưa có SĐT'})
                    </span>
                  </p>
                </div>
                {watchedPatientNotes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-700">
                    <strong>Triệu chứng:</strong> <span className="italic">"{watchedPatientNotes}"</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NÚT CHUYỂN BƯỚC */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <Button key="prev-step-btn" type="button" variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Quay Lại
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button key="next-step-btn" type="button" onClick={handleNextStep}>
                Tiếp Theo <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                key="submit-booking-btn"
                type="submit"
                isLoading={isSubmitting}
                size="lg"
                className="px-8 shadow-lg bg-[#10b981] hover:bg-emerald-600 font-bold"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Xác Nhận Đặt Lịch Khám
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Đang tải cổng đặt lịch...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}
