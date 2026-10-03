# ⚙️ THƯ MỤC XỬ LÝ BACKEND (BACKEND & BUSINESS LOGIC)

## 📌 Tổng Quan
Hệ thống xử lý nghiệp vụ phía máy chủ (Server-side) được tổ chức rõ ràng theo mô hình phân tầng:
1. **API Router / Controller**: Nằm tại `src/app/api/*` (tiếp nhận HTTP Request, parse parameters, trả về NextResponse).
2. **Business Services**: Nằm tại `src/backend/services/*` (xử lý logic nghiệp vụ, tính toán, kiểm tra quyền hạn).
3. **Data Access Layer**: Tương tác với CSDL thông qua `src/database/prisma.ts`.

## 📂 Cấu Trúc Thư Mục Backend
```text
src/
├── app/api/                     # Các API Route Handlers (Next.js App Router API)
│   ├── admin/stats/             # API thống kê tổng quan quản trị
│   ├── ai-chat/                 # API trợ lý ảo AI Chatbot y tế
│   ├── appointments/            # API quản lý và đặt lịch khám
│   ├── auth/                    # API đăng ký, đăng nhập, phân quyền, logout
│   ├── doctor/schedules/        # API lịch công tác bác sĩ
│   ├── doctors/                 # API danh sách và thông tin bác sĩ
│   ├── medical-records/         # API hồ sơ bệnh án điện tử
│   ├── notifications/           # API gửi thông báo nhắc lịch
│   └── specialties/             # API danh mục chuyên khoa khám
│
└── backend/                     # Tầng nghiệp vụ cốt lõi (Core Business Logic)
    ├── auth/                    # Xác thực session, phân quyền người dùng (RBAC)
    ├── services/                # Các dịch vụ xử lý logic độc lập
    │   ├── doctor.service.ts    # Nghiệp vụ quản lý bác sĩ, chuyên khoa
    │   ├── appointment.service.ts # Nghiệp vụ lịch khám, kiểm tra lịch trống
    │   └── admin.service.ts     # Nghiệp vụ thống kê doanh thu, báo cáo
    ├── validations/             # Kiểm tra tính hợp lệ dữ liệu đầu vào (Zod Schemas)
    ├── index.ts                 # Điểm xuất khẩu tập trung của Backend
    └── README.md                # Tài liệu hướng dẫn tầng Backend
```
