'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, DoctorSchedule, UserSession } from '@/types';
import { Tabs } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
  Stethoscope,
  Clock,
  UserCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  FileCheck2,
  CheckCircle,
  Pill,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, getStatusBadgeStyle, getStatusLabel } from '@/lib/utils';

interface MedicineRow {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export default function DoctorPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('queue');
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING'>('ALL');
  const [user, setUser] = useState<UserSession | null>(null);
  const [allAppts, setAllAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Consultation Modal State
  const [consultAppt, setConsultAppt] = useState<Appointment | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [consultNotes, setConsultNotes] = useState('');
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    { medicineName: '', dosage: '', frequency: '', duration: '', notes: '' },
  ]);
  const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);

  // Urgent Unavailability Modal State
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [urgentReason, setUrgentReason] = useState('');
  const [isSubmittingUrgent, setIsSubmittingUrgent] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadDoctorData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();

      if (!meData.user || meData.user.role !== 'DOCTOR') {
        toast.error('Giao diện dành riêng cho tài khoản Bác sĩ');
        router.push('/login');
        return;
      }
      setUser(meData.user);

      if (meData.user.doctorId) {
        const apptRes = await fetch(`/api/appointments?doctorId=${meData.user.doctorId}`);
        const apptData = await apptRes.json();
        const arr: Appointment[] = Array.isArray(apptData) ? apptData : [];
        setAllAppts(arr);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  // Filter groups
  const waitingAppts = allAppts
    .filter(
      (a) =>
        a.status === 'PENDING' ||
        a.status === 'CONFIRMED' ||
        a.status === 'NEEDS_REASSIGNMENT'
    )
    .sort((a, b) => {
      const dateCmp = a.appointmentDate.localeCompare(b.appointmentDate);
      if (dateCmp !== 0) return dateCmp;
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });

  const todayWaitingAppts = waitingAppts.filter((a) => a.appointmentDate === todayStr);
  const futureWaitingAppts = waitingAppts.filter((a) => a.appointmentDate > todayStr);

  const todayTotalAppts = allAppts.filter(
    (a) => a.appointmentDate === todayStr && a.status !== 'CANCELLED'
  );
  const todayCompletedCount = todayTotalAppts.filter((a) => a.status === 'COMPLETED').length;
  const todayWaitingCount = todayWaitingAppts.length;

  const completedAppts = allAppts.filter((a) => a.status === 'COMPLETED');
  const cancelledAppts = allAppts.filter((a) => a.status === 'CANCELLED');

  // Filtered queue based on sub-filter
  const filteredWaitingAppts = waitingAppts.filter((a) => {
    if (queueFilter === 'TODAY') return a.appointmentDate === todayStr;
    if (queueFilter === 'UPCOMING') return a.appointmentDate > todayStr;
    return true;
  });

  const handleOpenConsultation = (appt: Appointment) => {
    setConsultAppt(appt);
    setSymptoms(appt.patientNotes || '');
    setDiagnosis('');
    setConsultNotes('');
    setMedicines([{ medicineName: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof MedicineRow, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultAppt) return;
    if (!symptoms.trim() || !diagnosis.trim()) {
      toast.error('Vui lòng nhập đầy đủ triệu chứng và chẩn đoán');
      return;
    }

    const validMedicines = medicines.filter((m) => m.medicineName.trim() !== '');

    setIsSubmittingConsult(true);
    try {
      const res = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: consultAppt.id,
          symptoms,
          diagnosis,
          notes: consultNotes,
          prescriptions: validMedicines,
        }),
      });

      if (res.ok) {
        toast.success('Đã hoàn thành khám bệnh & phát hành đơn thuốc điện tử!');
        setConsultAppt(null);
        loadDoctorData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Lưu hồ sơ thất bại');
      }
    } catch (e) {
      toast.error('Lỗi lưu thông tin');
    } finally {
      setIsSubmittingConsult(false);
    }
  };

  const handleReportUrgentUnavailability = async () => {
    if (!urgentReason.trim()) {
      toast.error('Vui lòng nhập lý do báo bận');
      return;
    }

    setIsSubmittingUrgent(true);
    try {
      const res = await fetch('/api/doctor/urgent-unavailability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: user?.doctorId,
          reason: urgentReason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.warning(data.message);
        setIsUrgentModalOpen(false);
        setUrgentReason('');
        loadDoctorData();
      } else {
        toast.error(data.error || 'Báo bận thất bại');
      }
    } catch (e) {
      toast.error('Lỗi báo bận');
    } finally {
      setIsSubmittingUrgent(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.fullName}</h1>
              <Badge variant="emerald">Giao Diện Bác Sĩ</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bàn làm việc Bác sĩ • Hôm nay: {formatDate(todayStr)} ({todayTotalAppts.length} ca khám)
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={() => setIsUrgentModalOpen(true)}
          className="shadow-md"
        >
          <AlertTriangle className="w-4 h-4 mr-1.5" /> Báo Đột Xuất Bận Khám
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* STAT 1: WAITING APPOINTMENTS */}
        <Card className="flex items-center gap-4 p-5 border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4fc3a1] flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Lịch Hẹn Chờ Khám</p>
            <p className="text-2xl font-bold text-slate-800">{waitingAppts.length} Bệnh nhân</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Hôm nay: <strong>{todayWaitingCount}</strong> ca • Sắp tới: <strong>{futureWaitingAppts.length}</strong> ca
            </p>
          </div>
        </Card>

        {/* STAT 2: TODAY APPOINTMENTS */}
        <Card className="flex items-center gap-4 p-5 border-2 border-teal-100 hover:border-teal-300 transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Lịch Khám Hôm Nay</p>
            <p className="text-2xl font-bold text-slate-800">{todayTotalAppts.length} Bệnh nhân</p>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">
              Chờ khám: <strong>{todayWaitingCount}</strong> • Đã khám: <strong>{todayCompletedCount}</strong>
            </p>
          </div>
        </Card>

        {/* STAT 3: COMPLETED CONSULTATIONS */}
        <Card className="flex items-center gap-4 p-5 border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Đã Khám Xong</p>
            <p className="text-2xl font-bold text-slate-800">{completedAppts.length} Bệnh nhân</p>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">
              Tổng số hồ sơ & đơn thuốc đã kê
            </p>
          </div>
        </Card>
      </div>

      {/* TABS CONTAINER */}
      <Card className="p-6">
        <Tabs
          tabs={[
            {
              id: 'queue',
              label: 'Hàng Chờ & Lịch Khám',
              count: waitingAppts.length,
              icon: <UserCheck className="w-4 h-4" />,
            },
            {
              id: 'history',
              label: 'Lịch Sử Đã Khám & Bệnh Án',
              count: completedAppts.length,
              icon: <FileCheck2 className="w-4 h-4" />,
            },
            {
              id: 'cancelled',
              label: 'Lịch Đã Hủy',
              count: cancelledAppts.length,
              icon: <Trash2 className="w-4 h-4" />,
            },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div>
            {/* TAB 1: WAITING QUEUE & UPCOMING APPOINTMENTS */}
            {activeTab === 'queue' && (
              <div className="space-y-4">
                {/* SUB-FILTER BUTTONS */}
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 mr-1">Bộ lọc:</span>
                  <button
                    type="button"
                    onClick={() => setQueueFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      queueFilter === 'ALL'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả chờ khám ({waitingAppts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueFilter('TODAY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      queueFilter === 'TODAY'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Hôm nay ({todayWaitingAppts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueFilter('UPCOMING')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      queueFilter === 'UPCOMING'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Lịch sắp tới ({futureWaitingAppts.length})
                  </button>
                </div>

                {filteredWaitingAppts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <UserCheck className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">
                      {queueFilter === 'TODAY'
                        ? 'Không có lịch hẹn khám nào cần tiếp nhận hôm nay.'
                        : queueFilter === 'UPCOMING'
                        ? 'Không có lịch hẹn khám sắp tới nào.'
                        : 'Hiện tại không có bệnh nhân nào đang chờ khám.'}
                    </p>
                  </div>
                ) : (
                  filteredWaitingAppts.map((appt) => {
                    const isToday = appt.appointmentDate === todayStr;
                    return (
                      <div
                        key={appt.id}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
                          isToday
                            ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400'
                            : 'border-slate-200 bg-white hover:border-emerald-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            {isToday ? (
                              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                🟢 Hôm Nay lúc {appt.appointmentTime}
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                {formatDate(appt.appointmentDate)} lúc {appt.appointmentTime}
                              </span>
                            )}

                            <span
                              className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                                appt.status,
                                appt
                              )}`}
                            >
                              {getStatusLabel(appt.status, appt)}
                            </span>

                            {appt.specialty?.name && (
                              <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                                Khoa: {appt.specialty.name}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              Bệnh Nhân: {appt.patient?.fullName}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              SĐT: <strong>{appt.patient?.phone || 'Chưa cập nhật'}</strong> • Email: {appt.patient?.email || 'N/A'}
                            </p>
                          </div>

                          {appt.patientNotes && (
                            <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                              Triệu chứng khai báo: "{appt.patientNotes}"
                            </p>
                          )}
                        </div>

                        <div>
                          {appt.status === 'NEEDS_REASSIGNMENT' ? (
                            <Badge variant="rose" className="px-3 py-1 text-xs font-bold">
                              Đã Báo Đổi Bác Sĩ Gấp
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleOpenConsultation(appt)}
                              className="bg-emerald-600 hover:bg-emerald-700 font-bold px-4 py-2.5 shadow-md shadow-emerald-900/10"
                            >
                              <Stethoscope className="w-4 h-4 mr-1.5" /> Bắt Đầu Khám & Kê Đơn
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: COMPLETED MEDICAL RECORDS */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {completedAppts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <FileCheck2 className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Chưa có ca khám bệnh nào được hoàn tất.</p>
                  </div>
                ) : (
                  completedAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-3 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">
                              {formatDate(appt.appointmentDate)} lúc {appt.appointmentTime}
                            </span>
                            <Badge variant="blue" className="text-xs font-bold">
                              ✓ Đã Khám & Kê Đơn Xong
                            </Badge>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">
                            Bệnh nhân: {appt.patient?.fullName} ({appt.patient?.phone})
                          </h4>
                        </div>
                      </div>

                      {appt.medicalRecord && (
                        <div className="text-xs space-y-2 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p>
                            <strong className="text-slate-900">Triệu chứng lâm sàng:</strong>{' '}
                            {appt.medicalRecord.symptoms}
                          </p>
                          <p>
                            <strong className="text-emerald-800 font-bold">Chẩn đoán y khoa:</strong>{' '}
                            <span className="font-bold text-slate-900">{appt.medicalRecord.diagnosis}</span>
                          </p>
                          {appt.medicalRecord.notes && (
                            <p>
                              <strong className="text-slate-900">Lời khuyên bác sĩ:</strong>{' '}
                              {appt.medicalRecord.notes}
                            </p>
                          )}

                          {appt.medicalRecord.prescriptions && appt.medicalRecord.prescriptions.length > 0 && (
                            <div className="pt-2 border-t border-slate-200 mt-2">
                              <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                                <Pill className="w-3.5 h-3.5 text-emerald-600" /> Đơn thuốc đã kê ({appt.medicalRecord.prescriptions.length} loại thuốc):
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {appt.medicalRecord.prescriptions.map((p, idx) => (
                                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                                    <span className="font-bold text-slate-800">
                                      {idx + 1}. {p.medicineName}
                                    </span>{' '}
                                    ({p.dosage})
                                    <p className="text-slate-500 mt-0.5">
                                      {p.frequency} • {p.duration}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: CANCELLED APPOINTMENTS */}
            {activeTab === 'cancelled' && (
              <div className="space-y-4">
                {cancelledAppts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Trash2 className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Không có lịch hẹn nào bị hủy.</p>
                  </div>
                ) : (
                  cancelledAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">
                            {formatDate(appt.appointmentDate)} lúc {appt.appointmentTime}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-600">
                            Đã Hủy Lịch
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">
                          Bệnh nhân: {appt.patient?.fullName} ({appt.patient?.phone})
                        </h4>
                        {appt.patientNotes && (
                          <p className="text-xs text-slate-500 italic">
                            Triệu chứng ban đầu: "{appt.patientNotes}"
                          </p>
                        )}
                      </div>

                      <span className="text-xs text-slate-400 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                        Bệnh nhân đã hủy lịch hẹn
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* CONSULTATION MODAL */}
      <Dialog
        isOpen={!!consultAppt}
        onClose={() => setConsultAppt(null)}
        title={`Khám Bệnh: ${consultAppt?.patient?.fullName}`}
        description="Nhập triệu chứng, chẩn đoán y khoa và thêm đơn thuốc điện tử."
        maxWidth="2xl"
      >
        {consultAppt && (
          <form onSubmit={handleSubmitConsultation} className="space-y-6 pt-2">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Triệu Chứng Lâm Sàng *
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                  placeholder="Mô tả triệu chứng của bệnh nhân..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Chẩn Đoán Y Khoa *
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                  placeholder="Nhập kết luận chẩn đoán..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Lời Khuyên Bác Sĩ & Chế Độ Sinh Hoạt (Không bắt buộc)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                  placeholder="Ví dụ: Uống 2 lít nước/ngày, tái khám sau 4 tuần..."
                  value={consultNotes}
                  onChange={(e) => setConsultNotes(e.target.value)}
                />
              </div>
            </div>

            {/* DYNAMIC MEDICINES */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-[#4fc3a1]" /> Đơn Thuốc Điện Tử (Danh Sách Thuốc)
                </h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMedicine}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm Thuốc
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Thuốc #{idx + 1}</span>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Tên Thuốc *"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        value={med.medicineName}
                        onChange={(e) => handleMedicineChange(idx, 'medicineName', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Hàm Lượng (500mg) *"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Cách Dùng (Uống 2 lần/ngày) *"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Thời Gian (7 ngày) *"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setConsultAppt(null)}>
                Hủy Bỏ
              </Button>
              <Button type="submit" isLoading={isSubmittingConsult}>
                Hoàn Thành Khám & Kê Đơn
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* URGENT UNAVAILABILITY MODAL */}
      <Dialog
        isOpen={isUrgentModalOpen}
        onClose={() => setIsUrgentModalOpen(false)}
        title="Báo Đột Xuất Bận Khám"
        description="Thông báo cho Lễ tân/Quản lý. Các lịch khám còn lại trong ngày sẽ được báo khẩn để chuyển bác sĩ khác."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Lý Do Đột Xuất Bận Khám *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Ví dụ: Đột xuất bị sốt cao, việc gia đình khẩn cấp..."
              value={urgentReason}
              onChange={(e) => setUrgentReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsUrgentModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              isLoading={isSubmittingUrgent}
              onClick={handleReportUrgentUnavailability}
            >
              Gửi Thông Báo Khẩn
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
