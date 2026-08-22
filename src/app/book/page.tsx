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
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils';

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSpecialty = searchParams.get('specialtyId') || '';
  const initialDoctor = searchParams.get('doctorId') || '';

  const [step, setStep] = useState<number>(1);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorInfo[]>([]);
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
        setAvailableSlots(data.availableSlots || []);
        if (selectedTime && !data.availableSlots?.includes(selectedTime)) {
          form.setValue('appointmentTime', '');
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* BƯỚC 2: CHỌN NGÀY & GIỜ KHÁM */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Bước 2: Chọn Ngày & Giờ Khám</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn ngày khám để xem các khung giờ còn nhận lịch hẹn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột chọn ngày */}
                <div className="space-y-3">
                  <Input
                    label="Ngày Khám Bệnh *"
                    type="date"
                    min={todayStr}
                    {...form.register('appointmentDate')}
                    error={form.formState.errors.appointmentDate?.message}
                    icon={<CalendarIcon className="w-4 h-4" />}
                  />
                  <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                    💡 Khung giờ làm việc: 08:00 - 17:00 (Thứ 2 - Thứ 6) và 08:00 - 12:00 (Thứ 7).
                  </div>
                </div>

                {/* Cột chọn khung giờ */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Khung Giờ Còn Trống *
                  </label>

                  {loadingSlots ? (
                    <div className="py-8 text-center text-xs text-slate-400">Đang tìm giờ trống...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                      Ngày này hiện đã hết suất khám. Vui lòng chọn ngày khám khác.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => form.setValue('appointmentTime', slot)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#4fc3a1] text-white shadow-sm ring-2 ring-emerald-200'
                                : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-[#4fc3a1] border border-slate-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {slot}
                          </button>
                        );
                      })}
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
                  Số điện thoại là mã định danh chính để bạn theo dõi hồ sơ khám bệnh trực tuyến.
                </p>
              </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mô Tả Triệu Chứng / Lý Do Khám (Không bắt buộc)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                  placeholder="Ví dụ: Đau đầu kéo dài 2 ngày, sốt nhẹ..."
                  {...form.register('patientNotes')}
                />
              </div>

              {/* Tóm tắt phiếu đặt */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Tóm Tắt Thông Tin Đặt Lịch:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <p><strong>Chuyên Khoa:</strong> {selectedSpecialtyObj?.name}</p>
                  <p>
                    <strong>Bác Sĩ:</strong>{' '}
                    {selectedBookingType === 'AUTO_ASSIGN' || !selectedDoctorObj
                      ? 'Hệ thống tự xếp bác sĩ'
                      : selectedDoctorObj.user.fullName}
                  </p>
                  <p className="text-emerald-700 font-bold">
                    <strong>Thời Gian:</strong> {formatDate(selectedDate)} lúc {selectedTime}
                  </p>
                  <p><strong>Bệnh Nhân:</strong> {form.getValues('fullName')} ({form.getValues('phone')})</p>
                </div>
              </div>
            </div>
          )}

          {/* NÚT CHUYỂN BƯỚC */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Quay Lại
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={handleNextStep}>
                Tiếp Theo <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting} size="lg" className="px-8 shadow-lg">
                Xác Nhận Đặt Lịch Khám
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
