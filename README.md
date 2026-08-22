# 🏥 Phòng Khám 2026 (Clinic Management System)

Hệ thống quản lý phòng khám hiện đại, tối ưu cho việc đặt lịch khám, quản lý hồ sơ bệnh án, kê đơn thuốc và phân công bác sĩ tự động/thủ công. Dự án được xây dựng theo kiến trúc Full-stack với **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM** và **Tailwind CSS**.

---

## 🚀 Các Công Nghệ Được Áp Dụng

### 1. Nền Tảng & Framework Cốt Lõi (Core Stack)
* **[Next.js 14 (v14.2.5)](https://nextjs.org/)**: Framework React full-stack hiện đại với App Router (`src/app`), Server Components và Server API Routes.
* **[React 18 (v18.3.1)](https://react.dev/)**: Thư viện UI cốt lõi cung cấp cơ chế render hiệu năng cao.
* **[TypeScript (v5.5.4)](https://www.typescriptlang.org/)**: Đảm bảo **Type Safety** toàn diện từ Frontend UI, Backend API Routes cho đến các truy vấn CSDL Prisma.

### 2. Cơ Sở Dữ Liệu & ORM (Database & Persistence Layer)
* **[Prisma ORM (v5.18.0)](https://www.prisma.io/)**: ORM thế hệ mới cho TypeScript, quản lý migration, sinh Prisma Client ngắt lỗi compile-time.
* **[SQLite](https://www.sqlite.org/)**: CSDL quan hệ dạng tệp tin cục bộ (`prisma/dev.db`), nhẹ, gọn và dễ dàng triển khai thử nghiệm.
* **Prisma Studio**: Công cụ UI quản trị cơ sở dữ liệu (`npx prisma studio`).
* **[tsx (v4.17.0)](https://github.com/privatenumber/tsx)**: Công cụ thực thi TypeScript runner cho script khởi tạo dữ liệu mẫu (`prisma/seed.ts`).

### 3. Giao Diện & Thiết Kế (UI & Styling System)
* **[Tailwind CSS (v3.4.7)](https://tailwindcss.com/)**: Utility-first CSS framework giúp thiết kế responsive, tùy biến linh hoạt.
* **[PostCSS (v8.4.40)](https://postcss.org/) & Autoprefixer**: Tiền xử lý CSS tương thích trình duyệt.
* **[Lucide React (v0.427.0)](https://lucide.dev/)**: Bộ biểu tượng SVG vector hiện đại, đồng bộ.
* **clsx & tailwind-merge**: Tiện ích xử lý và gộp CSS class động cho các UI component.

### 4. Quản Lý Form & Kiểm Định Dữ Liệu (Form Handling & Validation)
* **[React Hook Form (v7.52.2)](https://react-hook-form.com/)**: Quản lý trạng thái form hiệu năng cao, tối ưu re-render.
* **[Zod (v3.23.8)](https://zod.dev/)**: Khai báo schema validation dữ liệu đồng bộ giữa Client Form và Server API.
* **@hookform/resolvers**: Kết nối Zod Schema với React Hook Form.

### 5. Xác Thực & Bảo Mật (Authentication & Security)
* **[Bcrypt.js (v2.4.3)](https://github.com/dcodeIO/bcrypt.js)**: Mã hóa mật khẩu an toàn với Salt (Password Hashing).
* **Cookie-Based Session Auth**: Quản lý phiên đăng nhập an toàn qua HTTP Cookie (`phongkham_session_user`), xử lý đọc session trực tiếp từ Server Side qua Next.js `cookies()`.

### 6. Hiển Thị Dữ Liệu & Tiện Ích Trải Nghiệm (Data Visualization & UX Utilities)
* **[Recharts (v2.12.7)](https://recharts.org/)**: Thư viện vẽ biểu đồ thống kê chuyên khoa, lượt khám và doanh thu.
* **[Sonner (v1.5.0)](https://sonner.emilkowal.ski/)**: Thư viện hiển thị thông báo Toast mượt mà.
* **[date-fns (v3.6.0)](https://date-fns.org/)**: Tiện ích xử lý và định dạng ngày tháng.

---

## 🏗️ Kiến Trúc Hệ Thống & Phân Quyền (RBAC)

Hệ thống phân quyền 3 vai trò chính dựa trên `Role`:

```
+-------------------------------------------------------------------+
|                        Next.js App Router                         |
+-------------------------------------------------------------------+
       |                            |                           |
       v                            v                           v
[PATIENT - Bệnh nhân]      [DOCTOR - Bác sĩ]        [ADMIN - Quản trị]
- Tìm kiếm bác sĩ          - Xem ca khám            - Thống kê tổng quan
- Đặt lịch khám            - Nhập hồ sơ bệnh án     - Phân công bác sĩ
- Xem đơn thuốc / lịch sử  - Kê đơn thuốc           - Quản lý danh mục
       |                            |                           |
       +----------------------------+---------------------------+
                                    |
                                    v
                         [Server API / Prisma ORM]
                                    |
                                    v
                           [SQLite Database]
```

### Các Mô Hình Dữ Liệu Chính (Data Models)
* **User**: Người dùng hệ thống (`ADMIN`, `DOCTOR`, `PATIENT`).
* **DoctorInfo**: Thông tin bằng cấp, kinh nghiệm, chuyên khoa, giá khám của Bác sĩ.
* **DoctorSchedule**: Lịch làm việc theo thứ / giờ của từng Bác sĩ.
* **Specialty**: Danh mục Chuyên khoa (Nội khoa, Nhi khoa, Tim mạch, v.v.).
* **Appointment**: Lịch hẹn khám (Trạng thái: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NEEDS_REASSIGNMENT`).
* **MedicalRecord**: Hồ sơ bệnh án chi tiết gắn liền với Lịch hẹn.
* **Prescription**: Đơn thuốc đi kèm Hồ sơ bệnh án.
* **Notification**: Hệ thống thông báo thời gian thực cho người dùng.

---

## 📁 Cấu Trúc Mã Nguồn

```text
PhongKham2026/
├── prisma/
│   ├── schema.prisma      # Khai báo Schema CSDL & quan hệ bảng
│   └── seed.ts            # Script sinh dữ liệu mẫu ban đầu
├── src/
│   ├── app/               # Next.js App Router (Pages & API Routes)
│   │   ├── admin/         # Phân hệ Quản trị viên
│   │   ├── api/           # Các Backend REST API Routes
│   │   ├── book/          # Luồng Đặt lịch khám
│   │   ├── dashboard/     # Trang cá nhân Bệnh nhân
│   │   ├── doctor/        # Phân hệ Bác sĩ
│   │   ├── login/         # Trang Đăng nhập
│   │   ├── register/      # Trang Đăng ký
│   │   ├── globals.css    # Stylesheet toàn cục (Tailwind CSS)
│   │   ├── layout.tsx     # Root Layout
│   │   └── page.tsx       # Trang chủ hệ thống
│   ├── components/        # UI Components dùng chung & Layout
│   │   ├── layout/        # Navbar, Footer, Sidebar
│   │   └── ui/            # Buttons, Cards, Inputs, Modals
│   ├── lib/               # Utility functions, Auth, Prisma Client & Validations
│   │   ├── auth.ts        # Helper xử lý Session Cookie
│   │   ├── prisma.ts      # Khởi tạo Singleton Prisma Client
│   │   ├── utils.ts       # Utility helper functions
│   │   └── validations.ts # Zod Schemas
│   └── types/             # Định nghĩa TypeScript Types / Interfaces
├── next.config.mjs        # Cấu hình Next.js
├── tailwind.config.ts     # Cấu hình Tailwind CSS
└── package.json           # Quản lý dependencies & scripts
```

---

## 🛠️ Hướng Dẫn Chạy Dự Án (Quick Start)

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Khởi tạo Cơ sở dữ liệu SQLite & Data Seed
```bash
# Push schema vào file SQLite cục bộ (prisma/dev.db)
npm run db:push

# Nạp dữ liệu mẫu ban đầu (Bác sĩ, Chuyên khoa, Người dùng)
npm run db:seed
```

### 3. Chạy Server ở Môi Trường Phát Triển
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 4. Quản Trị CSDL Với Prisma Studio (Tùy chọn)
```bash
npm run db:studio
```
Mở giao diện quản trị CSDL tại: `http://localhost:5555`

---

## 📜 Các Lệnh Scripts khả dụng

* `npm run dev`: Chạy server phát triển Next.js.
* `npm run build`: Biên dịch ứng dụng cho Production.
* `npm run start`: Chạy server ở chế độ Production sau khi build.
* `npm run lint`: Kiểm tra lỗi mã nguồn với Next.js ESLint.
* `npm run db:push`: Đồng bộ Prisma Schema vào SQLite CSDL.
* `npm run db:seed`: Chạy nạp dữ liệu mẫu ban đầu.
* `npm run db:studio`: Mở công cụ quản trị dữ liệu Prisma Studio.
