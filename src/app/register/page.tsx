'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HeartPulse, Lock, User, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ (10 số)');
      return;
    }
    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        try {
          localStorage.setItem('careplus_patient_phone', phone.trim());
        } catch (e) {}
        toast.success(`Đăng ký tài khoản thành công! Xin chào ${data.user.fullName}`);
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Đăng ký thất bại');
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 md:py-16 overflow-hidden">
      {/* BACKGROUND IMAGE WITH BLUR & MEDICAL GRADIENT OVERLAYS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 filter blur-[8px] md:blur-[10px] transform"
          style={{
            backgroundImage: "url('/images/medical-auth-bg.jpg')",
          }}
        />
        {/* Deep frosted medical overlay for contrast and sleek appearance */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/45 to-emerald-950/70" />
        <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10b981] to-teal-400 text-white flex items-center justify-center mx-auto font-bold shadow-xl shadow-emerald-500/30 ring-4 ring-white/30 backdrop-blur-sm">
            <HeartPulse className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            Đăng Ký Bệnh Nhân
          </h1>
          <p className="text-xs text-emerald-100/90 font-medium drop-shadow-sm">
            Chỉ cần <strong className="text-white font-bold">Số Điện Thoại</strong> để tạo tài khoản theo dõi lịch hẹn & đơn thuốc
          </p>
        </div>

        {/* BENEFIT CALLOUT */}
        <div className="bg-white/90 backdrop-blur-md border border-emerald-200/80 p-4 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5 shadow-xl shadow-slate-950/10">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-emerald-900">Không cần email phức tạp:</strong> Số điện thoại là tên đăng nhập duy nhất giúp bạn nhận thông báo và tra cứu hồ sơ nhanh chóng.
          </p>
        </div>

        <Card className="p-6 md:p-8 bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-950/20 rounded-3xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Họ và Tên Bệnh Nhân *"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Số Điện Thoại (10 Số) *"
              type="tel"
              placeholder="0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4 text-emerald-600 font-bold" />}
              required
            />

            <Input
              label="Mật Khẩu (Ít nhất 6 ký tự) *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Xác Nhận Mật Khẩu *"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button type="submit" isLoading={isLoading} className="w-full shadow-lg shadow-emerald-500/25 bg-gradient-to-r from-[#10b981] to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold py-2.5 rounded-xl transition-all">
              Đăng Ký Bằng Số Điện Thoại
            </Button>
          </form>
        </Card>

        <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-3.5 shadow-lg shadow-slate-950/10 text-center text-xs text-slate-600">
          Đã có tài khoản bệnh nhân?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Đăng Nhập Tại Đây
          </Link>
        </div>
      </div>
    </div>
  );
}
