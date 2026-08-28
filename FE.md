# TÀI LIỆU PHÂN TÍCH TOÀN DIỆN THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (FRONTEND UI/UX ARCHITECTURE)
## DỰ ÁN PHÒNG KHÁM ĐA KHOA CAREPLUS+ (CAREPLUS CLINIC 2026)

---

## MỤC LỤC
1. [Tổng Quan Kiến Trúc Frontend & Triết Lý Thiết Kế (Design System & Philosophy)](#1-tổng-quan-kiến-trúc-frontend--triết-lý-thiết-kế)
   - [1.1. Triết lý thiết kế UI Y Tế Hiện Đại (Modern Healthcare Aesthetics)](#11-triết-lý-thiết-kế-ui-y-tế-hiện-đại-modern-healthcare-aesthetics)
   - [1.2. Hệ thống Design Tokens & Bảng màu chủ đạo (Color Palette & Semantic Tokens)](#12-hệ-thống-design-tokens--bảng-màu-chủ-đạo)
   - [1.3. Hệ thống Typography & Phông chữ Tiếng Việt tối ưu (Inter & Be Vietnam Pro)](#13-hệ-thống-typography--phông-chữ-tiếng-việt-tối-ưu)
   - [1.4. Hệ thống Bố cục, Lưới & Điểm ngắt Responsive](#14-hệ-thống-bố-cục-lưới--điểm-ngắt-responsive)
   - [1.5. Hiệu ứng Chiều sâu, Bóng đổ, Glassmorphism & Micro-animations](#15-hiệu-ứng-chiều-sâu-bóng-đổ-glassmorphism--micro-animations)
2. [Cấu Trúc Thư Mục & Bản Đồ Mã Nguồn Frontend (Source Code Architecture)](#2-cấu-trúc-thư-mục--bản-đồ-mã-nguồn-frontend)
   - [2.1. Cây thư mục hoàn chỉnh của phân hệ Frontend](#21-cây-thư-mục-hoàn-chỉnh-của-phân-hệ-frontend)
   - [2.2. Bảng thống kê chi tiết dung lượng, số dòng và vai trò từng file Frontend](#22-bảng-thống-kê-chi-tiết-dung-lượng-số-dòng-và-vai-trò-từng-file-frontend)
3. [Công Nghệ & Thư Viện Giao Diện Cốt Lõi (Frontend Tech Stack & Ecosystem)](#3-công-nghệ--thư-viện-giao-diện-cốt-lõi)
   - [3.1. Next.js 14 App Router & Hybrid Rendering](#31-nextjs-14-app-router--hybrid-rendering)
   - [3.2. Tailwind CSS v3.4 Utility-First & Custom Configurations](#32-tailwind-css-v34-utility-first--custom-configurations)
   - [3.3. Lucide React Vector Icons System](#33-lucide-react-vector-icons-system)
   - [3.4. React Hook Form & Zod Schema Validation](#34-react-hook-form--zod-schema-validation)
   - [3.5. Recharts Data Visualization (Interactive SVG Charts)](#35-recharts-data-visualization)
   - [3.6. Sonner Toast Notification & Realtime Feedback System](#36-sonner-toast-notification--realtime-feedback-system)
4. [Hệ Thống Atomic UI Components Dùng Chung & Phân Tích Mã Nguồn (UI Component Deep-Dive)](#4-hệ-thống-atomic-ui-components-dùng-chung--phân-tích-mã-nguồn)
   - [4.1. Phân tích Button Component (`button.tsx`)](#41-phân-tích-button-component-buttontsx)
   - [4.2. Phân tích Card Component System (`card.tsx`)](#42-phân-tích-card-component-system-cardtsx)
   - [4.3. Phân tích Dialog / Modal System (`dialog.tsx`)](#43-phân-tích-dialog--modal-system-dialogtsx)
   - [4.4. Phân tích Badge Component & Quản lý Trạng thái Lịch hẹn Thông minh](#44-phân-tích-badge-component--quản-lý-trạng-thái-lịch-hẹn-thông-minh)
   - [4.5. Phân tích Input & Select Controls (`input.tsx`, `select.tsx`)](#45-phân-tích-input--select-controls)
   - [4.6. Phân tích Tabs Navigation Component (`tabs.tsx`)](#46-phân-tích-tabs-navigation-component-tabstsx)
   - [4.7. Phân tích Shimmer Loading Skeletons (`skeleton.tsx`)](#47-phân-tích-shimmer-loading-skeletons-skeletontsx)
5. [Kiến Trúc Bố Cục Toàn Cục (Global Layout & Shell Components)](#5-kiến-trúc-bố-cục-toàn-cục)
   - [5.1. RoleSwitcherBanner — Thanh Demo Chuyển Đổi Vai Trò Tức Thì](#51-roleswitcherbanner--thanh-demo-chuyển-đổi-vai-trò-tức-thì)
   - [5.2. Navbar — Thanh Điều Hướng Thông Minh Theo Quyền](#52-navbar--thanh-điều-hướng-thông-minh-theo-quyền)
   - [5.3. Footer — Chân Trang Đa Thông Tin Nhận Biết Ngữ Cảnh](#53-footer--chân-trang-đa-thông-tin-nhận-biết-ngữ-cảnh)
   - [5.4. RootLayout & Bộ Nhận Diện Thương Hiệu Favicon Đa Kích Thước](#54-rootlayout--bộ-nhận-diện-thương-hiệu-favicon-đa-kích-thước)
6. [Phân Tích Chi Tiết Từng Màn Hình Giao Diện Người Dùng (Screen-by-Screen UI Analysis)](#6-phân-tích-chi-tiết-từng-màn-hình-giao-diện-người-dùng)
   - [6.1. Màn Hình Trang Chủ (`/` — Homepage & Landing Page)](#61-màn-hình-trang-chủ---homepage--landing-page)
   - [6.2. Màn Hình Đặt Lịch Khám Bệnh (`/book` — 3-Step Booking Wizard)](#62-màn-hình-đặt-lịch-khám-bệnh-book--3-step-booking-wizard)
   - [6.3. Màn Hình Cổng Bệnh Nhân (`/dashboard` — Patient Health Portal)](#63-màn-hình-cổng-bệnh-nhân-dashboard--patient-health-portal)
   - [6.4. Màn Hình Cổng Bác Sĩ (`/doctor` — Doctor Clinical Workbench)](#64-màn-hình-cổng-bác-sĩ-doctor--doctor-clinical-workbench)
   - [6.5. Màn Hình Trung Tâm Quản Trị & Lễ Tân (`/admin` — Operations & BI Command Center)](#65-màn-hình-trung-tâm-quản-trị--lễ-tân-admin--operations--bi-command-center)
   - [6.6. Màn Hình Xác Thực (`/login` & `/register` — Authentication Views)](#66-màn-hình-xác-thực-login--register--authentication-views)
7. [Sơ Đồ Luồng Tương Tác & Máy Trạng Thái Giao Diện (UI State Machines & User Flows)](#7-sơ-đồ-luồng-tương-tác--máy-trạng-thái-giao-diện)
   - [7.1. Sơ đồ luồng Đặt lịch khám bệnh 3 bước](#71-sơ-đồ-luồng-đặt-lịch-khám-bệnh-3-bước)
   - [7.2. Sơ đồ luồng Bác sĩ khám lâm sàng & Kê đơn thuốc đa dòng](#72-sơ-đồ-luồng-bác-sĩ-khám-lâm-sàng--kê-đơn-thuốc-đa-dòng)
   - [7.3. Sơ đồ luồng Điều phối ca khám & Giải quyết Đổi lịch khẩn cấp](#73-sơ-đồ-luồng-điều-phối-ca-khám--giải-quyết-đổi-lịch-khẩn-cấp)
   - [7.4. Sơ đồ luồng Bệnh nhân tra cứu hồ sơ & In đơn thuốc điện tử](#74-sơ-đồ-luồng-bệnh-nhân-tra-cứu-hồ-sơ--in-đơn-thuốc-điện-tử)
   - [7.5. Sơ đồ luồng Chuyển đổi vai trò Demo tức thì](#75-sơ-đồ-luồng-chuyển-đổi-vai-trò-demo-tức-thì)
8. [Chiến Lược Quản Lý Trạng Thái & Nạp Dữ Liệu Frontend (Client State & Data Fetching)](#8-chiến-lược-quản-lý-trạng-thái--nạp-dữ-liệu-frontend)
   - [8.1. Mô hình React State Lifecycle & Custom State Hooks](#81-mô-hình-react-state-lifecycle--custom-state-hooks)
   - [8.2. Cơ chế Đồng bộ Phiên Cookie-based Session Auth](#82-cơ-chế-đồng-bộ-phiên-cookie-based-session-auth)
   - [8.3. Nguyên tắc Cập nhật trực quan Lạc quan (Optimistic UI Updates)](#83-nguyên-tắc-cập-nhật-trực-quan-lạc-quan-optimistic-ui-updates)
9. [Bảng Ma Trận Validation & Bắt Lỗi Form Toàn Cục (Form Validation Matrix)](#9-bảng-ma-trận-validation--bắt-lỗi-form-toàn-cục)
10. [Ma Trận Tương Thích Đa Thiết Bị & Điểm Ngắt (Responsive & Breakpoint Adaptation Matrix)](#10-ma-trận-tương-thích-đa-thiết-bị--điểm-ngắt)
11. [Trải Nghiệm Người Dùng & Tương Tác Nâng Cao (UX/UI Patterns & Micro-Interactions)](#11-trải-nghiệm-người-dùng--tương-tác-nâng-cao)
    - [11.1. Nguyên Tắc Cập Nhật Trực Quan Không Tải Lại Trang (Zero Page Reload)](#111-nguyên-tắc-cập-nhật-trực-quan-không-tải-lại-trang)
    - [11.2. Hệ Thống Trạng Thái Rỗng & Phản Hồi Trực Quan (Empty States)](#112-hệ-thống-trạng-thái-rỗng--phản-hồi-trực-quan)
    - [11.3. Tối Ưu Hóa Bản In Đơn Thuốc Y Tế (Print CSS & Dedicated Print View)](#113-tối-ưu-hóa-bản-in-đơn-thuốc-y-tế)
    - [11.4. Thiết Kế Công Thái Học Cho Thiết Bị Di Động (Mobile-First Ergonomics)](#114-thiết-kế-công-thái-học-cho-thiết-bị-di-động)
12. [Tiêu Chuẩn Truy Cập, Hiệu Năng & SEO (Accessibility, Performance & SEO)](#12-tiêu-chuẩn-truy-cập-hiệu-năng--seo)
13. [Bảng Checklist Kiểm Thử Giao Diện & Tiêu Chuẩn Nghiệm Thu (UI/UX Acceptance Checklist)](#13-bảng-checklist-kiểm-thử-giao-diện--tiêu-chuẩn-nghiệm-thu)
14. [Bảng Ma Trận Tổng Hợp Phân Hệ Giao Diện & Quyền Hạn Truy Cập (Frontend Sitemap Matrix)](#14-bảng-ma-trận-tổng-hợp-phân-hệ-giao-diện--quyền-hạn-truy-cập)

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
3. **Hệ thống Bóng đổ Mềm (Custom Soft Shadows):**
   - `shadow-card`: `0 4px 20px -2px rgba(79, 195, 161, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)`
   - `shadow-soft`: `0 10px 30px -5px rgba(0, 0, 0, 0.05)`
   - Nút bấm và Thẻ tương tác có hiệu ứng `hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`.
4. **Micro-animations & Phản hồi Tương tác:**
   - Cảnh báo đổi bác sĩ khẩn cấp: Hiệu ứng `animate-pulse` nhấp nháy đỏ nhẹ thu hút sự chú ý tức thì của Lễ tân.
   - Nút nạp dữ liệu: Biểu tượng `Loader2` quay tròn với `animate-spin`.
   - Mở Modal Dialog: Hiệu ứng bung nhẹ `animate-in fade-in zoom-in-95 duration-150`.

---

## 2. CẤU TRÚC THƯ MỤC & BẢN ĐỒ MÃ NGUỒN FRONTEND

### 2.1. Cây thư mục hoàn chỉnh của phân hệ Frontend

```text
PhongKham2026/
├── public/                               # Tài nguyên tĩnh & Nhận diện thương hiệu
│   ├── favicon.ico                       # Favicon ICO chuẩn cho trình duyệt
│   ├── favicon.svg                       # Vector SVG favicon chất lượng cao (Icon nhịp tim)
│   ├── icon.png                          # Biểu tượng ứng dụng di động & Apple Touch Icon
│   └── images/
│       └── medical-auth-bg.jpg           # Ảnh nền y tế chìm cho trang Auth
│
├── src/
│   ├── app/                              # Next.js App Router (Routing & Màn hình)
│   │   ├── globals.css                   # Stylesheet toàn cục, biến CSS & hiệu ứng ánh sáng
│   │   ├── layout.tsx                    # Root Layout: nạp font, shell, toaster & metadata
│   │   ├── page.tsx                      # [Trang Chủ] Landing Page & Cổng thông tin
│   │   ├── book/
│   │   │   └── page.tsx                  # [Đặt Lịch] Wizard 3 bước đặt lịch khám bệnh
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # [Cổng Bệnh Nhân] Hồ sơ, Lịch sử khám & Đơn thuốc
│   │   ├── doctor/
│   │   │   └── page.tsx                  # [Cổng Bác Sĩ] Bàn làm việc, Hàng chờ & Kê đơn
│   │   ├── admin/
│   │   │   └── page.tsx                  # [Trung Tâm Quản Trị] BI Charts, Điều phối lịch & CRUD
│   │   ├── login/
│   │   │   └── page.tsx                  # [Đăng Nhập] Form SĐT, Nút Demo 3 Role & Quên MK
│   │   └── register/
│   │       └── page.tsx                  # [Đăng Ký] Tạo tài khoản bệnh nhân nhanh bằng SĐT
│   │
│   ├── components/                       # Thư viện UI Components
│   │   ├── layout/                       # Khung điều hướng & Layout toàn cục
│   │   │   ├── Navbar.tsx                # Thanh điều hướng thích ứng theo vai trò & Mobile Menu
│   │   │   ├── Footer.tsx                # Chân trang thông tin 4 cột (tự ẩn trên Admin/Doctor)
│   │   │   └── RoleSwitcherBanner.tsx    # Thanh công cụ Demo chuyển nhanh 4 vai trò (Top Bar)
│   │   │
│   │   └── ui/                           # Hệ thống Atomic UI Components dùng chung
│   │       ├── button.tsx                # Nút bấm 6 biến thể, 3 kích cỡ, hiệu ứng Loading
│   │       ├── card.tsx                  # Khối thẻ nội dung đa tầng & hiệu ứng hover elevation
│   │       ├── dialog.tsx                # Pop-up Modal 6 kích cỡ, khóa cuộn trang, bắt phím ESC
│   │       ├── badge.tsx                 # Huy hiệu trạng thái y tế đa sắc thái
│   │       ├── input.tsx                 # Ô nhập liệu tích hợp icon trang trí & thông báo lỗi
│   │       ├── select.tsx                # Dropdown chọn giá trị chuẩn hóa
│   │       ├── tabs.tsx                  # Thanh chuyển tab có đếm số lượng Badge & cuộn ngang
│   │       └── skeleton.tsx              # Khung hiệu ứng Shimmer nạp dữ liệu bảng & thẻ
│   │
│   ├── lib/                              # Tiện ích, Helper & Validation
│   │   ├── utils.ts                      # Hàm gộp class cn(), format tiền tệ/ngày giờ, badge helper
│   │   └── validations.ts                # Bộ Zod Schemas kiểm tra dữ liệu Form
│   │
│   └── types/                            # Hệ thống TypeScript Types & Interfaces
│       └── index.ts                      # Định nghĩa kiểu dữ liệu đồng bộ cho Frontend
│
├── tailwind.config.ts                    # Cấu hình Design Tokens, Bảng màu y tế & Hiệu ứng
├── postcss.config.mjs                    # Cấu hình PostCSS & Autoprefixer
└── package.json                          # Quản lý dependencies giao diện (Lucide, Recharts, Sonner...)
```

---

### 2.2. Bảng thống kê chi tiết dung lượng, số dòng và vai trò từng file Frontend

| STT | Đường dẫn Tệp Tin | Kích thước | Số dòng mã | Xuất khẩu chính (Exports) | Chức năng cụ thể |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | [`src/app/admin/page.tsx`](file:///d:/PhongKham2026/src/app/admin/page.tsx) | 95.4 KB | 2.109 dòng | `default AdminPortalPage` | Trung tâm điều hành Quản trị viên & Lễ tân, BI Charts, Phân công lịch, CRUD Bác sĩ/Khoa. |
| 2 | [`src/app/dashboard/page.tsx`](file:///d:/PhongKham2026/src/app/dashboard/page.tsx) | 51.2 KB | 1.100 dòng | `default PatientDashboard` | Cổng thông tin Bệnh nhân: Lịch hẹn sắp tới, Lịch sử khám font 24px, Đơn thuốc điện tử & In A4. |
| 3 | [`src/app/book/page.tsx`](file:///d:/PhongKham2026/src/app/book/page.tsx) | 41.1 KB | 871 dòng | `default BookingPage` | Luồng đặt lịch khám bệnh 3 bước, kiểm tra slot trống realtime, tạo lịch CONFIRMED/PENDING. |
| 4 | [`src/app/doctor/page.tsx`](file:///d:/PhongKham2026/src/app/doctor/page.tsx) | 32.7 KB | 742 dòng | `default DoctorPortalPage` | Bàn làm việc Bác sĩ, Hàng chờ khám, Nút báo bận khẩn cấp, Modal khám & kê đơn thuốc nhiều dòng. |
| 5 | [`src/components/layout/Navbar.tsx`](file:///d:/PhongKham2026/src/components/layout/Navbar.tsx) | 19.8 KB | 456 dòng | `Navbar` | Thanh điều hướng linh hoạt nhận diện quyền người dùng (Guest, Patient, Doctor, Admin). |
| 6 | [`src/app/page.tsx`](file:///d:/PhongKham2026/src/app/page.tsx) | 18.1 KB | 340 dòng | `default HomePage` | Trang chủ Landing Page, Hero Banner y tế, Thống kê, Lưới chuyên khoa, Top 8 Bác sĩ đầu ngành. |
| 7 | [`src/app/login/page.tsx`](file:///d:/PhongKham2026/src/app/login/page.tsx) | 17.3 KB | 409 dòng | `default LoginPage` | Form đăng nhập SĐT/Mật khẩu, Nút chuyển nhanh 3 Role Demo, Modal Quên mật khẩu OTP 2 bước. |
| 8 | [`src/app/register/page.tsx`](file:///d:/PhongKham2026/src/app/register/page.tsx) | 6.6 KB | 162 dòng | `default RegisterPage` | Form đăng ký tài khoản bệnh nhân siêu tốc không cần email phức tạp trên nền kính mờ. |
| 9 | [`src/components/layout/Footer.tsx`](file:///d:/PhongKham2026/src/components/layout/Footer.tsx) | 6.4 KB | 144 dòng | `Footer` | Chân trang y tế 4 cột, tự động ẩn trên cổng Bác sĩ/Quản trị viên để tối ưu diện tích hiển thị. |
| 10 | [`src/components/layout/RoleSwitcherBanner.tsx`](file:///d:/PhongKham2026/src/components/layout/RoleSwitcherBanner.tsx) | 5.1 KB | 125 dòng | `RoleSwitcherBanner` | Thanh Top Bar chuyển đổi nhanh 4 vai trò (Khách, Bệnh nhân, Bác sĩ, Quản lý) phục vụ demo/chấm thi. |
| 11 | [`src/lib/utils.ts`](file:///d:/PhongKham2026/src/lib/utils.ts) | 5.4 KB | 185 dòng | `cn, formatCurrency, formatDate, getStatusBadgeStyle...` | Bộ hàm tiện ích dùng chung cho format ngày/giờ, tiền tệ, khung giờ chuẩn và màu sắc badge. |
| 12 | [`src/lib/validations.ts`](file:///d:/PhongKham2026/src/lib/validations.ts) | 4.1 KB | 91 dòng | `bookingFormSchema, loginSchema, consultationSchema...` | Bộ Zod Schemas kiểm tra dữ liệu form tại client và đồng bộ API server. |
| 13 | [`src/types/index.ts`](file:///d:/PhongKham2026/src/types/index.ts) | 2.4 KB | 114 dòng | `UserSession, Appointment, DoctorInfo, Specialty...` | Định nghĩa hệ thống kiểu dữ liệu TypeScript toàn diện cho Frontend. |
| 14 | [`src/components/ui/dialog.tsx`](file:///d:/PhongKham2026/src/components/ui/dialog.tsx) | 2.2 KB | 73 dòng | `Dialog` | Pop-up Modal thông minh 6 kích cỡ, khóa cuộn trang, bắt phím ESC và nền mờ sâu. |
| 15 | [`src/components/ui/button.tsx`](file:///d:/PhongKham2026/src/components/ui/button.tsx) | 2.1 KB | 65 dòng | `Button` | Nút bấm 6 biến thể, 3 kích cỡ, tích hợp hiệu ứng xoay tròn Loader2 khi đang xử lý. |
| 16 | [`src/components/ui/tabs.tsx`](file:///d:/PhongKham2026/src/components/ui/tabs.tsx) | 1.7 KB | 52 dòng | `Tabs` | Thanh chuyển Tab ngang hỗ trợ đếm Badge và vuốt trượt cảm ứng trên di động. |
| 17 | [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx) | 1.6 KB | 52 dòng | `default RootLayout, metadata` | Layout gốc bao bọc toàn bộ ứng dụng, nạp phông chữ, bộ favicon và sonner toast. |
| 18 | [`src/components/ui/card.tsx`](file:///d:/PhongKham2026/src/components/ui/card.tsx) | 1.5 KB | 54 dòng | `Card, CardHeader, CardTitle, CardDescription...` | Khối thẻ đa tầng bo góc `rounded-2xl` với hiệu ứng nâng thẻ `hoverable`. |
| 19 | [`src/components/ui/input.tsx`](file:///d:/PhongKham2026/src/components/ui/input.tsx) | 1.5 KB | 51 dòng | `Input` | Ô nhập văn bản tích hợp icon trang trí, thông báo lỗi và viền sáng focus. |
| 20 | [`src/components/ui/select.tsx`](file:///d:/PhongKham2026/src/components/ui/select.tsx) | 1.4 KB | 53 dòng | `Select` | Trình chọn Dropdown chuẩn hóa phong cách thiết kế CarePlus+. |
| 21 | [`src/app/globals.css`](file:///d:/PhongKham2026/src/app/globals.css) | 1.3 KB | 66 dòng | Biến CSS & Tiện ích toàn cục | Khai báo các lớp kính mờ, quầng sáng và thanh cuộn đẹp mắt. |
| 22 | [`src/components/ui/badge.tsx`](file:///d:/PhongKham2026/src/components/ui/badge.tsx) | 1.0 KB | 38 dòng | `Badge` | Huy hiệu trạng thái y tế đa dạng màu sắc. |
| 23 | [`src/components/ui/skeleton.tsx`](file:///d:/PhongKham2026/src/components/ui/skeleton.tsx) | 0.9 KB | 35 dòng | `Skeleton, TableSkeleton, CardSkeleton` | Khung nạp hiệu ứng Shimmer mô phỏng dữ liệu đang tải. |

---

## 3. CÔNG NGHỆ & THƯ VIỆN GIAO DIỆN CỐT LÕI

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

### 3.1. Next.js 14 App Router & Hybrid Rendering
- **Server Components (RSC):** [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx) đóng vai trò là Shell cấp cao nhất nạp phông chữ, cấu hình Metadata SEO và nạp bộ nhận diện Icon tĩnh mà không làm tăng JavaScript bundle gửi về trình duyệt.
- **Client Components (`'use client'`):** Các trang điều hành tương tác cao ([`page.tsx`](file:///d:/PhongKham2026/src/app/page.tsx), [`/book`](file:///d:/PhongKham2026/src/app/book/page.tsx), [`/dashboard`](file:///d:/PhongKham2026/src/app/dashboard/page.tsx), [`/doctor`](file:///d:/PhongKham2026/src/app/doctor/page.tsx), [`/admin`](file:///d:/PhongKham2026/src/app/admin/page.tsx)) tận dụng React State, Hooks (`useState`, `useEffect`, `useMemo`, `useRouter`, `useSearchParams`) để quản lý các luồng nghiệp vụ phức tạp.

---

### 3.2. Tailwind CSS v3.4 Utility-First & Custom Configurations
Dự án sử dụng cơ chế gom lớp tiện ích (Utility classes) kết hợp hàm gộp class thông minh:
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
Hàm `cn()` giúp gộp linh hoạt các class điều kiện (`clsx`) và tự động giải quyết xung đột thuộc tính trùng nhau (`tailwind-merge`).

---

### 3.3. Lucide React Vector Icons System
Hệ thống sử dụng đồng bộ bộ biểu tượng Lucide React mang tính chuyên khoa y tế cao:
- Chuyên khoa: `HeartPulse` (Tim mạch), `Baby` (Nhi khoa), `Sparkles` (Da liễu), `Headphones` (Tai Mũi Họng), `Eye` (Mắt), `Smile` (Răng Hàm Mặt), `Activity` (Cơ Xương Khớp), `Stethoscope` (Đa khoa).
- Nghiệp vụ: `Calendar`, `Clock`, `UserCheck`, `Pill`, `FileText`, `Printer`, `AlertOctagon`, `Shield`, `CheckCircle2`.

---

### 3.4. React Hook Form & Zod Schema Validation
Sự kết hợp giữa `react-hook-form` và `zod` mang lại hiệu năng tối đa:
- Không gây re-render toàn bộ trang khi người dùng gõ từng ký tự vào ô Input.
- Bắt lỗi ngay tại Client và đồng bộ schema kiểm tra dữ liệu với Backend API.

---

### 3.5. Recharts Data Visualization (Interactive SVG Charts)
Tại cổng Quản trị viên [`/admin`](file:///d:/PhongKham2026/src/app/admin/page.tsx), thư viện `Recharts` trực quan hóa các chỉ số quan trọng:
1. **Biểu đồ Cột (`BarChart`):** Phân bổ số lượt khám theo từng chuyên khoa với màu cột gradient `brand-400`.
2. **Biểu đồ Đường (`LineChart` / `AreaChart`):** Theo dõi xu hướng tăng trưởng lượt đặt lịch khám trong 7 ngày gần nhất theo múi giờ Việt Nam.

---

### 3.6. Sonner Toast Notification & Realtime Feedback System
Thư viện `Sonner` được gắn cố định tại góc trên bên phải màn hình (`position="top-right"`, `richColors`):
- `toast.success("Thông báo thành công")`: Hiển thị viền xanh lá, icon dấu tích khi đặt lịch, tạo bác sĩ, lưu bệnh án.
- `toast.error("Thông báo lỗi")`: Hiển thị viền đỏ, icon cảnh báo khi trùng lịch hoặc nhập sai dữ liệu.

---

## 4. HỆ THỐNG ATOMIC UI COMPONENTS DÙNG CHUNG & PHÂN TÍCH MÃ NGUỒN

### 4.1. Phân tích Button Component (`button.tsx`)

File nguồn: [`src/components/ui/button.tsx`](file:///d:/PhongKham2026/src/components/ui/button.tsx)

```typescript
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, type = 'button', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl whitespace-nowrap select-none';

    const variants = {
      primary: 'bg-[#4fc3a1] hover:bg-[#3fb190] text-white shadow-sm hover:shadow focus:ring-[#4fc3a1]',
      secondary: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 focus:ring-[#4fc3a1]',
      outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-[#4fc3a1]',
      ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
      danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm focus:ring-rose-500',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base font-semibold gap-2.5 rounded-2xl',
    };

    return (
      <button ref={ref} type={type} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
```

---

### 4.2. Phân tích Card Component System (`card.tsx`)

File nguồn: [`src/components/ui/card.tsx`](file:///d:/PhongKham2026/src/components/ui/card.tsx)

```typescript
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-100/80 rounded-2xl p-6 shadow-card transition-all duration-200',
        hoverable && 'hover:shadow-soft hover:-translate-y-0.5 hover:border-emerald-200/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

### 4.3. Phân tích Dialog / Modal System (`dialog.tsx`)

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

export function Dialog({ isOpen, onClose, title, description, children, maxWidth = 'lg' }: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  // Render Modal với backdrop mờ và animate-in
}
```

---

### 4.4. Phân tích Badge Component & Quản lý Trạng thái Lịch hẹn Thông minh

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

---

### 4.5. Phân tích Input & Select Controls

- **[`input.tsx`](file:///d:/PhongKham2026/src/components/ui/input.tsx):** Hỗ trợ biểu tượng bên trái (`icon`), nhãn `label`, thông báo lỗi `error` màu đỏ và viền sáng focus `focus:ring-2 focus:ring-[#4fc3a1]/20`.
- **[`select.tsx`](file:///d:/PhongKham2026/src/components/ui/select.tsx):** Tích hợp biểu tượng mũi tên xổ xuống `ChevronDown` và kiểu dáng đồng bộ.

---

### 4.6. Phân tích Tabs Navigation Component (`tabs.tsx`)

File nguồn: [`src/components/ui/tabs.tsx`](file:///d:/PhongKham2026/src/components/ui/tabs.tsx)
- Hỗ trợ hiển thị số đếm `count` (ví dụ: số ca chờ khám, số ca đổi lịch gấp).
- Thiết kế thanh trượt ngang mượt mà trên di động với class `overflow-x-auto scrollbar-none touch-pan-x flex-nowrap`.
- Trạng thái Active có viền chân màu xanh ngọc lục bảo `border-[#4fc3a1]` và nền nhạt `bg-emerald-50/50`.

---

### 4.7. Phân tích Shimmer Loading Skeletons (`skeleton.tsx`)

- `Skeleton`: Khối xám nhấp nháy chuyển động ánh sáng `animate-pulse bg-slate-200/80 rounded-xl`.
- `TableSkeleton`: Khởi tạo sẵn cấu trúc bảng dữ liệu với số dòng và số cột tùy biến.

---

## 5. KIẾN TRÚC BỐ CỤC TOÀN CỤC (GLOBAL LAYOUT & SHELL COMPONENTS)

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

### 5.1. RoleSwitcherBanner — Thanh Demo Chuyển Đổi Vai Trò Tức Thì

File nguồn: [`src/components/layout/RoleSwitcherBanner.tsx`](file:///d:/PhongKham2026/src/components/layout/RoleSwitcherBanner.tsx)
- Đặt cố định ở đỉnh màn hình với tông màu đen xám công nghệ (`bg-slate-900`).
- Cung cấp **4 nút chuyển vai trò 1-click**: `Khách` | `Bệnh Nhân` | `Bác Sĩ` | `Quản Lý`, phục vụ việc demo và kiểm thử luồng người dùng cực nhanh.

---

### 5.2. Navbar — Thanh Điều Hướng Thông Minh Theo Quyền

File nguồn: [`src/components/layout/Navbar.tsx`](file:///d:/PhongKham2026/src/components/layout/Navbar.tsx)
- Menu trung tâm tự động biến đổi theo vai trò người dùng (Admin $\rightarrow$ Quản lý; Doctor $\rightarrow$ Bàn làm việc; Patient $\rightarrow$ Đặt lịch & Hồ sơ; Guest $\rightarrow$ Trang chủ & Liên hệ).
- Tích hợp Avatar người dùng, chức năng Đăng xuất và Drawer Menu trượt mượt mà trên di động.

---

### 5.3. Footer — Chân Trang Đa Thông Tin Nhận Biết Ngữ Cảnh

File nguồn: [`src/components/layout/Footer.tsx`](file:///d:/PhongKham2026/src/components/layout/Footer.tsx)
- Bố cục 4 cột chi tiết: Thông tin thương hiệu CarePlus+, Liên kết nhanh, Địa chỉ phòng khám và Giờ làm việc y tế.
- **Cơ chế nhận biết ngữ cảnh (Context-Aware):** Tự động ẩn hoàn toàn khi người dùng ở trong cổng Bác sĩ hoặc Quản trị viên để tối ưu diện tích bảng biểu.

---

### 5.4. RootLayout & Bộ Nhận Diện Thương Hiệu Favicon Đa Kích Thước

File nguồn: [`src/app/layout.tsx`](file:///d:/PhongKham2026/src/app/layout.tsx)
- [`public/favicon.ico`](file:///d:/PhongKham2026/public/favicon.ico): Tương thích trình duyệt cổ điển, loại bỏ hoàn toàn lỗi `404 favicon.ico` trên DevTools Console.
- [`public/favicon.svg`](file:///d:/PhongKham2026/public/favicon.svg): Đồ họa vector sắc nét ở mọi độ phân giải màn hình Retina/4K.
- [`public/icon.png`](file:///d:/PhongKham2026/public/icon.png): Định dạng PNG tối ưu cho thiết bị di động và Apple Touch Icon.

---

## 6. PHÂN TÍCH CHI TIẾT TỪNG MÀN HÌNH GIAO DIỆN NGƯỜI DÙNG

### 6.1. Màn Hình Trang Chủ (`/` — Homepage & Landing Page)

File nguồn: [`src/app/page.tsx`](file:///d:/PhongKham2026/src/app/page.tsx)

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

---

### 6.2. Màn Hình Đặt Lịch Khám Bệnh (`/book` — 3-Step Booking Wizard)

File nguồn: [`src/app/book/page.tsx`](file:///d:/PhongKham2026/src/app/book/page.tsx)

```
[ BƯỚC 1: Chọn Chuyên Khoa & Bác Sĩ ] ──> [ BƯỚC 2: Chọn Ngày & Giờ Khám ] ──> [ BƯỚC 3: Điền Thông Tin & Xác Nhận ]
```

- **Tự động điền thông tin:** Pre-fill từ session nếu đã đăng nhập.
- **Ma trận Khung Giờ Thông Minh:** Phân tách sáng / chiều, nhận diện slot bận realtime.
- **Tự Động Phân Nhánh Trạng Thái:** Tự chọn bác sĩ $\rightarrow$ `CONFIRMED`; Tự động xếp bác sĩ $\rightarrow$ `PENDING`.

---

### 6.3. Màn Hình Cổng Bệnh Nhân (`/dashboard` — Patient Health Portal)

File nguồn: [`src/app/dashboard/page.tsx`](file:///d:/PhongKham2026/src/app/dashboard/page.tsx)

- **Lịch Hẹn Sắp Tới:** Bác sĩ phụ trách, trạng thái, modal xác nhận hủy lịch.
- **Lịch Sử & Chẩn Đoán:** Tiêu đề chẩn đoán nổi bật cỡ `24px font-extrabold`, khối dặn dò màu hổ phách `bg-amber-50`.
- **Đơn Thuốc Điện Tử & Modal In Chuẩn A4:** Tích hợp `window.print()` và CSS `@media print`.
- **Chỉnh Sửa Hồ Sơ:** 8 Avatar Preset y tế đẹp mắt và đổi mật khẩu an toàn.

---

### 6.4. Màn Hình Cổng Bác Sĩ (`/doctor` — Doctor Clinical Workbench)

File nguồn: [`src/app/doctor/page.tsx`](file:///d:/PhongKham2026/src/app/doctor/page.tsx)

- **3 KPI Lâm Sàng:** Ca chờ hôm nay, ca đã khám xong, tổng ca trong ngày.
- **Nút Báo Bận Đột Xuất:** Chuyển các ca hẹn sang `NEEDS_REASSIGNMENT` và phát cảnh báo tới Admin.
- **Modal Khám Bệnh & Kê Đơn:** Form triệu chứng, chẩn đoán, và bảng thêm/xóa thuốc động nhiều dòng.

---

### 6.5. Màn Hình Trung Tâm Quản Trị & Lễ Tân (`/admin` — Operations & BI Command Center)

File nguồn: [`src/app/admin/page.tsx`](file:///d:/PhongKham2026/src/app/admin/page.tsx)

- **5 Thẻ KPI:** Tổng lịch, Đã xác nhận, Hoàn tất, Cần đổi bác sĩ khẩn cấp, Đã hủy.
- **Biểu đồ Doanh nghiệp Recharts:** `BarChart` tải khám chuyên khoa & `LineChart` xu hướng 7 ngày.
- **6 Tab Nghiệp Vụ:** Điều phối lịch hẹn, Đổi lịch khẩn cấp, Quản lý Bác sĩ, Quản lý Chuyên khoa, Giám sát ca hủy và Trung tâm thông báo.

---

### 6.6. Màn Hình Xác Thực (`/login` & `/register` — Authentication Views)

File nguồn: [`src/app/login/page.tsx`](file:///d:/PhongKham2026/src/app/login/page.tsx) và [`src/app/register/page.tsx`](file:///d:/PhongKham2026/src/app/register/page.tsx)
- Đăng ký siêu tốc chỉ bằng Số điện thoại (Zero-email friction).
- Bộ 3 nút Quick Demo Login 1-click.
- Modal Quên mật khẩu OTP 2 bước.

---

## 7. SƠ ĐỒ LUỒNG TƯƠNG TÁC & MÁY TRẠNG THÁI GIAO DIỆN

### 7.1. Sơ đồ luồng Đặt lịch khám bệnh 3 bước

```
[Bệnh Nhân Truy Cập /book]
          │
          ▼
┌───────────────────────────────────────────────────────────┐
│ Bước 1: CHỌN CHUYÊN KHOA & HÌNH THỨC                      │
│ ├─ Tự chọn bác sĩ: Nạp danh sách bác sĩ thuộc chuyên khoa │
│ └─ Xếp tự động: Chuyển thẳng sang bước 2                  │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│ Bước 2: CHỌN NGÀY & KHUNG GIỜ KHÁM                        │
│ ├─ Chọn ngày (Chặn ngày quá khứ)                          │
│ └─ Gọi API /api/appointments/available-slots              │
│    ├─ Slot trống: Hiển thị nút xanh                       │
│    └─ Slot kín: Disabled nút xám                          │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│ Bước 3: NHẬP THÔNG TIN BỆNH NHÂN                          │
│ ├─ Họ tên, SĐT 10 số (Zod Validation)                     │
│ └─ Ghi chú triệu chứng lâm sàng                           │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│ KẾT QUẢ & ĐIỀU HƯỚNG GIAO DIỆN                            │
│ ├─ Có chọn Bác sĩ ──> Gán CONFIRMED (Chờ khám)           │
│ └─ Xếp tự động    ──> Gán PENDING   (Chờ Lễ tân xếp)     │
└───────────────────────────────────────────────────────────┘
```

---

### 7.2. Sơ đồ luồng Bác sĩ khám lâm sàng & Kê đơn thuốc đa dòng

```
[Bác Sĩ Đăng Nhập /doctor]
          │
          ▼
┌───────────────────────────────────────────────────────────┐
│ HÀNG CHỜ KHÁM (Queue List)                                │
│ ├─ Lọc: Tất cả | Hôm nay | Sắp tới                        │
│ └─ Bấm nút [🩺 Bắt Đầu Khám & Kê Đơn]                     │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│ MODAL KHÁM BỆNH (Max-width 4xl)                           │
│ ├─ Nhập Triệu chứng (symptoms) & Chẩn đoán (diagnosis)    │
│ ├─ Bảng Thuốc Động: Bấm [+ Thêm thuốc] sinh thêm dòng     │
│ ├─ Nhập: Tên thuốc, Hàm lượng, Cách dùng, Số ngày         │
│ └─ Bấm [Lưu Hồ Sơ & Hoàn Tất Khám]                        │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│ CẬP NHẬT TRẠNG THÁI GIAO DIỆN                             │
│ ├─ Lịch hẹn chuyển sang COMPLETED                         │
│ ├─ Toast Sonner thông báo thành công                      │
│ └─ Hồ sơ xuất hiện tức thì trên Dashboard Bệnh Nhân       │
└───────────────────────────────────────────────────────────┘
```

---

### 7.3. Sơ đồ luồng Điều phối ca khám & Giải quyết Đổi lịch khẩn cấp

```
[Admin / Lễ Tân Đăng Nhập /admin]
          │
          ├────────────────────────────────────────┐
          │ (Luồng Điều Phối Thường)                │ (Luồng Đổi Lịch Khẩn Cấp)
          ▼                                        ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ TAB QUẢN LÝ LỊCH HẸN         │        │ TAB ĐỔI LỊCH KHẨN CẤP        │
│ ├─ Ca PENDING (Chưa có BS)   │        │ ├─ Ca NEEDS_REASSIGNMENT     │
│ ├─ Chọn BS từ Dropdown dòng  │        │ ├─ Phương án A: Chọn BS khác │
│ └─ Tự kiểm tra trùng lịch    │        │ └─ Phương án B: Đổi giờ khám │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────┐
│ KẾT QUẢ: Chuyển sang CONFIRMED, Gửi thông báo tới Bệnh Nhân  │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.4. Sơ đồ luồng Bệnh nhân tra cứu hồ sơ & In đơn thuốc điện tử

```
[Bệnh Nhân Truy Cập /dashboard]
          │
          ▼
┌──────────────────────────────────────────────────────────────┐
│ TAB ĐƠN THUỐC & LỊCH SỬ KHÁM                                 │
│ ├─ Xem Chẩn đoán Y Khoa nổi bật cỡ chữ 24px                  │
│ ├─ Xem Khối Dặn Dò màu hổ phách của Bác sĩ                   │
│ └─ Bấm nút [📄 Xem Chi Tiết Đơn Thuốc & In]                  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ MODAL IN ĐƠN THUỐC ĐIỆN TỬ (Printable View)                  │
│ ├─ Tiêu đề Phòng khám CarePlus+ & Mã phiếu hẹn               │
│ ├─ Thông tin Bệnh nhân & Bác sĩ phụ trách                    │
│ ├─ Bảng danh mục thuốc chi tiết                              │
│ └─ Bấm nút [🖨️ In Đơn Thuốc] ──> Gọi window.print()         │
│    (CSS @media print tự ẩn toàn bộ Navbar/Footer)            │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.5. Sơ đồ luồng Chuyển đổi vai trò Demo tức thì

```
[Người Dùng Bấm Nút Trên RoleSwitcherBanner]
          │
          ├──────────────┬──────────────┬──────────────┐
          ▼              ▼              ▼              ▼
       [Khách]     [Bệnh Nhân]     [Bác Sĩ]       [Quản Lý]
          │              │              │              │
          ▼              ▼              ▼              ▼
     Gọi Logout    POST Role      POST Role      POST Role
          │          PATIENT        DOCTOR         ADMIN
          ▼              ▼              ▼              ▼
      Chuyển về      Chuyển về      Chuyển về      Chuyển về
       Trang /      /dashboard       /doctor        /admin
```

---

## 8. CHIẾN LƯỢC QUẢN LÝ TRẠNG THÁI & NẠP DỮ LIỆU FRONTEND

### 8.1. Mô hình React State Lifecycle & Custom State Hooks
- Sử dụng các Hook chuẩn của React: `useState` cho dữ liệu cục bộ, `useEffect` cho nạp dữ liệu ban đầu, `useMemo` cho lọc và tính toán thống kê (như tính toán Top 8 bác sĩ, phân loại ca chờ khám), `useRef` cho tham chiếu phần tử HTML và bản in.
- Không sử dụng các thư viện State bên ngoài cồng kềnh (như Redux), giúp tối ưu kích thước bundle JavaScript gửi về client.

---

### 8.2. Cơ chế Đồng bộ Phiên Cookie-based Session Auth
- Giao diện nạp thông tin người dùng qua endpoint `/api/auth/me`.
- Khi chuyển đổi route, hook `usePathname` trong `Navbar` và `RoleSwitcherBanner` tự động kích hoạt hàm `fetchSession()` để làm mới thông tin đăng nhập, đảm bảo hiển thị đúng avatar, họ tên và menu theo quyền hạn.

---

### 8.3. Nguyên tắc Cập nhật trực quan Lạc quan (Optimistic UI Updates)
- Khi Lễ tân phân công bác sĩ hoặc Bác sĩ hoàn thành khám, giao diện cập nhật state mảng `appointments` ngay lập tức trên UI trước khi đợi request server hoàn tất, mang lại cảm giác mượt mà tức thì cho người dùng.

---

## 9. BẢNG MA TRẬN VALIDATION & BẮT LỖI FORM TOÀN CỤC

| Tên Form / Schema | Trường kiểm tra | Điều kiện Ràng buộc (Validation Rule) | Thông báo Lỗi Hiển thị Tiếng Việt |
| :--- | :--- | :--- | :--- |
| **Đặt Lịch Khám** (`bookingFormSchema`) | `specialtyId` | Bắt buộc, chuỗi không rỗng | *"Vui lòng chọn chuyên khoa khám"* |
| | `appointmentDate` | Bắt buộc, $\ge$ Ngày hiện tại | *"Ngày khám không thể ở trong quá khứ"* |
| | `appointmentTime` | Bắt buộc, chuỗi không rỗng | *"Vui lòng chọn khung giờ khám"* |
| | `fullName` | Độ dài $\ge$ 2 ký tự | *"Họ và tên phải có ít nhất 2 ký tự"* |
| | `phone` | Regex SĐT VN 10 số | *"Số điện thoại phải đúng định dạng 10 số"* |
| **Đăng Ký** (`registerSchema`) | `fullName` | Độ dài $\ge$ 2 ký tự | *"Họ tên phải có ít nhất 2 ký tự"* |
| | `phone` | Regex SĐT VN 10 số | *"Số điện thoại phải đúng định dạng 10 số"* |
| | `password` | Độ dài $\ge$ 6 ký tự | *"Mật khẩu phải có ít nhất 6 ký tự"* |
| | `confirmPassword` | Phải trùng khớp với `password` | *"Mật khẩu xác nhận không khớp"* |
| **Khám & Kê Đơn** (`consultationSchema`)| `symptoms` | Độ dài $\ge$ 3 ký tự | *"Vui lòng mô tả triệu chứng bệnh nhân"* |
| | `diagnosis` | Độ dài $\ge$ 3 ký tự | *"Vui lòng nhập chẩn đoán y khoa"* |
| | `medicineName` | Bắt buộc cho từng dòng thuốc | *"Vui lòng nhập tên thuốc"* |
| | `dosage` | Bắt buộc (ví dụ: 500mg) | *"Vui lòng nhập hàm lượng"* |
| | `frequency` | Bắt buộc (ví dụ: 2 lần/ngày) | *"Vui lòng nhập cách dùng"* |
| | `duration` | Bắt buộc (ví dụ: 7 ngày) | *"Vui lòng nhập thời gian"* |
| **Bác Sĩ Báo Bận** (`doctorUnavailabilitySchema`)| `reason` | Độ dài $\ge$ 5 ký tự | *"Vui lòng nhập rõ lý do báo bận"* |
| **Thêm Bác Sĩ Mới** (`doctorProfileSchema`)| `fullName`, `email`, `phone`, `degree`, `experienceYears`, `consultationFee`, `bio` | Bắt buộc đầy đủ, email hợp lệ, kinh nghiệm và giá khám $\ge$ 0 | *"Vui lòng nhập đầy đủ thông tin bác sĩ hợp lệ"* |

---

## 10. MA TRẬN TƯƠNG THÍCH ĐA THIẾT BỊ & ĐIỂM NGẮT

| Màn hình | Mobile (< 640px) | Tablet (640px - 1024px) | Desktop (1024px - 1440px) | Ultrawide (> 1440px) |
| :--- | :--- | :--- | :--- | :--- |
| **Trang Chủ (`/`)** | 1 cột, Drawer Menu, Lưới chuyên khoa 2 cột. | Lưới chuyên khoa 3 cột, Lưới Bác sĩ 2 cột. | Lưới chuyên khoa 4 cột, Lưới Bác sĩ 4 cột, Hero Banner 2 cột. | Container căn giữa `max-w-7xl`, giới hạn độ rộng đọc tối ưu. |
| **Đặt Lịch (`/book`)** | 1 cột Wizard, Ma trận khung giờ 2 cột. | Ma trận khung giờ 4 cột, Nút điều hướng cố định. | 2 cột (Cột chọn + Cột tóm tắt phiếu khám). | Bố cục thoáng, căn giữa màn hình. |
| **Cổng Bệnh Nhân (`/dashboard`)**| Tab cuộn ngang vuốt ngón tay, Card xếp dọc. | Tab đầy đủ, Lưới đơn thuốc 2 cột. | Bảng lịch hẹn chi tiết, Cột hồ sơ bên trái. | Bố cục đa cột tối ưu không gian. |
| **Cổng Bác Sĩ (`/doctor`)** | 3 KPI xếp dọc, Nút Khám toàn chiều rộng. | 3 KPI dàn ngang, Bảng hàng chờ cuộn ngang. | Bảng lâm sàng đầy đủ, Modal kê đơn 4xl. | Tối ưu quan sát nhiều ca khám cùng lúc. |
| **Quản Trị (`/admin`)** | KPI 2 cột, Biểu đồ xếp dọc 1 cột. | KPI 3 cột, Bảng điều phối cuộn ngang. | KPI 5 cột, Biểu đồ 2 cột song song, Đầy đủ bảng CRUD. | Tháp điều hành toàn diện, hiển thị tối đa dữ liệu. |

---

## 11. TRẢI NGHIỆM NGƯỜI DÙNG & TƯƠNG TÁC NÂNG CAO

### 11.1. Nguyên Tắc Cập Nhật Trực Quan Không Tải Lại Trang (Zero Page Reload)
Toàn bộ các tác vụ CRUD đều được xử lý bằng cơ chế **Asynchronous Fetch + React State Updates**:
- Không có hiện tượng giật màn hình hoặc nháy trắng trình duyệt (FOUC).

---

### 11.2. Hệ Thống Trạng Thái Rỗng & Phản Hồi Trực Quan (Empty States)
Khi chưa có dữ liệu, hiển thị **Empty State Card** với icon mờ, thông điệp rõ ràng và nút bấm kêu gọi hành động dẫn thẳng tới luồng tạo mới.

---

### 11.3. Tối Ưu Hóa Bản In Đơn Thuốc Y Tế (Print CSS & Dedicated Print View)
Cấu hình CSS `@media print` tự động loại bỏ thanh điều hướng, nút bấm, banner demo và định dạng đơn thuốc vừa vặn trên trang giấy A4 hoặc file PDF xuất ra.

---

### 11.4. Thiết Kế Công Thái Học Cho Thiết Bị Di Động (Mobile-First Ergonomics)
Toàn bộ nút bấm và mục chọn đều có chiều cao $\ge 44px$, khoảng cách an toàn tránh bấm nhầm trên màn hình cảm ứng.

---

## 12. TIÊU CHUẨN TRUY CẬP, HIỆU NĂNG & SEO

- **Semantic HTML5:** Mỗi trang duy trì 1 thẻ `<h1>`, sử dụng đúng các thẻ ngữ nghĩa `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- **Tối ưu Web Vitals:** Cấu hình `display: 'swap'` cho phông chữ giúp chỉ số CLS = 0.
- **Metadata:** Tiêu đề, mô tả và cấu hình favicon chuẩn W3C.

---

## 13. BẢNG CHECKLIST KIỂM THỬ GIAO DIỆN & TIÊU CHUẨN NGHIỆM THU

| Hạng mục kiểm thử | Tiêu chuẩn Đạt yêu cầu (Acceptance Criteria) | Kết quả Đánh giá |
| :--- | :--- | :---: |
| **Nhận diện Thương hiệu & Favicon** | Hiển thị đúng biểu tượng nhịp tim y tế, không báo lỗi 404 trên Console F12. | **ĐẠT (100%)** |
| **Thanh Chuyển Quyền Demo** | Chuyển đổi mượt mà giữa 4 vai trò Khách, Bệnh nhân, Bác sĩ, Quản lý chỉ với 1 click. | **ĐẠT (100%)** |
| **Đặt Lịch Khám Bệnh 3 Bước** | Chọn đúng chuyên khoa, bác sĩ, ngày giờ; kiểm tra trùng slot realtime; tạo lịch thành công. | **ĐẠT (100%)** |
| **Cổng Bệnh Nhân & Đơn Thuốc** | Hiển thị kết luận chẩn đoán font 24px, khối dặn dò bác sĩ, in đơn thuốc A4 chuẩn. | **ĐẠT (100%)** |
| **Cổng Bác Sĩ & Kê Đơn Thuốc** | Nút Báo bận khẩn cấp hoạt động, bảng kê đơn thuốc động cho phép thêm/xóa thuốc mượt mà. | **ĐẠT (100%)** |
| **Trung Tâm Quản Trị & BI Charts**| Biểu đồ Recharts vẽ chuẩn, điều phối bác sĩ 1-click thành công, xử lý đổi lịch khẩn cấp tốt. | **ĐẠT (100%)** |
| **Responsive trên Thiết Bị Di Động**| Drawer menu hoạt động trơn tru, không vỡ layout trên màn hình từ 375px trở lên. | **ĐẠT (100%)** |

---

## 14. BẢNG MA TRẬN TỔNG HỢP PHÂN HỆ GIAO DIỆN & QUYỀN HẠN TRUY CẬP

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
