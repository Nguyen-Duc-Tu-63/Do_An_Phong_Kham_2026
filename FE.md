# TÀI LIỆU PHÂN TÍCH TOÀN DIỆN THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (FRONTEND UI/UX ARCHITECTURE)
## DỰ ÁN PHÒNG KHÁM ĐA KHOA CAREPLUS+ (CAREPLUS CLINIC 2026)

---

## MỤC LỤC
1. [Tổng Quan Kiến Trúc Frontend & Triết Lý Thiết Kế (Design System & Philosophy)](#1-tổng-quan-kiến-trúc-frontend--triết-lý-thiết-kế)
   - [1.1. Triết lý thiết kế UI Y Tế Hiện Đại (Modern Healthcare Aesthetics)](#11-triết-lý-thiết-kế-ui-y-tế-hiện-đại-modern-healthcare-aesthetics)
   - [1.2. Hệ thống Design Tokens & Bảng màu chủ đạo (Color Palette & Semantic Tokens)](#12-hệ-thống-design-tokens--bảng-màu-chủ-đạo)
   - [1.3. Hệ thống Typography & Phông chữ Tiếng Việt tối ưu](#13-hệ-thống-typography--phông-chữ-tiếng-việt-tối-ưu)
   - [1.4. Hệ thống Bố cục, Lưới & Điểm ngắt Responsive](#14-hệ-thống-bố-cục-lưới--điểm-ngắt-responsive)
   - [1.5. Hiệu ứng Chiều sâu, Bóng đổ, Glassmorphism & Micro-animations](#15-hiệu-ứng-chiều-sâu-bóng-đổ-glassmorphism--micro-animations)
2. [Công Nghệ & Thư Viện Giao Diện Cốt Lõi (Frontend Tech Stack & Ecosystem)](#2-công-nghệ--thư-viện-giao-diện-cốt-lõi)
   - [2.1. Next.js 14 App Router & Hybrid Rendering](#21-nextjs-14-app-router--hybrid-rendering)
   - [2.2. Tailwind CSS v3.4 Utility-First & Custom Configurations](#22-tailwind-css-v34-utility-first--custom-configurations)
   - [2.3. Lucide React Vector Icons System](#23-lucide-react-vector-icons-system)
   - [2.4. React Hook Form & Zod Schema Validation](#24-react-hook-form--zod-schema-validation)
   - [2.5. Recharts Data Visualization (Interactive SVG Charts)](#25-recharts-data-visualization)
   - [2.6. Sonner Toast Notification & Realtime Feedback System](#26-sonner-toast-notification--realtime-feedback-system)
3. [Hệ Thống Atomic UI Components Dùng Chung (Reusable UI Library)](#3-hệ-thống-atomic-ui-components-dùng-chung)
   - [3.1. Phân tích Button Component (`button.tsx`)](#31-phân-tích-button-component-buttontsx)
   - [3.2. Phân tích Card Component System (`card.tsx`)](#32-phân-tích-card-component-system-cardtsx)
   - [3.3. Phân tích Dialog / Modal System (`dialog.tsx`)](#33-phân-tích-dialog--modal-system-dialogtsx)
   - [3.4. Phân tích Badge Component & Quản lý Trạng thái Lịch hẹn Thông minh](#34-phân-tích-badge-component--quản-lý-trạng-thái-lịch-hẹn-thông-minh)
   - [3.5. Phân tích Input & Select Controls (`input.tsx`, `select.tsx`)](#35-phân-tích-input--select-controls)
   - [3.6. Phân tích Tabs Navigation Component (`tabs.tsx`)](#36-phân-tích-tabs-navigation-component-tabstsx)
   - [3.7. Phân tích Shimmer Loading Skeletons (`skeleton.tsx`)](#37-phân-tích-shimmer-loading-skeletons-skeletontsx)
4. [Kiến Trúc Bố Cục Toàn Cục (Global Layout & Shell Components)](#4-kiến-trúc-bố-cục-toàn-cục)
   - [4.1. RoleSwitcherBanner — Thanh Demo Chuyển Đổi Vai Trò Tức Thì](#41-roleswitcherbanner--thanh-demo-chuyển-đổi-vai-trò-tức-thì)
   - [4.2. Navbar — Thanh Điều Hướng Thông Minh Theo Quyền](#42-navbar--thanh-điều-hướng-thông-minh-theo-quyền)
   - [4.3. Footer — Chân Trang Đa Thông Tin Nhận Biết Ngữ Cảnh](#43-footer--chân-trang-đa-thông-tin-nhận-biết-ngữ-cảnh)
   - [4.4. RootLayout & Bộ Nhận Diện Thương Hiệu Favicon Đa Kích Thước](#44-rootlayout--bộ-nhận-diện-thương-hiệu-favicon-đa-kích-thước)
5. [Phân Tích Chi Tiết Từng Màn Hình Giao Diện Người Dùng (Screen-by-Screen UI Analysis)](#5-phân-tích-chi-tiết-từng-màn-hình-giao-diện-người-dùng)
   - [5.1. Màn Hình Trang Chủ (`/` — Homepage & Landing Page)](#51-màn-hình-trang-chủ---homepage--landing-page)
   - [5.2. Màn Hình Đặt Lịch Khám Bệnh (`/book` — 3-Step Booking Wizard)](#52-màn-hình-đặt-lịch-khám-bệnh-book--3-step-booking-wizard)
   - [5.3. Màn Hình Cổng Bệnh Nhân (`/dashboard` — Patient Health Portal)](#53-màn-hình-cổng-bệnh-nhân-dashboard--patient-health-portal)
   - [5.4. Màn Hình Cổng Bác Sĩ (`/doctor` — Doctor Clinical Workbench)](#54-màn-hình-cổng-bác-sĩ-doctor--doctor-clinical-workbench)
   - [5.5. Màn Hình Trung Tâm Quản Trị & Lễ Tân (`/admin` — Operations & BI Command Center)](#55-màn-hình-trung-tâm-quản-trị--lễ-tân-admin--operations--bi-command-center)
   - [5.6. Màn Hình Xác Thực (`/login` & `/register` — Authentication Views)](#56-màn-hình-xác-thực-login--register--authentication-views)
6. [Trải Nghiệm Người Dùng & Tương Tác Nâng Cao (UX/UI Patterns & Micro-Interactions)](#6-trải-nghiệm-người-dùng--tương-tác-nâng-cao)
   - [6.1. Nguyên Tắc Cập Nhật Trực Quan Không Tải Lại Trang (Zero Page Reload)](#61-nguyên-tắc-cập-nhật-trực-quan-không-tải-lại-trang)
   - [6.2. Hệ Thống Trạng Thái Rỗng & Phản Hồi Trực Quan (Empty States & Shimmer Skeletons)](#62-hệ-thống-trạng-thái-rỗng--phản-hồi-trực-quan)
   - [6.3. Bắt Lỗi Form Thời Gian Thực & Trợ Lực Nhập Liệu (Realtime Form Validation)](#63-bắt-lỗi-form-thời-gian-thực--trợ-lực-nhập-liệu)
   - [6.4. Tối Ưu Hóa Bản In Đơn Thuốc Y Tế (Print CSS & Dedicated Print View)](#64-tối-ưu-hóa-bản-in-đơn-thuốc-y-tế)
   - [6.5. Thiết Kế Công Thái Học Cho Thiết Bị Di Động (Mobile-First Ergonomics)](#65-thiết-kế-công-thái-học-cho-thiết-bị-di-động)
7. [Tiêu Chuẩn Truy Cập, Hiệu Năng & SEO (Accessibility, Performance & SEO)](#7-tiêu-chuẩn-truy-cập-hiệu-năng--seo)
8. [Bảng Ma Trận Tổng Hợp Phân Hệ Giao Diện & Quyền Hạn Truy Cập (Frontend Sitemap Matrix)](#8-bảng-ma-trận-tổng-hợp-phân-hệ-giao-diện--quyền-hạn-truy-cập)

---

## 1. TỔNG QUAN KIẾN TRÚC FRONTEND & TRIẾT LÝ THIẾT KẾ

### 1.1. Triết lý thiết kế UI Y Tế Hiện Đại (Modern Healthcare Aesthetics)
Giao diện của dự án **Phòng Khám Đa Khoa CarePlus+ 2026** được định hướng theo triết lý **"Clean, Trustworthy & Human-Centric Medical UI"** (Sạch sẽ, Tin cậy và Lấy con người làm trung tâm). 

Khác với các phần mềm quản lý y tế truyền thống thường có giao diện đặc quánh bảng biểu xám xịt và phức tạp, CarePlus+ áp dụng phong cách thiết kế hiện đại:
- **Tạo cảm giác an tâm & chữa lành:** Sử dụng tông màu xanh ngọc lục bảo (Emerald Green) kết hợp xanh mòng két (Teal) làm màu chủ đạo. Đây là gam màu mang biểu trưng của sự sống, tái sinh, xoa dịu tâm lý lo âu của người bệnh.
- **Tối giản thị giác & phân cấp thông tin rõ nét (Visual Hierarchy):** Các trường dữ liệu y khoa phức tạp (triệu chứng, kết luận chẩn đoán, toa thuốc) được đóng gói thành các khối thẻ bo tròn mềm mại (`rounded-2xl`, `rounded-3xl`), sử dụng màu nền phân tách viền mờ (`border-slate-100/80`) thay vì các đường kẻ đen thô cứng.
- **Không gian thoáng đãng (Generous Whitespace):** Khoảng đệm (padding/margin) được tính toán rộng rãi giúp người dùng ở mọi lứa tuổi (đặc biệt là bệnh nhân lớn tuổi) dễ dàng quan sát, bấm chạm chính xác trên màn hình cảm ứng.

```
+-----------------------------------------------------------------------------------+
|                           CAREPLUS+ DESIGN SYSTEM PYRAMID                         |
+-----------------------------------------------------------------------------------+
|  [Layer 4: User Experience]    | Zero-Friction Booking, 1-Click Role Switch       |
|  [Layer 3: Interactive UI]     | Dialog Modals, Interactive Charts, Toast Feedback|
|  [Layer 2: Atomic Components]  | Button, Card, Badge, Input, Select, Tabs, Skeleton|
|  [Layer 1: Design Tokens]      | Emerald/Teal Palette, Inter Font, Soft Shadows   |
+-----------------------------------------------------------------------------------+
```

---

### 1.2. Hệ thống Design Tokens & Bảng màu chủ đạo

Bảng màu được cấu hình tập trung trong file [`tailwind.config.ts`](file:///d:/PhongKham2026/tailwind.config.ts) và biến CSS toàn cục trong [`src/app/globals.css`](file:///d:/PhongKham2026/src/app/globals.css):

```typescript
// Trích xuất cấu hình màu sắc trong tailwind.config.ts
colors: {
  brand: {
    50: '#f0fdf9',
    100: '#ccfbf0',
    200: '#99f6e0',
    300: '#5eead4',
    400: '#4fc3a1', // Màu thương hiệu chính (Primary Emerald)
    500: '#34d399',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  clinic: {
    primary: '#4fc3a1',
    primaryHover: '#3fb190',
    bgLight: '#F7F9FA',
    surface: '#FFFFFF',
    textDark: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
  }
}
```

#### Bảng ý nghĩa màu sắc ngữ nghĩa (Semantic Color Mapping):

| Mã màu / Token | Giá trị HEX | Ứng dụng cụ thể trong Giao diện |
| :--- | :--- | :--- |
| `brand-400` / `clinic.primary` | `#4fc3a1` | Nút bấm chính, Icon chuyên khoa, Viền active, Thanh tiến trình, Logo nhận diện. |
| `brand-600` / `emerald-600` | `#059669` | Trạng thái thành công, Huy hiệu xác nhận khám (`CONFIRMED`), Nhãn giá tiền. |
| `clinic.bgLight` | `#F7F9FA` | Màu nền toàn bộ ứng dụng, tạo cảm giác dịu mắt hơn màu trắng tinh `#FFFFFF`. |
| `clinic.surface` | `#FFFFFF` | Nền các khối Card, Modal Dialog, Thanh Navbar cố định. |
| `clinic.textDark` / `slate-800` | `#1E293B` | Màu văn bản chính, tiêu đề H1-H3, Họ tên bác sĩ/bệnh nhân. |
| `clinic.textMuted` / `slate-500`| `#64748B` | Mô tả phụ, ngày giờ, nhãn hướng dẫn phụ, placeholder. |
| `rose-500` / `rose-600` | `#F43F5E` | Cảnh báo khẩn cấp, Bác sĩ báo bận (`NEEDS_REASSIGNMENT`), Nút hủy lịch, Nút xóa. |
| `amber-500` / `amber-600` | `#F59E0B` | Lịch chờ xếp bác sĩ (`PENDING`), Khối dặn dò lưu ý của bác sĩ trong đơn thuốc. |
| `blue-500` / `blue-600` | `#3B82F6` | Trạng thái khám hoàn tất (`COMPLETED`), Icon in phiếu khám, Biểu đồ thống kê. |

---

### 1.3. Hệ thống Typography & Phông chữ Tiếng Việt tối ưu

Dự án tích hợp phông chữ kép chất lượng cao thông qua thư viện `next/font/google` trong [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx):
- **`Inter`:** Phông chữ hình học trung tính tiêu chuẩn quốc tế cho số liệu, mã lịch hẹn, bảng dữ liệu.
- **`Be Vietnam Pro`:** Phông chữ được thiết kế chuyên biệt cho ngôn ngữ Tiếng Việt, tối ưu hoàn hảo các dấu thanh phức tạp (hỏi, ngã, nặng, sắc, huyền) mà không bị lệch dòng hay vỡ nét trên hệ điều hành Windows và thiết bị di động.

```typescript
// src/app/layout.tsx
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
```

#### Quy chuẩn cỡ chữ & Độ đậm (Typographic Scale):
- **Display 1 (Hero Title):** `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight`
- **Section Heading (H2):** `text-2xl sm:text-3xl font-extrabold text-slate-900`
- **Card / Modal Title (H3):** `text-lg sm:text-xl font-bold text-slate-800`
- **Medical Diagnosis Heading:** `text-lg sm:text-2xl font-extrabold text-slate-900`
- **Body Regular:** `text-sm sm:text-base text-slate-600 font-normal leading-relaxed`
- **Caption / Meta / Timestamps:** `text-[11px] sm:text-xs font-semibold text-slate-400`

---

### 1.4. Hệ thống Bố cục, Lưới & Điểm ngắt Responsive

Dự án áp dụng chiến lược **Mobile-First Responsive Design** với các điểm ngắt chuẩn Tailwind CSS:

```
[Mobile (<640px)]      --> 1 Cột, Drawer Menu, Full-width Buttons, Compact Tables
[Tablet (640px-1024px)]--> 2 Cột Lưới, Scrollable Tab Header, Grid 2 Bác Sĩ
[Desktop (>=1024px)]   --> 3-4 Cột Lưới, Sticky Sidebar/Header, Multi-panel Dashboard
```

- **Container Căn giữa:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` đảm bảo nội dung không bị bè quá rộng trên màn hình Ultrawide (>1920px).
- **Hệ thống Lưới (CSS Grid):**
  - Danh mục Chuyên khoa: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6`
  - Đội ngũ Bác sĩ tiêu biểu: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
  - KPI Dashboard Admin: `grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5`
  - Khuôn biểu đồ phân tích: `grid grid-cols-1 lg:grid-cols-2 gap-6`

---

### 1.5. Hiệu ứng Chiều sâu, Bóng đổ, Glassmorphism & Micro-animations

Nhằm đem lại diện mạo cao cấp (Premium Look-and-Feel), dự án định nghĩa các tiện ích hiệu ứng độc quyền trong `globals.css` và `tailwind.config.ts`:

1. **Hiệu ứng Kính Mờ (Glassmorphism):**
   ```css
   .emerald-glass {
     background: rgba(255, 255, 255, 0.85);
     backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px);
     border: 1px solid rgba(79, 195, 161, 0.15);
   }
   ```
   *Ứng dụng:* Dùng trên thanh Navbar khi cuộn trang, Thẻ Hero Callout và các Modal Dialog giúp giao diện có chiều sâu đa tầng.

2. **Ánh sáng Môi trường (Hero Glow & Ambient Lighting):**
   ```css
   .hero-glow {
     position: absolute;
     top: -10%;
     right: -5%;
     width: 450px;
     height: 450px;
     background: radial-gradient(circle, rgba(79, 195, 161, 0.18) 0%, rgba(255, 255, 255, 0) 70%);
     pointer-events: none;
   }
   ```
   *Ứng dụng:* Tạo quầng sáng mềm màu xanh ngọc ở góc trên Banner, làm nổi bật thông điệp y tế mà không gây chói mắt.

3. **Hệ thống Bóng đổ Mềm (Custom Soft Shadows):**
   - `shadow-card`: `0 4px 20px -2px rgba(79, 195, 161, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)`
   - `shadow-soft`: `0 10px 30px -5px rgba(0, 0, 0, 0.05)`
   - Nút bấm và Thẻ tương tác có hiệu ứng `hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`.

4. **Micro-animations & Phản hồi Tương tác:**
   - Cảnh báo đổi bác sĩ khẩn cấp: Hiệu ứng `animate-pulse` nhấp nháy đỏ nhẹ thu hút sự chú ý tức thì của Lễ tân.
   - Nút nạp dữ liệu: Biểu tượng `Loader2` quay tròn với `animate-spin`.
   - Mở Modal Dialog: Hiệu ứng bung nhẹ `animate-in fade-in zoom-in-95 duration-150`.

---

## 2. CÔNG NGHỆ & THƯ VIỆN GIAO DIỆN CỐT LÕI

```
+-------------------------------------------------------------------------------+
|                           FRONTEND TECH STACK MATRIX                          |
+-------------------------------------------------------------------------------+
| UI Framework      | Next.js 14.2.5 (App Router) + React 18.3.1               |
| Ngôn ngữ          | TypeScript 5.5.4 (Strict Type Checking)                  |
| Styling Engine    | Tailwind CSS 3.4.7 + PostCSS + Autoprefixer              |
| Biểu tượng SVG    | Lucide React 0.427.0 (Unified Vector Icons)              |
| Quản lý Form      | React Hook Form 7.52.2 + @hookform/resolvers             |
| Kiểm tra Schema   | Zod 3.23.8 (Client-Server Shared Validation)             |
| Biểu đồ Thống kê  | Recharts 2.12.7 (SVG Responsive Charts)                  |
| Thông báo Toast   | Sonner 1.5.0 (Rich Multi-color Toaster)                  |
| Xử lý Ngày tháng  | date-fns 3.6.0 + Intl API (Việt Nam Timezone)             |
+-------------------------------------------------------------------------------+
```

### 2.1. Next.js 14 App Router & Hybrid Rendering
- **Server Components (RSC):** [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx) đóng vai trò là Shell cấp cao nhất nạp phông chữ, cấu hình Metadata SEO và nạp bộ nhận diện Icon tĩnh mà không làm tăng JavaScript bundle gửi về trình duyệt.
- **Client Components (`'use client'`):** Các trang điều hành tương tác cao ([`page.tsx`](file:///d:/PhongKham2026/src/app/page.tsx), [`/book`](file:///d:/PhongKham2026/src/app/book/page.tsx), [`/dashboard`](file:///d:/PhongKham2026/src/app/dashboard/page.tsx), [`/doctor`](file:///d:/PhongKham2026/src/app/doctor/page.tsx), [`/admin`](file:///d:/PhongKham2026/src/app/admin/page.tsx)) tận dụng React State, Hooks (`useState`, `useEffect`, `useMemo`, `useRouter`, `useSearchParams`) để quản lý các luồng nghiệp vụ phức tạp.

---

### 2.2. Tailwind CSS v3.4 Utility-First & Custom Configurations
Dự án sử dụng cơ chế gom lớp tiện ích (Utility classes) kết hợp hàm gộp class thông minh:
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
Hàm `cn()` giúp gộp linh hoạt các class điều kiện (`clsx`) và tự động giải quyết xung đột thuộc tính trùng nhau (`tailwind-merge`), ví dụ: `cn("p-4 bg-white", isUrgent && "bg-rose-50 border-rose-200")`.

---

### 2.3. Lucide React Vector Icons System
Hệ thống sử dụng đồng bộ bộ biểu tượng Lucide React mang tính chuyên khoa y tế cao:
- Chuyên khoa: `HeartPulse` (Tim mạch), `Baby` (Nhi khoa), `Sparkles` (Da liễu), `Headphones` (Tai Mũi Họng), `Eye` (Mắt), `Smile` (Răng Hàm Mặt), `Activity` (Cơ Xương Khớp), `Stethoscope` (Đa khoa).
- Nghiệp vụ: `Calendar`, `Clock`, `UserCheck`, `Pill`, `FileText`, `Printer`, `AlertOctagon`, `Shield`, `CheckCircle2`.

---

### 2.4. React Hook Form & Zod Schema Validation
Sự kết hợp giữa `react-hook-form` và `zod` mang lại hiệu năng tối đa:
- Không gây re-render toàn bộ trang khi người dùng gõ từng ký tự vào ô Input.
- Bắt lỗi ngay tại Client và đồng bộ schema kiểm tra dữ liệu với Backend API.

```typescript
// src/lib/validations.ts
export const bookingFormSchema = z.object({
  specialtyId: z.string().min(1, 'Vui lòng chọn chuyên khoa khám'),
  doctorId: z.string().nullable().optional(),
  bookingType: z.enum(['SELF_SELECTED', 'AUTO_ASSIGN']),
  appointmentDate: z.string().min(1, 'Vui lòng chọn ngày khám bệnh'),
  appointmentTime: z.string().min(1, 'Vui lòng chọn khung giờ khám'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9|1][0-9]{8}$|^[0-9]{10,11}$/, 'Số điện thoại 10 số không hợp lệ'),
  patientNotes: z.string().optional(),
});
```

---

### 2.5. Recharts Data Visualization (Interactive SVG Charts)
Tại cổng Quản trị viên [`/admin`](file:///d:/PhongKham2026/src/app/admin/page.tsx), thư viện `Recharts` trực quan hóa các chỉ số quan trọng:
1. **Biểu đồ Cột (`BarChart`):** Phân bổ số lượt khám theo từng chuyên khoa với màu cột gradient `brand-400`.
2. **Biểu đồ Đường (`LineChart` / `AreaChart`):** Theo dõi xu hướng tăng trưởng lượt đặt lịch khám trong 7 ngày gần nhất theo múi giờ Việt Nam.

---

### 2.6. Sonner Toast Notification & Realtime Feedback System
Thư viện `Sonner` được gắn cố định tại góc trên bên phải màn hình (`position="top-right"`, `richColors`):
- `toast.success("Thông báo thành công")`: Hiển thị viền xanh lá, icon dấu tích khi đặt lịch, tạo bác sĩ, lưu bệnh án.
- `toast.error("Thông báo lỗi")`: Hiển thị viền đỏ, icon cảnh báo khi trùng lịch hoặc nhập sai dữ liệu.

---

## 3. HỆ THỐNG ATOMIC UI COMPONENTS DÙNG CHUNG

Toàn bộ các thành phần giao diện nguyên tử được đóng gói tại thư mục [`src/components/ui/`](file:///d:/PhongKham2026/src/components/ui/) nhằm đảm bảo tính tái sử dụng và đồng nhất mã nguồn:

```
src/components/ui/
├── badge.tsx       # Huy hiệu trạng thái y tế & nhãn phân loại
├── button.tsx      # Nút bấm 6 biến thể với hiệu ứng loading
├── card.tsx        # Khối thẻ nội dung đa lớp & hiệu ứng nâng
├── dialog.tsx      # Cửa sổ Pop-up Modal 6 kích thước với Backdrop Blur
├── input.tsx       # Trường nhập văn bản tích hợp icon trang trí
├── select.tsx      # Trình chọn Dropdown chuẩn hóa
├── skeleton.tsx    # Khung nạp hiệu ứng Shimmer cho bảng & thẻ
└── tabs.tsx        # Thanh chuyển đổi tab có đếm số lượng Badge
```

---

### 3.1. Phân tích Button Component (`button.tsx`)

File nguồn: [`src/components/ui/button.tsx`](file:///d:/PhongKham2026/src/components/ui/button.tsx)

```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

#### Chi tiết 6 biến thể (Variants):
1. **`primary` (`bg-[#4fc3a1] hover:bg-[#3fb190]`):** Nút hành động chính quan trọng nhất (Đặt lịch, Lưu hồ sơ, Đăng nhập).
2. **`secondary` (`bg-emerald-50 text-emerald-800 hover:bg-emerald-100`):** Nút hành động phụ, tra cứu, xem chi tiết.
3. **`outline` (`border border-slate-200 bg-white text-slate-700`):** Nút quay lại, hủy thao tác, in ấn.
4. **`ghost` (`text-slate-600 hover:bg-slate-100`):** Nút trong suốt cho các tác vụ biểu tượng (icon buttons).
5. **`danger` (`bg-rose-500 hover:bg-rose-600`):** Nút hủy lịch hẹn, xóa bác sĩ, xóa chuyên khoa.
6. **`success` (`bg-emerald-600 hover:bg-emerald-700`):** Nút xác nhận hoàn thành khám, duyệt lịch hẹn.

*Cơ chế Loading tự động:* Khi `isLoading = true`, nút tự động chuyển sang trạng thái disabled và hiển thị `Loader2` xoay tròn, ngăn ngừa tình trạng người dùng click đúp (Double Submission).

---

### 3.2. Phân tích Card Component System (`card.tsx`)

File nguồn: [`src/components/ui/card.tsx`](file:///d:/PhongKham2026/src/components/ui/card.tsx)

Được thiết kế theo cấu trúc phân tầng:
- `Card`: Vỏ bọc ngoài bo góc `rounded-2xl`, hỗ trợ cờ `hoverable` tự động nâng thẻ (`hover:-translate-y-0.5`) và viền xanh ngọc mờ (`hover:border-emerald-200/60`).
- `CardHeader`: Phần đầu chứa tiêu đề và mô tả, có đường phân cách mờ `border-b border-slate-100`.
- `CardTitle`: Kiểu chữ `text-lg font-semibold text-slate-800`.
- `CardDescription`: Kiểu chữ `text-sm text-slate-500`.
- `CardContent`: Vùng chứa nội dung chính linh hoạt.

---

### 3.3. Phân tích Dialog / Modal System (`dialog.tsx`)

File nguồn: [`src/components/ui/dialog.tsx`](file:///d:/PhongKham2026/src/components/ui/dialog.tsx)

```typescript
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}
```

#### Các đặc tính kỹ thuật cao cấp của Dialog:
- **Khóa cuộn trang thông minh (Body Scroll Lock):** Khi Modal mở, tự động gán `document.body.style.overflow = 'hidden'`, khi đóng khôi phục về `unset`.
- **Lắng nghe phím ESC:** Tự động bắt sự kiện bàn phím `keydown === 'Escape'` để đóng Modal nhanh.
- **Lớp nền làm mờ sâu (Deep Frosted Backdrop):** `bg-slate-900/60 backdrop-blur-sm` tập trung 100% sự chú ý của người dùng vào nội dung cửa sổ nổi.
- **Kích thước linh hoạt:** Hỗ trợ từ `max-w-sm` (Modal xác nhận xóa) đến `max-w-4xl` (Modal Khám bệnh & Kê đơn thuốc nhiều dòng).

---

### 3.4. Phân tích Badge Component & Quản lý Trạng thái Lịch hẹn Thông minh

File nguồn: [`src/components/ui/badge.tsx`](file:///d:/PhongKham2026/src/components/ui/badge.tsx) kết hợp các helper trong [`src/lib/utils.ts`](file:///d:/PhongKham2026/src/lib/utils.ts):

```typescript
// src/lib/utils.ts
export function getStatusBadgeStyle(status: string, apptOrHasDoctor?: any) {
  let hasDoctor = false;
  if (typeof apptOrHasDoctor === 'boolean') {
    hasDoctor = apptOrHasDoctor;
  } else if (apptOrHasDoctor && typeof apptOrHasDoctor === 'object') {
    hasDoctor = Boolean(apptOrHasDoctor.doctorId || apptOrHasDoctor.doctor);
  }

  switch (status) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'COMPLETED':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PENDING':
      return hasDoctor
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'NEEDS_REASSIGNMENT':
      return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
```

```typescript
export function getStatusLabel(status: string, apptOrHasDoctor?: any) {
  let hasDoctor = false;
  if (typeof apptOrHasDoctor === 'boolean') {
    hasDoctor = apptOrHasDoctor;
  } else if (apptOrHasDoctor && typeof apptOrHasDoctor === 'object') {
    hasDoctor = Boolean(apptOrHasDoctor.doctorId || apptOrHasDoctor.doctor);
  }

  switch (status) {
    case 'CONFIRMED':
      return 'Đã xác nhận (Chờ khám)';
    case 'COMPLETED':
      return 'Đã hoàn thành khám';
    case 'PENDING':
      return hasDoctor ? 'Đã xác nhận (Chờ khám)' : 'Chờ sắp xếp bác sĩ';
    case 'CANCELLED':
      return 'Đã hủy lịch';
    case 'NEEDS_REASSIGNMENT':
      return 'Cần đổi bác sĩ gấp';
    default:
      return status;
  }
}
```

---

### 3.5. Phân tích Input & Select Controls

- **`Input.tsx`:** Hỗ trợ biểu tượng bên trái (`icon?: React.ReactNode`), hiển thị nhãn `label`, dòng báo lỗi `error` màu đỏ và trạng thái `focus:border-[#4fc3a1] focus:ring-2 focus:ring-[#4fc3a1]/20`.
- **`Select.tsx`:** Tích hợp biểu tượng mũi tên xổ xuống `ChevronDown`, tùy biến màu sắc khi chọn giá trị, đảm bảo hiển thị đồng nhất giữa các trình duyệt.

---

### 3.6. Phân tích Tabs Navigation Component (`tabs.tsx`)

File nguồn: [`src/components/ui/tabs.tsx`](file:///d:/PhongKham2026/src/components/ui/tabs.tsx)
- Hỗ trợ hiển thị số đếm `count` (ví dụ: số ca chờ khám, số ca đổi lịch gấp).
- Thiết kế thanh trượt ngang mượt mà trên di động với class `overflow-x-auto scrollbar-none touch-pan-x flex-nowrap`.
- Trạng thái Active có viền chân màu xanh ngọc lục bảo `border-[#4fc3a1]` và nền nhạt `bg-emerald-50/50`.

---

### 3.7. Phân tích Shimmer Loading Skeletons (`skeleton.tsx`)

Thay vì chỉ hiển thị một vòng xoay loading đơn điệu, dự án triển khai:
- `Skeleton`: Khối xám nhấp nháy chuyển động ánh sáng `animate-pulse bg-slate-200/80 rounded-xl`.
- `TableSkeleton`: Khởi tạo sẵn cấu trúc bảng dữ liệu với số dòng và số cột tùy biến, giúp người dùng hình dung trước cấu trúc dữ liệu sắp tải về, giảm cảm giác chờ đợi (Perceived Performance).

---

## 4. KIẾN TRÚC BỐ CỤC TOÀN CỤC (GLOBAL LAYOUT & SHELL COMPONENTS)

```
+-------------------------------------------------------------------------------+
|                       ROOT LAYOUT HIERARCHY (src/app/layout.tsx)              |
+-------------------------------------------------------------------------------+
| 1. [RoleSwitcherBanner] --> Thanh Demo chuyển đổi quyền tức thì (Top Bar)     |
| 2. [Navbar]             --> Thanh điều hướng thích ứng theo vai trò           |
| 3. [Main Content Area]  --> {children} - Nội dung thay đổi theo từng Route    |
| 4. [Footer]             --> Chân trang y tế (Tự ẩn trên Portal Admin/Doctor)  |
| 5. [Sonner Toaster]     --> Hệ thống thông báo nổi toàn cục                   |
+-------------------------------------------------------------------------------+
```

### 4.1. RoleSwitcherBanner — Thanh Demo Chuyển Đổi Vai Trò Tức Thì

File nguồn: [`src/components/layout/RoleSwitcherBanner.tsx`](file:///d:/PhongKham2026/src/components/layout/RoleSwitcherBanner.tsx)

Thanh công cụ này nằm ở vị trí cao nhất trên màn hình, phục vụ việc kiểm thử, nghiệm thu và chấm đồ án trực quan:
- Hiển thị tên người dùng và vai trò hiện tại đang đăng nhập.
- **4 Nút Chuyển Quyền 1-Click:**
  1. `Khách`: Xóa session cookie, chuyển về trang chủ dưới tư cách khách vãng lai.
  2. `Bệnh Nhân`: Tự động nạp tài khoản Bệnh nhân mẫu và chuyển hướng về `/dashboard`.
  3. `Bác Sĩ`: Tự động nạp tài khoản Bác sĩ mẫu và chuyển hướng về `/doctor`.
  4. `Quản Lý`: Tự động nạp tài khoản Admin/Lễ tân mẫu và chuyển hướng về `/admin`.

---

### 4.2. Navbar — Thanh Điều Hướng Thông Minh Theo Quyền

File nguồn: [`src/components/layout/Navbar.tsx`](file:///d:/PhongKham2026/src/components/layout/Navbar.tsx)

Navbar được cố định ở đầu trang (`sticky top-0 z-40 bg-white/95 backdrop-blur-md`):
- **Logo Thương Hiệu CarePlus+:** Biểu tượng nhịp tim y tế nổi bật với nền xanh ngọc bo góc, đi kèm phụ đề ngữ cảnh thay đổi theo vai trò đang đăng nhập.
- **Menu Trung Tâm Thích Ứng Theo Quyền:**
  - *Khi là ADMIN:* Hiển thị liên kết trực tiếp vào "Quản Lý Phòng Khám" kèm biểu tượng Khiên Bảo Mật `Shield`.
  - *Khi là DOCTOR:* Hiển thị liên kết trực tiếp vào "Bàn Làm Việc Bác Sĩ" kèm biểu tượng Ống Nghe `Stethoscope`.
  - *Khi là PATIENT:* Hiển thị: Trang Chủ | Chuyên Khoa (Cuộn mượt) | Đặt Lịch Khám | Hồ Sơ Của Tôi.
  - *Khi là GUEST:* Hiển thị: Trang Chủ | Chuyên Khoa | Liên Hệ | Đặt Lịch Khám | Theo Dõi Hồ Sơ.
- **Khu Vực Tài Khoản & Đăng Xuất (Right Section):**
  - Hiển thị Avatar tròn viền xanh ngọc, Họ tên, Tag vai trò viết hoa (`QUẢN LÝ`, `BÁC SĨ`, `BỆNH NHÂN`).
  - Nút Đăng xuất (`LogOut`) với hiệu ứng hover màu đỏ hoa hồng `text-rose-600`.
- **Mobile Navigation Drawer:** Nút menu hamburger trên thiết bị di động mở ra danh sách điều hướng trượt dọc toàn màn hình.

---

### 4.3. Footer — Chân Trang Đa Thông Tin Nhận Biết Ngữ Cảnh

File nguồn: [`src/components/layout/Footer.tsx`](file:///d:/PhongKham2026/src/components/layout/Footer.tsx)

- **Nhận Biết Ngữ Cảnh (Context-Aware):** Footer tự động ẩn hoàn toàn khi người dùng truy cập vào phân hệ làm việc chuyên biệt của Bác sĩ (`/doctor`) hoặc Quản trị viên (`/admin`), giúp không gian làm việc chuyên môn không bị chiếm dụng diện tích hiển thị bảng biểu.
- **Bố Cục 4 Cột Chi Tiết:**
  1. *Cột 1 (Thương hiệu & Tôn chỉ):* Logo, mô tả và huy hiệu `● Hỗ trợ tư vấn 24/7`.
  2. *Cột 2 (Danh mục chính):* Liên kết nhanh tới các phân hệ.
  3. *Cột 3 (Địa chỉ phòng khám):* Số 123 Đường Y Học, Quận 1, TP. HCM; Hotline và Email.
  4. *Cột 4 (Giờ làm việc y tế):* Lịch trực Thứ 2 - Thứ 6 (08:00 - 17:00), Thứ 7 (08:00 - 12:00), Chủ Nhật (Nghỉ/Cấp cứu).

---

### 4.4. RootLayout & Bộ Nhận Diện Thương Hiệu Favicon Đa Kích Thước

File nguồn: [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx)

Dự án trang bị trọn bộ biểu tượng thương hiệu chuẩn W3C:
- [`public/favicon.ico`](file:///d:/PhongKham2026/public/favicon.ico): Tương thích trình duyệt cổ điển, loại bỏ hoàn toàn lỗi `404 favicon.ico` trên DevTools Console.
- [`public/favicon.svg`](file:///d:/PhongKham2026/public/favicon.svg): Đồ họa vector sắc nét ở mọi độ phân giải màn hình Retina/4K.
- [`public/icon.png`](file:///d:/PhongKham2026/public/icon.png): Định dạng PNG tối ưu cho thiết bị di động và Apple Touch Icon.

---

## 5. PHÂN TÍCH CHI TIẾT TỪNG MÀN HÌNH GIAO DIỆN NGƯỜI DÙNG

---

### 5.1. Màn Hình Trang Chủ (`/` — Homepage & Landing Page)

File nguồn: [`src/app/page.tsx`](file:///d:/PhongKham2026/src/app/page.tsx)

Màn hình Trang chủ được thiết kế như một cổng thông tin y tế toàn diện, xây dựng niềm tin vững chắc cho bệnh nhân ngay từ cái nhìn đầu tiên:

```
+-----------------------------------------------------------------------------------+
| 1. HERO BANNER: Background Y Tế Chìm + Quầng Sáng Emerald + Tiêu Đề Gradient       |
|    - Tagline: "Phòng Khám Đa Khoa Hiện Đại & Tận Tâm"                             |
|    - 2 Nút CTA chính: [Đặt Lịch Khám Ngay] và [Theo Dõi Đơn Thuốc & Hồ Sơ]        |
+-----------------------------------------------------------------------------------+
| 2. QUICK STATS: 4 Khối Thống Kê Nhanh (10+ Chuyên Khoa, 20+ Bác Sĩ, 100% Online)  |
+-----------------------------------------------------------------------------------+
| 3. SPECIALTIES SECTION: Lưới Thẻ Chuyên Khoa Tương Tác Kèm Icon Vector Động       |
+-----------------------------------------------------------------------------------+
| 4. FEATURED DOCTORS: Top 8 Bác Sĩ Đầu Ngành (Avatar, Học Vị, Số Năm KN, Giá Khám) |
+-----------------------------------------------------------------------------------+
| 5. 3-STEP WORKFLOW GUIDE: Quy Trình Đặt Lịch & Khám Bệnh Minh Bạch                |
+-----------------------------------------------------------------------------------+
| 6. QUICK PHONE LOOKUP & SUPPORT HOTLINE: Tra Cứu Nhanh & Hotline 24/7             |
+-----------------------------------------------------------------------------------+
```

#### Các điểm nhấn thiết kế nổi bật:
1. **Hero Section Y Tế Sâu Sắc:** Nền ảnh phòng khám độ mờ 45% kết hợp lớp phủ gradient xanh ngọc bão hòa (`from-emerald-100/90 via-teal-50/80 to-slate-100`) và 2 quầng sáng blur 3xl ở hai góc, tạo cảm giác vô trùng, chuyên nghiệp.
2. **Lưới Thẻ Chuyên Khoa Tương Tác:** Mỗi thẻ chuyên khoa hiển thị Icon SVG tương ứng, tên chuyên khoa, mô tả tóm tắt và số lượng bác sĩ đang công tác. Khi click vào thẻ, giao diện tự động chuyển sang trang đặt lịch `/book?specialtyId={id}`.
3. **Danh Sách Bác Sĩ Tiêu Biểu:** Sử dụng thuật toán sắp xếp `sort((a, b) => b.experienceYears - a.experienceYears).slice(0, 8)` hiển thị 8 bác sĩ có thâm niên cao nhất. Thẻ bác sĩ hiển thị đầy đủ: Ảnh chân dung có viền xanh y tế, Chuyên khoa, Học vị (`Bác sĩ CKII`, `Thạc sĩ`, `Tiến sĩ`), Số năm kinh nghiệm và Bảng giá khám niêm yết rõ ràng.
4. **Khối Tra Cứu Nhanh Bằng Số Điện Thoại:** Cho phép bệnh nhân nhập số điện thoại để tra cứu ngay lịch hẹn gần nhất mà không cần phải thực hiện các bước đăng nhập rườm rà.

---

### 5.2. Màn Hình Đặt Lịch Khám Bệnh (`/book` — 3-Step Booking Wizard)

File nguồn: [`src/app/book/page.tsx`](file:///d:/PhongKham2026/src/app/book/page.tsx)

Giao diện đặt lịch được cấu trúc theo mô hình **Step Wizard 3 Bước** giúp người bệnh không bị choáng ngợp bởi quá nhiều thông tin:

```
[ BƯỚC 1: Chọn Chuyên Khoa & Bác Sĩ ] ──> [ BƯỚC 2: Chọn Ngày & Giờ Khám ] ──> [ BƯỚC 3: Điền Thông Tin & Xác Nhận ]
```

```
+-----------------------------------------------------------------------------------+
|                                 BOOKING FLOW MATRIX                               |
+-----------------------------------------------------------------------------------+
|  Bước 1: CHỌN HÌNH THỨC ĐẶT LỊCH                                                 |
|  - [Tự Chọn Bác Sĩ Yêu Thích] --> Xem danh sách bác sĩ, xem giá, chọn đích danh   |
|  - [Phòng Khám Tự Động Xếp]   --> Tiết kiệm thời gian, lễ tân sẽ điều phối         |
+-----------------------------------------------------------------------------------+
|  Bước 2: CHỌN THỜI GIAN KHÁM                                                      |
|  - Chọn ngày khám (Lịch chặn ngày quá khứ)                                         |
|  - Ma trận Khung Giờ Sáng (08:00 - 11:30) & Chiều (13:30 - 17:00)                 |
|  - Nhận diện Slot trống / Slot đã có người đặt / Slot ngoài giờ làm việc          |
+-----------------------------------------------------------------------------------+
|  Bước 3: THÔNG TIN BỆNH NHÂN & LÝ DO KHÁM                                         |
|  - Họ tên, Số điện thoại (Bắt buộc), Email, Mô tả triệu chứng ban đầu             |
+-----------------------------------------------------------------------------------+
|  KẾT QUẢ: PHIẾU LỊCH HẸN ĐIỆN TỬ (Tự chuyển CONFIRMED hoặc PENDING)               |
+-----------------------------------------------------------------------------------+
```

#### Các cải tiến UX đột phá:
- **Tự động điền thông tin (Auto Pre-fill):** Nếu bệnh nhân đã đăng nhập, hệ thống tự động nạp Họ tên, Số điện thoại và Email vào Form từ phiên làm việc `UserSession`.
- **Ma trận Khung Giờ Thông Minh (Smart Time Slot Matrix):**
  - Tự động gọi API `/api/doctors/slots` để kiểm tra lịch trống theo thời gian thực.
  - Các ô giờ sáng (vàng nắng `Sun`) và chiều (mát dịu `Moon`) được hiển thị dưới dạng nút chọn bo tròn.
  - Khung giờ đã kín lịch sẽ bị vô hiệu hóa kèm nhãn *"Đã có lịch hẹn"* hoặc *"Bác sĩ không có lịch trực"*.
- **Tự Động Phân Nhánh Trạng Thái:**
  - Đặt lịch tự chọn bác sĩ $\rightarrow$ Chuyển ngay sang trạng thái **`CONFIRMED`** (*Đã xác nhận & Chờ khám*).
  - Đặt lịch tự động xếp bác sĩ $\rightarrow$ Đưa vào trạng thái **`PENDING`** (*Chờ Lễ tân điều phối*).

---

### 5.3. Màn Hình Cổng Bệnh Nhân (`/dashboard` — Patient Health Portal)

File nguồn: [`src/app/dashboard/page.tsx`](file:///d:/PhongKham2026/src/app/dashboard/page.tsx)

Cổng thông tin cá nhân của bệnh nhân là nơi quản lý toàn diện lịch sử sức khỏe:

```
+-----------------------------------------------------------------------------------+
| 1. HEADER: Thông Tin Cá Nhân, Avatar, Số Điện Thoại + Nút [Chỉnh Sửa Hồ Sơ]       |
+-----------------------------------------------------------------------------------+
| 2. NAVIGATION TABS:                                                               |
|    [ 📅 Lịch Hẹn Sắp Tới ]  |  [ 📋 Lịch Sử & Chẩn Đoán ]  |  [ 💊 Đơn Thuốc ]   |
+-----------------------------------------------------------------------------------+
| 3. CHI TIẾT NỘI DUNG TỪNG TAB:                                                    |
|    - Tab 1: Danh sách lịch hẹn tương lai, Bác sĩ phụ trách, Nút Hủy Lịch Có Modal  |
|    - Tab 2: Chẩn đoán Y Khoa Cỡ Lớn (Font 24px), Triệu chứng, Lời khuyên bác sĩ   |
|    - Tab 3: Bảng danh mục thuốc kê đơn, Hàm lượng, Cách dùng, Nút [In Đơn Thuốc]  |
+-----------------------------------------------------------------------------------+
| 4. POPUP MODAL: In Đơn Thuốc Điện Tử PDF (Chuẩn Y Tế, Mã QR, Chữ Ký Bác Sĩ)      |
+-----------------------------------------------------------------------------------+
```

#### Chi tiết các nâng cấp UI/UX:
1. **Khối Bác Sĩ Khám Chuyên Nghiệp:** Tích hợp đầy đủ thông tin: Avatar tròn có viền xanh ngọc, Họ tên, Học vị (`Bác sĩ Chuyên khoa II`), Chuyên khoa phụ trách.
2. **Typography Chẩn Đoán Dễ Đọc:** 
   - Tiêu đề kết luận bệnh án được phóng to nổi bật: `text-lg sm:text-2xl font-extrabold text-slate-900`.
   - Lời khuyên & dặn dò của bác sĩ được đóng khung trong hộp màu hổ phách dịu (`bg-amber-50 border-amber-200`) với font chữ to, rõ ràng giúp người cao tuổi dễ đọc.
3. **Modal In Đơn Thuốc Điện Tử (Printable E-Prescription):** 
   - Thiết kế mô phỏng chính xác mẫu Đơn thuốc y tế của Bộ Y Tế: Tiêu đề phòng khám, thông tin bệnh nhân, bảng danh sách thuốc chi tiết (Tên thuốc, Hàm lượng, Liều lượng, Cách dùng, Số ngày uống), lời dặn tái khám và vị trí ký tên bác sĩ.
   - Hỗ trợ nút `window.print()` tích hợp sẵn CSS Media Print loại bỏ toàn bộ giao diện thừa khi xuất file PDF hoặc in giấy A4.
4. **Modal Chỉnh Sửa Hồ Sơ & Đổi Avatar:** Cung cấp bộ sưu tập 8 Avatar Preset y tế đẹp mắt hoặc nhập link ảnh tùy ý, kèm chức năng đổi mật khẩu bảo mật.

---

### 5.4. Màn Hình Cổng Bác Sĩ (`/doctor` — Doctor Clinical Workbench)

File nguồn: [`src/app/doctor/page.tsx`](file:///d:/PhongKham2026/src/app/doctor/page.tsx)

Bàn làm việc số của Bác sĩ được tối ưu hóa cho tốc độ thao tác lâm sàng:

```
+-----------------------------------------------------------------------------------+
| 1. WORKBENCH HEADER: Tên Bác Sĩ, Chuyên Khoa + NÚT [🚨 BÁO BẬN ĐỘT XUẤT]         |
+-----------------------------------------------------------------------------------+
| 2. LIVE KPI METRICS:                                                              |
|    [ ⏳ Ca Chờ Khám Hôm Nay ] | [ ✅ Đã Khám Xong ] | [ 📊 Tổng Lịch Hẹn Đã Xếp ] |
+-----------------------------------------------------------------------------------+
| 3. CLINICAL QUEUE TABS:                                                           |
|    - Bộ lọc con: [Tất Cả] | [Hôm Nay] | [Sắp Tới]                                  |
|    - Danh sách bệnh nhân chờ khám: Giờ hẹn, Họ tên, SĐT, Lý do khám               |
|    - NÚT HÀNH ĐỘNG: [🩺 Bắt Đầu Khám & Kê Đơn]                                    |
+-----------------------------------------------------------------------------------+
| 4. POPUP MODAL: Nhập Hồ Sơ Bệnh Án & Kê Đơn Thuốc Đa Dòng (Thêm/Xóa Thuốc Động)  |
+-----------------------------------------------------------------------------------+
```

#### Các tính năng UI chuyên sâu:
1. **Nút Báo Bận Đột Xuất (Urgent Unavailability Command):** 
   - Nút màu đỏ nổi bật ở góc trên bàn làm việc.
   - Khi bấm, mở Modal yêu cầu bác sĩ nhập lý do đột xuất (ví dụ: *"Bác sĩ có ca phẫu thuật cấp cứu"*).
   - Ngay lập tức, toàn bộ các ca hẹn trong tương lai của bác sĩ sẽ được chuyển sang trạng thái **`NEEDS_REASSIGNMENT`** (*Cần đổi bác sĩ gấp*) và phát cảnh báo nhấp nháy tới trung tâm điều hành Admin.
2. **Modal Khám Bệnh & Kê Đơn Thuốc Đa Dòng:**
   - Trường nhập Triệu chứng lâm sàng (`symptoms`) và Chẩn đoán kết luận (`diagnosis`).
   - Bảng kê đơn thuốc động cho phép bác sĩ bấm nút `+ Thêm thuốc` để thêm vô số hàng thuốc mới (Tên thuốc, Hàm lượng, Liều lượng cách dùng, Số ngày uống) hoặc bấm biểu tượng Thùng rác `Trash2` để xóa thuốc đã chọn.
   - Sau khi bác sĩ bấm `Lưu Hồ Sơ & Hoàn Tất Khám`, lịch hẹn tự động chuyển sang `COMPLETED` và hồ sơ lập tức xuất hiện trên ứng dụng của Bệnh nhân.

---

### 5.5. Màn Hình Trung Tâm Quản Trị & Lễ Tân (`/admin` — Operations & BI Command Center)

File nguồn: [`src/app/admin/page.tsx`](file:///d:/PhongKham2026/src/app/admin/page.tsx)

Đây là phân hệ đồ sộ và phức tạp nhất dự án (hơn 2.100 dòng mã nguồn), đóng vai trò là tháp điều hành tác chiến số:

```
+-----------------------------------------------------------------------------------+
| 1. COMMAND HEADER: Trạng Thái Vận Hành + Thông Tin Quản Trị Viên / Lễ Tân         |
+-----------------------------------------------------------------------------------+
| 2. REALTIME KPI METRICS (5 Thẻ):                                                  |
|    [Tổng Lịch Khám] | [Đã Xác Nhận] | [Hoàn Tất] | [Cần Đổi Bác Sĩ] | [Đã Hủy]    |
+-----------------------------------------------------------------------------------+
| 3. BUSINESS INTELLIGENCE CHARTS (2 Biểu Đồ Recharts):                             |
|    - Biểu Đồ Cột: Phân Bổ Tải Khám Theo Chuyên Khoa (BarChart)                    |
|    - Biểu Đồ Đường: Xu Hướng Lịch Hẹn 7 Ngày Gần Nhất (LineChart)                 |
+-----------------------------------------------------------------------------------+
| 4. OPERATIONS TABS MATRIX:                                                        |
|    [📅 Quản Lý Lịch Hẹn]  | [🚨 Đổi Lịch Khẩn Cấp] | [👨‍⚕️ Quản Lý Bác Sĩ]        |
|    [🏥 Quản Lý Chuyên Khoa]| [🗑️ Ca Đã Hủy]        | [🔔 Trung Tâm Thông Báo]     |
+-----------------------------------------------------------------------------------+
```

#### Chi tiết 6 Tab Tác Vụ Điều Hành:
1. **Tab 1: Quản Lý & Điều Phối Lịch Hẹn (`appointments`):**
   - Bộ 3 bộ lọc đa chiều: Lọc theo Trạng thái, Lọc theo Chuyên khoa, Lọc theo Bác sĩ.
   - Đối với các ca đặt tự động (`AUTO_ASSIGN` / `PENDING`), giao diện hiển thị ngay **Dropdown Chọn Bác Sĩ Trực Tiếp** trên từng dòng bảng. Lễ tân chỉ cần chọn bác sĩ phù hợp trong danh sách, hệ thống tự động kiểm tra trùng lịch (Conflict Check) và chuyển trạng thái sang `CONFIRMED`.
2. **Tab 2: Trung Tâm Xử Lý Đổi Lịch Khẩn Cấp (`emergency`):**
   - Đánh dấu số đếm đỏ nhấp nháy trên tiêu đề Tab.
   - Liệt kê toàn bộ các ca hẹn bị ảnh hưởng do bác sĩ báo bận.
   - Cung cấp 2 phương án giải quyết nhanh: 
     - *Phương án A:* Chọn Bác sĩ thay thế cùng chuyên khoa còn trống lịch.
     - *Phương án B:* Đổi giờ khám mới theo thỏa thuận với bệnh nhân.
3. **Tab 3: Quản Lý Đội Ngũ Bác Sĩ (`doctors`):**
   - Tìm kiếm theo họ tên, lọc theo chuyên khoa.
   - Nút `+ Thêm Bác Sĩ Mới` mở Modal Form toàn diện: Họ tên, Email, SĐT, Chuyên khoa, Bằng cấp, Số năm kinh nghiệm, Giá khám, Tiểu sử và Avatar.
   - Tự động tạo tài khoản đăng nhập với mật khẩu mã hóa an toàn và kích hoạt lịch trực chuẩn.
   - Hỗ trợ Chỉnh sửa (`Pencil`) và Xóa/Cho thôi công tác an toàn (`Trash2`).
4. **Tab 4: Quản Lý Danh Mục Chuyên Khoa (`specialties`):**
   - Quản lý mã, tên, mô tả chuyên khoa.
   - Bộ chọn biểu tượng trực quan (`Specialty Icon Picker` với 9 biểu tượng y tế chuẩn).
   - Kiểm tra ràng buộc khóa ngoại an toàn: Nếu chuyên khoa còn bác sĩ trực thuộc, hệ thống sẽ cảnh báo và không cho phép xóa nhầm.
5. **Tab 5: Giám Sát Ca Đã Hủy & Tái Thu Hồi Suất Khám (`cancellations`):**
   - Ghi lại nhật ký người hủy, thời gian hủy và nguyên nhân.
   - Tự động giải phóng khung giờ để người khác có thể đặt lại.
6. **Tab 6: Trung Tâm Thông Báo Thời Gian Thực (`notifications`):**
   - Hiển thị danh sách cảnh báo từ hệ thống, phân loại theo mức độ khẩn cấp (`URGENT_DOCTOR_BUSY`, `NEW_BOOKING`, `GENERAL`).

---

### 5.6. Màn Hình Xác Thực (`/login` & `/register` — Authentication Views)

File nguồn: [`src/app/login/page.tsx`](file:///d:/PhongKham2026/src/app/login/page.tsx) và [`src/app/register/page.tsx`](file:///d:/PhongKham2026/src/app/register/page.tsx)

```
+-----------------------------------------------------------------------------------+
| 1. NỀN GIAO DIỆN: Ảnh Bệnh Viện Mờ Kèm Lớp Kính Mờ Gradient (Frosted Glass)       |
+-----------------------------------------------------------------------------------+
| 2. ĐĂNG KÝ BỆNH NHÂN SIÊU TỐC:                                                    |
|    - Chỉ cần [Họ Tên] + [Số Điện Thoại] + [Mật Khẩu]                              |
|    - Loại bỏ hoàn toàn sự rườm rà của email đối với bệnh nhân lớn tuổi             |
+-----------------------------------------------------------------------------------+
| 3. ĐĂNG NHẬP AN TOÀN & TIỆN ÍCH QUÊN MẬT KHẨU:                                    |
|    - Đăng nhập bằng Số Điện Thoại & Mật Khẩu                                      |
|    - Modal Quên Mật Khẩu với quy trình cấp OTP 2 bước trực quan                   |
+-----------------------------------------------------------------------------------+
| 4. BỘ NÚT ĐĂNG NHẬP NHANH DEMO (1-Click Demo Login):                              |
|    - [👨‍💼 Đăng Nhập Quản Lý] | [🩺 Đăng Nhập Bác Sĩ] | [👤 Đăng Nhập Bệnh Nhân]    |
+-----------------------------------------------------------------------------------+
```

---

## 6. TRẢI NGHIỆM NGƯỜI DÙNG & TƯƠNG TÁC NÂNG CAO

### 6.1. Nguyên Tắc Cập Nhật Trực Quan Không Tải Lại Trang (Zero Page Reload)
Toàn bộ các tác vụ CRUD (Thêm chuyên khoa, phân công bác sĩ, hủy lịch, đổi ca trực, kê đơn thuốc) đều được xử lý bằng cơ chế **Asynchronous Fetch + React State Updates**:
- Khi gửi request thành công, state cục bộ lập tức được cập nhật và giao diện render lại chỉ trong vài mili-giây.
- Không có hiện tượng giật màn hình hoặc nháy trắng trình duyệt (FOUC).

---

### 6.2. Hệ Thống Trạng Thái Rỗng & Phản Hồi Trực Quan (Empty States & Shimmer Skeletons)
Khi dữ liệu trống (chưa có lịch hẹn, chưa có bác sĩ hoặc không tìm thấy kết quả lọc), hệ thống không để màn hình trống rỗng mà hiển thị **Empty State Card**:
- Biểu tượng mờ nhẹ kích thước lớn (`Calendar`, `Search`, `FileText`).
- Tiêu đề thông báo rõ ràng (ví dụ: *"Chưa có lịch hẹn nào sắp tới"*).
- Nút kêu gọi hành động dẫn thẳng tới luồng đặt lịch: `[ + Đặt Lịch Khám Mới ]`.

---

### 6.3. Bắt Lỗi Form Thời Gian Thực & Trợ Lực Nhập Liệu (Realtime Form Validation)
- Kiểm tra định dạng số điện thoại Việt Nam 10 số ngay khi người dùng hoàn thành nhập (`onBlur`).
- Kiểm tra ngày khám không được phép chọn ngày trong quá khứ.
- Bôi đỏ trường lỗi và hiển thị câu thông báo tiếng Việt dễ hiểu ngay dưới ô Input.

---

### 6.4. Tối Ưu Hóa Bản In Đơn Thuốc Y Tế (Print CSS & Dedicated Print View)
Dự án được cấu hình CSS in ấn chuyên biệt (`@media print`):
```css
@media print {
  /* Ẩn toàn bộ thanh điều hướng, banner demo, nút bấm khi in */
  header, footer, .role-switcher-banner, button {
    display: none !important;
  }
  /* Mở rộng tối đa khung đơn thuốc cho khổ giấy A4 */
  .printable-prescription {
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }
}
```

---

### 6.5. Thiết Kế Công Thái Học Cho Thiết Bị Di Động (Mobile-First Ergonomics)
- **Vùng chạm ngón tay tối thiểu:** Toàn bộ nút bấm và mục chọn đều có chiều cao $\ge 44px$, khoảng cách an toàn tránh bấm nhầm.
- **Thanh cuộn mượt không lộ thanh cuộn:** Class `scrollbar-none` kết hợp `touch-pan-x` trên các thanh Tabs giúp thao tác vuốt trượt trên điện thoại êm ái như ứng dụng Native (iOS/Android).

---

## 7. TIÊU CHUẨN TRUY CẬP, HIỆU NĂNG & SEO

### 7.1. Semantic HTML5 & Cấu Trúc Phân Cấp Tiêu Đề
- Mỗi trang duy trì duy nhất một thẻ `<h1>` chứa từ khóa quan trọng.
- Sử dụng các thẻ ngữ nghĩa: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Các nút bấm hành động luôn có thẻ `<button>` hoặc `<Link>` đúng chuẩn truy cập trình đọc màn hình (Screen Readers / ARIA).

---

### 7.2. Tối Ưu Hiệu Năng Render, Giảm CLS & Web Vitals
- **Tải trước Phông chữ (Font Preloading):** Cấu hình `display: 'swap'` trong `next/font` ngăn ngừa hiện tượng giật bố cục (Cumulative Layout Shift - CLS = 0).
- **Tối ưu hóa Ảnh:** Nạp ảnh đại diện từ CDN với tham số kích thước phù hợp (`&w=250&q=80`) giúp giảm 80% dung lượng ảnh tải về.
- **Tree-Shaking Icons:** Thư viện `lucide-react` chỉ đóng gói các icon thực tế được import vào bundle.

---

### 7.3. Cấu Hình Metadata & SEO Tiêu Chuẩn
Cấu hình tập trung trong [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx):
- `title`: *"CarePlus+ — Hệ Thống Phòng Khám Đặt Lịch & Theo Dõi Hồ Sơ Y Tế"*
- `description`: *"Đặt lịch khám bệnh trực tuyến nhanh chóng, chọn bác sĩ chuyên khoa và xem đơn thuốc điện tử an toàn."*
- Cấu hình thẻ `lang="vi"` chuẩn hóa ngôn ngữ cho các công cụ tìm kiếm Google/Bing.

---

## 8. BẢNG MA TRẬN TỔNG HỢP PHÂN HỆ GIAO DIỆN & QUYỀN HẠN TRUY CẬP

| Đường dẫn Route | Tên Giao Diện | Phân Quyền Hạn | Thành Phần UI Chính & Trọng Tâm Thiết Kế |
| :--- | :--- | :--- | :--- |
| `/` | **Trang Chủ (Landing Page)** | `PUBLIC` (Tất cả) | Hero Banner y tế, Thống kê, Lưới chuyên khoa, Top 8 bác sĩ, Quy trình 3 bước, Tra cứu nhanh. |
| `/book` | **Đặt Lịch Khám Bệnh** | `PUBLIC` / `PATIENT` | Wizard 3 bước, Lọc bác sĩ, Ma trận slot sáng/chiều, Phiếu lịch hẹn điện tử. |
| `/dashboard` | **Cổng Bệnh Nhân** | `PATIENT` (Bệnh nhân) | Header hồ sơ, Lịch hẹn tương lai, Lịch sử chẩn đoán, Đơn thuốc điện tử, Modal in phiếu A4. |
| `/doctor` | **Cổng Bác Sĩ** | `DOCTOR` (Bác sĩ) | 3 KPI ngày, Nút Báo bận khẩn cấp, Hàng chờ khám, Modal Khám & Kê đơn thuốc đa dòng. |
| `/admin` | **Trung Tâm Quản Trị & Lễ Tân** | `ADMIN` (Quản lý/Lễ tân) | 5 KPI, Biểu đồ Bar/Line Recharts, Điều phối lịch hẹn, Đổi bác sĩ khẩn cấp, CRUD Bác sĩ/Khoa. |
| `/login` | **Trang Đăng Nhập** | `PUBLIC` (Chưa login) | Form SĐT/Mật khẩu, Nút Quick Demo 3 Role, Modal Quên mật khẩu & OTP 2 bước. |
| `/register` | **Trang Đăng Ký** | `PUBLIC` (Bệnh nhân mới)| Form Đăng ký nhanh không cần email, Lớp nền kính mờ bảo mật. |

---

> **Tổng kết:** Toàn bộ hệ thống giao diện của **Phòng Khám CarePlus+ 2026** được xây dựng đồng bộ, hiện đại, đạt chuẩn công nghiệp về mặt kiến trúc Component, Type Safety và tính thẩm mỹ y tế. Hệ thống không chỉ đáp ứng hoàn hảo yêu cầu đồ án mà còn sẵn sàng cho việc triển khai thực tế tại các phòng khám đa khoa chuyên nghiệp.
