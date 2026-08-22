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
  const [user, setUser] = useState<UserSession | null>(null);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
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

        const todayItems = arr.filter((a) => a.appointmentDate === todayStr);
        setTodayAppts(todayItems);
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

  const completedTodayCount = todayAppts.filter((a) => a.status === 'COMPLETED').length;
  const remainingTodayCount = todayAppts.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  ).length;

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
              Hàng Chờ Khám • {todayAppts.length} Bệnh nhân đặt khám hôm nay ({formatDate(todayStr)})
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
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4fc3a1] flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Tổng Hôm Nay</p>
            <p className="text-2xl font-bold text-slate-800">{todayAppts.length} Bệnh nhân</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Đã Khám Xong</p>
            <p className="text-2xl font-bold text-slate-800">{completedTodayCount} Bệnh nhân</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Đang Chờ Khám</p>
            <p className="text-2xl font-bold text-slate-800">{remainingTodayCount} Bệnh nhân</p>
          </div>
        </Card>
      </div>

      {/* TABS */}
      <Card className="p-6">
        <Tabs
          tabs={[
            { id: 'queue', label: 'Hàng Chờ Khám Hôm Nay', count: todayAppts.length, icon: <UserCheck className="w-4 h-4" /> },
            { id: 'history', label: 'Lịch Sử Khám Bệnh', count: allAppts.length, icon: <FileCheck2 className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div>
            {activeTab === 'queue' && (
              <div className="space-y-4">
                {todayAppts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <UserCheck className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Chưa có lịch hẹn khám nào hôm nay.</p>
                  </div>
                ) : (
                  todayAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-[#4fc3a1] bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                            Giờ hẹn: {appt.appointmentTime}
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                              appt.status
                            )}`}
                          >
                            {getStatusLabel(appt.status)}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            Bệnh Nhân: {appt.patient?.fullName}
                          </h3>
                          <p className="text-xs text-slate-500">
                            SĐT: {appt.patient?.phone} • Email: {appt.patient?.email}
                          </p>
                        </div>

                        {appt.patientNotes && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                            Triệu chứng bệnh nhân mô tả: "{appt.patientNotes}"
                          </p>
                        )}
                      </div>

                      <div>
                        {appt.status === 'COMPLETED' ? (
                          <Badge variant="blue" className="px-3 py-1 text-xs font-bold">
                            ✓ Đã Khám & Kê Đơn Xong
                          </Badge>
                        ) : appt.status === 'NEEDS_REASSIGNMENT' ? (
                          <Badge variant="rose" className="px-3 py-1 text-xs font-bold">
                            Đã Báo Đổi Bác Sĩ Gấp
                          </Badge>
                        ) : (
                          <Button onClick={() => handleOpenConsultation(appt)}>
                            <Stethoscope className="w-4 h-4 mr-1.5" /> Bắt Đầu Khám
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {allAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-5 rounded-2xl border border-slate-100 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">
                          {formatDate(appt.appointmentDate)} lúc {appt.appointmentTime}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                            appt.status
                          )}`}
                        >
                          {getStatusLabel(appt.status)}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">
                        Bệnh nhân: {appt.patient?.fullName}
                      </h4>
                      {appt.medicalRecord && (
                        <p className="text-xs text-emerald-700 font-semibold">
                          Chẩn đoán: {appt.medicalRecord.diagnosis}
                        </p>
                      )}
                    </div>

                    {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                      <Button size="sm" variant="outline" onClick={() => handleOpenConsultation(appt)}>
                        Khám Cho Bệnh Nhân
                      </Button>
                    )}
                  </div>
                ))}
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

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
