# 🗺️ BẢN ĐỒ CẤU TRÚC DỰ ÁN PHÒNG KHÁM CAREPLUS 2026
> Hệ thống được xây dựng theo kiến trúc **Full-stack Monolith tiêu chuẩn Next.js 14**, phân định rõ ràng 3 phân hệ: **Frontend**, **Backend** và **Database**.

---

## 🏗️ TỔNG QUAN 3 PHÂN HỆ CHÍNH

| Phân hệ | Thư mục phụ trách | Chức năng & Vai trò |
| :--- | :--- | :--- |
| 🖥️ **FRONTEND** | `src/frontend/`<br>`src/app/(pages)`<br>`src/components/`<br>`public/` | Giao diện người dùng, trang quản trị, trang bác sĩ, đặt lịch khám, giao diện AI Chatbot, Responsive Tailwind CSS |
| ⚙️ **BACKEND** | `src/backend/`<br>`src/app/api/`<br>`src/lib/` | Hệ thống RESTful API endpoints, xác thực phiên đăng nhập (Auth Session), logic nghiệp vụ (Services), kiểm tra dữ liệu (Zod Validations) |
| 🗄️ **DATABASE** | `src/database/`<br>`prisma/` | Kết nối Prisma ORM Client (Singleton), lược đồ thực thể quan hệ `schema.prisma`, file CSDL SQLite `dev.db`, dữ liệu mẫu `seed.ts` |

---

## 🌳 SƠ ĐỒ CÂY THƯ MỤC CHI TIẾT (DIRECTORY TREE)

```text
PhongKham2026/
│
├── 📂 prisma/                              <--- [DATABASE] Lược đồ & Dữ liệu CSDL
│   ├── schema.prisma                      # Khai báo cấu trúc các bảng (User, Doctor, Specialty, Appointment,...)
│   ├── dev.db                             # File cơ sở dữ liệu SQLite thực tế
│   ├── seed.ts                            # Kịch bản nạp dữ liệu mẫu ban đầu
│   └── add_data.ts                        # Kịch bản bổ sung dữ liệu thử nghiệm
│
├── 📂 public/                              <--- [FRONTEND] Tài nguyên tĩnh
│   └── (Ảnh bác sĩ, logo, icon, banner y tế)
│
├── 📂 src/                                 <--- MÃ NGUỒN CỐT LÕI (SOURCE CODE)
│   │
│   ├── 📂 frontend/                        <--- [FRONTEND] Quản lý tập trung phân hệ Frontend
│   │   ├── components/                    # Xuất khẩu các UI components dùng chung
│   │   ├── index.ts                       # Entrypoint phân hệ Frontend
│   │   └── README.md                      # Tài liệu chi tiết tầng Frontend
│   │
│   ├── 📂 backend/                         <--- [BACKEND] Quản lý tập trung phân hệ Backend
│   │   ├── auth/                          # Quản lý xác thực Session & Phân quyền RBAC
│   │   │   ├── session.ts                 # Hàm getCurrentUser, checkAuthorization
│   │   │   └── index.ts
│   │   ├── services/                      # Tầng nghiệp vụ xử lý logic độc lập
│   │   │   ├── doctor.service.ts          # Nghiệp vụ quản lý Bác sĩ & Chuyên khoa
│   │   │   ├── appointment.service.ts     # Nghiệp vụ Lịch hẹn & Trạng thái khám
│   │   │   ├── admin.service.ts           # Nghiệp vụ Thống kê số liệu Dashboard
│   │   │   └── index.ts
│   │   ├── validations/                   # Kiểm tra tính hợp lệ dữ liệu (Zod)
│   │   ├── index.ts                       # Entrypoint phân hệ Backend
│   │   └── README.md                      # Tài liệu chi tiết tầng Backend
│   │
│   ├── 📂 database/                        <--- [DATABASE] Quản lý tập trung tầng CSDL
│   │   ├── prisma.ts                      # Khởi tạo PrismaClient Singleton
│   │   ├── index.ts                       # Entrypoint xuất khẩu kết nối CSDL
│   │   └── README.md                      # Tài liệu chi tiết tầng Database
│   │
│   ├── 📂 components/                      <--- [FRONTEND] Thư viện UI Components
│   │   ├── layout/                        # Navbar, Footer
│   │   ├── chat/                          # Widget AI Chatbot tư vấn y tế CarePlus
│   │   └── ui/                            # Nút bấm, Ô nhập, Thẻ Card, Modal, Hộp thoại
│   │
│   ├── 📂 app/                             <--- [NEXT.JS ROUTER] Tích hợp Giao diện & APIs
│   │   │
│   │   │  --- 🌐 CÁC TRANG GIAO DIỆN (FRONTEND PAGES) ---
│   │   ├── page.tsx                       # Trang chủ phòng khám (Landing page)
│   │   ├── layout.tsx                     # Khung sườn tổng thể toàn ứng dụng
│   │   ├── globals.css                    # Cấu hình phong cách CSS, biến màu chủ đạo
│   │   ├── book/page.tsx                  # Giao diện Đặt lịch khám bệnh trực tuyến
│   │   ├── dashboard/page.tsx             # Giao diện Bệnh nhân (Hồ sơ, Lịch khám)
│   │   ├── doctor/page.tsx                # Giao diện Bàn khám bệnh của Bác sĩ
│   │   ├── admin/page.tsx                 # Giao diện Bảng điều khiển Quản trị viên
│   │   ├── login/page.tsx                 # Giao diện Đăng nhập
│   │   ├── register/page.tsx              # Giao diện Đăng ký tài khoản
│   │   │
│   │   │  --- 🔌 CÁC ĐẦU MÚT DỊCH VỤ (BACKEND REST APIs) ---
│   │   └── api/
│   │       ├── admin/stats/route.ts       # API: Thống kê số liệu báo cáo
│   │       ├── ai-chat/route.ts           # API: Trả lời AI Chatbot thông minh
│   │       ├── appointments/route.ts      # API: Quản lý lịch hẹn
│   │       ├── auth/                      # API: Đăng nhập, đăng ký, phiên làm việc
│   │       ├── doctor/                    # API: Bác sĩ xử lý khám và ca trực
│   │       ├── doctors/route.ts           # API: Danh sách bác sĩ
│   │       ├── medical-records/route.ts   # API: Hồ sơ bệnh án điện tử
│   │       ├── notifications/route.ts     # API: Thông báo người dùng
│   │       └── specialties/route.ts       # API: Danh mục các chuyên khoa
│   │
│   ├── 📂 lib/                             <--- TIỆN ÍCH DÙNG CHUNG (SHARED UTILITIES)
│   │   ├── prisma.ts                      # Cầu nối tương thích kết nối CSDL
│   │   ├── auth.ts                        # Cầu nối tương thích xác thực người dùng
│   │   ├── utils.ts                       # Hàm định dạng tiền tệ, ngày tháng, CSS class
│   │   └── validations.ts                 # Bộ quy chuẩn xác thực form Zod
│   │
│   └── 📂 types/                           <--- KIỂU DỮ LIỆU TYPESCRIPT
│       └── index.ts                       # Định nghĩa kiểu dữ liệu User, Appointment,...
│
├── 📂 TÀI LIỆU BÁO CÁO CHI TIẾT (DOCUMENTATION)
│   ├── PROJECT_STRUCTURE.md               # [Tệp này] Hướng dẫn cấu trúc phân hệ
│   ├── README.md                          # Giới thiệu & hướng dẫn cài đặt dự án
│   ├── FE.md                              # Tài liệu phân tích toàn diện Frontend UI/UX
│   ├── BE.md                              # Tài liệu phân tích toàn diện Backend & APIs
│   ├── CSDL.md                            # Tài liệu phân tích toàn diện Cơ sở dữ liệu
│   ├── Admin.md                           # Hướng dẫn chi tiết phân hệ Quản trị viên
│   ├── Doctor.md                          # Hướng dẫn chi tiết phân hệ Bác sĩ
│   ├── Patient.md                         # Hướng dẫn chi tiết phân hệ Bệnh nhân
│   └── AIChatBot.md                       # Hướng dẫn chi tiết phân hệ Trợ lý ảo AI
│
├── package.json                           # Khai báo thư viện & các lệnh chạy dự án
├── tsconfig.json                          # Cấu hình TypeScript & đường dẫn Alias (@/*)
└── tailwind.config.ts                     # Cấu hình giao diện Tailwind CSS
```

---

## 🚀 CÁCH VẬN HÀNH DỰ ÁN
1. **Khởi chạy môi trường phát triển**:
   ```bash
   npm run dev
   ```
2. **Kiểm tra cơ sở dữ liệu**:
   ```bash
   npm run db:studio
   ```
3. **Đóng gói sản phẩm (Production build)**:
   ```bash
   npm run build
   ```
