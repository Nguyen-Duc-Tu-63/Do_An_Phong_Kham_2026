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

### Luồng 5: Quy Trình Báo Bận Đột Xuất & Kích Hoạt Điều Phối Khẩn Cấp (Urgent Unavailability & Reassignment)

#### 1. Mục Đích & Ý Nghĩa Nghiệp Vụ Thực Tế:
Trong thực tế hoạt động phòng khám, bác sĩ có thể gặp sự cố bất khả kháng (sốt cao đột xuất, tai nạn, việc gia đình khẩn cấp, ca cấp cứu ngoài dự kiến). Nếu không có quy trình xử lý khẩn, bệnh nhân đến phòng khám sẽ phải chờ đợi vô ích, gây bức xúc và làm gián đoạn vận hành phòng khám. Tính năng này thiết lập một **quy trình điều phối tự động & thông suốt 4 bên** (Bác sĩ ➔ Backend Hệ thống ➔ Quản lý/Lễ tân ➔ Bệnh nhân).

#### 2. Chi Tiết 4 Giai Đoạn Vận Hành:

- **Giai đoạn 1: Bác Sĩ Kích Hoạt Báo Bận ([`src/app/doctor/page.tsx`](file:///d:/PhongKham2026/src/app/doctor/page.tsx))**
  1. Bác sĩ bấm nút **"⚠️ Báo Đột Xuất Bận Khám"** màu đỏ nổi bật trên banner làm việc.
  2. Hệ thống mở Modal xác nhận và yêu cầu bác sĩ nhập lý do vắng mặt (Ví dụ: *"Sốt cao đột xuất", "Bận việc gia đình khẩn"*).
  3. Bấm **"Gửi Thông Báo Khẩn"** ➔ Hệ thống gửi request `POST /api/doctor/urgent-unavailability`.

- **Giai đoạn 2: Cơ Chế Tự Động Hóa Backend ([`route.ts`](file:///d:/PhongKham2026/src/app/api/doctor/urgent-unavailability/route.ts))**
  1. **Lọc ca khám bị ảnh hưởng:** Truy vấn SQLite DB tìm toàn bộ lịch hẹn trong ngày hôm nay (`todayStr`) của bác sĩ này đang ở trạng thái `CONFIRMED` hoặc `PENDING`.
  2. **Cập nhật trạng thái hàng loạt:** Chuyển tất cả các ca khám này sang trạng thái **`NEEDS_REASSIGNMENT`** (Cần đổi bác sĩ gấp).
  3. **Phát tín hiệu khẩn tới Lễ tân:** Tạo các bản ghi `Notification` loại **`URGENT_DOCTOR_BUSY`** gửi tới toàn bộ tài khoản Admin/Lễ tân:
     > *"URGENT: BS. [Tên Bác Sĩ] báo bận đột xuất ("[Lý do]"). Lịch hẹn lúc [Giờ] cần đổi bác sĩ ngay!"*

- **Giai đoạn 3: Phía Lễ Tân / Quản Lý Tiếp Nhận & Điều Phối ([`src/app/admin/page.tsx`](file:///d:/PhongKham2026/src/app/admin/page.tsx))**
  1. Trên Header trang Quản lý xuất hiện nút cảnh báo đỏ nhấp nháy: **`Có X Lịch Cần Đổi Bác Sĩ Gấp!`**.
  2. Quản lý bấm vào để chuyển thẳng đến tab **"Xử Lý Đổi Lịch Khẩn"**.
  3. Bấm **"Phân Bác Sĩ Thay Thế"**: Chọn bác sĩ khác cùng chuyên khoa còn trống lịch hoặc đổi sang khung giờ thích hợp.
  4. Hệ thống kiểm tra trùng lịch (Conflict check) đảm bảo bác sĩ mới không bị trùng ca ➔ Gọi `POST /api/appointments/reassign` ➔ Chuyển lịch hẹn về lại trạng thái **`CONFIRMED`**.

- **Giai đoạn 4: Cập Nhật Minh Bạch Cho Bệnh Nhân ([`src/app/dashboard/page.tsx`](file:///d:/PhongKham2026/src/app/dashboard/page.tsx))**
  1. Trong thời gian chờ xử lý, lịch hẹn của bệnh nhân hiển thị badge cảnh báo: *"Cần đổi bác sĩ gấp (Phòng khám đang tự động sắp xếp)"*.
  2. Ngay khi Lễ tân hoàn tất điều phối, lịch hẹn tự động hiển thị tên Bác sĩ mới phụ trách và thông tin giờ khám mà bệnh nhân không cần phải thao tác đặt lại từ đầu.

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

### Sơ đồ 2: Quy trình Báo bận đột xuất & Điều phối thay thế 4 bên
```
[Bác Sĩ]             [Doctor Portal]      [API /urgent-unavailability]     [SQLite DB]        [Admin / Lễ Tân]       [Bệnh Nhân]
   |                        |                          |                        |                     |                 |
   |-- 1. Báo bận khẩn ---->|                          |                        |                     |                 |
   |   (Nhập lý do vắng)    |-- 2. POST /api/doctor/ ->|                        |                     |                 |
   |                        |      urgent-unavailability                        |                     |                 |
   |                        |                          |-- 3. Query appts ----->|                     |                 |
   |                        |                          |   (today, doctorId)    |                     |                 |
   |                        |                          |-- 4. Update status --->|                     |                 |
   |                        |                          |   NEEDS_REASSIGNMENT   |                     |                 |
   |                        |                          |-- 5. Create Notif ---->|                     |                 |
   |                        |                          |   (URGENT_DOCTOR_BUSY) |                     |                 |
   |                        |<-- 6. HTTP 200 OK -------|                        |                     |                 |
   |<-- 7. Toast xác nhận --|                          |                        |-- 8. Alert Banner ->|                 |
   |                        |                          |                        |   (Cảnh báo đỏ)     |                 |
   |                        |                          |                        |                     |-- 9. Reassign ->|
   |                        |                          |                        |                     |   (Chọn BS mới) |
   |                        |                          |                        |                     |-- 10. POST ---> |
   |                        |                          |                        |                     |  /reassign      |
   |                        |                          |                        |<-- 11. CONFIRMED ---|                 |
   |                        |                          |                        |                     |                 |<-- 12. Xem BS mới
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

## 8. DANH BẠ ĐỘI NGŨ 30 BÁC SĨ PHÒNG KHÁM (3 BÁC SĨ / CHUYÊN KHOA)

| STT | Chuyên Khoa | Bác Sĩ Phụ Trách | Học Vị & Bằng Cấp | Kinh Nghiệm | Email Đăng Nhập |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Khoa Tim Mạch** | BS CKI. Lê Thị Thanh Hà | Bác sĩ CKI. Tim Mạch Học | 14 năm | `doctor1@clinic.com` |
| 2 | **Khoa Tim Mạch** | BS CKI. Phan Thị Kim Ngân | Bác sĩ CKI. Tim Mạch & Can Thiệp | 11 năm | `doctor11@clinic.com` |
| 3 | **Khoa Tim Mạch** | BS CKII. Nguyễn Hoàng Nam | Bác sĩ CKII. Tim Mạch Lâm Sàng | 17 năm | `doctor13@clinic.com` |
| 4 | **Khoa Nhi** | ThS BS. Nguyễn Minh Triết | Thạc sĩ Bác sĩ Nhi Khoa | 10 năm | `doctor2@clinic.com` |
| 5 | **Khoa Nhi** | ThS BS. Đoàn Nhật Huy | Thạc sĩ Bác sĩ Nhi - Hô Hấp | 9 năm | `doctor12@clinic.com` |
| 6 | **Khoa Nhi** | BS CKI. Đỗ Thị Thu Trang | Bác sĩ CKI. Nhi Sơ Sinh & Dinh Dưỡng | 12 năm | `doctor14@clinic.com` |
| 7 | **Khoa Da Liễu** | BS. Trần Hoàng Yến | Bác sĩ Chuyên Khoa Da Liễu | 8 năm | `doctor3@clinic.com` |
| 8 | **Khoa Da Liễu** | ThS BS. Trần Tuấn Anh | Thạc sĩ Bác sĩ Da Liễu & Thẩm Mỹ Da | 11 năm | `doctor15@clinic.com` |
| 9 | **Khoa Da Liễu** | BS CKI. Lê Mai Phương | Bác sĩ CKI. Da Liễu Học | 13 năm | `doctor16@clinic.com` |
| 10 | **Khoa Nội Tổng Quát** | ThS BS. Phạm Quốc Bảo | Thạc sĩ Bác sĩ Nội Khoa | 12 năm | `doctor4@clinic.com` |
| 11 | **Khoa Nội Tổng Quát** | BS CKII. Đặng Hữu Phúc | Bác sĩ CKII. Nội Tổng Quát | 19 năm | `doctor17@clinic.com` |
| 12 | **Khoa Nội Tổng Quát** | ThS BS. Nguyễn Bích Ngọc | Thạc sĩ Bác sĩ Nội Tiết & Dinh Dưỡng | 10 năm | `doctor18@clinic.com` |
| 13 | **Khoa Tai Mũi Họng** | BS CKII. Võ Minh Hoàng | Bác sĩ CKII. Tai Mũi Họng | 16 năm | `doctor5@clinic.com` |
| 14 | **Khoa Tai Mũi Họng** | ThS BS. Hoàng Minh Quân | Thạc sĩ Bác sĩ Tai Mũi Họng | 12 năm | `doctor19@clinic.com` |
| 15 | **Khoa Tai Mũi Họng** | BS CKI. Lê Thị Hải Yến | Bác sĩ CKI. Tai Mũi Họng Nhi | 10 năm | `doctor20@clinic.com` |
| 16 | **Khoa Mắt (Nhãn Khoa)** | ThS BS. Đặng Ngọc Anh | Thạc sĩ Bác sĩ Nhãn Khoa | 11 năm | `doctor6@clinic.com` |
| 17 | **Khoa Mắt (Nhãn Khoa)** | BS CKII. Vũ Đình Trọng | Bác sĩ CKII. Nhãn Khoa | 18 năm | `doctor21@clinic.com` |
| 18 | **Khoa Mắt (Nhãn Khoa)** | ThS BS. Phan Thảo My | Thạc sĩ Bác sĩ Nhãn Khoa Trẻ Em | 9 năm | `doctor22@clinic.com` |
| 19 | **Khoa Răng Hàm Mặt** | BS CKI. Bùi Tuấn Kiệt | Bác sĩ CKI. Răng Hàm Mặt & Chỉnh Nha | 9 năm | `doctor7@clinic.com` |
| 20 | **Khoa Răng Hàm Mặt** | ThS BS. Nguyễn Thành Long | Thạc sĩ Bác sĩ Chỉnh Nha & Răng Trẻ Em | 11 năm | `doctor23@clinic.com` |
| 21 | **Khoa Răng Hàm Mặt** | BS CKI. Phạm Minh Châu | Bác sĩ CKI. Cấy Ghép Implant & Phục Hình | 13 năm | `doctor24@clinic.com` |
| 22 | **Khoa Cơ Xương Khớp** | TS BS. Hoàng Đức Thắng | Tiến sĩ Bác sĩ Cơ Xương Khớp | 18 năm | `doctor8@clinic.com` |
| 23 | **Khoa Cơ Xương Khớp** | BS CKII. Bùi Quang Huy | Bác sĩ CKII. Chấn Thương Chỉnh Hình | 16 năm | `doctor25@clinic.com` |
| 24 | **Khoa Cơ Xương Khớp** | ThS BS. Trần Thị Ánh Tuyết | Thạc sĩ Bác sĩ Thấp Khớp Học | 10 năm | `doctor26@clinic.com` |
| 25 | **Khoa Sản Phụ Khoa** | BS CKI. Vũ Thùy Linh | Bác sĩ CKI. Sản Phụ Khoa | 12 năm | `doctor9@clinic.com` |
| 26 | **Khoa Sản Phụ Khoa** | BS CKII. Đặng Thanh Nga | Bác sĩ CKII. Sản Phụ Khoa | 17 năm | `doctor27@clinic.com` |
| 27 | **Khoa Sản Phụ Khoa** | ThS BS. Lê Hồng Hạnh | Thạc sĩ Bác sĩ Phụ Khoa & Nội Tiết Sinh Sản | 11 năm | `doctor28@clinic.com` |
| 28 | **Khoa Tiêu Hóa - Gan Mật** | ThS BS. Trương Gia Bảo | Thạc sĩ Bác sĩ Tiêu Hóa & Nội Soi | 13 năm | `doctor10@clinic.com` |
| 29 | **Khoa Tiêu Hóa - Gan Mật** | BS CKII. Ngô Văn Dũng | Bác sĩ CKII. Gan Mật Tụy | 18 năm | `doctor29@clinic.com` |
| 30 | **Khoa Tiêu Hóa - Gan Mật** | ThS BS. Hoàng Thị Diệu Linh | Thạc sĩ Bác sĩ Nội Soi Tiêu Hóa | 10 năm | `doctor30@clinic.com` |

> 🔑 **Mật khẩu mặc định cho toàn bộ tài khoản bác sĩ:** `password123`

---
*Tài liệu được biên soạn và cập nhật theo phiên bản hệ thống Phòng Khám CarePlus+ 2026.*
