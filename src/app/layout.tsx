import type { Metadata } from 'next';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { RoleSwitcherBanner } from '@/components/layout/RoleSwitcherBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CarePlus+ — Hệ Thống Phòng Khám Đặt Lịch & Theo Dõi Hồ Sơ Y Tế',
  description: 'Đặt lịch khám bệnh trực tuyến nhanh chóng, chọn bác sĩ chuyên khoa và xem đơn thuốc điện tử an toàn.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#F7F9FA] text-slate-800 antialiased font-sans">
        <RoleSwitcherBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
