import type { Metadata } from 'next';
import './globals.css';
import { RoleSwitcherBanner } from '@/components/layout/RoleSwitcherBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'CarePlus+ — Hệ Thống Phòng Khám Đặt Lịch & Theo Dõi Hồ Sơ Y Tế',
  description: 'Đặt lịch khám bệnh trực tuyến nhanh chóng, chọn bác sĩ chuyên khoa và xem đơn thuốc điện tử an toàn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-[#F7F9FA] text-slate-800 antialiased">
        <RoleSwitcherBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
