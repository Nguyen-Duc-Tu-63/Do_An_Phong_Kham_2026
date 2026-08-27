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
  Pencil,
  Trash2,
  Search,
  Mail,
  Phone,
  AlertTriangle,
  HeartPulse,
  Baby,
  Sparkles,
  Headphones,
  Eye,
  Smile,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  Award,
  CalendarDays,
  Percent,
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

const SPECIALTY_ICON_OPTIONS = [
  { value: 'HeartPulse', label: '❤️ Tim Mạch / Tuần Hoàn' },
  { value: 'Baby', label: '👶 Nhi Khoa / Trẻ Em' },
  { value: 'Sparkles', label: '✨ Da Liễu / Thẩm Mỹ' },
  { value: 'Stethoscope', label: '🩺 Nội Tổng Quát / Đa Khoa' },
  { value: 'Headphones', label: '👂 Tai Mũi Họng' },
  { value: 'Eye', label: '👁️ Mắt / Nhãn Khoa' },
  { value: 'Smile', label: '🦷 Răng Hàm Mặt' },
  { value: 'Activity', label: '🦴 Cơ Xương Khớp' },
  { value: 'Layers', label: '🏥 Chuyên Khoa Khác' },
];

function getSpecialtyIcon(iconName?: string | null) {
  switch (iconName) {
    case 'HeartPulse':
      return <HeartPulse className="w-6 h-6 text-[#4fc3a1]" />;
    case 'Baby':
      return <Baby className="w-6 h-6 text-[#4fc3a1]" />;
    case 'Sparkles':
      return <Sparkles className="w-6 h-6 text-[#4fc3a1]" />;
    case 'Headphones':
      return <Headphones className="w-6 h-6 text-[#4fc3a1]" />;
    case 'Eye':
      return <Eye className="w-6 h-6 text-[#4fc3a1]" />;
    case 'Smile':
      return <Smile className="w-6 h-6 text-[#4fc3a1]" />;
    case 'Bone':
    case 'Activity':
      return <Activity className="w-6 h-6 text-[#4fc3a1]" />;
    default:
      return <Stethoscope className="w-6 h-6 text-[#4fc3a1]" />;
  }
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserSession | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for Appointments
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('');
  const [filterDoctor, setFilterDoctor] = useState<string>('');

  // Filters for Doctors Tab
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>('');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState<string>('');

  // Filters for Specialties Tab
  const [specialtySearchQuery, setSpecialtySearchQuery] = useState<string>('');

  // Filters for Analytics / Dashboard
  const [trendTimeRange, setTrendTimeRange] = useState<'7DAYS' | '14DAYS'>('7DAYS');

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
  const [newSpecIcon, setNewSpecIcon] = useState('Stethoscope');
  const [isSubmittingSpecialty, setIsSubmittingSpecialty] = useState(false);

  // Edit Specialty Modal
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [editSpecName, setEditSpecName] = useState('');
  const [editSpecDesc, setEditSpecDesc] = useState('');
  const [editSpecIcon, setEditSpecIcon] = useState('Stethoscope');
  const [isSubmittingEditSpec, setIsSubmittingEditSpec] = useState(false);

  // Delete Specialty Modal
  const [deletingSpecialty, setDeletingSpecialty] = useState<Specialty | null>(null);
  const [isSubmittingDeleteSpec, setIsSubmittingDeleteSpec] = useState(false);

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
  const [newDocAvatar, setNewDocAvatar] = useState('');
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);

  // Edit Doctor Modal
  const [editingDoctor, setEditingDoctor] = useState<DoctorInfo | null>(null);
  const [editDocName, setEditDocName] = useState('');
  const [editDocEmail, setEditDocEmail] = useState('');
  const [editDocPhone, setEditDocPhone] = useState('');
  const [editDocSpecialty, setEditDocSpecialty] = useState('');
  const [editDocDegree, setEditDocDegree] = useState('');
  const [editDocExp, setEditDocExp] = useState(5);
  const [editDocFee, setEditDocFee] = useState(40);
  const [editDocBio, setEditDocBio] = useState('');
  const [editDocAvatar, setEditDocAvatar] = useState('');
  const [isSubmittingEditDoc, setIsSubmittingEditDoc] = useState(false);

  // Delete Doctor Modal
  const [deletingDoctor, setDeletingDoctor] = useState<DoctorInfo | null>(null);
  const [isSubmittingDeleteDoc, setIsSubmittingDeleteDoc] = useState(false);

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

  const filteredDoctorsList = doctors.filter((d) => {
    if (doctorSpecialtyFilter && d.specialtyId !== doctorSpecialtyFilter) return false;
    if (doctorSearchQuery.trim()) {
      const q = doctorSearchQuery.toLowerCase().trim();
      const nameMatch = d.user.fullName.toLowerCase().includes(q);
      const emailMatch = d.user.email.toLowerCase().includes(q);
      const phoneMatch = d.user.phone?.toLowerCase().includes(q);
      const degreeMatch = d.degree?.toLowerCase().includes(q);
      const specMatch = d.specialty?.name?.toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || degreeMatch || specMatch;
    }
    return true;
  });

  const filteredSpecialtiesList = specialties.filter((s) => {
    if (!specialtySearchQuery.trim()) return true;
    const q = specialtySearchQuery.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
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
    setIsSubmittingSpecialty(true);
    try {
      const res = await fetch('/api/specialties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSpecName,
          description: newSpecDesc,
          iconUrl: newSpecIcon || 'Stethoscope',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Đã tạo chuyên khoa mới thành công!');
        setIsSpecialtyModalOpen(false);
        setNewSpecName('');
        setNewSpecDesc('');
        setNewSpecIcon('Stethoscope');
        loadAdminData();
      } else {
        toast.error(data.error || 'Lỗi tạo chuyên khoa');
      }
    } catch (e) {
      toast.error('Lỗi tạo chuyên khoa');
    } finally {
      setIsSubmittingSpecialty(false);
    }
  };

  const handleOpenEditSpecialty = (spec: Specialty) => {
    setEditingSpecialty(spec);
    setEditSpecName(spec.name || '');
    setEditSpecDesc(spec.description || '');
    setEditSpecIcon(spec.iconUrl || 'Stethoscope');
  };

  const handleEditSpecialtySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty) return;
    setIsSubmittingEditSpec(true);
    try {
      const res = await fetch('/api/specialties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSpecialty.id,
          name: editSpecName,
          description: editSpecDesc,
          iconUrl: editSpecIcon,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Đã cập nhật thông tin chuyên khoa thành công!');
        setEditingSpecialty(null);
        loadAdminData();
      } else {
        toast.error(data.error || 'Cập nhật chuyên khoa thất bại');
      }
    } catch (e) {
      toast.error('Lỗi khi cập nhật chuyên khoa');
    } finally {
      setIsSubmittingEditSpec(false);
    }
  };

  const handleDeleteSpecialtySubmit = async () => {
    if (!deletingSpecialty) return;
    setIsSubmittingDeleteSpec(true);
    try {
      const res = await fetch(`/api/specialties?id=${deletingSpecialty.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Đã xóa chuyên khoa thành công!');
        setDeletingSpecialty(null);
        loadAdminData();
      } else {
        toast.error(data.error || 'Xóa chuyên khoa thất bại');
      }
    } catch (e) {
      toast.error('Lỗi khi xóa chuyên khoa');
    } finally {
      setIsSubmittingDeleteSpec(false);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDoctor(true);
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
          avatarUrl: newDocAvatar,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Đã tạo thông tin bác sĩ mới!');
        setIsDoctorModalOpen(false);
        setNewDocName('');
        setNewDocEmail('');
        setNewDocPhone('');
        setNewDocSpecialty('');
        setNewDocDegree('');
        setNewDocExp(5);
        setNewDocFee(40);
        setNewDocBio('');
        setNewDocAvatar('');
        loadAdminData();
      } else {
        toast.error(data.error || 'Lỗi tạo bác sĩ');
      }
    } catch (e) {
      toast.error('Lỗi tạo bác sĩ');
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  const handleOpenEditDoctor = (doc: DoctorInfo) => {
    setEditingDoctor(doc);
    setEditDocName(doc.user.fullName || '');
    setEditDocEmail(doc.user.email || '');
    setEditDocPhone(doc.user.phone || '');
    setEditDocSpecialty(doc.specialtyId || '');
    setEditDocDegree(doc.degree || '');
    setEditDocExp(doc.experienceYears ?? 5);
    setEditDocFee(doc.consultationFee ?? 40);
    setEditDocBio(doc.bio || '');
    setEditDocAvatar(doc.user.avatarUrl || '');
  };

  const handleEditDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    setIsSubmittingEditDoc(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDoctor.id,
          fullName: editDocName,
          email: editDocEmail,
          phone: editDocPhone,
          specialtyId: editDocSpecialty,
          degree: editDocDegree,
          experienceYears: editDocExp,
          consultationFee: editDocFee,
          bio: editDocBio,
          avatarUrl: editDocAvatar,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Đã cập nhật thông tin bác sĩ thành công!');
        setEditingDoctor(null);
        loadAdminData();
      } else {
        toast.error(data.error || 'Cập nhật bác sĩ thất bại');
      }
    } catch (e) {
      toast.error('Lỗi cập nhật bác sĩ');
    } finally {
      setIsSubmittingEditDoc(false);
    }
  };

  const handleDeleteDoctorSubmit = async () => {
    if (!deletingDoctor) return;
    setIsSubmittingDeleteDoc(true);
    try {
      const res = await fetch(`/api/doctors?id=${deletingDoctor.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Đã xóa bác sĩ thành công!');
        setDeletingDoctor(null);
        loadAdminData();
      } else {
        toast.error(data.error || 'Xóa bác sĩ thất bại');
      }
    } catch (e) {
      toast.error('Lỗi khi xóa bác sĩ');
    } finally {
      setIsSubmittingDeleteDoc(false);
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
        {/* Card 1: Tổng Hôm Nay */}
        <Card className="p-4 bg-white border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Lịch Khám Hôm Nay
            </p>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-slate-800">
              {stats?.kpis?.totalToday ?? 0}{' '}
              <span className="text-sm font-semibold text-slate-500">Lịch</span>
            </p>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {stats?.kpis?.completedToday ?? 0} xong • {stats?.kpis?.confirmedToday ?? 0} chờ
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Ngày: <strong className="text-slate-600 font-medium">{stats?.todayStr ? formatDate(stats.todayStr) : 'Hôm nay'}</strong>
          </p>
        </Card>

        {/* Card 2: Đã Khám Xong */}
        <Card className="p-4 bg-white border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Đã Khám Xong
            </p>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-blue-600">
              {stats?.kpis?.completedToday ?? 0}{' '}
              <span className="text-sm font-semibold text-blue-500">Hôm nay</span>
            </p>
            <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              Tổng {stats?.kpis?.completedTotal ?? 0} ca
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Tỷ lệ hoàn thành: <strong className="text-blue-600 font-semibold">{stats?.kpis?.completionRate ?? 0}%</strong>
          </p>
        </Card>

        {/* Card 3: Chờ Phân Bác Sĩ */}
        <Card className="p-4 bg-white border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
              Chờ Phân Bác Sĩ
            </p>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-amber-600">
              {stats?.kpis?.pendingCount ?? 0}{' '}
              <span className="text-sm font-semibold text-amber-500">Lịch</span>
            </p>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                (stats?.kpis?.pendingCount ?? 0) > 0
                  ? 'text-amber-800 bg-amber-50 border-amber-200 font-bold'
                  : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}
            >
              {stats?.kpis?.pendingCount === 0 ? 'Đã phân hết' : 'Cần xử lý'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {stats?.kpis?.pendingCount > 0 ? 'Có ca đặt tự động chờ phân' : 'Không có ca chờ điều phối'}
          </p>
        </Card>

        {/* Card 4: Cần Đổi Bác Sĩ Gấp */}
        <Card
          className={`p-4 transition-all hover:shadow-md ${
            (stats?.kpis?.needsReassignmentCount ?? 0) > 0
              ? 'bg-rose-50 border-2 border-rose-300 animate-pulse'
              : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                (stats?.kpis?.needsReassignmentCount ?? 0) > 0
                  ? 'text-rose-700 font-bold'
                  : 'text-slate-500'
              }`}
            >
              Cần Đổi BS Gấp
            </p>
            <AlertOctagon
              className={`w-4 h-4 ${
                (stats?.kpis?.needsReassignmentCount ?? 0) > 0
                  ? 'text-rose-600'
                  : 'text-slate-400'
              }`}
            />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p
              className={`text-2xl font-black ${
                (stats?.kpis?.needsReassignmentCount ?? 0) > 0
                  ? 'text-rose-700'
                  : 'text-slate-800'
              }`}
            >
              {stats?.kpis?.needsReassignmentCount ?? 0}{' '}
              <span className="text-sm font-semibold text-slate-500">Báo Bận</span>
            </p>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                (stats?.kpis?.needsReassignmentCount ?? 0) > 0
                  ? 'text-rose-800 bg-rose-100 border-rose-200 font-bold'
                  : 'text-slate-600 bg-slate-50 border-slate-200'
              }`}
            >
              {(stats?.kpis?.needsReassignmentCount ?? 0) > 0 ? 'Khẩn cấp!' : 'Bình thường'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Đã hủy: <strong className="text-slate-600">{stats?.kpis?.cancelledCount ?? 0} ca</strong>
          </p>
        </Card>

        {/* Card 5: Doanh Thu */}
        <Card className="p-4 bg-white border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Doanh Thu Hôm Nay
            </p>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-xl font-black text-emerald-600">
              {formatCurrency(stats?.kpis?.todayRevenue ?? 0)}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            Tổng thu: <strong className="text-emerald-700 font-semibold">{formatCurrency(stats?.kpis?.totalRevenue ?? 0)}</strong>
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
                {/* 4 MINI EXECUTIVE KPI METRICS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                      <Stethoscope className="w-4 h-4" />
                      <span>Đội Ngũ Y Bác Sĩ</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800 mt-1.5">
                      {stats?.kpis?.totalDoctors ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Bác sĩ chuyên khoa đang trực</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/50 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
                      <Layers className="w-4 h-4" />
                      <span>Chuyên Khoa Khám</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800 mt-1.5">
                      {stats?.kpis?.totalSpecialties ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Khoa phòng tiếp nhận điều trị</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold">
                      <Users className="w-4 h-4" />
                      <span>Hồ Sơ Bệnh Nhân</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800 mt-1.5">
                      {stats?.kpis?.totalPatients ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tài khoản bệnh nhân đăng ký</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>Tổng Lượt Đặt Khám</span>
                    </div>
                    <p className="text-2xl font-black text-slate-800 mt-1.5">
                      {stats?.kpis?.totalAllTime ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tỷ lệ hoàn thành {stats?.kpis?.completionRate ?? 0}%
                    </p>
                  </div>
                </div>

                {/* ROW 1: BIỂU ĐỒ XU HƯỚNG & BIỂU ĐỒ TRẠNG THÁI */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* BIỂU ĐỒ XU HƯỚNG LỊCH KHÁM (7 NGÀY / 14 NGÀY) */}
                  <Card className="p-5 border-slate-100 shadow-sm lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">
                            Xu Hướng Đặt Khám Theo Thời Gian
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Theo dõi số lượng ca đặt khám và ca hoàn thành thực tế
                          </p>
                        </div>
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setTrendTimeRange('7DAYS')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              trendTimeRange === '7DAYS'
                                ? 'bg-white text-slate-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            7 Ngày
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrendTimeRange('14DAYS')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              trendTimeRange === '14DAYS'
                                ? 'bg-white text-slate-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            14 Ngày
                          </button>
                        </div>
                      </div>

                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={
                              trendTimeRange === '14DAYS'
                                ? stats?.trend14Days || []
                                : stats?.weeklyTrend || []
                            }
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4fc3a1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#4fc3a1" stopOpacity={0.0} />
                              </linearGradient>
                              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey={trendTimeRange === '14DAYS' ? 'shortDate' : 'date'}
                              tick={{ fontSize: 11, fill: '#64748b' }}
                            />
                            <YAxis
                              allowDecimals={false}
                              tick={{ fontSize: 11, fill: '#64748b' }}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                                      <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                                        {data.date} ({data.dateStr})
                                      </p>
                                      <p className="text-emerald-400">
                                        • Tổng ca đặt: <strong>{data.count}</strong>
                                      </p>
                                      <p className="text-blue-400">
                                        • Đã khám xong: <strong>{data.completed}</strong>
                                      </p>
                                      <p className="text-cyan-300">
                                        • Chờ khám: <strong>{data.confirmed}</strong>
                                      </p>
                                      {data.cancelled > 0 && (
                                        <p className="text-rose-400">
                                          • Đã hủy: <strong>{data.cancelled}</strong>
                                        </p>
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend
                              verticalAlign="top"
                              align="right"
                              iconType="circle"
                              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="count"
                              name="Tổng Ca Hẹn"
                              stroke="#4fc3a1"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorCount)"
                              dot={{ r: 4, fill: '#4fc3a1' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="completed"
                              name="Đã Khám Xong"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorCompleted)"
                              dot={{ r: 3, fill: '#3b82f6' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Card>

                  {/* BIỂU ĐỒ CƠ CẤU TRẠNG THÁI (DONUT CHART) */}
                  <Card className="p-5 border-slate-100 shadow-sm lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Cơ Cấu Trạng Thái Lịch Khám</h3>
                      <p className="text-xs text-slate-400 mt-0.5 mb-2">
                        Tỷ trọng phân bổ {stats?.kpis?.totalAllTime ?? 0} ca khám trong hệ thống
                      </p>

                      <div className="h-56 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats?.statusDistribution || []}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={4}
                              dataKey="count"
                            >
                              {(stats?.statusDistribution || []).map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any, name: any) => [
                                `${value} ca (${Math.round(
                                  ((Number(value) || 0) / (stats?.kpis?.totalAllTime || 1)) * 100
                                )}%)`,
                                name,
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black text-slate-800 leading-none">
                            {stats?.kpis?.totalAllTime ?? 0}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                            Tổng Ca
                          </span>
                        </div>
                      </div>

                      {/* LEGEND CHI TIẾT */}
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                        {(stats?.statusDistribution || []).map((item: any) => (
                          <div key={item.status} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                              <span className="text-slate-700 text-[11px] truncate">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-900 text-xs shrink-0 ml-1">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ROW 2: PHÂN BỔ CHUYÊN KHOA & BẢNG XẾP HẠNG BÁC SĨ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* BIỂU ĐỒ CỘT CHUYÊN KHOA */}
                  <Card className="p-5 border-slate-100 shadow-sm lg:col-span-7">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">
                          Lượng Khám Theo Chuyên Khoa
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Số ca tiếp nhận và ca đã hoàn thành theo từng khoa phòng
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                        {stats?.specialtyDistribution?.length || 0} Khoa
                      </span>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats?.specialtyDistribution || []}
                          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="name"
                            interval={0}
                            angle={-25}
                            textAnchor="end"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            height={45}
                          />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip
                            formatter={(value: any, name: any) => [
                              `${value} ca`,
                              name === 'count' ? 'Tổng ca đặt' : 'Đã khám xong',
                            ]}
                          />
                          <Bar dataKey="count" name="Tổng Ca Hẹn" fill="#4fc3a1" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="completedCount" name="Đã Khám Xong" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* BẢNG XẾP HẠNG HIỆU SUẤT BÁC SĨ (TOP DOCTORS) */}
                  <Card className="p-5 border-slate-100 shadow-sm lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">Bác Sĩ Nổi Bật</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Bác sĩ có nhiều lượt khám và hoàn thành tốt nhất
                          </p>
                        </div>
                        <Award className="w-5 h-5 text-amber-500 shrink-0" />
                      </div>

                      {(!stats?.topDoctors || stats.topDoctors.length === 0) ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          Chưa có dữ liệu bác sĩ nhận ca
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                          {stats.topDoctors.slice(0, 5).map((doc: any, idx: number) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative shrink-0">
                                  <img
                                    src={
                                      doc.avatarUrl ||
                                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80'
                                    }
                                    alt={doc.name}
                                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                  />
                                  <span
                                    className={`absolute -top-1 -left-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                                      idx === 0
                                        ? 'bg-amber-500'
                                        : idx === 1
                                        ? 'bg-slate-400'
                                        : idx === 2
                                        ? 'bg-amber-700'
                                        : 'bg-slate-600'
                                    }`}
                                  >
                                    {idx + 1}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 text-xs truncate">
                                    {doc.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {doc.specialty}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-bold text-emerald-600 text-xs">
                                  {doc.completed}/{doc.appointments} ca
                                </span>
                                <p className="text-[10px] text-slate-400">
                                  {formatCurrency(doc.revenue)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* ROW 3: PHÂN BỔ KHUNG GIỜ KHÁM */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        Phân Bổ Lượng Bệnh Nhân Theo Khung Giờ
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Giúp Lễ tân & Quản lý bố trí nhân sự phù hợp cho các khung giờ cao điểm
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                        ☀️ Ca Sáng (08:00 - 11:30): {stats?.timeSlotOverview?.morningCount ?? 0} ca
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold">
                        🌤️ Ca Chiều (13:30 - 17:00): {stats?.timeSlotOverview?.afternoonCount ?? 0} ca
                      </span>
                    </div>
                  </div>

                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats?.timeSlotOverview?.hourlyDistribution || []}
                        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#475569' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
                        <Tooltip
                          formatter={(value: any) => [`${value} lượt khám`, 'Lượng bệnh nhân']}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Danh Sách Chuyên Khoa Khám Chữa Bệnh</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Quản lý danh mục các khoa phòng, bổ sung chuyên khoa mới hoặc cập nhật thông tin tiếp nhận điều trị ({specialties.length} khoa)
                    </p>
                  </div>
                  <Button onClick={() => setIsSpecialtyModalOpen(true)} className="shrink-0">
                    <Plus className="w-4 h-4 mr-1.5" /> Thêm Chuyên Khoa Mới
                  </Button>
                </div>

                {/* SEARCH BAR FOR SPECIALTIES */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 relative">
                  <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm chuyên khoa theo tên hoặc mô tả bệnh lý tiếp nhận..."
                    value={specialtySearchQuery}
                    onChange={(e) => setSpecialtySearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                  />
                </div>

                {/* SPECIALTIES GRID */}
                {filteredSpecialtiesList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">Không tìm thấy chuyên khoa phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">Vui lòng thử lại với từ khóa tìm kiếm khác</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSpecialtiesList.map((s) => {
                      const specDoctors = doctors.filter((d) => d.specialtyId === s.id);
                      const specAppointments = appointments.filter((a) => a.specialtyId === s.id);

                      return (
                        <Card
                          key={s.id}
                          className="p-5 flex flex-col justify-between hover:shadow-md transition-all border border-slate-100 bg-white group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3.5 min-w-0">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4fc3a1] flex items-center justify-center border border-emerald-100 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                                  {getSpecialtyIcon(s.iconUrl)}
                                </div>
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-slate-900 text-base leading-tight">
                                      {s.name}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-semibold">
                                      {specDoctors.length} Bác Sĩ
                                    </span>
                                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-semibold">
                                      {specAppointments.length} Ca Hẹn
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* ACTION BUTTONS: SỬA & XÓA */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSpecialty(s)}
                                  className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                                  title="Chỉnh sửa thông tin chuyên khoa"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingSpecialty(s)}
                                  className="p-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                                  title="Xóa chuyên khoa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                              {s.description}
                            </p>
                          </div>

                          {/* DOCTORS PREVIEW IN THIS SPECIALTY */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            {specDoctors.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2 overflow-hidden">
                                  {specDoctors.slice(0, 4).map((doc) => (
                                    <img
                                      key={doc.id}
                                      src={
                                        doc.user.avatarUrl ||
                                        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80'
                                      }
                                      alt={doc.user.fullName}
                                      title={doc.user.fullName}
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {specDoctors.map((d) => d.user.fullName).slice(0, 2).join(', ')}
                                  {specDoctors.length > 2 ? ` và +${specDoctors.length - 2} BS khác` : ''}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-600 italic">Chưa có bác sĩ thuộc khoa này</span>
                            )}
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {s.id.slice(0, 8)}...
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: QUẢN LÝ BÁC SĨ */}
            {activeTab === 'doctors' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Danh Sách Bác Sĩ Phụ Trách</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Quản lý hồ sơ công tác, cập nhật thông tin hoặc cho thôi công tác đội ngũ {doctors.length} bác sĩ
                    </p>
                  </div>
                  <Button onClick={() => setIsDoctorModalOpen(true)} className="shrink-0">
                    <Plus className="w-4 h-4 mr-1.5" /> Thêm Bác Sĩ Mới
                  </Button>
                </div>

                {/* SEARCH & SPECIALTY FILTER BAR */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-7 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bác sĩ theo họ tên, email, học vị..."
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <select
                      value={doctorSpecialtyFilter}
                      onChange={(e) => setDoctorSpecialtyFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
                    >
                      <option value="">Tất cả chuyên khoa ({doctors.length} bác sĩ)</option>
                      {specialties.map((s) => {
                        const count = doctors.filter((d) => d.specialtyId === s.id).length;
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name} ({count} BS)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* DOCTOR CARDS GRID */}
                {filteredDoctorsList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">Không tìm thấy bác sĩ phù hợp với điều kiện tìm kiếm</p>
                    <p className="text-xs text-slate-400 mt-1">Vui lòng thử từ khóa khác hoặc bỏ lọc chuyên khoa</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctorsList.map((doc) => (
                      <Card
                        key={doc.id}
                        className="p-5 flex flex-col justify-between hover:shadow-md transition-all border border-slate-100 bg-white group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5 min-w-0">
                              <img
                                src={
                                  doc.user.avatarUrl ||
                                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'
                                }
                                alt={doc.user.fullName}
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-xs shrink-0"
                              />
                              <div className="space-y-1 min-w-0">
                                <Badge variant="emerald" className="text-[10px] py-0.5">
                                  {doc.specialty?.name}
                                </Badge>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                                  {doc.user.fullName}
                                </h4>
                                <p className="text-xs font-medium text-slate-600 truncate">{doc.degree}</p>
                              </div>
                            </div>

                            {/* ACTION BUTTONS: SỬA & XÓA */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenEditDoctor(doc)}
                                className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                                title="Chỉnh sửa thông tin bác sĩ"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingDoctor(doc)}
                                className="p-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                                title="Xóa / Cho thôi công tác"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* CONTACT META INFO */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{doc.user.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{doc.user.phone || 'Chưa cập nhật'}</span>
                            </div>
                          </div>

                          {/* BIO PREVIEW */}
                          {doc.bio && (
                            <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                              "{doc.bio}"
                            </p>
                          )}
                        </div>

                        {/* BOTTOM INFO ROW */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100">
                            Giá khám: {formatCurrency(doc.consultationFee)}
                          </span>
                          <span className="text-slate-500 font-medium">
                            Kinh nghiệm: <strong className="text-slate-700">{doc.experienceYears} năm</strong>
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
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
              <option value="">Chọn bác sĩ thay thế...</option>
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
        description="Thêm khoa khám bệnh mới vào danh mục dịch vụ của phòng khám CarePlus+."
        maxWidth="md"
      >
        <form onSubmit={handleCreateSpecialty} className="space-y-4 pt-2">
          <Input
            label="Tên Chuyên Khoa *"
            placeholder="Ví dụ: Khoa Thần Kinh Học"
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Biểu Tượng Đại Diện (Icon)
            </label>
            <select
              value={newSpecIcon}
              onChange={(e) => setNewSpecIcon(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
            >
              {SPECIALTY_ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô Tả Chuyên Khoa & Bệnh Lý Tiếp Nhận *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
              placeholder="Mô tả các bệnh lý, triệu chứng và kỹ thuật chuyên sâu khoa tiếp nhận..."
              value={newSpecDesc}
              onChange={(e) => setNewSpecDesc(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsSpecialtyModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmittingSpecialty}>
              Lưu Chuyên Khoa
            </Button>
          </div>
        </form>
      </Dialog>

      {/* EDIT SPECIALTY MODAL */}
      <Dialog
        isOpen={!!editingSpecialty}
        onClose={() => setEditingSpecialty(null)}
        title="Chỉnh Sửa Thông Tin Chuyên Khoa"
        description="Cập nhật tên gọi, biểu tượng và mô tả bệnh lý của chuyên khoa."
        maxWidth="md"
      >
        <form onSubmit={handleEditSpecialtySubmit} className="space-y-4 pt-2">
          <Input
            label="Tên Chuyên Khoa *"
            placeholder="Ví dụ: Khoa Tim Mạch"
            value={editSpecName}
            onChange={(e) => setEditSpecName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Biểu Tượng Đại Diện (Icon)
            </label>
            <select
              value={editSpecIcon}
              onChange={(e) => setEditSpecIcon(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
            >
              {SPECIALTY_ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mô Tả Chuyên Khoa & Bệnh Lý Tiếp Nhận *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
              placeholder="Mô tả các bệnh lý, triệu chứng và kỹ thuật chuyên sâu..."
              value={editSpecDesc}
              onChange={(e) => setNewSpecDesc(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setEditingSpecialty(null)}>
              Hủy Bỏ
            </Button>
            <Button type="submit" isLoading={isSubmittingEditSpec}>
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </Dialog>

      {/* DELETE SPECIALTY CONFIRMATION MODAL */}
      <Dialog
        isOpen={!!deletingSpecialty}
        onClose={() => setDeletingSpecialty(null)}
        title="Xác Nhận Xóa Chuyên Khoa"
        maxWidth="md"
      >
        {deletingSpecialty && (() => {
          const docCount = doctors.filter((d) => d.specialtyId === deletingSpecialty.id).length;
          const apptCount = appointments.filter((a) => a.specialtyId === deletingSpecialty.id).length;

          return (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1">
                  <p className="font-bold text-sm text-rose-950">
                    Bạn có chắc chắn muốn xóa chuyên khoa này?
                  </p>
                  <p>
                    Chuyên khoa: <strong className="font-bold">{deletingSpecialty.name}</strong>
                  </p>
                  <p>
                    Hiện có: <strong>{docCount} bác sĩ</strong> và <strong>{apptCount} ca khám</strong> liên kết.
                  </p>
                  <p className="text-rose-700 mt-2 pt-2 border-t border-rose-200/60 leading-relaxed">
                    ⚠️ <strong>Cảnh báo quan trọng:</strong> Khi xóa chuyên khoa, toàn bộ hồ sơ bác sĩ và lịch hẹn thuộc khoa này sẽ được dọn dẹp an toàn khỏi hệ thống để tránh xung đột dữ liệu.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => setDeletingSpecialty(null)}>
                  Hủy Bỏ
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  isLoading={isSubmittingDeleteSpec}
                  onClick={handleDeleteSpecialtySubmit}
                >
                  Xác Nhận Xóa Chuyên Khoa
                </Button>
              </div>
            </div>
          );
        })()}
      </Dialog>

      {/* ADD DOCTOR MODAL */}
      <Dialog
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        title="Thêm Hồ Sơ Bác Sĩ Mới"
        description="Khởi tạo tài khoản bác sĩ mới, cấp quyền truy cập và tự động sinh 5 lịch trực tuần."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Họ và Tên Bác Sĩ *"
              placeholder="Ví dụ: BS CKII. Nguyễn Văn B"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              min={0}
            />
            <Input
              type="number"
              label="Giá Khám Tư Vấn ($) *"
              value={newDocFee}
              onChange={(e) => setNewDocFee(Number(e.target.value))}
              required
              min={0}
            />
          </div>

          <Input
            label="URL Ảnh Đại Diện (Avatar)"
            placeholder="https://images.unsplash.com/..."
            value={newDocAvatar}
            onChange={(e) => setNewDocAvatar(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tóm Tắt Tiểu Sử & Kinh Nghiệm Bác Sĩ *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
              placeholder="Kinh nghiệm khám chữa bệnh, chứng chỉ hành nghề..."
              value={newDocBio}
              onChange={(e) => setNewDocBio(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsDoctorModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmittingDoctor}>
              Lưu Hồ Sơ Bác Sĩ
            </Button>
          </div>
        </form>
      </Dialog>

      {/* EDIT DOCTOR MODAL */}
      <Dialog
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        title="Chỉnh Sửa Thông Tin Bác Sĩ"
        description="Cập nhật thông tin công tác, học vị, chuyên khoa và giá khám của bác sĩ."
        maxWidth="lg"
      >
        <form onSubmit={handleEditDoctorSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Họ và Tên Bác Sĩ *"
              placeholder="Ví dụ: BS CKII. Nguyễn Văn A"
              value={editDocName}
              onChange={(e) => setEditDocName(e.target.value)}
              required
            />
            <Input
              label="Địa Chỉ Email *"
              type="email"
              placeholder="bacsi@clinic.com"
              value={editDocEmail}
              onChange={(e) => setEditDocEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Số Điện Thoại *"
              placeholder="0912345678"
              value={editDocPhone}
              onChange={(e) => setEditDocPhone(e.target.value)}
              required
            />
            <Select
              label="Chuyên Khoa Phụ Trách *"
              value={editDocSpecialty}
              onChange={(e) => setEditDocSpecialty(e.target.value)}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Bằng Cấp / Học Vị *"
              placeholder="Ví dụ: Thạc sĩ, Bác sĩ CKI"
              value={editDocDegree}
              onChange={(e) => setEditDocDegree(e.target.value)}
              required
            />
            <Input
              type="number"
              label="Kinh Nghiệm (Năm) *"
              value={editDocExp}
              onChange={(e) => setEditDocExp(Number(e.target.value))}
              required
              min={0}
            />
            <Input
              type="number"
              label="Giá Khám Tư Vấn ($) *"
              value={editDocFee}
              onChange={(e) => setEditDocFee(Number(e.target.value))}
              required
              min={0}
            />
          </div>

          <Input
            label="URL Ảnh Đại Diện (Avatar)"
            placeholder="https://images.unsplash.com/..."
            value={editDocAvatar}
            onChange={(e) => setEditDocAvatar(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tóm Tắt Tiểu Sử & Kinh Nghiệm Khám Bệnh *
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4fc3a1]"
              placeholder="Kinh nghiệm khám chữa bệnh, thành tựu..."
              value={editDocBio}
              onChange={(e) => setEditDocBio(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setEditingDoctor(null)}>
              Hủy Bỏ
            </Button>
            <Button type="submit" isLoading={isSubmittingEditDoc}>
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </Dialog>

      {/* DELETE DOCTOR CONFIRMATION MODAL */}
      <Dialog
        isOpen={!!deletingDoctor}
        onClose={() => setDeletingDoctor(null)}
        title="Xác Nhận Xóa / Cho Thôi Công Tác"
        maxWidth="md"
      >
        {deletingDoctor && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 space-y-1">
                <p className="font-bold text-sm text-rose-950">
                  Bạn có chắc chắn muốn xóa bác sĩ này?
                </p>
                <p>
                  Bác sĩ: <strong className="font-bold">{deletingDoctor.user.fullName}</strong>
                </p>
                <p>
                  Chuyên khoa: <strong>{deletingDoctor.specialty?.name}</strong> • Email: {deletingDoctor.user.email}
                </p>
                <p className="text-rose-700 mt-2 pt-2 border-t border-rose-200/60 leading-relaxed">
                  ⚠️ <strong>Lưu ý quan trọng:</strong> Toàn bộ lịch làm việc của bác sĩ sẽ bị hủy. Các ca khám đang chờ của bác sĩ sẽ được tự động chuyển sang trạng thái <strong>"Cần đổi bác sĩ gấp"</strong> để Lễ tân điều phối bác sĩ thay thế kịp thời.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setDeletingDoctor(null)}>
                Hủy Bỏ
              </Button>
              <Button
                variant="danger"
                type="button"
                isLoading={isSubmittingDeleteDoc}
                onClick={handleDeleteDoctorSubmit}
              >
                Xác Nhận Xóa Bác Sĩ
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
