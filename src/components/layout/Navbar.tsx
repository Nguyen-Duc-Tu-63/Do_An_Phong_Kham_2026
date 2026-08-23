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
  Menu,
  X,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false); // Close mobile menu on page transition
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Đã đăng xuất thành công');
      setUser(null);
      setIsMobileMenuOpen(false);
      router.push('/login');
    } catch (e) {
      toast.error('Lỗi đăng xuất');
    }
  };

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
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
      <div className="w-full px-3 sm:px-6 lg:px-10 xl:px-12 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 group min-w-0"
          title="Về Trang Chủ Phòng Khám CarePlus+"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#4fc3a1] flex items-center justify-center text-white shadow-md shadow-[#4fc3a1]/30 group-hover:scale-105 transition-transform shrink-0">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight block group-hover:text-[#4fc3a1] transition-colors leading-tight truncate">
              Phòng Khám CarePlus+
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 block truncate">
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

        {/* Center Nav Links - DESKTOP ONLY */}
        {user?.role === 'ADMIN' ? (
          /* 1. ADMIN - Desktop */
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 text-slate-800 hover:text-[#4fc3a1] transition-colors whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4fc3a1]/10 flex items-center justify-center text-[#4fc3a1] shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight">Quản Lý Phòng Khám</span>
            </Link>
          </div>
        ) : user?.role === 'DOCTOR' ? (
          /* 2. DOCTOR - Desktop */
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/doctor"
              className="flex items-center gap-2.5 text-slate-800 hover:text-[#4fc3a1] transition-colors whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4fc3a1]/10 flex items-center justify-center text-[#4fc3a1] shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight">Bàn Làm Việc Bác Sĩ</span>
            </Link>
          </div>
        ) : user?.role === 'PATIENT' ? (
          /* 3. PATIENT - Desktop */
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            <Link
              href="/"
              className={`text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
                pathname === '/'
                  ? 'text-[#4fc3a1] font-bold'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              Trang Chủ
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('specialties')}
              className="text-sm font-semibold text-slate-600 hover:text-[#4fc3a1] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
            >
              <Layers className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Chuyên Khoa
            </button>

            <Link
              href="/book"
              className={`text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap py-1 ${
                pathname.startsWith('/book')
                  ? 'text-[#4fc3a1] font-bold'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Đặt Lịch Khám
            </Link>

            <Link
              href="/dashboard"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap py-1 px-3 rounded-xl border ${
                pathname.startsWith('/dashboard')
                  ? 'text-[#4fc3a1] font-bold bg-[#4fc3a1]/10 border-[#4fc3a1]/25'
                  : 'text-slate-600 hover:text-[#4fc3a1] border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Hồ Sơ Của Tôi
            </Link>
          </nav>
        ) : (
          /* 4. PUBLIC GUEST - Desktop */
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            <Link
              href="/"
              className={`text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
                pathname === '/'
                  ? 'text-[#4fc3a1] font-bold'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              Trang Chủ
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('specialties')}
              className="text-sm font-semibold text-slate-600 hover:text-[#4fc3a1] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
            >
              <Layers className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Chuyên Khoa
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="text-sm font-semibold text-slate-600 hover:text-[#4fc3a1] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap py-1"
            >
              <Phone className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Liên Hệ
            </button>

            <Link
              href="/book"
              className={`text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap py-1 ${
                pathname.startsWith('/book')
                  ? 'text-[#4fc3a1] font-bold'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Đặt Lịch Khám
            </Link>

            <Link
              href="/dashboard"
              className={`text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap py-1 ${
                pathname.startsWith('/dashboard')
                  ? 'text-[#4fc3a1] font-bold'
                  : 'text-slate-600 hover:text-[#4fc3a1]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#4fc3a1] shrink-0" /> Theo Dõi Hồ Sơ
            </Link>
          </nav>
        )}

        {/* Right Actions - DESKTOP */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl shrink-0 shadow-xs">
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                  }
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-400 shrink-0"
                />
                <div className="text-left whitespace-nowrap">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">{user.fullName}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    {user.role === 'ADMIN' ? 'Quản lý' : user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 border border-slate-200 shrink-0 rounded-xl"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0 mr-1" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
              <Link href="/login" className="shrink-0">
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Đăng Nhập</span>
                </button>
              </Link>

              <Link href="/register" className="shrink-0">
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Đăng Ký</span>
                </button>
              </Link>

              <Link href="/book" className="shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-md shadow-emerald-500/30 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Đặt Khám Ngay</span>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE & TABLET HAMBURGER BUTTON */}
        <div className="flex lg:hidden items-center gap-2">
          {!user && (
            <Link href="/book" className="shrink-0">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#10b981] hover:bg-emerald-600 shadow-sm flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Đặt Khám</span>
              </button>
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl">
              <img
                src={
                  user.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                }
                alt={user.fullName}
                className="w-6 h-6 rounded-full object-cover border border-emerald-400 shrink-0"
              />
              <span className="text-xs font-bold text-slate-700 max-w-[80px] truncate">{user.fullName.split(' ').pop()}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* MOBILE & TABLET DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-emerald-100 shadow-xl px-4 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {/* USER INFO BANNER (IF LOGGED IN) */}
          {user && (
            <div className="flex items-center justify-between p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                  }
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                  <p className="text-xs font-semibold text-emerald-700 uppercase">
                    {user.role === 'ADMIN' ? 'Quản lý / Lễ tân' : user.role === 'DOCTOR' ? 'Bác sĩ chuyên khoa' : 'Bệnh nhân'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 px-2.5 py-1"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Thoát
              </Button>
            </div>
          )}

          {/* NAVIGATION LINKS LIST */}
          <div className="grid grid-cols-1 gap-1 font-medium text-sm">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                pathname === '/' ? 'bg-emerald-50 text-[#10b981] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-5 h-5 text-[#10b981]" /> Trang Chủ Phòng Khám
            </Link>

            <button
              type="button"
              onClick={() => handleNavClick('specialties')}
              className="p-2.5 rounded-xl flex items-center gap-3 text-slate-700 hover:bg-slate-50 text-left transition-colors cursor-pointer"
            >
              <Layers className="w-5 h-5 text-[#10b981]" /> Danh Mục Chuyên Khoa
            </button>

            <Link
              href="/book"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                pathname.startsWith('/book') ? 'bg-emerald-50 text-[#10b981] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-5 h-5 text-[#10b981]" /> Đặt Lịch Khám Bệnh
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                pathname.startsWith('/dashboard') ? 'bg-emerald-50 text-[#10b981] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-[#10b981]" /> Hồ Sơ & Đơn Thuốc
            </Link>

            {user?.role === 'DOCTOR' && (
              <Link
                href="/doctor"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                  pathname.startsWith('/doctor') ? 'bg-emerald-50 text-[#10b981] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Stethoscope className="w-5 h-5 text-[#10b981]" /> Bàn Làm Việc Bác Sĩ
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                  pathname.startsWith('/admin') ? 'bg-emerald-50 text-[#10b981] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-5 h-5 text-[#10b981]" /> Hệ Thống Quản Lý
              </Link>
            )}
          </div>

          {/* GUEST ACTIONS IN MOBILE MENU */}
          {!user && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-bold text-xs py-2.5 border-slate-200">
                    <UserIcon className="w-4 h-4 mr-1.5 text-slate-500" /> Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full font-bold text-xs py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <UserPlus className="w-4 h-4 mr-1.5 text-emerald-600" /> Đăng Ký
                  </Button>
                </Link>
              </div>

              <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full font-bold py-2.5 bg-[#10b981] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25">
                  <Calendar className="w-4 h-4 mr-2" /> Đặt Lịch Khám Ngay
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
