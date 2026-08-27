# TÀI LIỆU PHÂN TÍCH TOÀN DIỆN CƠ SỞ DỮ LIỆU (DATABASE SYSTEM ARCHITECTURE)
## DỰ ÁN PHÒNG KHÁM ĐA KHOA CAREPLUS+ (CAREPLUS CLINIC 2026)

---

## MỤC LỤC
1. [Tổng Quan Kiến Trúc Cơ Sở Dữ Liệu Dự Án](#1-tổng-quan-kiến-trúc-cơ-sở-dữ-liệu-dự-án)
2. [Cơ Chế & Các Phương Thức Kết Nối Cơ Sở Dữ Liệu](#2-cơ-chế--các-phương-thức-kết-nối-cơ-sở-dữ-liệu)
   - [2.1. Mô Hình Kết Nối Client Singleton Trong Next.js](#21-mô-hình-kết-nối-client-singleton-trong-nextjs)
   - [2.2. Cơ Chế Kết Nối File-based SQLite](#22-cơ-chế-kết-nối-file-based-sqlite)
   - [2.3. Cơ Chế Connection Pooling Cho Môi Trường Production & Serverless](#23-cơ-chế-connection-pooling-cho-môi-trường-production--serverless)
   - [2.4. Quy Trình Đồng Bộ & Migration Dữ Liệu (Schema Lifecycle)](#24-quy-trình-đồng-bộ--migration-dữ-liệu-schema-lifecycle)
3. [Thiết Kế Cơ Sở Dữ Liệu Dự Án (Database Design & ERD)](#3-thiết-kế-cơ-sở-dữ-liệu-dự-án-database-design--erd)
   - [3.1. Sơ Đồ Thực Thể - Mối Quan Hệ (Entity Relationship Diagram - ERD)](#31-sơ-đồ-thực-thể---mối-quan-hệ-erd)
   - [3.2. Từ Điển Dữ Liệu Chi Tiết (Data Dictionary - 8 Models Cốt Lõi)](#32-từ-điển-dữ-liệu-chi-tiết-data-dictionary)
   - [3.3. Phân Tích Ràng Buộc Khóa Ngoại & Hành Vi Xóa (Cascading & Referential Integrity)](#33-phân-tích-ràng-buộc-khóa-ngoại--hành-vi-xóa)
   - [3.4. Vòng Đời Trạng Thái Lịch Hẹn & Tính Toàn Vẹn ACID](#34-vòng-đời-trạng-thái-lịch-hẹn--tính-toàn-vẹn-acid)
4. [Các Công Cụ Quản Lý Cơ Sở Dữ Liệu Hiện Nay & Mức Độ Sử Dụng](#4-các-công-cụ-quản-lý-cơ-sở-dữ-liệu-hiện-nay--mức-độ-sử-dụng)
   - [4.1. Prisma Studio (Công Cụ Quản Trị Trực Tiếp Trong Dự Án)](#41-prisma-studio-công-cụ-quản-trị-csdl-trực-tiếp-trong-dự-án)
     - [4.1.1. Bản Chất Kiến Trúc & Vận Hành Web GUI](#411-bản-chất-kiến-trúc--cách-thức-vận-hành-của-prisma-studio)
     - [4.1.2. Ứng Dụng Thực Tế Trong Dự Án Phòng Khám 2026](#412-các-tính-năng-cốt-lõi-được-ứng-dụng-thực-tế-trong-dự-án-phòng-khám-2026)
     - [4.1.3. Đánh Giá & Lời Khuyên Cho Đồ Án Sinh Viên](#413-đánh-giá-chuyên-sâu-có-nên-sử-dụng-prisma-studio-trong-đồ-án-của-sinh-viên)
   - [4.2. DBeaver Community (Tiêu chuẩn công nghiệp đa CSDL)](#42-dbeaver-community)
   - [4.3. DataGrip - JetBrains (Công cụ chuyên nghiệp doanh nghiệp)](#43-datagrip-jetbrains)
   - [4.4. TablePlus (Giao diện Native hiệu năng cao)](#44-tableplus)
   - [4.5. DB Browser for SQLite (Công cụ chuyên dụng cho file SQLite)](#45-db-browser-for-sqlite)
   - [4.6. pgAdmin 4 (Chuyên dụng cho PostgreSQL)](#46-pgadmin-4)
   - [4.7. Supabase Studio / Cloud Consoles](#47-supabase-studio--cloud-consoles)
   - [4.8. Bảng Ma Trận So Sánh Các Công Cụ & Mức Độ Khuyên Dùng](#48-bảng-ma-trận-so-sánh-các-công-cụ--mức-độ-khuyên-dùng)
5. [Chiến Lược Mở Rộng & Chuyển Đổi CSDL Lên Production (Scale-Up Roadmap)](#5-chiến-lược-mở-rộng--chuyển-đổi-csdl-lên-production)
6. [Các Check-List An Toàn & Bảo Mật Dữ Liệu Y Tế (HIPAA/Security Best Practices)](#6-các-check-list-an-toàn--bảo-mật-dữ-liệu-y-tế)

---

## 1. TỔNG QUAN KIẾN TRÚC CƠ SỞ DỮ LIỆU DỰ ÁN

Hệ thống cơ sở dữ liệu của **Phòng khám CarePlus+ 2026** được xây dựng nhằm đáp ứng các yêu cầu khắt khe trong môi trường y tế:
- **Tính toàn vẹn dữ liệu (Data Integrity):** Tuyệt đối không để xảy ra tình trạng trùng lịch khám (Double Booking), mất lịch hẹn khi bác sĩ thôi công tác, hoặc sai lệch đơn thuốc.
- **Tính an toàn & Bảo mật (Security & Privacy):** Mật khẩu người dùng được băm một chiều với thuật toán `Bcrypt` (Salt rounds = 10), phân tách rõ ràng quyền hạn giữa Bệnh nhân (`PATIENT`), Bác sĩ (`DOCTOR`) và Quản trị viên / Lễ tân (`ADMIN`).
- **Khả năng phản hồi thời gian thực (Low Latency):** Thời gian truy vấn dữ liệu tính bằng mili-giây, phục vụ điều phối lịch khám và thống kê báo cáo tức thì.

### Ngăn xếp Công nghệ CSDL (Database Technology Stack):
- **Hệ quản trị CSDL phát triển:** **SQLite 3** (Lưu trữ cục bộ tại file [`prisma/dev.db`](file:///d:/PhongKham2026/prisma/dev.db)).
- **Công cụ ORM (Object-Relational Mapping):** **Prisma ORM v5.18.0** (`@prisma/client` & `prisma CLI`).
- **Ngôn ngữ định nghĩa Schema:** Prisma Schema Language (DSL) tại file [`prisma/schema.prisma`](file:///d:/PhongKham2026/prisma/schema.prisma).
- **Môi trường thực thi:** Node.js v20+ / TypeScript 5.0+ trong cấu trúc Next.js 14 App Router.

---

## 2. CƠ CHẾ & CÁC PHƯƠNG THỨC KẾT NỐI CƠ SỞ DỮ LIỆU

### 2.1. Mô Hình Kết Nối Client Singleton Trong Next.js

Trong môi trường phát triển Next.js với tính năng **Hot Module Replacement (HMR)**, mỗi lần mã nguồn được lưu, máy chủ Node.js sẽ biên dịch lại các module. Nếu khởi tạo `new PrismaClient()` thông thường trong từng file API Route, hàng chục kết nối CSDL mới sẽ liên tục được mở ra, dẫn đến hiện tượng **Connection Exhaustion (Cạn kiệt kết nối)** hoặc **Database File Lock**.

Để giải quyết triệt để vấn đề này, dự án áp dụng **Design Pattern: Singleton** gắn vào đối tượng toàn cục `globalThis` tại file [`src/lib/prisma.ts`](file:///d:/PhongKham2026/src/lib/prisma.ts):

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Tái sử dụng PrismaClient hiện có nếu đã khởi tạo, tránh tạo mới khi HMR reload
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

#### Ưu điểm của mô hình Singleton:
- Đảm bảo **duy nhất 1 instance** của `PrismaClient` tồn tại xuyên suốt vòng đời của Node.js process.
- Quản lý vòng đời kết nối tập trung, tự động kết nối khi có truy vấn đầu tiên (Lazy Connection).
- Giải phóng kết nối an toàn khi ứng dụng dừng (`prisma.$disconnect()`).

---

### 2.2. Cơ Chế Kết Nối File-based SQLite

Dự án hiện cấu hình kết nối trực tiếp đến file cơ sở dữ liệu cục bộ:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### Đặc tính hoạt động của kết nối SQLite:
1. **Không cần tiến trình máy chủ độc lập (Serverless Native):** 
   SQLite chạy trực tiếp nhúng bên trong tiến trình của ứng dụng Next.js. Không có độ trễ mạng (Network Overhead) hay chi phí bắt tay TCP/IP, mang lại tốc độ đọc ghi cực nhanh (< 1ms).
2. **Cơ chế khóa tập tin (File Locking Mechanism):**
   - Hỗ trợ **nhiều tiến trình đọc đồng thời (Concurrent Reads)**.
   - Khi có tiến trình thực hiện ghi (Write/Update/Delete), SQLite khóa file tạm thời để đảm bảo tính toàn vẹn ACID.
3. **Cơ chế ghi nhật ký WAL (Write-Ahead Logging):**
   Các thay đổi được ghi tuần tự vào file `-wal` trước khi ghi cố định vào file `.db`, giúp tăng tốc độ ghi và giảm thiểu xung đột khóa.

---

### 2.3. Cơ Chế Connection Pooling Cho Môi Trường Production & Serverless

Khi triển khai hệ thống lên môi trường Production (sử dụng PostgreSQL, MySQL trên Cloud như Supabase, Neon, AWS RDS) với mô hình **Serverless Functions** (Vercel, AWS Lambda):

```
                                              +-----------------------+
                                              |   Prisma Accelerate   |
                                              |       (Edge Pool)     |
                                              +-----------+-----------+
                                                          |
+---------------------+     +-----------------+           v           +---------------------+
| Next.js App Router  | --> | Prisma Client   | --------------------> | PostgreSQL Database |
| (Serverless API)    |     | (Singleton)     |           ^           | (AWS RDS / Supabase)|
+---------------------+     +-----------------+           |           +---------------------+
                                                          |
                                              +-----------+-----------+
                                              |       PgBouncer       |
                                              |  (Connection Pooler)  |
                                              +-----------------------+
```

1. **Vấn đề của Serverless Functions:** 
   Mỗi request người dùng có thể kích hoạt một instance Serverless mới. Nếu có 1.000 người truy cập đồng thời, 1.000 kết nối trực tiếp sẽ được gửi tới CSDL, vượt quá giới hạn `max_connections` của RDBMS.
2. **Giải pháp Connection Pooler:**
   - **PgBouncer:** Đóng vai trò làm trung gian trung chuyển (Proxy), duy trì sẵn một nhóm 20–50 kết nối cố định tới CSDL và phân phối nhanh cho hàng nghìn request Serverless.
   - **Prisma Accelerate:** Dịch vụ Connection Pooling toàn cầu kèm bộ nhớ đệm toàn cầu (Global Edge Cache) của Prisma.
   - Cấu hình chuỗi kết nối trong môi trường Production:
     ```env
     # Kết nối qua PgBouncer (Transaction Mode)
     DATABASE_URL="postgresql://user:password@aws.rds.com:6543/phongkham_db?pgbouncer=true&connection_limit=20"
     # Kết nối trực tiếp để chạy Migration (Session Mode)
     DIRECT_URL="postgresql://user:password@aws.rds.com:5432/phongkham_db"
     ```

---

### 2.4. Quy Trình Đồng Bộ & Migration Dữ Liệu (Schema Lifecycle)

Hệ thống quản lý vòng đời cấu trúc dữ liệu thông qua bộ công cụ **Prisma CLI**:

| Lệnh Thực Thi | Mục Đích & Cơ Chế Hoạt Động | Giai Đoạn Áp Dụng |
| :--- | :--- | :--- |
| `npx prisma db push` | Đọc `schema.prisma` và đẩy trực tiếp các thay đổi vào CSDL mà không tạo file migration trung gian. Tự động cập nhật bảng. | **Phát triển ban đầu (Prototyping & Dev)** |
| `npx prisma migrate dev --name <ten_migration>` | So sánh schema hiện tại, sinh ra file SQL Migration có đánh số thứ tự trong thư mục `prisma/migrations/`, áp dụng vào DB và cập nhật bảng `_prisma_migrations`. | **Môi trường Teamwork & Staging** |
| `npx prisma migrate deploy` | Áp dụng toàn bộ các file SQL migration chưa chạy lên CSDL Production (không chỉnh sửa cấu trúc ngầm). | **Môi trường Production CI/CD** |
| `npx prisma generate` | Quét cấu trúc `schema.prisma` và biên dịch sinh ra bộ thư viện TypeScript Types an toàn tuyệt đối bên trong `node_modules/@prisma/client`. | **Mỗi khi thay đổi schema** |
| `npx prisma db seed` | Chạy file kịch bản [`prisma/seed.ts`](file:///d:/PhongKham2026/prisma/seed.ts) để nạp tài khoản mẫu, danh mục 11 chuyên khoa, 32 bác sĩ và lịch hẹn mẫu. | **Khởi tạo dữ liệu ban đầu** |
| `npx prisma studio` | Khởi chạy máy chủ GUI Web cục bộ (mặc định cổng `5555`) để quản trị, duyệt và chỉnh sửa dữ liệu CSDL trực quan. | **Quản trị & Kiểm thử nhanh** |

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU DỰ ÁN (DATABASE DESIGN & ERD)

### 3.1. Sơ Đồ Thực Thể - Mối Quan Hệ (ERD)

```
 +---------------------------------------------------------------------------------------------------------+
 |                                  CAREPLUS CLINIC - ERD DIAGRAM                                          |
 +---------------------------------------------------------------------------------------------------------+

       +-------------------------+                     +---------------------------+
       |          User           |                     |         Specialty         |
       +-------------------------+                     +---------------------------+
       | PK  id (UUID)           |                     | PK  id (UUID)             |
       |     fullName (String)   |                     |     name (String)         |
       | UQ  email (String)      |                     |     description (String)  |
       |     phone (String)      |                     |     iconUrl (String?)     |
       |     passwordHash (Str)  |                     +-------------+-------------+
       |     role (ADMIN|DOC|PAT)|                                   |
       |     avatarUrl (String?) |                                   | 1:N
       |     createdAt (DateTime)|                                   |
       +------------+------------+                                   |
                    |                                                |
          +---------+---------+                                      |
      1:1 |                   | 1:N                                  |
          v                   v                                      v
 +-----------------+   +---------------------------------------------------+
 |   DoctorInfo    |   |                    Appointment                    |
 +-----------------+   +---------------------------------------------------+
 | PK  id (UUID)   |   | PK  id (UUID)                                     |
 | UQ  userId      |   | FK  patientId (User.id)                   [Cascade]|
 | FK  specialtyId |<--| FK  doctorId (DoctorInfo.id, Nullable)    [SetNull]|
 |     degree      |   | FK  specialtyId (Specialty.id)            [Cascade]|
 |     expYears    |   |     appointmentDate (String YYYY-MM-DD)           |
 |     bio         |   |     appointmentTime (String HH:mm)                |
 |     fee (Float) |   |     status (PENDING|CONFIRMED|COMPLETED...)       |
 +--------+--------+   |     bookingType (SELF_SELECTED|AUTO_ASSIGN)       |
          |            |     patientNotes (String?)                        |
      1:N |            |     createdAt (DateTime)                          |
          v            +-------------------------+-------------------------+
 +----------------------+                        |
 |    DoctorSchedule    |                        | 1:1
 +----------------------+                        v
 | PK  id (UUID)        |              +-------------------+
 | FK  doctorId [Casc]  |              |   MedicalRecord   |
 |     dayOfWeek (0-6)  |              +-------------------+
 |     startTime (08:00)|              | PK  id (UUID)     |
 |     endTime (17:00)  |              | UQ  appointmentId |
 |     slotDuration (30)|              | FK  patientId     |
 +----------------------+              | FK  doctorId      |
                                       |     symptoms      |
                                       |     diagnosis     |
                                       |     notes         |
                                       |     createdAt     |
                                       +---------+---------+
                                                 |
                                             1:N |
                                                 v
                                       +-------------------+
                                       |   Prescription    |
                                       +-------------------+
                                       | PK  id (UUID)     |
                                       | FK  medicalRecId  |
                                       |     medicineName  |
                                       |     dosage        |
                                       |     frequency     |
                                       |     duration      |
                                       |     notes         |
                                       +-------------------+

       +---------------------------------------------------+
       |                   Notification                    |
       +---------------------------------------------------+
       | PK  id (UUID)                                     |
       | FK  userId (User.id)                              |
       | FK  appointmentId (Appointment.id, Nullable)      |
       |     message (String)                              |
       |     type (URGENT_DOCTOR_BUSY|NEW_BOOKING|GENERAL) |
       |     isRead (Boolean, default: false)              |
       |     createdAt (DateTime)                          |
       +---------------------------------------------------+
```

---

### 3.2. Từ Điển Dữ Liệu Chi Tiết (Data Dictionary)

#### 1. Bảng `User` (Quản Lý Tài Khoản & Người Dùng)
Bảng trung tâm quản lý danh tính, phân quyền kiểm soát truy cập (RBAC) và xác thực người dùng.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Định danh duy nhất toàn cầu cho người dùng. |
| `fullName` | `String` | `NOT NULL` | Họ và tên đầy đủ (VD: *"BS CKII. Nguyễn Văn A"*). |
| `email` | `String` | `NOT NULL`, **UNIQUE** | Địa chỉ email dùng để đăng nhập hệ thống. |
| `phone` | `String` | `NOT NULL` | Số điện thoại liên lạc của người dùng. |
| `passwordHash` | `String` | `NOT NULL` | Mật khẩu đã được băm an toàn bằng `Bcrypt`. |
| `role` | `String` | `NOT NULL`, default: `"PATIENT"` | Vai trò: `"ADMIN"` (Quản lý/Lễ tân), `"DOCTOR"` (Bác sĩ), `"PATIENT"` (Bệnh nhân). |
| `avatarUrl` | `String?` | `NULLABLE` | Đường dẫn ảnh đại diện chất lượng cao (Unsplash hoặc Cloudinary). |
| `createdAt` | `DateTime` | default: `now()` | Thời điểm khởi tạo tài khoản. |

---

#### 2. Bảng `Specialty` (Danh Mục Chuyên Khoa Khám Bệnh)
Danh mục các khoa phòng điều trị chuyên sâu của phòng khám.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Định danh duy nhất của chuyên khoa. |
| `name` | `String` | `NOT NULL` | Tên chuyên khoa (VD: *"Khoa Tim Mạch"*, *"Khoa Nhi"*). |
| `description` | `String` | `NOT NULL` | Mô tả các bệnh lý, triệu chứng và kỹ thuật tiếp nhận. |
| `iconUrl` | `String?` | `NULLABLE` | Tên icon Lucide đại diện (VD: `HeartPulse`, `Baby`, `Sparkles`...). |

---

#### 3. Bảng `DoctorInfo` (Hồ Sơ Chuyên Môn Bác Sĩ)
Lưu trữ thông số hành nghề y khoa, học vị, thâm niên và giá khám của bác sĩ. Liên kết quan hệ $1:1$ với `User`.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Định danh hồ sơ chuyên môn của bác sĩ. |
| `userId` | `String` | `NOT NULL`, **UNIQUE**, **FK ➔ User.id** | Khóa ngoại liên kết tài khoản `User` (`onDelete: Cascade`). |
| `specialtyId` | `String` | `NOT NULL`, **FK ➔ Specialty.id** | Khóa ngoại liên kết `Specialty` (`onDelete: Cascade`). |
| `degree` | `String` | `NOT NULL` | Học vị/Bằng cấp (VD: *"Tiến sĩ Bác sĩ"*, *"BS CKI"*). |
| `experienceYears`| `Int` | `NOT NULL`, min: 0 | Thâm niên kinh nghiệm công tác (tính theo năm). |
| `bio` | `String` | `NOT NULL` | Tóm tắt tiểu sử và thành tựu điều trị lâm sàng. |
| `consultationFee`| `Float` | `NOT NULL` | Phí khám tư vấn tiêu chuẩn ($/VND). |

---

#### 4. Bảng `DoctorSchedule` (Khung Lịch Làm Việc Tuần Của Bác Sĩ)
Cấu hình ma trận lịch làm việc định kỳ từ Thứ 2 đến Chủ Nhật cho từng bác sĩ.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Định danh bản ghi ca làm việc. |
| `doctorId` | `String` | `NOT NULL`, **FK ➔ DoctorInfo.id** | Bác sĩ trực thuộc (`onDelete: Cascade`). |
| `dayOfWeek` | `Int` | `NOT NULL`, giá trị từ `0` đến `6` | Ngày trong tuần: `0` (Chủ Nhật), `1` (Thứ 2) ➔ `6` (Thứ 7). |
| `startTime` | `String` | `NOT NULL`, default: `"08:00"` | Giờ bắt đầu nhận ca khám. |
| `endTime` | `String` | `NOT NULL`, default: `"17:00"` | Giờ kết thúc ca trực. |
| `slotDurationMinutes` | `Int` | `NOT NULL`, default: `30` | Thời lượng tiêu chuẩn cho 1 lượt khám (30 phút). |

---

#### 5. Bảng `Appointment` (Trung Tâm Vận Hành & Điều Phối Lịch Hẹn)
Bảng cốt lõi ghi nhận toàn bộ các ca đăng ký khám của bệnh nhân, trạng thái điều phối và lịch sử phục vụ.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Mã định danh ca hẹn khám. |
| `patientId` | `String` | `NOT NULL`, **FK ➔ User.id** | Người đặt lịch (`onDelete: Cascade`). |
| `doctorId` | `String?` | **NULLABLE**, **FK ➔ DoctorInfo.id** | Bác sĩ phụ trách (`onDelete: SetNull` - bảo vệ lịch). |
| `specialtyId` | `String` | `NOT NULL`, **FK ➔ Specialty.id** | Chuyên khoa bệnh nhân đăng ký khám. |
| `appointmentDate`| `String` | `NOT NULL`, định dạng `"YYYY-MM-DD"` | Ngày khám bệnh theo lịch Việt Nam (VD: `"2026-08-28"`). |
| `appointmentTime`| `String` | `NOT NULL`, định dạng `"HH:mm"` | Khung giờ khám (VD: `"09:00"`, `"14:30"`). |
| `status` | `String` | `NOT NULL`, default: `"PENDING"` | Trạng thái: `PENDING`, `CONFIRMED`, `COMPLETED`, `NEEDS_REASSIGNMENT`, `CANCELLED`. |
| `bookingType` | `String` | `NOT NULL`, default: `"SELF_SELECTED"` | Hình thức đặt: `"SELF_SELECTED"` (Tự chọn BS), `"AUTO_ASSIGN"` (Hệ thống tự phân phối). |
| `patientNotes` | `String?` | `NULLABLE` | Mô tả triệu chứng ban đầu do bệnh nhân tự khai. |
| `createdAt` | `DateTime` | default: `now()` | Thời điểm bệnh nhân thực hiện gửi yêu cầu đặt khám. |

---

#### 6. Bảng `MedicalRecord` (Hồ Sơ Bệnh Án Lâm Sàng)
Ghi nhận kết quả khám bệnh trực tiếp của bác sĩ, chẩn đoán xác định và lời dặn y khoa. Liên kết $1:1$ với `Appointment`.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Mã hồ sơ bệnh án. |
| `appointmentId` | `String` | `NOT NULL`, **UNIQUE**, **FK ➔ Appointment.id** | Ca khám tương ứng (`onDelete: Cascade`). |
| `patientId` | `String` | `NOT NULL`, **FK ➔ User.id** | Bệnh nhân được khám (`onDelete: Cascade`). |
| `doctorId` | `String` | `NOT NULL`, **FK ➔ DoctorInfo.id** | Bác sĩ thực hiện chẩn đoán (`onDelete: Cascade`). |
| `symptoms` | `String` | `NOT NULL` | Triệu chứng lâm sàng ghi nhận qua thăm khám. |
| `diagnosis` | `String` | `NOT NULL` | Chẩn đoán xác định bệnh lý (kèm mã ICD nếu có). |
| `notes` | `String?` | `NULLABLE` | Lời dặn dò dinh dưỡng, chế độ sinh hoạt và hẹn tái khám. |
| `createdAt` | `DateTime` | default: `now()` | Thời điểm hoàn tất khám bệnh và lưu bệnh án. |

---

#### 7. Bảng `Prescription` (Đơn Thuốc Điện Tử)
Chi tiết từng loại thuốc được kê trong hồ sơ bệnh án. Quan hệ $1:N$ với `MedicalRecord`.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Mã dòng thuốc trong đơn. |
| `medicalRecordId`| `String` | `NOT NULL`, **FK ➔ MedicalRecord.id** | Bệnh án chứa đơn thuốc (`onDelete: Cascade`). |
| `medicineName` | `String` | `NOT NULL` | Tên biệt dược / hoạt chất (VD: *"Amlodipine 5mg"*). |
| `dosage` | `String` | `NOT NULL` | Liều lượng mỗi lần dùng (VD: *"1 viên"*). |
| `frequency` | `String` | `NOT NULL` | Tần suất sử dụng (VD: *"Uống 2 lần/ngày sau ăn sáng - tối"*). |
| `duration` | `String` | `NOT NULL` | Thời gian điều trị (VD: *"30 ngày"*, *"7 ngày"*). |
| `notes` | `String?` | `NULLABLE` | Chú ý đặc biệt (VD: *"Kiêng uống rượu bia trong thời gian dùng thuốc"*). |

---

#### 8. Bảng `Notification` (Trung Tâm Thông Báo & Cảnh Báo Điều Phối)
Phát tín hiệu điều phối và cảnh báo khẩn cấp giữa Bác sĩ, Bệnh nhân và Ban Quản trị phòng khám.

| Tên Cột | Kiểu Dữ Liệu | Khóa / Ràng Buộc | Ý Nghĩa Nghiệp Vụ & Ví Dụ |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | **PRIMARY KEY**, default: `uuid()` | Mã thông báo. |
| `userId` | `String` | `NOT NULL`, **FK ➔ User.id** | Người nhận thông báo (`onDelete: Cascade`). |
| `appointmentId` | `String?` | **NULLABLE**, **FK ➔ Appointment.id** | Ca khám liên quan (`onDelete: SetNull`). |
| `message` | `String` | `NOT NULL` | Nội dung văn bản thông báo. |
| `type` | `String` | `NOT NULL`, default: `"GENERAL"` | Phân loại: `"URGENT_DOCTOR_BUSY"`, `"NEW_BOOKING"`, `"GENERAL"`. |
| `isRead` | `Boolean` | `NOT NULL`, default: `false` | Trạng thái đã đọc (`true`) hoặc chưa đọc (`false`). |
| `createdAt` | `DateTime` | default: `now()` | Thời điểm phát thông báo. |

---

### 3.3. Phân Tích Ràng Buộc Khóa Ngoại & Hành Vi Xóa (Cascading & Referential Integrity)

Thiết kế cơ sở dữ liệu của dự án áp dụng chiến lược phân tách rành mạch giữa **Xóa Lan Truyền (`Cascade`)** và **Bảo Tồn Dữ Liệu (`SetNull`)**:

```
[XÓA BÁC SĨ / CHO THÔI CÔNG TÁC]
               |
               +---> 1. DoctorSchedule: ON DELETE CASCADE (Xóa sạch 5-7 ca trực của BS)
               |
               +---> 2. DoctorInfo & User: ON DELETE CASCADE (Xóa thông tin tài khoản)
               |
               +---> 3. MedicalRecord & Prescription: ON DELETE CASCADE (Dọn dẹp liên quan)
               |
               +---> 4. Appointment (Lịch khám): ON DELETE SET NULL
                         * KHÔNG XÓA lịch khám của Bệnh nhân!
                         * Chuyển doctorId = NULL
                         * Chuyển status = 'NEEDS_REASSIGNMENT'
                         * Bắn Notification kích hoạt nút đỏ đổi Bác sĩ cho Admin
```

#### Rationale (Lý Do Thiết Kế):
1. **Tại sao `Appointment.doctorId` dùng `onDelete: SetNull` thay vì `Cascade`?**
   - Nếu áp dụng `Cascade`, khi 1 bác sĩ nghỉ việc, toàn bộ hàng trăm lịch hẹn mà bệnh nhân đã đặt trước đó sẽ bị xóa sạch khỏi hệ thống. Bệnh nhân đến phòng khám sẽ không tìm thấy lịch, gây khủng hoảng vận hành nghiêm trọng.
   - Với `SetNull`, hệ thống giữ nguyên lịch khám của bệnh nhân, tự động gắn cờ `NEEDS_REASSIGNMENT` và thông báo cho Lễ tân chọn bác sĩ khác cùng chuyên khoa thay thế.
2. **Tại sao `MedicalRecord.prescriptions` dùng `onDelete: Cascade`?**
   - Đơn thuốc là thực thể yếu (Weak Entity) phụ thuộc hoàn toàn vào Bệnh án. Khi bệnh án bị xóa, đơn thuốc không thể tồn tại độc lập.

---

### 3.4. Vòng Đời Trạng Thái Lịch Hẹn & Tính Toàn Vẹn ACID

```
                             +--------------------------------------------------+
                             |                     [PENDING]                    |
                             | (Bệnh nhân đặt AUTO_ASSIGN -> Chờ Admin chỉ định)|
                             +------------------------+-------------------------+
                                                      |
                                                      | [Admin phân công BS]
                                                      v
                             +--------------------------------------------------+
                             |                   [CONFIRMED]                    |
                             | (Đã có Bác sĩ phụ trách -> Sẵn sàng tiếp nhận)   |
                             +-----------+--------------------------+-----------+
                                         |                          |
         [Bác sĩ báo bận đột xuất]       |                          | [Bác sĩ khám xong & kê đơn]
                                         v                          v
+---------------------------------------------------+     +-----------------------------------+
|               [NEEDS_REASSIGNMENT]                |     |            [COMPLETED]            |
| (Cảnh báo khẩn cấp -> Admin phân bổ BS thay thế)  |     | (Hoàn tất chu trình khám bệnh)    |
+------------------------+--------------------------+     +-----------------------------------+
                         |
                         | [Admin phân BS mới]
                         +------------> Quay lại CONFIRMED
                                         |
                                         | [Bệnh nhân hoặc Lễ tân hủy ca]
                                         v
+---------------------------------------------------------------------------------------------+
|                                        [CANCELLED]                                          |
|                (Ca khám bị hủy -> Tự động giải phóng khung giờ cho bệnh nhân khác)          |
+---------------------------------------------------------------------------------------------+
```

---

## 4. CÁC CÔNG CỤ QUẢN LÝ CƠ SỞ DỮ LIỆU HIỆN NAY & MỨC ĐỘ SỬ DỤNG

Dưới đây là phân tích chi tiết các công cụ GUI (Graphical User Interface) quản trị cơ sở dữ liệu phổ biến nhất trên thị trường hiện nay, kèm đánh giá mức độ sử dụng thực tế trong quy trình phát triển và vận hành phần mềm:

---

### 4.1. Prisma Studio (Công Cụ Quản Trị CSDL Trực Tiếp Trong Dự Án)
- **Nhà phát triển:** Prisma Data Inc.
- **Mức độ sử dụng trong dự án Next.js/Prisma:** ⭐⭐⭐⭐⭐ **(9.8/10 - Cực Kỳ Cao / Khuyên Dùng Hàng Đầu)**
- **Đang hoạt động trong dự án:** Được tích hợp sẵn qua npm script `"db:studio": "prisma studio"` tại cổng mặc định `http://localhost:5555`.

#### 4.1.1. Bản Chất Kiến Trúc & Cách Thức Vận Hành Của Prisma Studio
Khác với các phần mềm quản trị CSDL truyền thống (phải cài đặt phần mềm máy tính và driver kết nối riêng), Prisma Studio vận hành theo kiến trúc **Web-based GUI Serverless-ready**:
1. Khi chạy lệnh `npm run db:studio` (hoặc `npx prisma studio`), Prisma CLI khởi tạo một máy chủ HTTP cục bộ nhẹ nhàng trên cổng `5555`.
2. Máy chủ này tự động đọc file cấu hình [`prisma/schema.prisma`](file:///d:/PhongKham2026/prisma/schema.prisma) để tải toàn bộ định nghĩa về **8 Models dữ liệu**, các kiểu trường và các mối quan hệ ràng buộc ($1:1, 1:N, N:N$).
3. Giao diện Web (Single Page App) giao tiếp trực tiếp với Prisma Query Engine dưới nền để truy vấn và cập nhật tệp CSDL [`prisma/dev.db`](file:///d:/PhongKham2026/prisma/dev.db).

```
+-----------------------------------------------------------------------------------+
|                        GIAO DIỆN WEB PRISMA STUDIO                                |
|                        (http://localhost:5555)                                    |
+-----------------------------------------+-----------------------------------------+
                                          | (HTTP / WebSocket)
                                          v
+-----------------------------------------------------------------------------------+
|                        PRISMA STUDIO LOCAL SERVER                                 |
|               (Đọc schema.prisma -> Quản lý Type & Metadata)                      |
+-----------------------------------------+-----------------------------------------+
                                          | (Prisma Engine Query)
                                          v
+-----------------------------------------------------------------------------------+
|                      CƠ SỞ DỮ LIỆU PHÒNG KHÁM (dev.db)                            |
|             (User | Specialty | DoctorInfo | Appointment | MedicalRecord...)      |
+-----------------------------------------------------------------------------------+
```

---

#### 4.1.2. Các Tính Năng Cốt Lõi Được Ứng Dụng Thực Tế Trong Dự Án Phòng Khám 2026

1. **Khám Phá & Duyệt Quan Hệ Liên Bảng 1-Click (Relational Data Navigation):**
   - **Từ `Appointment` ➔ `User` & `DoctorInfo`:** Khi mở bảng `Appointment`, quản trị viên chỉ cần click vào ô `patient` hoặc `doctor`, Prisma Studio sẽ tự động mở modal hiển thị đầy đủ thông tin bệnh nhân (Họ tên, Email, SĐT) hoặc bác sĩ tiếp nhận mà không cần phải viết câu lệnh `JOIN`.
   - **Từ `DoctorInfo` ➔ `DoctorSchedule` & `MedicalRecord`:** Xem trực tiếp toàn bộ 5–7 ca trực trong tuần của bác sĩ và các hồ sơ bệnh án bác sĩ đó đã khám.
   - **Từ `MedicalRecord` ➔ `Prescription`:** Kiểm tra tức thì danh sách các loại thuốc đã kê trong đơn thuốc.

2. **Thao Tác Dữ Liệu Trực Quan Nhanh Chóng (Inline Data CRUD Operations):**
   - **Thêm bác sĩ / chuyên khoa thử nghiệm:** Cho phép nhập liệu trực tiếp trên bảng như một bảng tính Excel, tự động kiểm tra định dạng dữ liệu (Validation) dựa trên kiểu dữ liệu của Schema.
   - **Đổi trạng thái ca khám trực tiếp:** Có thể chuyển đổi nhanh trạng thái lịch hẹn giữa `PENDING` ➔ `CONFIRMED` ➔ `COMPLETED` ➔ `NEEDS_REASSIGNMENT` ➔ `CANCELLED` để kiểm thử giao diện Lễ tân và Bác sĩ.

3. **Bộ Lọc Nâng Cao & Sắp Xếp Dữ Liệu Tức Thì (Advanced Filtering & Sorting):**
   - Lọc nhanh các ca khám trong ngày hôm nay: `appointmentDate equals "2026-08-28"`.
   - Lọc các bác sĩ thuộc khoa cụ thể: `specialty.name equals "Khoa Tim Mạch"`.
   - Lọc các ca khám cần xử lý khẩn: `status in ["PENDING", "NEEDS_REASSIGNMENT"]`.

4. **Cơ Chế Cam Kết Thay Đổi An Toàn (Transactional Changes & Staging Bar):**
   - Mọi thay đổi dữ liệu (Thêm mới dòng, sửa giá trị ô, xóa bản ghi) đều được đưa vào trạng thái chờ (Staged Changes) hiển thị ở thanh công cụ dưới đáy màn hình: *"Save 3 changes"* hoặc *"Discard"*.
   - Chỉ khi người dùng bấm **"Save changes"**, Prisma Studio mới thực hiện một Database Transaction xuống file CSDL, loại bỏ hoàn toàn nguy cơ vô tình làm hỏng dữ liệu.

---

#### 4.1.3. Đánh Giá Chuyên Sâu: Có Nên Sử Dụng Prisma Studio Trong Đồ Án Của Sinh Viên?

> **KẾT LUẬN: CỰC KỲ NÊN DÙNG (RẤT KHUYẾN KHÍCH)!**

Trong các đồ án môn học, đồ án tốt nghiệp hoặc đề tài nghiên cứu khoa học của sinh viên ngành CNTT/KTPM, việc áp dụng Prisma Studio đem lại rất nhiều lợi thế mang tính quyết định:

##### A. Những Lợi Điểm Vượt Trội Cho Đồ Án Sinh Viên:
1. **Tạo Ấn Tượng Mạnh Mẽ & Tính Thuyết Phục Cao Khi Báo Cáo Trước Hội Đồng Chấm Thi:**
   - Trong buổi bảo vệ đồ án, khi thầy cô yêu cầu: *"Em hãy thực hiện đặt một lịch hẹn trên trang web, sau đó chứng minh dữ liệu dưới cơ sở dữ liệu đã được ghi nhận đúng và chuyển trạng thái ra sao?"*.
   - Sinh viên chỉ cần mở tab trình duyệt có sẵn **Prisma Studio**, bấm F5 là thấy ngay bản ghi mới xuất hiện cùng quan hệ liên bảng được hiển thị đẹp mắt, chuyên nghiệp và chỉn chu.
2. **Tiết Kiệm 80% Thời Gian Phát Triển, Nhập Liệu Mẫu & Debug:**
   - Sinh viên không cần tốn hàng giờ viết các câu lệnh `INSERT INTO` dài dòng bằng tay. Có thể tạo nhanh hàng chục ca khám, bác sĩ mẫu chỉ với vài cú click chuột.
3. **Cài Đặt "0 Giây" (Zero Configuration) – Nhẹ Máy & Thuận Tiện Di Chuyển Demo:**
   - Không cần cài đặt các phần mềm nặng máy ngốn RAM (như DBeaver cần cài Java Runtime, DataGrip trả phí, pgAdmin nặng nề). Khi mang đồ án sang máy tính trường hoặc máy tính của bạn cùng nhóm, chỉ cần chạy lệnh `npm run db:studio` là dùng được ngay trên mọi trình duyệt.
4. **Bắt Kịp Xu Hướng Công Nghệ Doanh Nghiệp Hiện Đại:**
   - Bộ công nghệ **TypeScript + Next.js + Prisma ORM + Prisma Studio** hiện là tiêu chuẩn công nghệ (Modern Tech Stack) được các công ty phần mềm tuyển dụng hàng đầu ưa chuộng. Việc thành thạo công cụ này là điểm cộng lớn trong CV của sinh viên khi tốt nghiệp.

##### B. Ba Điểm Cốt Lõi Sinh Viên Cần Lưu Ý Để Đạt Điểm Tối Đa (Điểm A+):
1. **Nắm vững bản chất SQL thuần (Raw SQL):** Không nên chỉ dựa vào giao diện bấm chuột. Sinh viên cần hiểu rõ câu lệnh SQL thuần tương ứng (`SELECT ... JOIN ... WHERE ... GROUP BY`) để trả lời tự tin các câu hỏi vấn đáp lý thuyết của Hội đồng.
2. **Sử dụng Sơ đồ ERD chuẩn trong Báo cáo:** Prisma Studio hiển thị dạng bảng dữ liệu chứ không xuất ra sơ đồ thực thể dạng cây. Sinh viên nên sử dụng sơ đồ ERD đã vẽ tại **[Mục 3.1](#31-sơ-đồ-thực-thể---mối-quan-hệ-erd)** để đưa vào quyển báo cáo Word/PDF.
3. **Phân biệt môi trường Dev và Production:** Hiểu rõ Prisma Studio là công cụ hỗ trợ phát triển (Dev Tool), còn trong hệ thống thực tế ngoài đời, người dùng cuối sẽ thao tác qua trang quản trị phân quyền (Admin Portal) của phòng khám.

---

### 4.2. DBeaver Community
- **Nhà phát triển:** DBeaver Corp (Mã nguồn mở).
- **Mức độ sử dụng toàn cầu:** ⭐⭐⭐⭐⭐ **(9.7/10 - Tiêu Chuẩn Công Nghiệp Đa Năng)**
- **Đặc điểm & Ưu điểm:**
  - **Hỗ trợ Universal Database:** Kết nối được hơn **100+ loại CSDL** khác nhau thông qua JDBC driver (SQLite, PostgreSQL, MySQL, MariaDB, Oracle, Microsoft SQL Server, Redis, ClickHouse...).
  - **Sinh sơ đồ ERD tự động:** Tự động quét cấu trúc CSDL và vẽ sơ đồ quan hệ thực thể trực quan tuyệt đẹp.
  - **Trình soạn thảo SQL Editor cao cấp:** Hỗ trợ Auto-completion, Format SQL, Query Execution Plan (EXPLAIN ANALYZE), tô màu cú pháp thông minh.
  - **Công cụ Import/Export dữ liệu mạnh mẽ:** Xuất nhập dữ liệu dạng CSV, JSON, XML, SQL Inserts, Markdown, Excel dễ dàng.
  - **Miễn phí 100%:** Phiên bản Community hoàn toàn miễn phí, đa nền tảng (Windows, macOS, Linux).

---

### 4.3. DataGrip (JetBrains)
- **Nhà phát triển:** JetBrains s.r.o.
- **Mức độ sử dụng doanh nghiệp:** ⭐⭐⭐⭐⭐ **(9.2/10 - Đỉnh Cao Cho Developer Chuyên Nghiệp)**
- **Đặc điểm & Ưu điểm:**
  - **IDE CSDL thông minh bậc nhất:** Khả năng phân tích ngữ cảnh SQL, phát hiện lỗi cú pháp, gợi ý tối ưu hóa index và refactoring tên bảng/cột tự động.
  - **Git Version Control tích hợp:** Quản lý lịch sử thay đổi cấu trúc bảng trực tiếp qua Git.
  - **So sánh Schema (Schema Diff):** So sánh sự khác biệt cấu trúc giữa CSDL Staging và Production chỉ bằng 1 click.
  - **Nhược điểm:** Là phần mềm trả phí bản quyền (nằm trong gói JetBrains All Products Pack).

---

### 4.4. TablePlus
- **Nhà phát triển:** TablePlus Inc.
- **Mức độ sử dụng:** ⭐⭐⭐⭐ **(8.6/10 - Rất Phổ Biến Trong Giới Web Developer)**
- **Đặc điểm & Ưu điểm:**
  - **Hiệu năng siêu nhẹ (Native App):** Được viết bằng ngôn ngữ native (Swift/Objective-C trên macOS, C#/C++ trên Windows) nên khởi động tức thì, tiêu tốn cực ít RAM so với các ứng dụng nền Electron.
  - **Giao diện tối giản, thanh lịch:** Hỗ trợ Dark Mode đẹp mắt, inline edit trực quan giống như phần mềm Excel.
  - **Quản lý đa tab:** Mở nhiều kết nối CSDL và nhiều bảng cùng lúc trên các tab tiện lợi.

---

### 4.5. DB Browser for SQLite (SQLite Database Browser)
- **Nhà phát triển:** SQLiteBrowser Team (Open-source).
- **Mức độ sử dụng cho SQLite:** ⭐⭐⭐⭐ **(8.5/10 - Chuyên Dụng Số 1 Cho SQLite)**
- **Đặc điểm & Ưu điểm:**
  - **Chuyên biệt cho file `.db / .sqlite`:** Mở trực tiếp tập tin [`prisma/dev.db`](file:///d:/PhongKham2026/prisma/dev.db) của dự án mà không cần khởi động bất kỳ tiến trình dịch vụ máy chủ nào.
  - **Portable & Siêu gọn nhẹ:** Dung lượng chỉ vài MB, có bản portable không cần cài đặt.
  - **Kiểm tra Index & Query Log:** Dễ dàng kiểm tra các câu lệnh SQL mà Prisma ORM tạo ra dưới nền.

---

### 4.6. pgAdmin 4
- **Nhà phát triển:** The PostgreSQL Global Development Group.
- **Mức độ sử dụng cho PostgreSQL:** ⭐⭐⭐⭐ **(8.8/10 - Chuẩn Mực Cho PostgreSQL)**
- **Đặc điểm & Ưu điểm:**
  - Quản trị chuyên sâu 100% tính năng độc quyền của PostgreSQL: Stored Procedures, Triggers, Table Partitioning, Row Level Security (RLS), Backup/Restore định dạng `.tar / .custom`.
  - Giám sát hiệu năng máy chủ theo thời gian thực (Server Activity, TPS Graph, Locks Monitor).

---

### 4.7. Supabase Studio / PlanetScale Console
- **Nhà phát triển:** Supabase / PlanetScale.
- **Mức độ sử dụng Cloud/Serverless:** ⭐⭐⭐⭐⭐ **(9.4/10 - Hiện Đại Nhất Cho Cloud Native)**
- **Đặc điểm & Ưu điểm:**
  - Giao diện Web Dashboard trực tuyến lưu trữ trên Cloud.
  - Tích hợp sẵn REST API tự động, GraphQL, Authentication, Storage và Realtime WebSocket Subscriptions.

---

### 4.8. Bảng Ma Trận So Sánh Các Công Cụ & Mức Độ Khuyên Dùng

| Tiêu Chí Đánh Giá | Prisma Studio | DBeaver Community | DataGrip (JetBrains) | TablePlus | DB Browser (SQLite) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mức Độ Phổ Biến** | Rất cao (Dev Next.js) | Cực kỳ phổ biến | Rất cao (Enterprise) | Cao (Startup/Freelance)| Cao (Riêng SQLite) |
| **Loại CSDL Hỗ Trợ** | Đa CSDL (qua Prisma) | **100+ CSDL** | **100+ CSDL** | Đa CSDL phổ biến | Chỉ SQLite |
| **Bản Quyền & Chi Phí** | Miễn phí (Mã nguồn mở)| **Miễn phí 100%** | Trả phí (Subscription)| Miễn phí giới hạn / Trả phí | **Miễn phí 100%** |
| **Nền Tảng Hoạt Động** | Web Browser (Localhost)| Windows, macOS, Linux | Windows, macOS, Linux | macOS, Windows, iOS | Windows, macOS, Linux |
| **Xem Quan Hệ Liên Bảng**| ⭐⭐⭐⭐⭐ (Tự động) | ⭐⭐⭐⭐ (ERD View) | ⭐⭐⭐⭐⭐ (Deep Inspect)| ⭐⭐⭐ (Cơ bản) | ⭐⭐ (Thủ công) |
| **Trình Soạn Thảo SQL** | Không hỗ trợ | ⭐⭐⭐⭐⭐ (Rất mạnh) | ⭐⭐⭐⭐⭐ (Đỉnh nhất) | ⭐⭐⭐⭐ (Tốt) | ⭐⭐⭐ (Cơ bản) |
| **Mức Đích Sử Dụng Tốt Nhất**| **Dev / Test dự án này** | **Quản trị đa hệ thống**| **Doanh nghiệp chuyên sâu**| **Developer thích app nhẹ**| **Kiểm tra nhanh file .db**|

---

## 5. CHIẾN LƯỢC MỞ RỘNG & CHUYỂN ĐỔI CSDL LÊN PRODUCTION

Khi hệ thống phòng khám CarePlus+ phát triển mở rộng chuỗi chi nhánh và đón hàng trăm nghìn lượt bệnh nhân, quy trình chuyển đổi từ **SQLite Cục Bộ** sang **PostgreSQL / MySQL Phân Tán** được thực hiện theo 4 bước chuẩn hóa:

```
[BƯỚC 1: Cấu hình Datasource]
  Thay provider = "postgresql" trong prisma/schema.prisma
  Cập nhật chuỗi DATABASE_URL kết nối tới PostgreSQL (Supabase / AWS RDS)

[BƯỚC 2: Kiểm tra Tương thích Kiểu Dữ Liệu]
  SQLite (String, Int, Float) ➔ PostgreSQL (Text/VarChar, Integer, DoublePrecision, Timestamp)

[BƯỚC 3: Triển khai Migration]
  Chạy lệnh: npx prisma migrate dev --name init_postgres
  Tạo tự động toàn bộ 8 bảng và khóa ngoại trên cơ sở dữ liệu mới

[BƯỚC 4: Di chuyển Dữ liệu Cũ (Data Migration)]
  Chạy script export dữ liệu từ SQLite sang JSON/SQL
  Nạp vào PostgreSQL và kích hoạt Connection Pooling (PgBouncer)
```

---

## 6. CÁC CHECK-LIST AN TOÀN & BẢO MẬT DỮ LIỆU Y TẾ

1. **Mã Hóa Dữ Liệu Tại Chỗ & Khi Truyền Đi (Encryption In-Transit & At-Rest):**
   - Bắt buộc giao thức **HTTPS/TLS 1.3** cho mọi API giao tiếp CSDL.
   - Băm mật khẩu bằng thuật toán **Bcrypt** với `saltRounds >= 10`.
2. **Ngăn Ngừa Tấn Công Tiêm Mã SQL (SQL Injection Prevention):**
   - Prisma ORM sử dụng cơ chế **Parameterized Queries (Truy vấn tham số hóa)** 100%, vô hiệu hóa hoàn toàn nguy cơ SQL Injection.
3. **Chiến Lược Sao Lưu Dự Phòng Tự Động (Automated Backup & Disaster Recovery):**
   - Lập lịch tự động sao lưu định kỳ hàng ngày (`Daily Snapshot`) và sao lưu tăng dần (`Point-in-Time Recovery - PITR`).
4. **Quy Tắc Xóa Dữ Liệu An Toàn (Safe Deletion & Audit Trail):**
   - Áp dụng `onDelete: SetNull` cho lịch hẹn để bảo vệ hồ sơ bệnh án của bệnh nhân ngay cả khi bác sĩ điều trị đã thôi công tác.
