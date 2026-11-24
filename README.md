# 🏥 Phòng Khám 2026 (Clinic Management System)

Hệ thống quản lý phòng khám hiện đại, tối ưu cho việc đặt lịch khám, quản lý hồ sơ bệnh án, kê đơn thuốc và phân công bác sĩ tự động/thủ công. Dự án được xây dựng theo kiến trúc Full-stack với **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM** và **Tailwind CSS**.

---

## 🚀 Các Công Nghệ Được Áp Dụng (Chi Tiết & Đầy Đủ)

### 1. Nền Tảng Cốt Lõi & Ngôn Ngữ Lập Trình (Core Framework & Language)

| Công nghệ | Phiên bản | Vai trò & Ứng dụng thực tế trong dự án | File tiêu biểu |
| :--- | :--- | :--- | :--- |
| **[Next.js (App Router)](https://nextjs.org/)** | `14.2.5` | Framework Full-stack chủ đạo của dự án. Quản lý định tuyến theo thư mục (`src/app`), kết hợp **Server Components** và **Client Components** (`'use client'`), đồng thời tích hợp sẵn **Server API Routes** làm Backend mà không cần tách server Express riêng. | `next.config.mjs`, `src/app/layout.tsx` |
| **[React](https://react.dev/) & React DOM** | `18.3.1` | Thư viện cốt lõi xây dựng giao diện hướng thành phần (Component-based UI). Sử dụng các React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`) để quản lý trạng thái đặt lịch, giỏ thuốc, bộ lọc tìm kiếm và chatbot. | `src/app/page.tsx` |
| **[TypeScript](https://www.typescriptlang.org/)** | `5.5.4` | Ngôn ngữ chính (`strict: true`). Đảm bảo **Type Safety** xuyên suốt từ giao diện, dữ liệu gửi qua API cho tới các bảng truy vấn trong CSDL, giúp phát hiện lỗi ngay lúc biên dịch (Compile-time). | `tsconfig.json`, `src/types/index.ts` |
| **Node.js Runtime** | `v20+` | Môi trường thực thi phía máy chủ (Server-side runtime) cho Next.js API Routes, Prisma ORM và các tác vụ đọc/ghi file CSDL. | `package.json` |

### 2. Giao Diện, Thiết Kế & Trực Quan Hóa Dữ Liệu (UI, Styling & Data Visualization)

| Công nghệ | Phiên bản | Vai trò & Ứng dụng thực tế trong dự án | File tiêu biểu |
| :--- | :--- | :--- | :--- |
| **[Tailwind CSS](https://tailwindcss.com/)** | `3.4.7` | Utility-first CSS Framework dùng để thiết kế toàn bộ giao diện theo tông màu y tế (`brand` / `clinic` xanh ngọc `#4fc3a1`, `#10b981`) và tối ưu hiển thị đa thiết bị (Responsive Mobile / Tablet / Desktop). | `tailwind.config.ts`, `src/app/globals.css` |
| **[PostCSS](https://postcss.org/) & Autoprefixer** | `8.4.40` / `10.4.20` | Công cụ biên dịch CSS và tự động thêm tiền tố (`-webkit-`, `-moz-`) đảm bảo tương thích trên mọi trình duyệt. | `postcss.config.mjs` |
| **[Lucide React](https://lucide.dev/)** | `0.427.0` | Bộ thư viện icon vector SVG y tế hiện đại (`HeartPulse`, `Stethoscope`, `Calendar`, `Baby`, `Shield`, `FileText`...) dùng trên toàn hệ thống. | `src/components/layout/Navbar.tsx` |
| **[Recharts](https://recharts.org/)** | `2.12.7` | Thư viện vẽ biểu đồ thống kê trực quan trong phân hệ **Admin** (biểu đồ doanh thu, số ca khám theo chuyên khoa, tỷ lệ trạng thái lịch hẹn). | `src/app/admin/page.tsx` |
| **[Sonner](https://sonner.emilkowal.ski/)** | `1.5.0` | Thư viện hiển thị thông báo nổi (**Toast Notifications**) mượt mà khi người dùng đặt lịch thành công, bác sĩ lưu bệnh án hoặc báo lỗi đăng nhập. | `src/app/layout.tsx` |
| **clsx & tailwind-merge** | `2.1.1` / `2.4.0` | Tiện ích gộp class CSS động thông minh (hàm `cn()`), giúp tránh xung đột class Tailwind khi xây dựng hệ thống Design System (`Button`, `Card`, `Badge`, `Modal`, `Input`). | `src/lib/utils.ts` |

### 3. Quản Lý Biểu Mẫu & Kiểm Định Dữ Liệu (Form Handling & Schema Validation)

| Công nghệ | Phiên bản | Vai trò & Ứng dụng thực tế trong dự án | File tiêu biểu |
| :--- | :--- | :--- | :--- |
| **[React Hook Form](https://react-hook-form.com/)** | `7.52.2` | Quản lý trạng thái các biểu mẫu phức tạp (Form Đặt lịch 3 bước, Form Khám bệnh & Kê đơn nhiều dòng thuốc, Form Đăng ký/Đăng nhập) với hiệu năng cao, hạn chế re-render. | `src/app/book/page.tsx`, `src/app/doctor/page.tsx` |
| **[Zod](https://zod.dev/)** | `3.23.8` | Khai báo Schema kiểm định dữ liệu chặt chẽ (ràng buộc định dạng số điện thoại Việt Nam 10 số, ngày khám không ở quá khứ, mật khẩu tối thiểu 6 ký tự, thông tin đơn thuốc...). | `src/lib/validations.ts` |
| **@hookform/resolvers** | `3.9.0` | Cầu nối tích hợp trực tiếp **Zod Schema** vào **React Hook Form** để tự động bắt lỗi và hiển thị thông báo tiếng Việt trên giao diện. | `src/app/register/page.tsx` |
| **[date-fns](https://date-fns.org/)** | `3.6.0` | Thư viện xử lý, so sánh và định dạng ngày giờ khám bệnh, tính toán lịch trực theo thứ trong tuần của bác sĩ. | `src/lib/utils.ts` |

### 4. Kiến Trúc Backend, API & Xử Lý Nghiệp Vụ (Backend & Business Logic)

| Công nghệ / Kỹ thuật | Chi tiết triển khai trong dự án | File tiêu biểu |
| :--- | :--- | :--- |
| **Next.js RESTful API Routes** | Xây dựng hệ thống các endpoints chuẩn REST (`GET`, `POST`, `PUT`, `DELETE`) trả về dữ liệu `JSON` qua `NextResponse`. Bao gồm: `/api/auth/*`, `/api/appointments`, `/api/consultations`, `/api/doctors`, `/api/specialties`, `/api/notifications`, `/api/stats`, `/api/ai-chat`. | `src/app/api/appointments/route.ts`, `src/app/api/consultations/route.ts` |
| **Native Fetch API** | Giao tiếp bất đồng bộ (`async/await`) giữa Client và Server mà không cần cài thêm thư viện ngoài như Axios, tối ưu dung lượng bundle. | `src/app/dashboard/page.tsx` |
| **CareBot — Trợ lý AI Phân luồng Y tế** | Hệ thống Chatbot thông minh xử lý ngôn ngữ tự nhiên tiếng Việt (khử dấu, so khớp từ khóa triệu chứng có trọng số - Weighted Rule-based NLP), phát hiện dấu hiệu cấp cứu khẩn cấp (Red Flags) và tự động truy vấn CSDL gợi ý đúng Chuyên khoa + Bác sĩ tiêu biểu. | `src/components/chat/AIChatBot.tsx`, `src/app/api/ai-chat/route.ts` |

### 5. Cơ Sở Dữ Liệu & Tầng ORM (Database & Persistence Layer)

| Công nghệ | Phiên bản | Vai trò & Ứng dụng thực tế trong dự án | File tiêu biểu |
| :--- | :--- | :--- | :--- |
| **[SQLite 3](https://www.sqlite.org/)** | Embedded DB | Hệ quản trị cơ sở dữ liệu quan hệ nhúng lưu trữ trực tiếp trong tệp nhị phân `prisma/dev.db`. Không cần cài đặt dịch vụ chạy nền, tốc độ đọc/ghi I/O cực nhanh và dễ dàng sao lưu/di chuyển toàn bộ dự án. Quản lý **8 bảng quan hệ**: `User`, `Specialty`, `DoctorInfo`, `DoctorSchedule`, `Appointment`, `MedicalRecord`, `Prescription`, `Notification`. | `prisma/schema.prisma` |
| **[Prisma ORM](https://www.prisma.io/) & Prisma Client** | `5.18.0` | Tầng ánh xạ đối tượng - quan hệ (Object-Relational Mapping). Tự động sinh bộ hàm truy vấn Type-safe, chống 100% lỗi bảo mật **SQL Injection** và áp dụng **Singleton Pattern** để tránh nghẽn kết nối khi Hot-Reload. | `src/database/prisma.ts`, `src/lib/prisma.ts` |
| **[tsx (TypeScript Execute)](https://github.com/privatenumber/tsx)** | `4.17.0` | Công cụ chạy trực tiếp script khởi tạo dữ liệu mẫu (`prisma/seed.ts`) bằng TypeScript để nạp sẵn 10 Chuyên khoa, 30 Bác sĩ, Lịch làm việc và Bệnh nhân mẫu. | `prisma/seed.ts` |
| **Prisma Studio & DB Browser for SQLite** | Công cụ GUI | Giao diện trực quan (Web GUI ở cổng `5555` với lệnh `npm run db:studio` và phần mềm Desktop) giúp xem, lọc, sửa dữ liệu và thực thi truy vấn SQL trực tiếp. | `KTHT.md` |

### 6. Xác Thực, Bảo Mật & Phân Quyền (Authentication, Security & RBAC)

| Công nghệ / Cơ chế | Phiên bản | Vai trò & Ứng dụng thực tế trong dự án | File tiêu biểu |
| :--- | :--- | :--- | :--- |
| **[Bcrypt.js (`bcryptjs`)](https://github.com/dcodeIO/bcrypt.js)** | `2.4.3` | Mã hóa mật khẩu người dùng một chiều kèm chuỗi ngẫu nhiên (**Salt hashing** với `saltRounds = 10`) trước khi lưu vào bảng `User` và đối chiếu khi đăng nhập. | `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts` |
| **HTTP Cookie Session (`next/headers`)** | Native Next.js | Quản lý phiên đăng nhập qua Cookie định danh `phongkham_session_user`, đọc và xác thực phiên trực tiếp ở phía Server. | `src/backend/auth/session.ts` |
| **Phân quyền RBAC (Role-Based Access Control)** | 3 Vai trò | Kiểm soát quyền truy cập nghiêm ngặt theo 3 vai trò: **`PATIENT`** (Đặt lịch, xem hồ sơ & đơn thuốc), **`DOCTOR`** (Xem ca trực, khám bệnh, kê đơn, báo bận), **`ADMIN`** (Thống kê tổng quan, điều phối/xếp bác sĩ, quản lý danh mục khoa & bác sĩ). | `src/backend/auth/session.ts` |

### 7. Sơ Đồ Phối Hợp Công Nghệ (Tech Stack Flow)

```mermaid
flowchart TD
    subgraph Client ["1. Tầng Giao Diện (Browser / Client)"]
        UI["React 18 + Next.js 14 App Router"]
        Style["Tailwind CSS + Lucide Icons + Recharts"]
        Form["React Hook Form + Zod Validation"]
    end

    subgraph Server ["2. Tầng Máy Chủ (Next.js Node.js Runtime)"]
        API["Next.js REST API Routes (/api/*)"]
        Auth["Cookie Session + Bcrypt.js + RBAC"]
        Bot["CareBot NLP Engine (/api/ai-chat)"]
    end

    subgraph Data ["3. Tầng Dữ Liệu (Persistence Layer)"]
        ORM["Prisma ORM v5.18 (Type-safe Singleton)"]
        DB[("SQLite 3 Database (prisma/dev.db)")]
    end

    UI --> Form
    UI --> Style
    Form -- "HTTP Fetch (JSON)" --> API
    UI -- "HTTP Fetch (JSON)" --> Bot
    API --> Auth
    API --> ORM
    Bot --> ORM
    ORM -- "I/O Truy vấn tham số hóa" --> DB
```

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
├── public/                # Static assets & Favicons
│   ├── favicon.ico        # Favicon chuẩn ICO cho trình duyệt
│   ├── favicon.svg        # Vector SVG favicon chất lượng cao
│   ├── icon.png           # Icon ứng dụng & Apple touch icon
│   └── images/            # Hình ảnh tĩnh minh họa
├── src/
│   ├── app/               # Next.js App Router (Pages & API Routes)
│   │   ├── admin/         # Phân hệ Quản trị viên
│   │   ├── api/           # Các Backend REST API Routes
│   │   ├── book/          # Luồng Đặt lịch khám
│   │   ├── dashboard/     # Trang cá nhân Bệnh nhân (Hồ sơ, Lịch hẹn, Đơn thuốc)
│   │   ├── doctor/        # Phân hệ Bác sĩ (Bàn làm việc, Khám bệnh, Kê đơn)
│   │   ├── login/         # Trang Đăng nhập
│   │   ├── register/      # Trang Đăng ký
│   │   ├── globals.css    # Stylesheet toàn cục (Tailwind CSS)
│   │   ├── layout.tsx     # Root Layout & Cấu hình Metadata Icons
│   │   └── page.tsx       # Trang chủ hệ thống
│   ├── components/        # UI Components dùng chung & Layout
│   │   ├── layout/        # Navbar, Footer, Sidebar, RoleSwitcherBanner
│   │   └── ui/            # Buttons, Cards, Inputs, Modals, Badges, Tabs
│   ├── lib/               # Utility functions, Auth, Prisma Client & Validations
│   │   ├── auth.ts        # Helper xử lý Session Cookie & Phân quyền
│   │   ├── prisma.ts      # Khởi tạo Singleton Prisma Client
│   │   ├── utils.ts       # Utility helper functions (Formatters, Badge/Status Helpers)
│   │   └── validations.ts # Zod Schemas
│   └── types/             # Định nghĩa TypeScript Types / Interfaces
├── next.config.mjs        # Cấu hình Next.js
├── tailwind.config.ts     # Cấu hình Tailwind CSS
└── package.json           # Quản lý dependencies & scripts
```

---

## 📌 Nhật Ký Nâng Cấp & Hoàn Thiện Tính Năng (Recent Updates)

### 1. Nhận Diện Thương Hiệu & Tích Hợp Bộ Favicon Chuẩn
* **Khắc phục lỗi `404 favicon.ico` trên DevTools:** Tạo và tích hợp bộ biểu tượng thương hiệu CarePlus+ đa định dạng:
  * `public/favicon.ico`: Định dạng chuẩn ICO (trình duyệt tự động nạp).
  * `public/favicon.svg`: Icon vector SVG độ nét cao với biểu tượng nhịp tim y tế & nền xanh ngọc gradient.
  * `public/icon.png`: Định dạng PNG tối ưu cho thiết bị di động và Apple Touch Icon.
* **Cập nhật App Metadata:** Đã cấu hình trường `icons` trong `src/app/layout.tsx` theo chuẩn Next.js App Router.

### 2. Chuẩn Hóa Vòng Đời Trạng Thái Lịch Hẹn (Smart Appointment Status)
* **Phân biệt luồng đặt lịch:**
  * **Tự chọn Bác sĩ (`SELF_SELECTED` / Có `doctorId`):** Lịch hẹn được thiết lập ngay trạng thái **`CONFIRMED`** (*Đã xác nhận & Chờ khám*), xuất hiện ngay trong hàng chờ khám của Bác sĩ.
  * **Tự động xếp Bác sĩ (`AUTO_ASSIGN` / Chưa có `doctorId`):** Thiết lập trạng thái **`PENDING`** (*Chờ sắp xếp bác sĩ*), chờ Admin / Lễ tân điều phối bác sĩ trong Admin Portal.
* **Bộ hàm hiển thị thông minh (`getStatusLabel` & `getStatusBadgeStyle`):** Tự động nhận diện dữ liệu lịch hẹn, hiển thị nhãn và màu sắc tương ứng chuẩn xác trên toàn bộ giao diện (Bệnh nhân, Bác sĩ, Admin).

### 3. Nâng Cấp Mục "Lịch Sử & Chẩn Đoán" và "Đơn Thuốc Điện Tử" của Bệnh Nhân
* **Khắc phục và bổ sung đầy đủ thông tin Bác sĩ khám:**
  * Cập nhật API `src/app/api/appointments/route.ts` nạp quan hệ lồng nhau `doctor` $\rightarrow$ `user` $\rightarrow$ `specialty` cho `medicalRecord`.
  * Hiển thị khối thông tin Bác sĩ phụ trách chuyên nghiệp: Avatar có viền xanh y tế, Học vị, Chuyên khoa và Họ tên bác sĩ.
* **Tối ưu hóa Typography & Font-size dễ đọc:**
  * Tiêu đề chẩn đoán y khoa nâng cấp lên cỡ **`text-lg sm:text-2xl font-extrabold`** kèm huy hiệu y khoa nổi bật.
  * Triệu chứng lâm sàng tăng lên **`text-sm sm:text-base`** trên nền bo góc thoáng đãng.
  * Lời khuyên & dặn dò của bác sĩ nổi bật trong thẻ thông báo y khoa màu hổ phách (`bg-amber-50`), font chữ to, đậm, rõ ràng.
  * Nút "Xem Chi Tiết Đơn Thuốc" nổi bật với gradient màu xanh ngọc, hiển thị rõ số lượng loại thuốc đã kê.
* **Đồng bộ hóa Modal In Đơn Thuốc PDF:** Cập nhật thông tin Bác sĩ kê đơn (Họ tên, Học vị, Chuyên khoa) và Bệnh nhân chuẩn xác khi in hoặc xuất file PDF.

### 4. Đảm Bảo Type Safety Toàn Diện
* Bổ sung đầy đủ quan hệ `doctor?: DoctorInfo | null`, `patient?` và `appointment?: Appointment | null` trong interface `MedicalRecord` ([src/types/index.ts](file:///d:/PhongKham2026/src/types/index.ts)).
* Kiểm tra toàn bộ mã nguồn với TypeScript Compiler (`tsc --noEmit`), đảm bảo **0 lỗi compile**.

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
