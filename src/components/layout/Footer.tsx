'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { UserSession } from '@/types';

export function Footer() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => {});
  }, [pathname]);

  // Hide footer on Doctor and Admin interfaces
  if (
    pathname?.startsWith('/doctor') ||
    pathname?.startsWith('/admin') ||
    user?.role === 'DOCTOR' ||
    user?.role === 'ADMIN'
  ) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#4fc3a1] flex items-center justify-center text-white font-bold">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Phòng Khám CarePlus+</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Hệ thống phòng khám đa khoa hiện đại, tận tâm mang lại trải nghiệm khám chữa bệnh dễ dàng, tư vấn tận tình và theo dõi đơn thuốc điện tử an toàn.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-[#4fc3a1] border border-[#4fc3a1]/20">
                ● Hỗ trợ tư vấn 24/7
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Danh Mục Chính</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-[#4fc3a1] transition-colors">
                  Trang chủ & Chuyên khoa
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#4fc3a1] transition-colors">
                  Đặt lịch khám bệnh
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#4fc3a1] transition-colors">
                  Theo dõi hồ sơ & Lịch hẹn
                </Link>
              </li>
              <li>
                <Link href="/doctor" className="hover:text-[#4fc3a1] transition-colors">
                  Dành cho Bác sĩ
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#4fc3a1] transition-colors">
                  Dành cho Quản lý / Lễ tân
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Địa Chỉ Phòng Khám</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4fc3a1] shrink-0 mt-0.5" />
                <span>Số 123 Đường Y Học, Tòa nhà CarePlus+, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4fc3a1] shrink-0" />
                <span>Hotline: 090-123-4567 / (028) 3838-9999</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4fc3a1] shrink-0" />
                <span>datlich@careplus.vn</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Working Hours */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Giờ Làm Việc</h4>
            <div className="space-y-2 text-xs bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
              <div className="flex justify-between pb-2 border-b border-slate-700/60">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#4fc3a1]" /> Thứ 2 - Thứ 6:
                </span>
                <span className="font-semibold text-white">08:00 - 17:00</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-700/60">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#4fc3a1]" /> Thứ 7:
                </span>
                <span className="font-semibold text-white">08:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-rose-400" /> Chủ Nhật:
                </span>
                <span className="font-semibold text-rose-400">Nghỉ (Chỉ cấp cứu)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Hệ Thống Phòng Khám Đa Khoa CarePlus+. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-slate-400 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-slate-400 cursor-pointer">Quy trình khám bệnh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
