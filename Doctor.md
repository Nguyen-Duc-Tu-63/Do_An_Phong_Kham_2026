# PHÂN TÍCH CHI TIẾT HỆ THỐNG DÀNH CHO BÁC SĨ (DOCTOR WORKSPACE & PORTAL)
## PHÒNG KHÁM ĐA KHOA CAREPLUS+

---

## MỤC LỤC
1. [Tổng Quan Phân Hệ Bác Sĩ (Doctor Subsystem Overview)](#1-tổng-quan-phân-hệ-bác-sĩ)
2. [Các Công Nghệ & Thư Viện Được Sử Dụng](#2-các-công-nghệ--thư-viện-được-sử-dụng)
3. [Kiến Trúc & Mô Hình Dữ Liệu Liên Quan](#3-kiến-trúc--mô-hình-dữ-liệu-liên-quan)
4. [Toàn Bộ Luồng Xử Lý Nghiệp Vụ Của Bác Sĩ (Doctor Workflows & Life-Cycle)](#4-toàn-bộ-luồng-xử-lý-nghiệp-vụ-của-bác-sĩ)
   - [Luồng 1: Xác Thực & Phân Quyền Bác Sĩ (Authentication & Role Verification)](#luồng-1-xác-thực--phân-quyền-bác-sĩ)
   - [Luồng 2: Dashboard Bàn Làm Việc & Hệ Thống Thống Kê 3 Chiều](#luồng-2-dashboard-bàn-làm-việc--hệ-thống-thống-kê-3-chiều)
   - [Luồng 3: Quản Lý Hàng Chờ Khám & Lịch Hẹn Đa Phân Đoạn](#luồng-3-quản-lý-hàng-chờ-khám--lịch-hẹn-đa-phân-đoạn)
   - [Luồng 4: Quy Trình Khám Bệnh Lâm Sàng & Kê Đơn Thuốc Điện Tử Động](#luồng-4-quy-trình-khám-bệnh-lâm-sàng--kê-đơn-thuốc-điện-tử-động)
   - [Luồng 5: Quy Trình Báo Bận Đột Xuất & Kích Hoạt Điều Phối Khẩn Cấp](#luồng-5-quy-trình-báo-bận-đột-xuất--kích-hoạt-điều-phối-khẩn-cấp)
   - [Luồng 6: Quản Lý Lịch Sử Bệnh Án & Theo Dõi Phục Hồi Bệnh Nhân](#luồng-6-quản-lý-lịch-sử-bệnh-án--theo-dõi-phục-hồi-bệnh-nhân)
   - [Luồng 7: Giám Sát Ca Hủy Lịch Khám Tự Động](#luồng-7-giám-sát-ca-hủy-lịch-khám-tự-động)
5. [Sơ Đồ Luồng Dữ Liệu & Trình Tự Thực Thi (Sequence Diagrams)](#5-sơ-đồ-luồng-dữ-liệu--trình-tự-thực-thi)
6. [Danh Sách Các Endpoint API Phục Vụ Bác Sĩ](#6-danh-sách-các-endpoint-api-phục-vụ-bác-sĩ)
7. [Các Điểm Nhấn Về Trải Nghiệm Người Dùng (UX/UI Highlights)](#7-các-điểm-nhấn-về-trải-nghiệm-người-dùng)

---

## 1. TỔNG QUAN PHÂN HỆ BÁC SĨ

Phân hệ **Bác Sĩ (Doctor Portal / Workspace)** tại phòng khám CarePlus+ được thiết kế chuyên biệt như một **"Bàn làm việc điện tử thông minh" (Smart Clinical Workspace)** hỗ trợ các bác sĩ chuyên khoa:
- **Tập trung tối đa vào chuyên môn:** Giao diện tối giản các thao tác hành chính phức tạp, giúp bác sĩ nắm bắt danh sách bệnh nhân chờ khám chỉ trong vài giây.
- **Quy trình khám bệnh - kê đơn liên tục:** Tích hợp trực tiếp biểu mẫu khám lâm sàng, chẩn đoán y khoa và thêm danh sách thuốc điện tử đa thành phần linh hoạt.
- **Cơ chế phản ứng nhanh khi có sự cố:** Cho phép bác sĩ phát tín hiệu "Báo bận đột xuất" chỉ với 1 click, hệ thống tự động thông báo khẩn tới Admin / Lễ tân để tái điều phối bác sĩ thay thế mà không làm gián đoạn việc điều trị của bệnh nhân.
- **Bảo mật & Phân lập dữ liệu:** Bác sĩ chỉ xem và xử lý các ca khám được phân công cho chính mình, tuân thủ nghiêm ngặt bảo mật thông tin bệnh án y khoa.

---

## 2. CÁC CÔNG NGHỆ & THƯ VIỆN ĐƯỢC SỬ DỤNG

| Công nghệ / Thư viện | Phiên bản / Phân loại | Mục đích & Ứng dụng trong phân hệ Bác Sĩ |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `v14.2+` (React 18) | Nền tảng Full-stack cho Bàn làm việc Bác sĩ (`/doctor`), hỗ trợ Client Components quản lý trạng thái real-time và Server Route Handlers xử lý nghiệp vụ y khoa. |
| **TypeScript** | `v5.x` | Định nghĩa cấu trúc dữ liệu y khoa chuẩn xác (`Appointment`, `MedicalRecord`, `Prescription`, `DoctorInfo`, `DoctorSchedule`), ngăn ngừa triệt để lỗi runtime. |
| **TailwindCSS** | `v3.4+` | Xây dựng hệ thống giao diện Y tế hiện đại với gam màu xanh ngọc chủ đạo (`#10b981`, `#4fc3a1`), thẻ trạng thái trực quan, hệ thống lưới Responsive. |
| **Prisma ORM** | `v5.18+` | Quản lý quan hệ dữ liệu đa tầng giữa `User` -> `DoctorInfo` -> `DoctorSchedule` -> `Appointment` -> `MedicalRecord` -> `Prescription`. |
| **SQLite (dev.db)** | Relational Database | Cơ sở dữ liệu quan hệ ACID đảm bảo tính toàn vẹn khi tạo đồng thời Bệnh án (`MedicalRecord`), Đơn thuốc (`Prescription`) và cập nhật trạng thái Lịch hẹn (`Appointment`). |
| **React Hook Form & Zod** | `v7.x` & `v3.x` | Quản lý form khám bệnh, validate các trường bắt buộc (triệu chứng, chẩn đoán, hàm lượng thuốc, liều lượng dùng). |
| **Lucide React** | `v0.427+` | Bộ icon SVG y tế chuyên nghiệp (`Stethoscope`, `Pill`, `UserCheck`, `FileCheck2`, `AlertTriangle`, `Trash2`, `Plus`...). |
| **Sonner** | `v1.5+` | Hiển thị Toast thông báo trạng thái tức thì (kê đơn thành công, báo bận thành công, cảnh báo quyền truy cập). |
| **HTTP-Only Cookies & Bcrypt** | Auth & Security | Xác thực phiên đăng nhập an toàn, ngăn ngừa tấn công XSS, phân quyền chặt chẽ Role-based Access Control (RBAC). |

---

## 3. KIẾN TRÚC & MÔ HÌNH DỮ LIỆU LIÊN QUAN

```
 +-------------------------------------------------------------------------+
 |                               User (Bác sĩ)                             |
 |  id: String (UUID) | fullName | email | phone | role: "DOCTOR"          |
 +-------------------------------------------------------------------------+
                                      | 1-1
                                      v
 +-------------------------------------------------------------------------+
 |                               DoctorInfo                                |
 |  id: String | userId | specialtyId | degree | experienceYears           |
 |  consultationFee: Float | bio: String                                   |
 +-------------------------------------------------------------------------+
         | 1-N                                                | 1-N
         v                                                    v
+------------------+                               +-----------------------+
|  DoctorSchedule  |                               |      Appointment      |
| dayOfWeek (0-6)  |                               | id | patientId        |
| startTime, endTime                               | doctorId | specialtyId|
| slotDuration     |                               | status | bookingType  |
+------------------+                               | date | time | notes   |
                                                   +-----------------------+
                                                              | 1-1
                                                              v
                                                   +-----------------------+
                                                   |     MedicalRecord     |
                                                   | id | appointmentId    |
                                                   | doctorId | patientId  |
                                                   | symptoms | diagnosis  |
                                                   | notes: String?        |
                                                   +-----------------------+
                                                              | 1-N
                                                              v
                                                   +-----------------------+
                                                   |      Prescription     |
                                                   | id | medicalRecordId  |
                                                   | medicineName | dosage |
                                                   | frequency | duration  |
                                                   +-----------------------+
```

### Các trạng thái Lịch Hẹn Bác Sĩ xử lý:
1. `PENDING`: Lịch hẹn vừa được bệnh nhân đặt, đang chờ phân công hoặc tiếp nhận.
2. `CONFIRMED`: Đã xác nhận, bệnh nhân chuẩn bị vào phòng khám theo giờ hẹn.
3. `COMPLETED`: Bác sĩ đã hoàn tất khám lâm sàng và phát hành đơn thuốc điện tử.
4. `NEEDS_REASSIGNMENT`: Bác sĩ đã kích hoạt báo bận khẩn cấp, chuyển quyền xử lý cho Lễ tân.
5. `CANCELLED`: Lịch hẹn đã bị bệnh nhân hủy bỏ trước giờ khám.

---

## 4. TOÀN BỘ LUỒNG XỬ LÝ NGHIỆP VỤ CỦA BÁC SĨ

### Luồng 1: Xác Thực & Phân Quyền Bác Sĩ (Authentication & Role Verification)
- **Truy cập:** Bác sĩ đăng nhập vào hệ thống tại `/login` với email và mật khẩu được phòng khám cấp.
- **Kiểm tra quyền hạn (Role Enforcement):**
  - Khi trang `/doctor` khởi tạo, hàm `loadDoctorData()` gửi request đến `GET /api/auth/me`.
  - Nếu `user.role !== 'DOCTOR'`, hệ thống lập tức hiển thị cảnh báo *"Giao diện dành riêng cho tài khoản Bác sĩ"* và điều hướng về trang đăng nhập.
  - Sau khi xác thực thành công, hệ thống lấy `user.doctorId` để truy vấn toàn bộ lịch khám gắn liền với bác sĩ đó.

---

### Luồng 2: Dashboard Bàn Làm Việc & Hệ Thống Thống Kê 3 Chiều
Trên cùng của trang làm việc, Bác sĩ được cung cấp **3 Thẻ Thống Kê Real-Time** phản ánh toàn diện khối lượng công việc:

1. **Thẻ 1 - Lịch Hẹn Chờ Khám (`waitingAppts.length`):**
   - Đếm tổng số ca khám đang chờ xử lý (`PENDING`, `CONFIRMED`, `NEEDS_REASSIGNMENT`).
   - Phân đoạn chi tiết: `Hôm nay: X ca • Sắp tới: Y ca`.
2. **Thẻ 2 - Lịch Khám Hôm Nay (`todayTotalAppts.length`):**
   - Đếm tổng số bệnh nhân có lịch hẹn trong ngày hôm nay.
   - Thống kê tiến độ: `Chờ khám: X • Đã khám: Y`.
3. **Thẻ 3 - Đã Hoàn Thành Khám (`completedAppts.length`):**
   - Tổng số ca bác sĩ đã hoàn tất khám và kê đơn thành công trên hệ thống.

---

### Luồng 3: Quản Lý Hàng Chờ Khám & Lịch Hẹn Đa Phân Đoạn
Tab **"Hàng Chờ & Lịch Khám"** hiển thị danh sách các bệnh nhân đang chờ tiếp nhận:
- **Tự động sắp xếp thời gian:** Ưu tiên ca khám gần nhất theo ngày (`appointmentDate ASC`) và giờ hẹn (`appointmentTime ASC`).
- **Bộ lọc con nhanh (Sub-filters):**
  - `Tất cả chờ khám`: Toàn bộ các ca chờ của bác sĩ.
  - `Hôm nay`: Lọc nhanh các ca cần tiếp đón trong ngày làm việc hiện tại.
  - `Lịch sắp tới`: Xem trước các ca khám trong các ngày tiếp theo để chuẩn bị.
- **Trực quan hóa thời gian:**
  - Ca khám hôm nay gắn tag nổi bật: `🟢 Hôm Nay lúc HH:mm` kèm hiệu ứng ping động.
  - Ca khám ngày tới gắn tag: `📅 [Thứ, Ngày/Tháng] lúc HH:mm`.
- **Thông tin lâm sàng ban đầu:** Hiển thị họ tên, SĐT, Email và triệu chứng bệnh nhân tự khai báo khi đặt lịch.

---

### Luồng 4: Quy Trình Khám Bệnh Lâm Sàng & Kê Đơn Thuốc Điện Tử Động
Khi bác sĩ bấm **"🩺 Bắt Đầu Khám & Kê Đơn"**:

1. **Khởi tạo Modal Khám Bệnh:**
   - Hệ thống tự động nạp thông tin bệnh nhân và triệu chứng ban đầu vào form.
2. **Nhập kết luận y khoa:**
   - `Triệu chứng lâm sàng *`: Bác sĩ ghi nhận các biểu hiện thực tế khi thăm khám.
   - `Chẩn đoán y khoa *`: Kết luận bệnh lý (Ví dụ: *Viêm phế quản cấp, Tăng huyết áp độ 1...*).
   - `Lời khuyên & Chế độ sinh hoạt`: Hướng dẫn dinh dưỡng, vận động, lịch hẹn tái khám.
3. **Kê Đơn Thuốc Động (Dynamic Prescription Rows):**
   - Bác sĩ có thể bấm **"+ Thêm Thuốc"** hoặc xóa bớt thuốc linh hoạt.
   - Mỗi mục thuốc gồm 4 trường chi tiết:
     - *Tên thuốc* (Ví dụ: `Augmentin 1g`)
     - *Hàm lượng* (Ví dụ: `1000mg`)
     - *Cách dùng* (Ví dụ: `Uống 1 viên x 2 lần/ngày sau ăn`)
     - *Thời gian dùng* (Ví dụ: `7 ngày`)
4. **Lưu trữ & Phát hành:**
   - Gửi yêu cầu `POST /api/medical-records`.
   - Hệ thống tạo bản ghi `MedicalRecord`, liên kết mảng `Prescription`, đồng thời cập nhật `Appointment.status = 'COMPLETED'`.
   - Bệnh nhân ngay lập tức có thể xem và in Đơn thuốc điện tử tại Dashboard của mình.

---

### Luồng 5: Quy Trình Báo Bận Đột Xuất & Kích Hoạt Điều Phối Khẩn Cấp
Trong trường hợp bác sĩ gặp sự cố bất khả kháng (sốt cao, việc khẩn):

1. Bác sĩ bấm nút **"⚠️ Báo Đột Xuất Bận Khám"** trên Banner làm việc.
2. Nhập lý do vắng mặt trong Modal xác nhận.
3. Bấm **"Gửi Thông Báo Khẩn"** -> Gửi `POST /api/doctor/urgent-unavailability`.
4. **Cơ chế tự động của hệ thống:**
   - Toàn bộ các ca khám chưa hoàn tất trong ngày của bác sĩ được chuyển trạng thái sang `NEEDS_REASSIGNMENT`.
   - Hệ thống tự động tạo bản ghi `Notification` loại `URGENT_DOCTOR_BUSY` gửi tới tài khoản Admin/Lễ tân.
   - Bảng điều khiển Admin sẽ hiện cảnh báo đỏ tại tab *"Xử Lý Đổi Lịch Khẩn"* để phân công bác sĩ thay thế ngay lập tức.

---

### Luồng 6: Quản Lý Lịch Sử Bệnh Án & Theo Dõi Phục Hồi Bệnh Nhân
Tab **"Lịch Sử Đã Khám & Bệnh Án"** lưu trữ toàn bộ các ca khám thành công:
- Bác sĩ dễ dàng xem lại chẩn đoán cũ, triệu chứng lâm sàng và danh sách đơn thuốc đã kê cho từng bệnh nhân.
- Hỗ trợ tra cứu tiền sử bệnh án khi bệnh nhân quay lại tái khám.

---

### Luồng 7: Giám Sát Ca Hủy Lịch Khám Tự Động
Tab **"Lịch Đã Hủy"** thống kê các ca khám bệnh nhân đã tự hủy:
- Bác sĩ nắm bắt được khung giờ nào vừa được giải phóng để sẵn sàng tiếp nhận bệnh nhân vãng lai hoặc ca cấp cứu.

---

## 5. SƠ ĐỒ LUỒNG DỮ LIỆU & TRÌNH TỰ THỰC THI

### Sơ đồ 1: Quy trình Khám bệnh & Kê đơn thuốc điện tử
```
[Bác Sĩ]               [Doctor Portal (UI)]             [API /medical-records]         [SQLite DB]
   |                            |                                 |                         |
   |--- 1. Bấm Bắt Đầu Khám --->|                                 |                         |
   |                            |--- Mở Consultation Modal ------>|                         |
   |--- 2. Nhập Chẩn Đoán & --->|                                 |                         |
   |       Kê Đơn Thuốc         |                                 |                         |
   |--- 3. Bấm Hoàn Tất ------->|--- 4. POST /api/medical-records |                         |
   |                            |       (appointmentId, diagnosis,|                         |
   |                            |        symptoms, prescriptions)->|                         |
   |                            |                                 |--- 5. Transaction: ---->|
   |                            |                                 |  • Create MedicalRecord |
   |                            |                                 |  • Create Prescriptions |
   |                            |                                 |  • Update Appt=COMPLETED|
   |                            |<-- 6. HTTP 201 Created ---------|<--- 7. Success Commit --|
   |<-- 8. Toast Thành Công ----|                                 |                         |
   |    (Chuyển sang Tab Lịch Sử)                                 |                         |
```

### Sơ đồ 2: Quy trình Báo bận đột xuất & Điều phối khẩn cấp
```
[Bác Sĩ]              [Doctor Portal (UI)]       [API /urgent-unavailability]      [Admin / Lễ Tân]
   |                            |                                 |                         |
   |--- 1. Báo Bận Đột Xuất --->|                                 |                         |
   |--- 2. Nhập Lý Do Bận ----->|--- 3. POST /urgent-unavailability|                         |
   |                            |       (doctorId, reason) ------>|                         |
   |                            |                                 |--- 4. Update Appts ---->|
   |                            |                                 |  status=NEEDS_REASSIGN  |
   |                            |                                 |--- 5. Create Alert ---->|
   |                            |<-- 6. HTTP 200 OK --------------|   Notification (ADMIN)  |
   |<-- 7. Toast Cảnh Báo ------|                                 |                         |
   |                            |                                 |==== 8. Banner Khẩn ====>|
   |                            |                                 |   (Admin phân bác sĩ mới|
   |                            |                                 |    hoặc đổi giờ khám)   |
```

---

## 6. DANH SÁCH CÁC ENDPOINT API PHỤC VỤ BÁC SĨ

| Phương thức | Đường dẫn API | Chức năng & Vai trò nghiệp vụ |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Kiểm tra phiên đăng nhập hiện tại, xác thực quyền `role === 'DOCTOR'` và lấy `doctorId`. |
| `GET` | `/api/appointments?doctorId={id}` | Lấy toàn bộ danh sách lịch khám của bác sĩ (bao gồm thông tin bệnh nhân, chuyên khoa, bệnh án). |
| `POST` | `/api/medical-records` | Lưu chẩn đoán lâm sàng, tạo danh sách đơn thuốc điện tử và cập nhật lịch hẹn sang `COMPLETED`. |
| `POST` | `/api/doctor/urgent-unavailability` | Kích hoạt trạng thái báo bận khẩn cấp, chuyển toàn bộ ca khám trong ngày sang `NEEDS_REASSIGNMENT` và báo Admin. |
| `PATCH` | `/api/appointments` | Cập nhật thông tin bổ sung hoặc ghi chú lâm sàng cho lịch hẹn khám. |

---

## 7. CÁC ĐIỂM NHẤN VỀ TRẢI NGHIỆM NGƯỜI DÙNG (UX/UI HIGHLIGHTS)

1. **Giao diện chuẩn Y khoa hiện đại (Modern Medical Aesthetic):**
   - Sử dụng gam màu xanh ngọc (Emerald `#10b981`) kết hợp nền sáng tạo cảm giác sạch sẽ, tin cậy và chuyên nghiệp.
2. **Tối ưu hóa thao tác lâm sàng (Frictionless Doctor UX):**
   - Toàn bộ danh sách thuốc được thêm/xóa động ngay trong một cửa sổ duy nhất, không cần chuyển trang.
3. **Phân tách trạng thái minh bạch:**
   - Thẻ lịch hẹn hôm nay có viền xanh lá và đèn hiệu nhấp nháy (`animate-ping`) giúp bác sĩ không bao giờ bỏ sót bệnh nhân đang có mặt tại phòng khám.
4. **Tương thích mọi thiết bị:**
   - Bác sĩ có thể sử dụng mượt mà trên iPad/Tablet khi đi buồng khám hoặc trên máy tính bàn phòng khám chuyên khoa.

---
*Tài liệu được biên soạn và cập nhật theo phiên bản hệ thống Phòng Khám CarePlus+ 2026.*
