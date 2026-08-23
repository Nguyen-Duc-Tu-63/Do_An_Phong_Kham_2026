'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { Shield, User, Stethoscope, Sparkles, UserX } from 'lucide-react';
import { toast } from 'sonner';

export function RoleSwitcherBanner() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>('');

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCurrentRole(data.user.role);
        setUserName(data.user.fullName);
      } else {
        setCurrentRole(null);
        setUserName('Khách (Chưa đăng nhập)');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleSwitchRole = async (targetRole: UserRole | 'GUEST') => {
    try {
      if (targetRole === 'GUEST') {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Đã chuyển về giao diện Khách chưa đăng nhập');
        window.location.href = '/';
        return;
      }

      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Đã đăng nhập vai trò ${targetRole === 'ADMIN' ? 'Quản lý' : targetRole === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'} (${data.user.fullName})`);
        if (targetRole === 'ADMIN') window.location.href = '/admin';
        else if (targetRole === 'DOCTOR') window.location.href = '/doctor';
        else window.location.href = '/dashboard';
      } else {
        toast.error('Lỗi chuyển vai trò');
      }
    } catch (err) {
      toast.error('Lỗi chuyển vai trò');
    }
  };

  return (
    <div className="bg-slate-900 text-white text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 gap-1.5 sm:gap-2">
      <div className="flex items-center justify-between sm:justify-start gap-2">
        <span className="flex items-center gap-1 bg-[#4fc3a1]/20 text-[#4fc3a1] px-2 py-0.5 rounded-full font-semibold border border-[#4fc3a1]/30 whitespace-nowrap text-[10px] sm:text-xs">
          <Sparkles className="w-3 h-3 shrink-0" /> THANH DEMO
        </span>
        <span className="text-slate-300 text-[11px] sm:text-xs truncate max-w-[200px] sm:max-w-none">
          <strong className="text-white">{userName || 'Đang tải...'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0 shrink-0">
        <span className="text-slate-400 font-medium mr-1 text-[11px] sm:text-xs hidden md:inline shrink-0">Chuyển vai trò:</span>

        <button
          onClick={() => handleSwitchRole('GUEST')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs whitespace-nowrap shrink-0 ${
            currentRole === null
              ? 'bg-amber-500 text-white font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Giao diện Khách chưa đăng nhập"
        >
          <UserX className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Khách
        </button>

        <button
          onClick={() => handleSwitchRole('PATIENT')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs whitespace-nowrap shrink-0 ${
            currentRole === 'PATIENT'
              ? 'bg-[#4fc3a1] text-white font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Giao diện Bệnh Nhân"
        >
          <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Bệnh Nhân
        </button>

        <button
          onClick={() => handleSwitchRole('DOCTOR')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs whitespace-nowrap shrink-0 ${
            currentRole === 'DOCTOR'
              ? 'bg-[#4fc3a1] text-white font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Giao diện Bác Sĩ"
        >
          <Stethoscope className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Bác Sĩ
        </button>

        <button
          onClick={() => handleSwitchRole('ADMIN')}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs whitespace-nowrap shrink-0 ${
            currentRole === 'ADMIN'
              ? 'bg-[#4fc3a1] text-white font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Giao diện Quản Lý"
        >
          <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> Quản Lý
        </button>
      </div>
    </div>
  );
}
