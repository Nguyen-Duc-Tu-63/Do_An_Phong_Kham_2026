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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#10b981] text-white flex items-center justify-center mx-auto font-bold shadow-lg shadow-emerald-500/25">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Đăng Ký Bệnh Nhân</h1>
          <p className="text-xs text-slate-500">
            Chỉ cần <strong>Số Điện Thoại</strong> để tạo tài khoản theo dõi lịch hẹn & đơn thuốc
          </p>
        </div>

        {/* BENEFIT CALLOUT */}
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5 shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Không cần email phức tạp:</strong> Số điện thoại là tên đăng nhập duy nhất giúp bạn nhận thông báo và tra cứu hồ sơ nhanh chóng.
          </p>
        </div>

        <Card className="p-6 md:p-8 border-2 border-slate-200 shadow-card">
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

            <Button type="submit" isLoading={isLoading} className="w-full shadow-lg bg-[#10b981] hover:bg-emerald-600">
              Đăng Ký Bằng Số Điện Thoại
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Đã có tài khoản bệnh nhân?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Đăng Nhập Tại Đây
          </Link>
        </p>
      </div>
    </div>
  );
}
