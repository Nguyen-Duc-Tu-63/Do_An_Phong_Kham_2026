'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, DoctorInfo, Specialty, UserSession, NotificationItem } from '@/types';
import { Tabs } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
  Shield,
  Calendar,
  AlertOctagon,
  Stethoscope,
  Users,
  Plus,
  BarChart3,
  CheckCircle2,
  Filter,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, formatCurrency, getStatusBadgeStyle, getStatusLabel } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserSession | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('');
  const [filterDoctor, setFilterDoctor] = useState<string>('');

  // Modals
  const [assignAppt, setAssignAppt] = useState<Appointment | null>(null);
  const [selectedDoctorForAssign, setSelectedDoctorForAssign] = useState<string>('');
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  // Reassignment Modal
  const [reassignAppt, setReassignAppt] = useState<Appointment | null>(null);
  const [reassignDoctorId, setReassignDoctorId] = useState<string>('');
  const [reassignDate, setReassignDate] = useState<string>('');
  const [reassignTime, setReassignTime] = useState<string>('');
  const [isSubmittingReassign, setIsSubmittingReassign] = useState(false);

  // Add Specialty Modal
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecDesc, setNewSpecDesc] = useState('');

  // Add Doctor Modal
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocDegree, setNewDocDegree] = useState('');
  const [newDocExp, setNewDocExp] = useState(5);
  const [newDocFee, setNewDocFee] = useState(40);
  const [newDocBio, setNewDocBio] = useState('');

  const loadAdminData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();

      if (!meData.user || meData.user.role !== 'ADMIN') {
        toast.error('Giao diện dành riêng cho Quản lý / Lễ tân');
        router.push('/login');
        return;
      }
      setUser(meData.user);

      const [statsRes, apptsRes, docsRes, specsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/appointments'),
        fetch('/api/doctors'),
        fetch('/api/specialties'),
      ]);

      const statsData = await statsRes.json();
      const apptsData = await apptsRes.json();
      const docsData = await docsRes.json();
      const specsData = await specsRes.json();

      setStats(statsData);
      setAppointments(Array.isArray(apptsData) ? apptsData : []);
      setDoctors(Array.isArray(docsData) ? docsData : []);
      setSpecialties(Array.isArray(specsData) ? specsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterSpecialty && a.specialtyId !== filterSpecialty) return false;
    if (filterDoctor && a.doctorId !== filterDoctor) return false;
    return true;
  });

  const needsReassignmentAppts = appointments.filter((a) => a.status === 'NEEDS_REASSIGNMENT');

  const handleAssignDoctorSubmit = async () => {
    if (!assignAppt || !selectedDoctorForAssign) {
      toast.error('Vui lòng chọn bác sĩ để phân công');
      return;
    }

    setIsSubmittingAssign(true);
    try {
      const res = await fetch('/api/appointments/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: assignAppt.id,
          doctorId: selectedDoctorForAssign,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Đã phân công bác sĩ & xác nhận lịch hẹn!');
        setAssignAppt(null);
        setSelectedDoctorForAssign('');
        loadAdminData();
      } else {
        toast.error(data.error || 'Phân công bác sĩ thất bại');
      }
    } catch (e) {
      toast.error('Lỗi phân công bác sĩ');
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  const handleReassignSubmit = async () => {
    if (!reassignAppt || !reassignDoctorId) {
      toast.error('Vui lòng chọn bác sĩ thay thế');
      return;
    }

    setIsSubmittingReassign(true);
    try {
      const res = await fetch('/api/appointments/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: reassignAppt.id,
          doctorId: reassignDoctorId,
          appointmentDate: reassignDate || reassignAppt.appointmentDate,
          appointmentTime: reassignTime || reassignAppt.appointmentTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Đã chuyển bác sĩ thay thế thành công!');
        setReassignAppt(null);
        loadAdminData();
      } else {
        toast.error(data.error || 'Đổi bác sĩ thất bại');
      }
    } catch (e) {
      toast.error('Lỗi đổi bác sĩ');
    } finally {
      setIsSubmittingReassign(false);
    }
  };

  const handleCreateSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/specialties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSpecName, description: newSpecDesc }),
      });
      if (res.ok) {
        toast.success('Đã tạo chuyên khoa mới');
        setIsSpecialtyModalOpen(false);
        setNewSpecName('');
        setNewSpecDesc('');
        loadAdminData();
      }
    } catch (e) {
      toast.error('Lỗi tạo chuyên khoa');
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newDocName,
          email: newDocEmail,
          phone: newDocPhone,
          specialtyId: newDocSpecialty,
          degree: newDocDegree,
          experienceYears: newDocExp,
          consultationFee: newDocFee,
          bio: newDocBio,
        }),
      });
      if (res.ok) {
        toast.success('Đã tạo thông tin bác sĩ mới!');
        setIsDoctorModalOpen(false);
        loadAdminData();
      }
    } catch (e) {
      toast.error('Lỗi tạo bác sĩ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ADMIN HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#4fc3a1] text-white flex items-center justify-center font-bold shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{user?.fullName}</h1>
              <Badge variant="emerald" className="bg-[#4fc3a1]/20 text-[#4fc3a1] border-[#4fc3a1]/30">
                Giao Diện Quản Lý / Lễ Tân
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Trung tâm điều hành phòng khám • Phân công bác sĩ • Thống kê & Quản lý lịch hẹn
            </p>
          </div>
        </div>

        {needsReassignmentAppts.length > 0 && (
          <Button
            variant="danger"
            onClick={() => setActiveTab('reassignment')}
            className="animate-bounce"
          >
            <AlertOctagon className="w-4 h-4 mr-1.5" />
            Có {needsReassignmentAppts.length} Lịch Cần Đổi Bác Sĩ Gấp!
          </Button>
        )}
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-white border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Tổng Hôm Nay</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {stats?.kpis?.totalToday ?? 0} Lịch Khám
          </p>
        </Card>

        <Card className="p-4 bg-white border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Đã Khám Xong</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats?.kpis?.completedToday ?? 0} Ca Khám
          </p>
        </Card>

        <Card className="p-4 bg-white border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Chờ Phân Bác Sĩ</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {stats?.kpis?.pendingCount ?? 0} Lịch Đặt
          </p>
        </Card>

        <Card className="p-4 bg-white border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase">Đã Hủy</p>
          <p className="text-2xl font-bold text-slate-500 mt-1">
            {stats?.kpis?.cancelledCount ?? 0} Lịch Hủy
          </p>
        </Card>

        <Card className="p-4 bg-rose-50 border-rose-200">
          <p className="text-xs font-semibold text-rose-600 uppercase">Cần Đổi Bác Sĩ Gấp</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">
            {stats?.kpis?.needsReassignmentCount ?? 0} Báo Bận
          </p>
        </Card>
      </div>

      {/* ADMIN TABS */}
      <Card className="p-6">
        <Tabs
          tabs={[
            { id: 'dashboard', label: 'Thống Kê Biểu Đồ', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'appointments', label: 'Bảng Tổng Hợp Lịch Hẹn', count: appointments.length, icon: <Calendar className="w-4 h-4" /> },
            { id: 'reassignment', label: 'Xử Lý Đổi Lịch Khẩn', count: needsReassignmentAppts.length, icon: <AlertOctagon className="w-4 h-4" /> },
            { id: 'specialties', label: 'Quản Lý Chuyên Khoa', count: specialties.length, icon: <Layers className="w-4 h-4" /> },
            { id: 'doctors', label: 'Quản Lý Bác Sĩ', count: doctors.length, icon: <Stethoscope className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {loading ? (
          <TableSkeleton rows={6} />
        ) : (
          <div>
            {/* TAB 1: THỐNG KÊ BIỂU ĐỒ */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-5 border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Số Lịch Khám Theo Chuyên Khoa</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.specialtyDistribution || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#4fc3a1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-5 border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Xu Hướng Lịch Khám 7 Ngày</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats?.weeklyTrend || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#4fc3a1"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#4fc3a1' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 2: BẢNG TỔNG HỢP LỊCH HẸN */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                {/* FILTERS */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Lọc Theo Trạng Thái"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ sắp xếp bác sĩ</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="COMPLETED">Đã hoàn thành khám</option>
                    <option value="NEEDS_REASSIGNMENT">Cần đổi bác sĩ gấp</option>
                    <option value="CANCELLED">Đã hủy lịch</option>
                  </Select>

                  <Select
                    label="Lọc Theo Chuyên Khoa"
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                  >
                    <option value="">Tất cả chuyên khoa</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Lọc Theo Bác Sĩ"
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                  >
                    <option value="">Tất cả bác sĩ</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.user.fullName}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Bệnh Nhân</th>
                        <th className="p-3.5">Chuyên Khoa</th>
                        <th className="p-3.5">Bác Sĩ Phụ Trách</th>
                        <th className="p-3.5">Ngày & Giờ Khám</th>
                        <th className="p-3.5">Trạng Thái</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">
                            {appt.patient?.fullName}
                            <span className="block text-[11px] font-normal text-slate-500">
                              {appt.patient?.phone}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-700">{appt.specialty?.name}</td>
                          <td className="p-3.5 font-semibold text-slate-700">
                            {appt.doctor ? appt.doctor.user.fullName : (
                              <span className="text-amber-600 font-bold">Chưa phân công (Tự động)</span>
                            )}
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800">
                            {formatDate(appt.appointmentDate)} lúc {appt.appointmentTime}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadgeStyle(
                                appt.status,
                                appt
                              )}`}
                            >
                              {getStatusLabel(appt.status, appt)}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {appt.status === 'PENDING' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setAssignAppt(appt);
                                  setSelectedDoctorForAssign('');
                                }}
                              >
                                Phân Bác Sĩ
                              </Button>
                            )}
                            {appt.status === 'NEEDS_REASSIGNMENT' && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  setReassignAppt(appt);
                                  setReassignDoctorId('');
                                  setReassignDate(appt.appointmentDate);
                                  setReassignTime(appt.appointmentTime);
                                }}
                              >
                                Đổi Bác Sĩ Gấp
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: XỬ LÝ ĐỔI LỊCH KHẨN */}
            {activeTab === 'reassignment' && (
              <div className="space-y-4">
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-center gap-3">
                  <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-rose-900 text-sm">Trung Tâm Xử Lý Lịch Đổi Khẩn Cấp</h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      Các ca khám bệnh nhân đã đặt bị bác sĩ báo bận đột xuất cần Lễ tân phân công bác sĩ khác hoặc hẹn lại giờ khám ngay.
                    </p>
                  </div>
                </div>

                {needsReassignmentAppts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                    <p className="text-sm font-semibold mt-2">Hiện tại không có lịch hẹn nào bị báo bận khẩn!</p>
                  </div>
                ) : (
                  needsReassignmentAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-5 rounded-2xl border-2 border-rose-200 bg-white hover:shadow-soft transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <Badge variant="rose">CẦN XỬ LÝ GẤP</Badge>
                        <h4 className="font-bold text-slate-800 text-base">
                          Bệnh nhân: {appt.patient?.fullName} (Khoa: {appt.specialty?.name})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Giờ khám ban đầu: {formatDate(appt.appointmentDate)} lúc {appt.appointmentTime}
                        </p>
                      </div>

                      <Button
                        variant="danger"
                        onClick={() => {
                          setReassignAppt(appt);
                          setReassignDoctorId('');
                          setReassignDate(appt.appointmentDate);
                          setReassignTime(appt.appointmentTime);
                        }}
                      >
                        Phân Bác Sĩ Thay Thế
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: QUẢN LÝ CHUYÊN KHOA */}
            {activeTab === 'specialties' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-base">Danh Sách Chuyên Khoa Khám</h3>
                  <Button onClick={() => setIsSpecialtyModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Thêm Chuyên Khoa Mới
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specialties.map((s) => (
                    <Card key={s.id} className="p-5">
                      <h4 className="font-bold text-slate-800 text-base">{s.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{s.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: QUẢN LÝ BÁC SĨ */}
            {activeTab === 'doctors' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-base">Danh Sách Bác Sĩ Phụ Trách</h3>
                  <Button onClick={() => setIsDoctorModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Thêm Bác Sĩ Mới
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doc) => (
                    <Card key={doc.id} className="p-5 flex items-start gap-4">
                      <img
                        src={
                          doc.user.avatarUrl ||
                          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={doc.user.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-emerald-200"
                      />
                      <div className="space-y-1">
                        <Badge variant="emerald">{doc.specialty?.name}</Badge>
                        <h4 className="font-bold text-slate-800 text-sm">{doc.user.fullName}</h4>
                        <p className="text-xs text-slate-500">{doc.degree}</p>
                        <p className="text-xs font-semibold text-[#4fc3a1]">
                          Giá khám: {formatCurrency(doc.consultationFee)} • KN: {doc.experienceYears} năm
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ASSIGN DOCTOR MODAL */}
      <Dialog
        isOpen={!!assignAppt}
        onClose={() => setAssignAppt(null)}
        title="Phân Công Bác Sĩ Khám Bệnh"
        description="Chọn bác sĩ còn lịch trống cho thời gian bệnh nhân đã chọn."
        maxWidth="md"
      >
        {assignAppt && (
          <div className="space-y-6 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 border border-slate-200">
              <p>
                <strong className="text-slate-800">Chuyên Khoa:</strong> {assignAppt.specialty?.name}
              </p>
              <p>
                <strong className="text-slate-800">Thời Gian:</strong>{' '}
                {formatDate(assignAppt.appointmentDate)} lúc {assignAppt.appointmentTime}
              </p>
              <p>
                <strong className="text-slate-800">Bệnh Nhân:</strong> {assignAppt.patient?.fullName}
              </p>
            </div>

            <Select
              label="Chọn Bác Sĩ Phụ Trách Khám *"
              value={selectedDoctorForAssign}
              onChange={(e) => setSelectedDoctorForAssign(e.target.value)}
            >
              <option value="">Chọn bác sĩ...</option>
              {doctors
                .filter((d) => d.specialtyId === assignAppt.specialtyId)
                .map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user.fullName} ({doc.degree})
                  </option>
                ))}
            </Select>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAssignAppt(null)}>
                Hủy
              </Button>
              <Button isLoading={isSubmittingAssign} onClick={handleAssignDoctorSubmit}>
                Xác Nhận Phân Bác Sĩ
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* REASSIGN DOCTOR MODAL */}
      <Dialog
        isOpen={!!reassignAppt}
        onClose={() => setReassignAppt(null)}
        title="Phân Bác Sĩ Thay Thế Khẩn Cấp"
        description="Đổi bác sĩ khám thay thế cho ca bị báo bận đột xuất."
        maxWidth="md"
      >
        {reassignAppt && (
          <div className="space-y-4 pt-2">
            <Select
              label="Bác Sĩ Khám Thay Thế *"
              value={reassignDoctorId}
              onChange={(e) => setReassignDoctorId(e.target.value)}
            >
              <option value="">Select replacement doctor...</option>
              {doctors
                .filter((d) => d.specialtyId === reassignAppt.specialtyId)
                .map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user.fullName} ({doc.degree})
                  </option>
                ))}
            </Select>

            <Input
              type="date"
              label="Ngày Khám Hẹn Lại"
              value={reassignDate}
              onChange={(e) => setReassignDate(e.target.value)}
            />

            <Input
              type="text"
              label="Giờ Khám (Ví dụ: 15:00)"
              value={reassignTime}
              onChange={(e) => setReassignTime(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setReassignAppt(null)}>
                Hủy
              </Button>
              <Button
                variant="danger"
                isLoading={isSubmittingReassign}
                onClick={handleReassignSubmit}
              >
                Xác Nhận Đổi Bác Sĩ
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ADD SPECIALTY MODAL */}
      <Dialog
        isOpen={isSpecialtyModalOpen}
        onClose={() => setIsSpecialtyModalOpen(false)}
        title="Tạo Chuyên Khoa Mới"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSpecialty} className="space-y-4 pt-2">
          <Input
            label="Tên Chuyên Khoa *"
            placeholder="Ví dụ: Thần kinh học"
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô Tả Chuyên Khoa *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
              placeholder="Mô tả các bệnh lý khoa tiếp nhận..."
              value={newSpecDesc}
              onChange={(e) => setNewSpecDesc(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsSpecialtyModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu Chuyên Khoa</Button>
          </div>
        </form>
      </Dialog>

      {/* ADD DOCTOR MODAL */}
      <Dialog
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        title="Thêm Hồ Sơ Bác Sĩ Mới"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Họ và Tên Bác Sĩ *"
              placeholder="Ví dụ: Dr. Nguyễn Văn B"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              required
            />
            <Input
              label="Địa Chỉ Email *"
              type="email"
              placeholder="bacsib@clinic.com"
              value={newDocEmail}
              onChange={(e) => setNewDocEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số Điện Thoại *"
              placeholder="0912345678"
              value={newDocPhone}
              onChange={(e) => setNewDocPhone(e.target.value)}
              required
            />
            <Select
              label="Chuyên Khoa Phụ Trách *"
              value={newDocSpecialty}
              onChange={(e) => setNewDocSpecialty(e.target.value)}
              required
            >
              <option value="">Chọn Chuyên Khoa</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Bằng Cấp / Học Vị *"
              placeholder="Ví dụ: Thạc sĩ, Bác sĩ CKI"
              value={newDocDegree}
              onChange={(e) => setNewDocDegree(e.target.value)}
              required
            />
            <Input
              type="number"
              label="Kinh Nghiệm (Năm) *"
              value={newDocExp}
              onChange={(e) => setNewDocExp(Number(e.target.value))}
              required
            />
            <Input
              type="number"
              label="Giá Khám Tư Vấn ($) *"
              value={newDocFee}
              onChange={(e) => setNewDocFee(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tóm Tắt Tiểu Sử Bác Sĩ *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
              placeholder="Kinh nghiệm khám chữa bệnh..."
              value={newDocBio}
              onChange={(e) => setNewDocBio(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsDoctorModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu Hồ Sơ Bác Sĩ</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
