# 🗄️ THƯ MỤC CƠ SỞ DỮ LIỆU (DATABASE LAYER)

## 📌 Tổng Quan
Thư mục này và thư mục `prisma/` chịu trách nhiệm toàn bộ về tầng dữ liệu (Data Access Layer) của hệ thống phòng khám CarePlus 2026.

## 📂 Cấu Trúc Các Tệp Liên Quan Đến Cơ Sở Dữ Liệu
```text
├── prisma/
│   ├── schema.prisma      # Lược đồ mô hình dữ liệu chính (User, DoctorInfo, Specialty, Appointment, MedicalRecord,...)
│   ├── dev.db             # Tệp cơ sở dữ liệu SQLite chứa toàn bộ dữ liệu thực tế của phòng khám
│   ├── seed.ts            # Dữ liệu khởi tạo mẫu (bác sĩ, chuyên khoa, lịch hẹn, bệnh nhân, tài khoản test)
│   └── add_data.ts        # Kịch bản bổ sung dữ liệu thử nghiệm
└── src/database/
    ├── prisma.ts          # Khởi tạo kết nối PrismaClient (Singleton Pattern) tối ưu hiệu năng
    ├── index.ts           # Điểm xuất khẩu (export) tập trung các hàm/thực thể database
    └── README.md          # Tài liệu mô tả tầng CSDL
```

## 🛠️ Các Lệnh Thao Tác Với Database
- **Đẩy cấu trúc schema vào CSDL**: `npm run db:push`
- **Nạp dữ liệu mẫu vào CSDL**: `npm run db:seed`
- **Mở giao diện quản trị Prisma Studio**: `npm run db:studio`
