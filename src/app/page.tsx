'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Specialty, DoctorInfo } from '@/types';
import {
  Calendar,
  Stethoscope,
  Award,
  ArrowRight,
  HeartPulse,
  Baby,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  FileText,
  Clock,
  Layers,
  Phone,
  Headphones,
  Eye,
  Smile,
  Activity,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Rút gọn: Chỉ chọn 8 Bác Sĩ tiêu biểu có nhiều năm kinh nghiệm nhất
  const featuredDoctors = useMemo(() => {
    return [...doctors]
      .sort((a, b) => b.experienceYears - a.experienceYears)
      .slice(0, 8);
  }, [doctors]);

  useEffect(() => {
    async function loadData() {
      try {
        const [specRes, docRes] = await Promise.all([
          fetch('/api/specialties'),
          fetch('/api/doctors'),
        ]);
        const specData = await specRes.json();
        const docData = await docRes.json();

        setSpecialties(Array.isArray(specData) ? specData : []);
        setDoctors(Array.isArray(docData) ? docData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-8 h-8 text-[#4fc3a1]" />;
      case 'Baby':
        return <Baby className="w-8 h-8 text-[#4fc3a1]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#4fc3a1]" />;
      case 'Headphones':
        return <Headphones className="w-8 h-8 text-[#4fc3a1]" />;
      case 'Eye':
        return <Eye className="w-8 h-8 text-[#4fc3a1]" />;
      case 'Smile':
        return <Smile className="w-8 h-8 text-[#4fc3a1]" />;
      case 'Bone':
      case 'Activity':
        return <Activity className="w-8 h-8 text-[#4fc3a1]" />;
      default:
        return <Stethoscope className="w-8 h-8 text-[#4fc3a1]" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HERO BANNER SECTION (RICHER MEDICAL AMBIENCE & DEEP CONTRAST) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-100/90 via-teal-50/80 to-slate-100 border-b-2 border-emerald-200/80 py-16 md:py-24">
        {/* Deeper Medical / Clinic Background Image & Vibrant Ambient Lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2000&q=80"
            alt="Không gian phòng khám"
            className="w-full h-full object-cover object-center opacity-45 filter blur-[1.5px] scale-105"
          />
          {/* Saturated Gradient Layer for Rich Medical Tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/75 via-teal-50/70 to-slate-100/90" />
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-emerald-400/25 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-teal-400/25 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#10b981] text-white shadow-md shadow-emerald-500/25">
            <Sparkles className="w-4 h-4 text-amber-300" /> Phòng Khám Đa Khoa Hiện Đại & Tận Tâm
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] drop-shadow-xs">
            Đặt Lịch Khám & <span className="bg-gradient-to-r from-teal-700 via-[#0d9488] to-emerald-600 bg-clip-text text-transparent">Theo Dõi Hồ Sơ Y Tế</span> Đơn Giản
          </h1>

          <p className="text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Hệ thống hỗ trợ đặt lịch khám trực tuyến nhanh chóng, tự chọn bác sĩ yêu thích hoặc để hệ thống tự động sắp xếp. Dễ dàng xem lại lịch sử khám và đơn thuốc điện tử mọi lúc.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/book">
              <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-emerald-600/30 px-8 py-3.5 text-base font-bold bg-[#10b981] hover:bg-[#059669]">
                <Calendar className="w-5 h-5 mr-2" /> Đặt Lịch Khám Ngay
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-7 py-3.5 text-base font-bold bg-white/95 hover:bg-white text-slate-800 border-2 border-emerald-300 shadow-sm">
                <FileText className="w-5 h-5 mr-2 text-[#0d9488]" /> Theo Dõi Hồ Sơ Bệnh Nhân
              </Button>
            </Link>
          </div>

          {/* Key Clinic Stats */}
          <div className="pt-4 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-5 shadow-lg shadow-slate-200/50 border-2 border-emerald-200/90">
            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0d9488]">15,000+</p>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mt-0.5">Bệnh nhân tin dùng</p>
            </div>
            <div className="border-x-2 border-emerald-100 px-2 sm:px-4">
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0d9488]">25+</p>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mt-0.5">Bác sĩ chuyên khoa</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0d9488]">99.4%</p>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mt-0.5">Hài lòng dịch vụ</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK 3-STEP GUIDE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-white mb-2 shadow-xs">
            ⚡ Quy Trình Đơn Giản
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Đặt Lịch Khám Trong 3 Bước Nhanh Chóng
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 text-center space-y-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/30">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-base">Chọn Khoa & Bác Sĩ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lựa chọn chuyên khoa phù hợp hoặc chọn bác sĩ yêu thích. Hoặc chọn hệ thống tự chọn giúp bạn.
            </p>
          </div>

          <div className="p-6 text-center space-y-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/30">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-base">Chọn Ngày & Giờ Khám</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chọn ngày tiện cho công việc của bạn. Hệ thống hiển thị các khung giờ trống còn nhận lịch.
            </p>
          </div>

          <div className="p-6 text-center space-y-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/30">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-base">Xác Nhận & Theo Dõi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhập số điện thoại để nhận thông báo xác nhận và theo dõi hồ sơ đơn thuốc trực tuyến.
            </p>
          </div>
        </div>
      </section>

      {/* SPECIALTIES GRID - DISTINCT MINT & EMERALD COLOR THEME */}
      <section id="specialties" className="bg-gradient-to-b from-[#e6f7f2] via-[#f0fdf9] to-white py-16 border-y-2 border-emerald-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white mb-2 shadow-xs">
                <Layers className="w-3.5 h-3.5" /> Danh Mục Chuyên Khoa Khám
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Chuyên Khoa Y Tế Nổi Bật
              </h2>
            </div>
            <Link href="/book">
              <Button variant="outline" size="sm" className="bg-white hover:bg-emerald-50 border-emerald-300 font-bold text-emerald-800">
                Xem Tất Cả Chuyên Khoa
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="h-52 animate-pulse bg-emerald-100/50" />
                ))
              : specialties.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex flex-col justify-between group cursor-pointer bg-white/95 rounded-2xl p-6 border-2 border-emerald-200 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-600/15 hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center group-hover:from-[#10b981] group-hover:to-teal-600 group-hover:text-white transition-all shadow-xs">
                        {getIcon(spec.iconUrl)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {spec.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                          {spec.description}
                        </p>
                      </div>
                    </div>

                    <Link href={`/book?specialtyId=${spec.id}`} className="mt-6">
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white px-3 py-1.5 rounded-xl transition-all">
                        Đặt lịch khoa này <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* OUR DOCTORS - DISTINCT OCEAN SKY & BLUE THEME */}
      <section className="bg-gradient-to-b from-slate-100 via-sky-50/70 to-slate-200/70 py-16 border-b-2 border-slate-300/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-800 text-white mb-2 shadow-xs">
                <Stethoscope className="w-3.5 h-3.5" /> Bác Sĩ Tiêu Biểu & Giàu Kinh Nghiệm
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Đội Ngũ Chuyên Gia Đầu Ngành
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Các Bác sĩ Chuyên khoa I, II và Tiến sĩ y khoa với trên 10–20 năm kinh nghiệm điều trị.
              </p>
            </div>
            <Link href="/book">
              <Button variant="outline" size="sm" className="bg-white hover:bg-sky-50 border-sky-300 font-bold text-sky-800">
                Xem Lịch Khám & Đặt Hẹn ({doctors.length} Bác Sĩ)
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border-2 border-sky-200/90 shadow-md hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-900/10 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                    <img
                      src={
                        doc.user.avatarUrl ||
                        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={doc.user.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-sky-800 text-white font-bold px-3 py-1 rounded-full text-[11px] shadow-md">
                      {formatCurrency(doc.consultationFee)}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="inline-block bg-sky-100 text-sky-800 font-bold text-[11px] px-2.5 py-0.5 rounded-lg border border-sky-300/80">
                      {doc.specialty?.name}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{doc.user.fullName}</h3>
                    <p className="text-xs text-sky-700 font-semibold">{doc.degree}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.bio}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" /> {doc.experienceYears} năm KN
                  </div>
                  <Link href={`/book?doctorId=${doc.id}&specialtyId=${doc.specialtyId}`}>
                    <Button size="sm" className="bg-sky-700 hover:bg-sky-800 text-white font-bold shadow-sm">
                      Đặt Khám
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOTLINE & CONTACT SECTION (ANCHOR SECTION: id="contact") */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-emerald-700/50">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/30 text-emerald-300 border border-emerald-400/40">
              📞 Tổng Đài Tư Vấn Trực Tuyến & Liên Hệ
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Bạn Cần Tư Vấn & Đặt Lịch Qua Điện Thoại?
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Đội ngũ y tá và tư vấn viên của phòng khám CarePlus+ luôn sẵn sàng lắng nghe, hỗ trợ chọn bác sĩ và sắp xếp thời gian khám phù hợp nhất cho bạn.
            </p>
          </div>

          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xl w-full md:w-auto text-center md:text-left space-y-2 shrink-0 border-2 border-emerald-400">
            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <PhoneCall className="w-4 h-4 text-emerald-600" /> Hotline Đặt Lịch
            </p>
            <p className="text-3xl font-black text-emerald-600">090-123-4567</p>
            <p className="text-xs font-medium text-slate-500">Giờ làm việc: 08:00 - 17:00 hàng ngày</p>
          </div>
        </div>
      </section>
    </div>
  );
}
