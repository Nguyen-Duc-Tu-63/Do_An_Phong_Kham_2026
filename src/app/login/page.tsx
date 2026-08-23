'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  HeartPulse,
  Phone,
  Lock,
  Shield,
  Stethoscope,
  User,
  Sparkles,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<number>(1);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!password) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Xin chào quay trở lại, ${data.user.fullName}!`);
        if (data.user.role === 'ADMIN') router.push('/admin');
        else if (data.user.role === 'DOCTOR') router.push('/doctor');
        else router.push('/dashboard');
      } else {
        toast.error(data.error || 'Số điện thoại hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      toast.error('Lỗi kết nối khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'ADMIN' | 'DOCTOR' | 'PATIENT') => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          `Đã đăng nhập vai trò ${
            role === 'ADMIN' ? 'Quản lý' : role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'
          } (${data.user.fullName})`
        );
        if (role === 'ADMIN') router.push('/admin');
        else if (role === 'DOCTOR') router.push('/doctor');
        else router.push('/dashboard');
      }
    } catch (e) {
      toast.error('Lỗi đăng nhập nhanh');
    }
  };

  // Step 1: Send OTP for password recovery
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim() || forgotPhone.trim().length < 9) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ (10 số)');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedOtp(data.otp);
        setForgotOtp(data.otp); // Pre-fill for user convenience in demo
        setForgotStep(2);
        toast.success(`Mã OTP xác thực đã được gửi về SĐT ${forgotPhone}`);
      } else {
        toast.error(data.error || 'Không thể gửi mã OTP');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim()) {
      toast.error('Vui lòng nhập mã OTP xác thực');
      return;
    }
    if (forgotNewPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error('Xác nhận mật khẩu mới không khớp');
      return;
    }

    setIsResettingPassword(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: forgotPhone.trim(),
          otp: forgotOtp.trim(),
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
        setPhone(forgotPhone.trim());
        setPassword(forgotNewPassword);
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setForgotPhone('');
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      } else {
        toast.error(data.error || 'Đặt lại mật khẩu thất bại');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsResettingPassword(false);
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
            Đăng Nhập CarePlus+
          </h1>
          <p className="text-xs text-emerald-100/90 font-medium drop-shadow-sm">
            Dùng <strong className="text-white font-bold">Số Điện Thoại</strong> để truy cập hồ sơ bệnh nhân hoặc tài khoản bác sĩ / quản lý
          </p>
        </div>

        {/* DEMO ACCOUNTS BOX */}
        <div className="bg-white/90 backdrop-blur-md border border-emerald-200/80 p-4 rounded-2xl space-y-3 shadow-xl shadow-slate-950/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Nút Đăng Nhập Nhanh Trải Nghiệm Demo:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('PATIENT')}
              className="p-2.5 bg-white/90 hover:bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-slate-800 flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-400 group"
            >
              <User className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" /> Bệnh Nhân
              <span className="text-[10px] text-slate-400 font-normal">0901234567</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('DOCTOR')}
              className="p-2.5 bg-white/90 hover:bg-sky-50 rounded-xl border border-emerald-200 text-xs font-bold text-slate-800 flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-sky-400 group"
            >
              <Stethoscope className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" /> Bác Sĩ
              <span className="text-[10px] text-slate-400 font-normal">0912345601</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="p-2.5 bg-white/90 hover:bg-purple-50 rounded-xl border border-emerald-200 text-xs font-bold text-slate-800 flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-purple-400 group"
            >
              <Shield className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" /> Quản Lý
              <span className="text-[10px] text-slate-400 font-normal">0909000001</span>
            </button>
          </div>
        </div>

        <Card className="p-6 md:p-8 bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-950/20 rounded-3xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Số Điện Thoại Đăng Nhập *"
              type="tel"
              placeholder="Ví dụ: 0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4 text-emerald-600" />}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mật Khẩu *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPhone(phone || '');
                    setForgotStep(1);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Quên mật khẩu?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>(Mật khẩu mặc định: <strong className="text-slate-700 font-mono">password123</strong>)</span>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full shadow-lg shadow-emerald-500/25 bg-gradient-to-r from-[#10b981] to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold py-2.5 rounded-xl transition-all">
              Đăng Nhập Bằng Số Điện Thoại
            </Button>
          </form>
        </Card>

        {/* EXTRA HELP OPTIONS */}
        <div className="bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-lg shadow-slate-950/10 space-y-2.5 text-center text-xs text-slate-600">
          <p>
            Chưa có tài khoản bệnh nhân?{' '}
            <Link href="/register" className="font-bold text-emerald-600 hover:underline">
              Đăng Ký Bằng SĐT Tại Đây
            </Link>
          </p>
          <div className="pt-2 border-t border-slate-200/80">
            <Link href="/dashboard" className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-600 transition-colors">
              ⚡ Hoặc tra cứu nhanh hồ sơ bằng SĐT (Không cần mật khẩu) <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <Dialog
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Khôi Phục Mật Khẩu Bệnh Nhân"
        description="Lấy lại quyền truy cập tài khoản dễ dàng qua Số Điện Thoại"
        maxWidth="md"
      >
        <div className="space-y-6 p-2">
          {forgotStep === 1 ? (
            /* STEP 1: ENTER PHONE NUMBER */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Xác thực số điện thoại:
                </p>
                <p className="leading-relaxed">
                  Nhập số điện thoại đã đăng ký để hệ thống gửi mã xác thực OTP đặt lại mật khẩu mới.
                </p>
              </div>

              <Input
                label="Số Điện Thoại Đã Đăng Ký *"
                type="tel"
                placeholder="Ví dụ: 0901234567"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                icon={<Phone className="w-4 h-4 text-emerald-600" />}
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsForgotModalOpen(false)}>
                  Hủy Bỏ
                </Button>
                <Button type="submit" isLoading={isSendingOtp} className="bg-[#10b981] hover:bg-emerald-600 font-bold">
                  Gửi Mã Xác Thực OTP <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP AND SET NEW PASSWORD */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mã xác thực OTP đã sẵn sàng:
                </p>
                <p>
                  Mã OTP gửi về SĐT <strong>{forgotPhone}</strong> là: <strong className="text-emerald-700 text-sm bg-white px-2 py-0.5 rounded border border-emerald-300">{generatedOtp || '123456'}</strong>
                </p>
              </div>

              <Input
                label="Nhập Mã Xác Thực OTP (6 số) *"
                placeholder="Ví dụ: 123456"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
                required
              />

              <Input
                label="Mật Khẩu Mới (Ít nhất 6 ký tự) *"
                type="password"
                placeholder="••••••••"
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Xác Nhận Mật Khẩu Mới *"
                type="password"
                placeholder="••••••••"
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="ghost" onClick={() => setForgotStep(1)} className="text-xs text-slate-500">
                  ← Nhập lại SĐT khác
                </Button>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsForgotModalOpen(false)}>
                    Hủy Bỏ
                  </Button>
                  <Button type="submit" isLoading={isResettingPassword} className="bg-[#10b981] hover:bg-emerald-600 font-bold">
                    Xác Nhận Đổi Mật Khẩu
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
}
