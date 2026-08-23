'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Appointment, MedicalRecord, UserSession } from '@/types';
import { Tabs } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  FileText,
  Pill,
  User,
  Clock,
  Printer,
  XCircle,
  Stethoscope,
  Phone,
  Search,
  Sparkles,
  RefreshCw,
  LogIn,
  AlertCircle,
  Camera,
  Upload,
  Lock,
  Save,
  Check,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, getStatusBadgeStyle, getStatusLabel } from '@/lib/utils';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
];

function PatientDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [user, setUser] = useState<UserSession | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Phone lookup states (for guest visitors)
  const [inputPhone, setInputPhone] = useState<string>('');
  const [activePhone, setActivePhone] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState<{ fullName: string; phone: string; email?: string } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Profile Edit states
  const [editFullName, setEditFullName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // E-Prescription printable modal state
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<MedicalRecord | null>(null);

  const fetchAppointmentsByPhone = async (phoneToQuery: string) => {
    const cleanPhone = phoneToQuery.trim();
    if (!cleanPhone) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/appointments?phone=${encodeURIComponent(cleanPhone)}`);
      const apptData = await res.json();
      const apptsArr: Appointment[] = Array.isArray(apptData) ? apptData : [];

      setAppointments(apptsArr);
      const recsArr: MedicalRecord[] = apptsArr
        .filter((a) => a.medicalRecord)
        .map((a) => a.medicalRecord!);
      setRecords(recsArr);

      setActivePhone(cleanPhone);
      setHasSearched(true);

      if (apptsArr.length > 0 && apptsArr[0].patient) {
        const p = apptsArr[0].patient;
        setPatientInfo({
          fullName: p.fullName,
          phone: p.phone,
          email: p.email,
        });
        setEditFullName(p.fullName);
        setEditPhone(p.phone);
        setEditEmail(p.email || '');
        setEditAvatarUrl(p.avatarUrl || '');
      } else {
        setPatientInfo({
          fullName: 'Bệnh nhân',
          phone: cleanPhone,
        });
        setEditFullName('Bệnh nhân');
        setEditPhone(cleanPhone);
      }

      try {
        localStorage.setItem('careplus_patient_phone', cleanPhone);
      } catch (e) {}
    } catch (e) {
      console.error(e);
      toast.error('Lỗi khi tra cứu dữ liệu hồ sơ');
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initDashboard() {
      setLoading(true);
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        // 1. IF LOGGED IN USER
        if (meData.user) {
          setUser(meData.user);
          setActivePhone(meData.user.phone || '');
          setPatientInfo({
            fullName: meData.user.fullName,
            phone: meData.user.phone,
            email: meData.user.email,
          });
          setEditFullName(meData.user.fullName || '');
          setEditPhone(meData.user.phone || '');
          setEditEmail(meData.user.email || '');
          setEditAvatarUrl(meData.user.avatarUrl || '');

          // Fetch logged-in user appointments directly by patientId
          const apptRes = await fetch(`/api/appointments?patientId=${meData.user.id}`);
          const apptData = await apptRes.json();
          const apptsArr: Appointment[] = Array.isArray(apptData) ? apptData : [];
          setAppointments(apptsArr);
          const recsArr: MedicalRecord[] = apptsArr
            .filter((a) => a.medicalRecord)
            .map((a) => a.medicalRecord!);
          setRecords(recsArr);
          setHasSearched(true);
          setLoading(false);
          return;
        }

        // 2. GUEST VISITOR: Check URL query param
        const paramPhone = searchParams.get('phone');
        if (paramPhone) {
          setInputPhone(paramPhone);
          await fetchAppointmentsByPhone(paramPhone);
          return;
        }

        // 3. GUEST VISITOR: Check localStorage saved phone
        let savedPhone = '';
        try {
          savedPhone = localStorage.getItem('careplus_patient_phone') || '';
        } catch (e) {}

        if (savedPhone) {
          setInputPhone(savedPhone);
          await fetchAppointmentsByPhone(savedPhone);
          return;
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    initDashboard();
  }, [searchParams]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhone.trim()) {
      toast.error('Vui lòng nhập số điện thoại để tra cứu');
      return;
    }
    await fetchAppointmentsByPhone(inputPhone);
  };

  const handleResetSearch = () => {
    setActivePhone('');
    setInputPhone('');
    setHasSearched(false);
    setAppointments([]);
    setRecords([]);
    setPatientInfo(null);
    try {
      localStorage.removeItem('careplus_patient_phone');
    } catch (e) {}
    router.push('/dashboard');
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này?')) return;
    try {
      const res = await fetch(`/api/appointments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: apptId, status: 'CANCELLED' }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Lỗi khi hủy lịch hẹn');
        return;
      }
      toast.success('Đã hủy lịch hẹn thành công');
      if (user) {
        const apptRes = await fetch(`/api/appointments?patientId=${user.id}`);
        const apptData = await apptRes.json();
        const apptsArr: Appointment[] = Array.isArray(apptData) ? apptData : [];
        setAppointments(apptsArr);
        setRecords(apptsArr.filter((a) => a.medicalRecord).map((a) => a.medicalRecord!));
      } else if (activePhone) {
        await fetchAppointmentsByPhone(activePhone);
      } else {
        setAppointments((prev) =>
          prev.map((a) => (a.id === apptId ? { ...a, status: 'CANCELLED' } : a))
        );
      }
    } catch (e) {
      toast.error('Lỗi khi hủy lịch hẹn');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dung lượng ảnh tối đa là 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setEditAvatarUrl(result);
      toast.success('Đã tải ảnh lên! Hãy bấm "Lưu Thay Đổi Thông Tin" để hoàn tất cập nhật.');
    };
    reader.onerror = () => {
      toast.error('Lỗi khi đọc file ảnh từ thiết bị');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu thông tin cá nhân');
      return;
    }

    if (!editFullName.trim()) {
      toast.error('Họ và tên không được để trống');
      return;
    }
    if (!editPhone.trim() || editPhone.trim().length < 9) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ (10 số)');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error('Xác nhận mật khẩu mới không khớp');
        return;
      }
      if (!currentPassword) {
        toast.error('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới');
        return;
      }
    }

    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editFullName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
          avatarUrl: editAvatarUrl.trim(),
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Cập nhật thông tin cá nhân & ảnh đại diện thành công!');
        setUser(data.user);
        setPatientInfo({
          fullName: data.user.fullName,
          phone: data.user.phone,
          email: data.user.email,
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        toast.error(data.error || 'Cập nhật thất bại');
      }
    } catch (e) {
      toast.error('Lỗi kết nối máy chủ khi lưu hồ sơ');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const upcomingAppts = appointments.filter(
    (a) => a.status === 'PENDING' || a.status === 'CONFIRMED' || a.status === 'NEEDS_REASSIGNMENT'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. TOP PHONE LOOKUP BAR — ONLY SHOWN FOR GUEST / UNAUTHENTICATED USERS */}
      {!user && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/30 text-emerald-300 border border-emerald-400/40">
                <Phone className="w-3.5 h-3.5" /> Tra Cứu Hồ Sơ & Lịch Hẹn Trực Tuyến
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Theo Dõi Lịch Khám & Đơn Thuốc
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Nhập <strong>Số Điện Thoại</strong> bạn đã sử dụng khi đặt lịch khám để xem ngay tình trạng lịch hẹn, kết quả chẩn đoán và đơn thuốc điện tử.
              </p>
            </div>

            {/* Search Form Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5 bg-white/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md border border-white/20"
            >
              <div className="relative w-full sm:w-72">
                <Phone className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Nhập SĐT (Ví dụ: 0901234567)"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 font-bold placeholder:text-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <Button
                type="submit"
                isLoading={searching}
                className="w-full sm:w-auto bg-[#10b981] hover:bg-emerald-600 text-white font-bold px-5 py-2.5 shadow-md shadow-emerald-900/50 shrink-0"
              >
                <Search className="w-4 h-4 mr-1.5" /> Tra Cứu
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 2. LOADING STATE */}
      {loading ? (
        <Card className="p-8">
          <TableSkeleton rows={4} />
        </Card>
      ) : !user && !hasSearched && !activePhone ? (
        /* 3. GUEST MODE INITIAL LANDING (NO PHONE SEARCHED YET) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2 space-y-4 bg-white border-2 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Bạn Chưa Nhập Số Điện Thoại Tra Cứu
                </h3>
                <p className="text-xs text-slate-500">
                  Hãy nhập số điện thoại vào ô tìm kiếm ở trên để hệ thống tự động tải toàn bộ hồ sơ của bạn.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Tiện ích không cần mật khẩu:
              </p>
              <p className="leading-relaxed">
                Tại phòng khám CarePlus+, mọi bệnh nhân đều có thể theo dõi tiến độ xếp lịch, bác sĩ phụ trách và in đơn thuốc điện tử chỉ với <strong>Số Điện Thoại</strong> cá nhân.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button onClick={() => router.push('/book')}>
                <Calendar className="w-4 h-4 mr-1.5" /> Đặt Lịch Khám Mới Ngay
              </Button>
              <Link href="/login">
                <Button variant="outline">
                  <LogIn className="w-4 h-4 mr-1.5" /> Đăng Nhập Tài Khoản
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 bg-slate-50 border-2 border-slate-200 space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">
              Hỗ Trợ Bệnh Nhân 24/7
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Nếu bạn không nhớ số điện thoại đã đăng ký hoặc cần hỗ trợ thay đổi lịch hẹn, vui lòng liên hệ hotline tổng đài:
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 font-extrabold text-emerald-700 text-lg text-center">
              📞 090-123-4567
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Giờ làm việc: 08:00 - 17:00 hàng ngày
            </p>
          </Card>
        </div>
      ) : !user && appointments.length === 0 ? (
        /* 4. GUEST SEARCHED BUT NO APPOINTMENTS FOUND */
        <Card className="p-8 text-center space-y-6 max-w-2xl mx-auto border-2 border-amber-200 bg-amber-50/30">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">
              Không Tìm Thấy Lịch Hẹn Nào Với SĐT: {activePhone}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Số điện thoại này hiện chưa có dữ liệu lịch khám hoặc hồ sơ bệnh án nào trên hệ thống CarePlus+. Vui lòng kiểm tra lại số điện thoại hoặc đặt lịch khám mới.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button onClick={() => router.push(`/book`)} className="bg-emerald-600 hover:bg-emerald-700">
              <Calendar className="w-4 h-4 mr-1.5" /> Đặt Lịch Khám Mới Với SĐT Này
            </Button>
            <Button variant="outline" onClick={handleResetSearch}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Nhập Số Điện Thoại Khác
            </Button>
          </div>
        </Card>
      ) : (
        /* 5. PATIENT PROFILE & RECORDS (CLEAN & DIRECT FOR LOGGED IN PATIENT) */
        <div className="space-y-6">
          {/* Patient Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.avatarUrl || patientInfo?.phone ? (
                <img
                  src={
                    user?.avatarUrl ||
                    editAvatarUrl ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={user?.fullName || patientInfo?.fullName || 'Bệnh nhân'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#10b981] shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-500/20 shrink-0">
                  {patientInfo?.fullName ? patientInfo.fullName.charAt(0).toUpperCase() : 'BN'}
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {user?.fullName || patientInfo?.fullName || 'Bệnh Nhân'}
                  </h2>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    📱 {user?.phone || activePhone}
                  </span>
                  {user && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      Bệnh Nhân CarePlus+
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>Tổng số lượt khám: <strong>{appointments.length}</strong></span>
                  <span>•</span>
                  <span>Lịch sắp tới: <strong>{upcomingAppts.length}</strong></span>
                  <span>•</span>
                  <span>Đơn thuốc đã kê: <strong>{records.length}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {!user && (
                <Button variant="outline" size="sm" onClick={handleResetSearch} className="text-slate-600 border-slate-300">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Đổi SĐT Khác
                </Button>
              )}
              <Button size="sm" onClick={() => router.push('/book')} className="bg-[#10b981] hover:bg-emerald-600 font-bold px-4 py-2">
                <Calendar className="w-4 h-4 mr-1.5" /> Đặt Lịch Khám Mới
              </Button>
            </div>
          </div>

          {/* TABS CONTAINER */}
          <Card className="p-6">
            <Tabs
              tabs={[
                { id: 'upcoming', label: 'Lịch Hẹn Khám', count: upcomingAppts.length, icon: <Calendar className="w-4 h-4" /> },
                { id: 'history', label: 'Lịch Sử & Chẩn Đoán', count: records.length, icon: <FileText className="w-4 h-4" /> },
                { id: 'prescriptions', label: 'Đơn Thuốc Điện Tử', count: records.filter((r) => r.prescriptions && r.prescriptions.length > 0).length, icon: <Pill className="w-4 h-4" /> },
                ...(user ? [{ id: 'profile', label: 'Quản Lý Cá Nhân', icon: <User className="w-4 h-4" /> }] : []),
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="mb-6"
            />

            {/* TAB 1: UPCOMING APPOINTMENTS */}
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingAppts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Calendar className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Bạn hiện không có lịch hẹn khám nào sắp tới.</p>
                    <Button size="sm" onClick={() => router.push('/book')}>
                      Đặt Lịch Khám Ngay
                    </Button>
                  </div>
                ) : (
                  upcomingAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                              appt.status
                            )}`}
                          >
                            {getStatusLabel(appt.status)}
                          </span>
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                            Khoa: {appt.specialty?.name}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-800">
                          Bác Sĩ Phụ Trách:{' '}
                          {appt.doctor
                            ? appt.doctor.user.fullName
                            : 'Đang xếp bác sĩ (Tự động theo khoa)'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                            <Calendar className="w-4 h-4 text-[#4fc3a1]" /> {formatDate(appt.appointmentDate)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#4fc3a1]" /> Khung giờ: {appt.appointmentTime}
                          </span>
                        </div>

                        {appt.patientNotes && (
                          <p className="text-xs text-slate-500 italic">
                            Triệu chứng khai báo: "{appt.patientNotes}"
                          </p>
                        )}
                      </div>

                      {appt.status !== 'CANCELLED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="text-rose-500 hover:bg-rose-50 border border-rose-200 rounded-xl"
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Hủy Lịch Hẹn
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: MEDICAL HISTORY & DIAGNOSIS */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {records.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <FileText className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Chưa có hồ sơ khám bệnh nào hoàn tất.</p>
                  </div>
                ) : (
                  records.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">
                            Chẩn Đoán: {rec.diagnosis}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Bác sĩ khám: {rec.doctor?.user.fullName} ({rec.doctor?.specialty?.name})
                          </p>
                        </div>
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 w-fit">
                          {formatDate(rec.createdAt)}
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5 text-slate-600">
                        <p>
                          <strong className="text-slate-800">Triệu chứng lâm sàng:</strong> {rec.symptoms}
                        </p>
                        {rec.notes && (
                          <p>
                            <strong className="text-slate-800">Lời khuyên bác sĩ:</strong> {rec.notes}
                          </p>
                        )}
                      </div>

                      {rec.prescriptions && rec.prescriptions.length > 0 && (
                        <div className="pt-2 flex justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedRecordForPrint(rec)}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold"
                          >
                            <Pill className="w-3.5 h-3.5 mr-1" /> Xem Đơn Thuốc ({rec.prescriptions.length} Loại Thuốc)
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: E-PRESCRIPTIONS */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                {records.filter((r) => r.prescriptions && r.prescriptions.length > 0).length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Pill className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Chưa có đơn thuốc điện tử nào.</p>
                  </div>
                ) : (
                  records
                    .filter((r) => r.prescriptions && r.prescriptions.length > 0)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm">
                            Đơn thuốc kê bởi Bác Sĩ {rec.doctor?.user.fullName}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Ngày kê: {formatDate(rec.createdAt)} • Chẩn đoán: {rec.diagnosis}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {rec.prescriptions.map((p, idx) => (
                              <Badge key={idx} variant="emerald">
                                {p.medicineName} ({p.dosage})
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecordForPrint(rec)}
                          className="font-bold text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                        >
                          <Printer className="w-4 h-4 mr-1.5" /> In Đơn Thuốc PDF
                        </Button>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* TAB 4: QUẢN LÝ CÁ NHÂN & CHỈNH SỬA THÔNG TIN / AVATAR */}
            {activeTab === 'profile' && user && (
              <form onSubmit={handleSaveProfile} className="space-y-8 max-w-2xl">
                {/* 1. Avatar Section */}
                <div className="space-y-5 p-6 bg-slate-50/90 rounded-2xl border-2 border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <span>Ảnh Đại Diện (Avatar)</span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-emerald-800 bg-white border-2 border-emerald-300 hover:bg-emerald-50 font-bold shadow-xs cursor-pointer w-fit"
                    >
                      <Upload className="w-4 h-4 mr-1.5 text-emerald-600" /> Tải Ảnh Từ Máy Tính
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative cursor-pointer group shrink-0"
                      title="Bấm để tải ảnh mới từ máy tính của bạn"
                    >
                      <img
                        src={
                          editAvatarUrl ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
                        }
                        alt="Avatar Preview"
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-[#10b981] shadow-md group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-700">
                        Hoặc chọn nhanh một trong các ảnh đại diện mẫu:
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {AVATAR_PRESETS.map((presetUrl, idx) => {
                          const isSelected = editAvatarUrl === presetUrl;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditAvatarUrl(presetUrl)}
                              className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#10b981] ring-2 ring-emerald-300 scale-105'
                                  : 'border-slate-200 hover:border-emerald-400 opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img src={presetUrl} alt="preset" className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#10b981]/40 flex items-center justify-center text-white">
                                  <Check className="w-4 h-4 font-bold" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Input
                      label="Hoặc Nhập Đường Dẫn Link Ảnh (Image URL)"
                      placeholder="https://images.unsplash.com/..."
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. Personal Information Section */}
                <div className="space-y-4 p-6 bg-white rounded-2xl border-2 border-slate-200">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Thông Tin Cơ Bản</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Họ và Tên Bệnh Nhân *"
                      placeholder="Nguyễn Văn A"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      icon={<User className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Số Điện Thoại Đăng Nhập & Tra Cứu *"
                      type="tel"
                      placeholder="0901234567"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      icon={<Phone className="w-4 h-4 text-emerald-600" />}
                      required
                    />
                  </div>

                  <Input
                    label="Địa Chỉ Email Liên Hệ (Tùy chọn)"
                    type="email"
                    placeholder="benhnhan@example.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>

                {/* 3. Change Password Section */}
                <div className="space-y-4 p-6 bg-slate-50/80 rounded-2xl border-2 border-slate-200">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Đổi Mật Khẩu (Để trống nếu không muốn đổi)</span>
                  </div>

                  <Input
                    label="Mật Khẩu Hiện Tại"
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại nếu muốn đổi"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Mật Khẩu Mới (Ít nhất 6 ký tự)"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                    />

                    <Input
                      label="Xác Nhận Mật Khẩu Mới"
                      type="password"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    isLoading={isSavingProfile}
                    className="bg-[#10b981] hover:bg-emerald-600 font-bold px-8 py-3 text-sm shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi Thông Tin
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* PRINTABLE E-PRESCRIPTION MODAL */}
      <Dialog
        isOpen={!!selectedRecordForPrint}
        onClose={() => setSelectedRecordForPrint(null)}
        title="Đơn Thuốc Điện Tử Phê Duyệt"
        description="Phiếu khám bệnh & Đơn thuốc phòng khám CarePlus+"
        maxWidth="lg"
      >
        {selectedRecordForPrint && (
          <div className="space-y-6 p-2">
            <div className="flex justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Phòng Khám Đa Khoa CarePlus+</h3>
                <p className="text-xs text-slate-500">Số 123 Đường Y Học, Tòa nhà CarePlus+, TP.HCM</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#10b981]">MÃ ĐƠN: RX-{selectedRecordForPrint.id.substring(0, 8)}</p>
                <p className="text-xs text-slate-500">{formatDate(selectedRecordForPrint.createdAt)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-slate-400 font-semibold uppercase">Bác Sĩ Kê Đơn</p>
                <p className="font-bold text-slate-800 text-sm">
                  {selectedRecordForPrint.doctor?.user.fullName}
                </p>
                <p className="text-slate-600">{selectedRecordForPrint.doctor?.degree}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase">Bệnh Nhân</p>
                <p className="font-bold text-slate-800 text-sm">{user?.fullName || patientInfo?.fullName || 'Bệnh nhân'}</p>
                <p className="text-slate-600">SĐT: {user?.phone || activePhone} • Chẩn đoán: {selectedRecordForPrint.diagnosis}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Danh Mục Thuốc Kê Đơn & Liều Dùng
              </h4>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase">
                    <th className="pb-2">Tên Thuốc</th>
                    <th className="pb-2">Hàm Lượng</th>
                    <th className="pb-2">Cách Dùng</th>
                    <th className="pb-2">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRecordForPrint.prescriptions.map((med, idx) => (
                    <tr key={idx} className="text-slate-800 font-semibold">
                      <td className="py-2.5">{med.medicineName}</td>
                      <td className="py-2.5">{med.dosage}</td>
                      <td className="py-2.5">{med.frequency}</td>
                      <td className="py-2.5">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedRecordForPrint(null)}>
                Đóng
              </Button>
              <Button onClick={() => window.print()} className="bg-[#10b981] hover:bg-emerald-600">
                <Printer className="w-4 h-4 mr-1.5" /> In Đơn Thuốc PDF
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Đang tải hồ sơ y tế...</div>}>
      <PatientDashboardContent />
    </Suspense>
  );
}
