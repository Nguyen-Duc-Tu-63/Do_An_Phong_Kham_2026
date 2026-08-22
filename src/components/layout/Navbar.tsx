'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserSession } from '@/types';
import { Button } from '@/components/ui/button';
import {
  HeartPulse,
  Calendar,
  LayoutDashboard,
  Stethoscope,
  Shield,
  LogOut,
  User as UserIcon,
  UserPlus,
  Layers,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Đã đăng xuất thành công');
      setUser(null);
      router.push('/login');
    } catch (e) {
      toast.error('Lỗi đăng xuất');
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Logo - Pushed Left & Enlarged Font Size */}
        <Link
          href={
            user?.role === 'ADMIN'
              ? '/admin'
              : user?.role === 'DOCTOR'
              ? '/doctor'
              : user?.role === 'PATIENT'
              ? '/dashboard'
              : '/'
          }
          className="flex items-center gap-3.5 shrink-0 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#4fc3a1] flex items-center justify-center text-white shadow-md shadow-[#4fc3a1]/30 group-hover:scale-105 transition-transform shrink-0">
            <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="whitespace-nowrap">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight block group-hover:text-[#4fc3a1] transition-colors leading-tight">
              Phòng Khám CarePlus+
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 block mt-0.5">
              {user?.role === 'ADMIN'
                ? 'Hệ thống Quản lý / Lễ tân'
                : user?.role === 'DOCTOR'
                ? 'Cổng làm việc Bác sĩ'
                : user?.role === 'PATIENT'
                ? 'Theo dõi hồ sơ y tế'
                : 'Chăm sóc sức khỏe uy tín'}
            </span>
          </div>
        </Link>

        {/* Center Nav Links - STRICT ROLE SEPARATION */}
        {user?.role === 'ADMIN' ? (
          /* 1. ADMIN / MANAGER ONLY - Title only */
          <div className="hidden md:flex items-center shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 text-slate-800 hover:text-[#4fc3a1] transition-colors whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4fc3a1]/10 flex items-center justify-center text-[#4fc3a1] shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Quản Lý Phòng Khám</span>
            </Link>
          </div>
        ) : user?.role === 'DOCTOR' ? (
          /* 2. DOCTOR ONLY - Title only */
          <div className="hidden md:flex items-center shrink-0">
            <Link
              href="/doctor"
              className="flex items-center gap-2.5 text-slate-800 hover:text-[#4fc3a1] transition-colors whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4fc3a1]/10 flex items-center justify-center text-[#4fc3a1] shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Bàn Làm Việc Bác Sĩ</span>
            </Link>
          </div>
        ) : user?.role === 'PATIENT' ? (
          /* 3. PATIENT ONLY - Title only */
          <div className="hidden md:flex items-center shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 text-slate-800 hover:text-[#4fc3a1] transition-colors whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4fc3a1]/10 flex items-center justify-center text-[#4fc3a1] shrink-0">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Theo Dõi Hồ Sơ</span>
            </Link>
          </div>
        ) : (
          /* 4. PUBLIC GUEST (CHƯA ĐĂNG NHẬP) - Clean evenly-spaced menu, guaranteed no text wrapping */
          <nav className="flex items-center gap-3.5 md:gap-5 lg:gap-6 xl:gap-8 shrink-0">
            <Link
              href="/"
              className={`text-xs md:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
                pathname === '/'
                  ? 'text-[#4fc3a1]'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              Trang Chủ
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('specialties')}
              className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#4fc3a1] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
            >
              <Layers className="w-3.5 h-3.5 text-[#4fc3a1] shrink-0" /> Chuyên Khoa
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="text-xs md:text-sm font-semibold text-slate-600 hover:text-[#4fc3a1] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
            >
              <Phone className="w-3.5 h-3.5 text-[#4fc3a1] shrink-0" /> Liên Hệ
            </button>

            <Link
              href="/book"
              className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap py-1 ${
                pathname.startsWith('/book')
                  ? 'text-[#4fc3a1]'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#4fc3a1] shrink-0" /> Đặt Lịch Khám
            </Link>

            <Link
              href="/dashboard"
              className={`text-xs md:text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap py-1 ${
                pathname.startsWith('/dashboard')
                  ? 'text-[#4fc3a1]'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#4fc3a1] shrink-0" /> Theo Dõi Hồ Sơ
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 px-4 py-2 rounded-2xl shrink-0 shadow-xs">
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                  }
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                />
                <div className="hidden sm:block text-left whitespace-nowrap">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.fullName}</p>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase mt-0.5">
                    {user.role === 'ADMIN' ? 'Quản lý' : user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 border-2 border-slate-200 shrink-0 rounded-xl"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4 shrink-0 mr-1" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link href="/login" className="shrink-0">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Đăng Nhập</span>
                </button>
              </Link>

              <Link href="/register" className="shrink-0">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-300 shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đăng Ký</span>
                </button>
              </Link>

              <Link href="/book" className="shrink-0">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-white shrink-0" />
                  <span>Đặt Khám Ngay</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
