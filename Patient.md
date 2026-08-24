# PHÂN TÍCH CHI TIẾT HỆ THỐNG DÀNH CHO BỆNH NHÂN (PATIENT SYSTEM)
## PHÒNG KHÁM ĐA KHOA CAREPLUS+

---

## MỤC LỤC
1. [Tổng Quan Phân Hệ Bệnh Nhân (Patient System Overview)](#1-tổng-quan-phân-hệ-bệnh-nhân)
2. [Các Công Nghệ & Thư Viện Được Sử Dụng](#2-các-công-nghệ--thư-viện-được-sử-dụng)
3. [Kiến Trúc & Mô Hình Dữ Liệu Liên Quan](#3-kiến-trúc--mô-hình-dữ-liệu-liên-quan)
4. [Toàn Bộ Vòng Đời & Nghiệp Vụ Của Bệnh Nhân (End-to-End Patient Journey)](#4-toàn-bộ-vòng-đời--nghiệp-vụ-của-bệnh-nhân)
   - [Giai Đoạn 1: Tiếp Cận & Tìm Hiểu Danh Mục Chuyên Khoa, Bác Sĩ](#giai-đoạn-1-tiếp-cận--tìm-hiểu-danh-mục-chuyên-khoa-bác-sĩ)
   - [Giai Đoạn 2: Quy Trình Đặt Lịch Khám 3 Bước & Xem Toàn Bộ Suất Khám](#giai-đoạn-2-quy-trình-đặt-lịch-khám-3-bước--xem-toàn-bộ-suất-khám)
   - [Giai Đoạn 3: Tra Cứu & Theo Dõi Hồ Sơ Bằng Số Điện Thoại](#giai-đoạn-3-tra-cứu--theo-dõi-hồ-sơ-bằng-số-điện-thoại)
   - [Giai Đoạn 4: Quy Trình Hủy Lịch Khám Trực Tuyến & Cập Nhật Tức Thì](#giai-đoạn-4-quy-trình-hủy-lịch-khám-trực-tuyến--cập-nhật-tức-thì)
   - [Giai Đoạn 5: Đăng Ký, Đăng Nhập & Cơ Chế Cấp Mật Khẩu Cho Khách Vãng Lai](#giai-đoạn-5-đăng-ký-đăng-nhập--cơ-chế-cấp-mật-khẩu-cho-khách-vãng-lai)
   - [Giai Đoạn 6: Quản Lý Hồ Sơ Cá Nhân & Tải Ảnh Đại Diện](#giai-đoạn-6-quản-lý-hồ-sơ-cá-nhân--tải-ảnh-đại-diện)
   - [Giai Đoạn 7: Khôi Phục Mật Khẩu Bằng Mã OTP SMS](#giai-đoạn-7-khôi-phục-mật-khẩu-bằng-mã-otp-sms)
5. [Sơ Đồ Luồng Dữ Liệu & Trình Tự Thực Thi (Sequence Diagrams)](#5-sơ-đồ-luồng-dữ-liệu--trình-tự-thực-thi)
6. [Danh Sách Các Endpoint API Phục Vụ Bệnh Nhân](#6-danh-sách-các-endpoint-api-phục-vụ-bệnh-nhân)
7. [Các Điểm Nhấn Về Trải Nghiệm Người Dùng (UX/UI Highlights)](#7-các-điểm-nhấn-về-trải-nghiệm-người-dùng)

---

## 1. TỔNG QUAN PHÂN HỆ BỆNH NHÂN

Phân hệ **Bệnh Nhân (Patient System)** của phòng khám CarePlus+ được xây dựng theo chuẩn mực **"Phone-First & Frictionless" (Lấy Số Điện Thoại làm trọng tâm & Tối giản tối đa rào cản thao tác)**:
- **Đặt khám không cần đăng ký trước:** Khách vãng lai lần đầu có thể hoàn tất đặt lịch khám trong chưa đầy **60 giây** mà không cần đăng ký tài khoản trước.
- **Số Điện Thoại (SĐT) là định danh duy nhất:** SĐT được dùng để đặt lịch, tra cứu kết quả khám bệnh, xem đơn thuốc điện tử và nhận thông báo mà không cần nhớ mật khẩu phức tạp.
- **Hiển thị đầy đủ tất cả các suất khám trong ngày:** Bước chọn giờ khám cung cấp toàn bộ 16 khung giờ (chia ca Sáng và Chiều) với trạng thái trực quan: *Còn chỗ*, *Đang chọn*, *Đã kín lịch*.
- **Hỗ trợ 10 chuyên khoa và 12 bác sĩ chuyên môn:** Cho phép chọn hệ thống tự động điều phối hoặc chỉ định bác sĩ mong muốn.
- **Hủy lịch khám chủ động:** Bệnh nhân có thể tự hủy lịch hẹn trực tiếp trên giao diện Dashboard khi có việc bận đột xuất, hệ thống tự động thông báo đến Bác sĩ và Admin.
- **Xem và in đơn thuốc điện tử PDF:** Lưu trữ lịch sử khám bệnh trực tuyến vĩnh viễn, xem đơn thuốc chi tiết và xuất bản in PDF mọi lúc mọi nơi.

---

## 2. CÁC CÔNG NGHỆ & THƯ VIỆN ĐƯỢC SỬ DỤNG

| Công nghệ / Thư viện | Phiên bản / Phân loại | Mục đích & Ứng dụng trong phân hệ Bệnh Nhân |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `v14.2+` (React 18) | Framework Full-stack chính. Quản lý Server Components (tải danh mục chuyên khoa, bác sĩ) và Client Components (wizard đặt lịch 3 bước, chọn suất khám real-time, tab hồ sơ). |
| **TypeScript** | `v5.x` | Đảm bảo tính toàn vẹn kiểu dữ liệu (`Appointment`, `MedicalRecord`, `Prescription`, `SlotStatus`, `UserSession`) từ Frontend đến Database. |
| **TailwindCSS** | `v3.4+` | Xây dựng giao diện y tế cao cấp, responsive đa nền tảng, hệ màu phân tầng trực quan (Xanh ngọc Mint & Emerald `#10b981`, Xanh Ocean Sky `#0284c7`). |
| **Prisma ORM** | `v5.18+` | Quản lý quan hệ dữ liệu đa tầng (`User` -> `Appointment` -> `MedicalRecord` -> `Prescription`), tối ưu hóa câu truy vấn và quan hệ bảng. |
| **SQLite (dev.db)** | CSDL quan hệ | Lưu trữ an toàn toàn bộ dữ liệu người dùng, lịch hẹn, hồ sơ bệnh án, đơn thuốc, lịch trực bác sĩ và thông báo. |
| **React Hook Form & Zod** | `v7.x` & `v3.x` | Quản lý form đặt lịch, form đăng ký/đăng nhập. Validate dữ liệu chuẩn mực (SĐT 10 số, ngày khám hợp lệ, mật khẩu an toàn). |
| **Bcrypt.js** | `v2.4+` | Mã hóa mật khẩu bảo mật một chiều (Salt Rounds = 10) trước khi lưu vào cơ sở dữ liệu. |
| **Lucide React** | `v0.427+` | Bộ icon SVG y tế sắc nét (`Stethoscope`, `HeartPulse`, `Calendar`, `Clock`, `Sun`, `Moon`, `Check`, `Pill`, `Phone`, `Upload`, `Printer`...). |
| **Sonner** | `v1.5+` | Hiển thị Toast thông báo trạng thái tức thì (đặt lịch thành công, hủy lịch thành công, đổi mật khẩu). |
| **FileReader API (HTML5)** | Web API chuẩn | Chuyển đổi tệp ảnh đại diện (avatar) từ máy tính sang chuẩn Base64 Data URL để xem trước tức thì và lưu trữ trực tiếp. |
| **HTTP-Only Cookies** | Session Management | Lưu trữ phiên làm việc an toàn, phòng chống tấn công XSS. |

---

## 3. KIẾN TRÚC & MÔ HÌNH DỮ LIỆU LIÊN QUAN

```
                   +-----------------------------------------------+
                   |              User (Bệnh Nhân / User)          |
                   |  id, fullName, phone, email, passwordHash,... |
                   |  role: "PATIENT" | avatarUrl: String?         |
                   +-----------------------------------------------+
                                          |
                   +----------------------+-----------------------+
                   | 1-N                                          | 1-N
                   v                                              v
      +-------------------------+                    +-------------------------+
      |       Appointment       | 1-1                |      MedicalRecord      |
      | id, patientId, doctorId |------------------->| id, appointmentId       |
      | specialtyId, date, time |                    | doctorId, patientId     |
      | status, bookingType     |                    | symptoms, diagnosis     |
      | patientNotes: String?   |                    | notes: String?          |
      +-------------------------+                    +-------------------------+
                                                                  | 1-N
                                                                  v
                                                     +-------------------------+
                                                     |       Prescription      |
                                                     | id, medicalRecordId     |
                                                     | medicineName, dosage    |
                                                     | frequency, duration     |
                                                     +-------------------------+
```

### Vòng đời trạng thái Lịch Hẹn (`Appointment.status`):
- `CONFIRMED`: Đã xác nhận & Chờ khám. Được thiết lập ngay khi bệnh nhân **Tự chọn Bác sĩ cụ thể** (`SELF_SELECTED`), hoặc sau khi Lễ tân hoàn tất phân công bác sĩ cho ca khám tự động.
- `PENDING`: Chờ sắp xếp bác sĩ (chỉ áp dụng khi bệnh nhân chọn **Phòng khám tự động xếp bác sĩ** `AUTO_ASSIGN` và chưa có bác sĩ phụ trách).
- `NEEDS_REASSIGNMENT`: Bác sĩ báo bận đột xuất, chuyển quyền điều phối khẩn cấp lại cho Admin / Lễ tân.
- `COMPLETED`: Bệnh nhân đã khám xong, bác sĩ đã hoàn tất bệnh án và kê đơn thuốc điện tử.
- `CANCELLED`: Lịch hẹn đã bị hủy bỏ bởi bệnh nhân hoặc phòng khám (được gỡ khỏi hàng chờ khám).

---

## 4. TOÀN BỘ VÒNG ĐỜI & NGHIỆP VỤ CỦA BỆNH NHÂN

### Giai Đoạn 1: Tiếp Cận & Tìm Hiểu Danh Mục Chuyên Khoa, Bác Sĩ
1. **Truy cập Trang chủ (`/`):**
   - **Hero Banner:** Giới thiệu hệ sinh thái phòng khám CarePlus+, quy trình khám chữa bệnh nhanh gọn và hotline hỗ trợ.
   - **Danh mục 10 Chuyên Khoa:**
     1. *Khoa Tim Mạch* (Tầm soát tăng huyết áp, nhịp tim, mạch vành)
     2. *Khoa Nhi* (Theo dõi phát triển thể chất và dinh dưỡng trẻ em)
     3. *Khoa Da Liễu* (Trị mụn, viêm da cơ địa, phục hồi da)
     4. *Khoa Nội Tổng Quát* (Tầm soát sức khỏe, tiểu đường, mỡ máu)
     5. *Khoa Tai Mũi Họng* (Viêm xoang, viêm họng, amidan, polyp mũi xoang)
     6. *Khoa Mắt (Nhãn Khoa)* (Đo thị lực, tật khúc xạ, kiểm soát cận thị)
     7. *Khoa Răng Hàm Mặt* (Nha khoa tổng quát, cạo vôi răng, nhổ răng khôn, Implant)
     8. *Khoa Cơ Xương Khớp* (Thoái hóa khớp, thoát vị đĩa đệm, tiêm PRP khớp)
     9. *Khoa Sản Phụ Khoa* (Khám thai định kỳ, siêu âm 4D, tầm soát phụ khoa)
     10. *Khoa Tiêu Hóa - Gan Mật* (Nội soi tiêu hóa không đau, trào ngược dạ dày, men gan cao)
   - **Đội ngũ 30 Bác Sĩ Chuyên Khoa (3 Bác sĩ / Chuyên khoa):** Hiển thị ảnh chân dung bác sĩ, bằng cấp chuyên khoa, số năm kinh nghiệm và chi phí khám minh bạch.

---

### Giai Đoạn 2: Quy Trình Đặt Lịch Khám 3 Bước & Xem Toàn Bộ Suất Khám (`/book`)

Quy trình được chuẩn hóa qua 3 bước thông minh:

```
[Bước 1: Chọn Khoa & Bác Sĩ] ---> [Bước 2: Chọn Ngày & Suất Khám] ---> [Bước 3: Điền SĐT & Xác Nhận]
```

#### Bước 1: Chọn Chuyên Khoa & Hình Thức Xếp Bác Sĩ
- Bệnh nhân chọn 1 trong 10 chuyên khoa khám bệnh.
- Lựa chọn hình thức xếp bác sĩ:
  - **Tùy chọn 1: Hệ thống tự động xếp (Mặc định):** Phòng khám tự động chọn bác sĩ giỏi đang còn lịch trống phù hợp nhất (Trạng thái ban đầu: `PENDING`).
  - **Tùy chọn 2: Tự chọn bác sĩ cụ thể:** Hiển thị danh sách bác sĩ thuộc chuyên khoa đã chọn kèm học vị, số năm kinh nghiệm và giá khám để bệnh nhân chọn bác sĩ mình tin tưởng (Trạng thái ban đầu: `CONFIRMED`).

#### Bước 2: Chọn Ngày & Hiển Thị Tất Cả Các Suất Khám Trong Ngày
- **Chọn ngày khám:**
  - Ô nhập ngày trực quan, tự động giới hạn không chọn ngày quá khứ (`min = today`).
  - **3 nút chọn nhanh ngày khám:** `Hôm Nay` | `Ngày Mai` | `+2 Ngày` giúp chọn ngày chỉ với 1 click.
  - Phục vụ tất cả các ngày trong tuần (Thứ 2 – Chủ Nhật).
- **Hiển thị toàn bộ 16 Suất Khám chuẩn:**
  - **🌅 Ca Sáng (08:00 – 11:30):** Gồm 8 suất khám: `08:00`, `08:30`, `09:00`, `09:30`, `10:00`, `10:30`, `11:00`, `11:30`.
  - **🌇 Ca Chiều (13:30 – 17:00):** Gồm 8 suất khám: `13:30`, `14:00`, `14:30`, `15:00`, `15:30`, `16:00`, `16:30`, `17:00`.
- **Trực quan hóa trạng thái từng suất:**
  - 🟩 **Đang chọn:** Nút màu xanh ngọc nổi bật (`bg-[#10b981]`), chữ trắng, dấu tích `✓`, hiệu ứng viền sáng.
  - ⬜ **Còn trống (Có thể đặt):** Nút màu trắng viền xám, rê chuột đổi sang nền xanh nhạt, nhãn *"Còn chỗ"*.
  - ⬛ **Đã kín lịch (Không thể chọn):** Nút xám nhạt, gạch ngang, bị vô hiệu hóa (`disabled`) kèm nhãn *"Đã kín"*, ngăn chặn bệnh nhân đặt trùng giờ.
- **Thanh chú thích màu sắc (Legend):** Giúp người dùng dễ dàng hiểu trạng thái các khung giờ.

#### Bước 3: Điền Thông Tin Bệnh Nhân (Khóa Định Danh Số Điện Thoại)
- **Số Điện Thoại (10 số):** Được thiết kế nổi bật với thông báo xác nhận: *"Số điện thoại là khóa định danh tra cứu hồ sơ quan trọng nhất. Sau khi đặt lịch thành công, bạn có thể tra cứu lịch hẹn và bệnh án bất cứ lúc nào mà không cần nhớ mật khẩu phức tạp."*
- **Họ và Tên bệnh nhân:** Nhập họ tên đầy đủ.
- **Email & Ghi chú triệu chứng:** Nhập triệu chứng ban đầu để bác sĩ nắm bắt trước khi khám.
- **Phiếu tóm tắt xác nhận:** Tóm tắt chuyên khoa, bác sĩ, ngày và giờ khám trước khi bấm nút *"Xác Nhận Đặt Lịch Khám"*.

#### Xử lý tại Backend (`POST /api/appointments`):
1. Tìm người dùng trong cơ sở dữ liệu theo `phone`.
2. Nếu chưa có: Tự động khởi tạo một tài khoản Bệnh nhân mới (`role: PATIENT`) gắn với SĐT đó và mật khẩu mặc định `password123`.
3. **Phân bổ trạng thái thông minh:**
   - Nếu bệnh nhân tự chọn bác sĩ cụ thể (`doctorId` hợp lệ) $\rightarrow$ Thiết lập `status = 'CONFIRMED'`.
   - Nếu chọn tự động điều phối (`doctorId = null`) $\rightarrow$ Thiết lập `status = 'PENDING'`.
4. Tạo bản ghi `Notification` gửi tới Quản lý và Bác sĩ được chỉ định.
5. Lưu SĐT vào `localStorage` của trình duyệt (`careplus_patient_phone`).
6. Chuyển hướng tức thì bệnh nhân sang trang Theo Dõi Hồ Sơ: `/dashboard?phone=0901234567`.

---

### Giai Đoạn 3: Tra Cứu & Theo Dõi Hồ Sơ Bằng Số Điện Thoại (`/dashboard`)

Hệ thống hỗ trợ 2 cơ chế theo dõi thuận tiện:

#### 1. Dành cho Khách vãng lai (Chưa đăng nhập)
- Khi truy cập `/dashboard`:
  - Hệ thống tự động kiểm tra `phone` từ URL query hoặc từ `localStorage`.
  - Nếu có SĐT: Tự động tải toàn bộ lịch sử ca khám mà **không cần đăng nhập**.
  - Nếu chưa có: Hiển thị thanh tra cứu nhanh: Bệnh nhân chỉ cần nhập Số Điện Thoại -> Bấm *"Tra Cứu"* -> Hệ thống tải toàn bộ dữ liệu.

#### 2. Dành cho Bệnh nhân đã đăng nhập
- Tự động nhận diện tài khoản chính chủ, hiển thị thông tin bệnh nhân và mở khóa thêm tab *"Quản Lý Cá Nhân"*.

#### Nội dung hiển thị trên các Tab theo dõi:
- **Tab 1 — Lịch Hẹn Khám:**
  - Hiển thị danh sách ca khám sắp diễn ra.
  - Tên bác sĩ phụ trách, chuyên khoa, ngày khám, khung giờ khám và huy hiệu trạng thái thông minh (`Đã xác nhận (Chờ khám)`, `Chờ sắp xếp bác sĩ`, `Cần đổi bác sĩ gấp`).
  - Nút **"Hủy Lịch Hẹn"** màu đỏ giúp bệnh nhân hủy lịch khám chủ động.
- **Tab 2 — Lịch Sử & Bệnh Án (Được Nâng Cấp Toàn Diện):**
  - Danh sách các ca khám đã hoàn tất (`COMPLETED`).
  - **Khối thông tin Bác sĩ khám chuyên nghiệp:** Hiển thị ảnh đại diện Bác sĩ có viền xanh y tế, Học vị, Chuyên khoa và Họ tên bác sĩ.
  - **Typography cỡ chữ to, rõ nét:** Tiêu đề chẩn đoán y khoa (`text-lg sm:text-2xl font-extrabold`), triệu chứng lâm sàng (`text-sm sm:text-base`).
  - **Lời khuyên & Dặn dò của bác sĩ nổi bật:** Trình bày trên thẻ thông báo y khoa nền hổ phách dịu mắt (`bg-amber-50`), font chữ to, đậm, dễ đọc.
  - Nút **"Xem Chi Tiết Đơn Thuốc"** màu xanh gradient nổi bật kèm số lượng loại thuốc đã kê.
- **Tab 3 — Đơn Thuốc Điện Tử:**
  - Danh sách từng loại thuốc chi tiết (Tên thuốc, hàm lượng, cách dùng, thời gian uống) với huy hiệu rõ ràng.
  - Nút **"In Đơn Thuốc PDF"**: Mở cửa sổ in ấn phiếu khám & toa thuốc chuẩn phòng khám CarePlus+ đầy đủ thông tin bác sĩ kê đơn, chẩn đoán, toa thuốc, chữ ký số và con dấu điện tử.

---

### Giai Đoạn 4: Quy Trình Hủy Lịch Khám Trực Tuyến & Cập Nhật Tức Thì
Khi bệnh nhân có việc bận đột xuất:
1. Tại Tab **"Lịch Hẹn Khám"**, bấm nút **"Hủy Lịch Hẹn"** màu đỏ tại ca khám tương ứng.
2. Hộp thoại xác nhận hiển thị yêu cầu bệnh nhân xác nhận thao tác.
3. Khi bấm **"Đồng ý hủy"**:
   - Gửi yêu cầu `PATCH /api/appointments` với payload `{ appointmentId: id, status: 'CANCELLED' }`.
   - Cơ sở dữ liệu cập nhật trạng thái lịch hẹn sang `CANCELLED`.
   - Tự động tạo bản ghi `Notification` loại `APPOINTMENT_CANCELLED` gửi tới Quản trị viên và Bác sĩ phụ trách.
   - **Cập nhật UI tức thì:** Ca khám lập tức biến mất khỏi danh sách lịch hẹn của bệnh nhân và biến mất khỏi hàng chờ khám của bác sĩ mà không cần tải lại toàn bộ trang.

---

### Giai Đoạn 5: Đăng Ký, Đăng Nhập & Cơ Chế Cấp Mật Khẩu Cho Khách Vãng Lai

#### 1. Khách Vãng Lai Tra Cứu KHÔNG CẦN MẬT KHẨU:
- **Tự động ghi nhớ trên cùng thiết bị:** Khách vãng lai đặt lịch xong, SĐT được lưu trong `localStorage`. Mở lại trang `/dashboard` hệ thống tự tải toàn bộ hồ sơ.
- **Truy cập từ thiết bị khác:** Chỉ cần nhập Số Điện Thoại vào thanh tra cứu trên đầu trang `/dashboard` để xem toàn bộ hồ sơ bệnh án và đơn thuốc.

#### 2. Cơ Chế Lấy Mật Khẩu Cho Khách Vãng Lai Đăng Nhập Chính Thức:
* **🔹 Cách 1: Tự tạo mật khẩu mới bằng mã OTP SMS (Khuyên dùng):**
  1. Vào trang **Đăng Nhập** (`/login`) -> Bấm **"Quên mật khẩu?"**.
  2. Nhập **Số Điện Thoại** đã đặt lịch -> Bấm *"Gửi Mã Xác Thực OTP"*.
  3. Nhập mã OTP 6 chữ số + **Mật khẩu mới tự chọn** -> Bấm *"Xác Nhận Đổi Mật Khẩu"*.
  4. Đăng nhập bình thường với mật khẩu vừa tạo.
* **🔹 Cách 2: Sử dụng mật khẩu khởi tạo mặc định:**
  - Hệ thống tự cấp mật khẩu ban đầu là `password123`.
  - Bệnh nhân có thể đăng nhập bằng **SĐT** + mật khẩu **`password123`**, sau đó vào Tab *"Quản Lý Cá Nhân"* để đổi mật khẩu riêng.

#### 3. Đăng Ký Tài Khoản Mới (`/register`):
- Biểu mẫu đăng ký tối giản: Họ tên, Số Điện Thoại, Mật khẩu.
- Tự động mã hóa mật khẩu Bcrypt và cấp Cookie phiên làm việc ngay khi đăng ký thành công.

#### 4. Đăng Nhập Tài Khoản (`/login`):
- Đăng nhập an toàn bằng **Số Điện Thoại** và **Mật Khẩu**.
- Có sẵn nút Đăng Nhập Nhanh trải nghiệm Demo cho Bệnh nhân, Bác sĩ và Quản lý.

---

### Giai Đoạn 6: Quản Lý Hồ Sơ Cá Nhân & Tải Ảnh Đại Diện
Khi đã đăng nhập, Tab **"Quản Lý Cá Nhân"** cho phép:
1. **Thay đổi ảnh đại diện (Avatar):**
   - **Tải ảnh từ máy tính:** Chọn tệp ảnh JPG, PNG, WEBP từ thiết bị (FileReader API nạp và chuyển sang Base64 tức thì).
   - **Chọn Avatar mẫu:** Chọn trong bộ sưu tập 8 avatar y tế có sẵn.
   - **Dán Link ảnh:** Nhập URL hình ảnh từ internet.
2. **Chỉnh sửa thông tin:** Cập nhật họ tên, số điện thoại, email liên hệ.
3. **Đổi mật khẩu tài khoản:** Nhập mật khẩu hiện tại và mật khẩu mới an toàn.

---

### Giai Đoạn 7: Khôi Phục Mật Khẩu Bằng Mã OTP SMS
1. Tại `/login`, bấm **"Quên mật khẩu?"**.
2. **Bước 1:** Nhập Số Điện Thoại -> Bấm *"Gửi Mã Xác Thực OTP"* (`POST /api/auth/forgot-password`).
3. **Bước 2:** Nhập mã OTP 6 chữ số và mật khẩu mới -> Bấm *"Xác Nhận Đổi Mật Khẩu"* (`POST /api/auth/reset-password`).
4. Hệ thống cập nhật mật khẩu mới và điền sẵn để bệnh nhân đăng nhập ngay lập tức.

---

## 5. SƠ ĐỒ LUỒNG DỮ LIỆU & TRÌNH TỰ THỰC THI

### Sơ Đồ 1: Quy trình Đặt lịch khám 3 bước & Xếp giờ khám tự động
```
[Bệnh Nhân]             [Next.js UI (/book)]         [API /available-slots & /appointments]     [SQLite DB]
     |                           |                                      |                            |
     |--- 1. Chọn Khoa & BS ---->|                                      |                            |
     |--- 2. Chọn Ngày Khám ---->|--- 3. GET /available-slots --------->|                            |
     |                           |       (date, specialtyId, doctorId)  |--- 4. Truy vấn DB: ------->|
     |                           |                                      |  • Kiểm tra lịch bác sĩ    |
     |                           |                                      |  • Đếm số ca đã đặt        |
     |                           |<-- 5. HTTP 200 OK {allSlots: 16} ----|<--- 6. Trả về kết quả -----|
     |<-- 7. Render 16 Slots ----|   (Phân ca Sáng/Chiều, Còn/Hết)      |                            |
     |                           |                                      |                            |
     |--- 8. Chọn Giờ & SĐT ---->|                                      |                            |
     |--- 9. Bấm Xác Nhận Khám ->|--- 10. POST /api/appointments ------>|                            |
     |                           |        {phone, fullName, date,       |--- 11. Transaction: ------>|
     |                           |         time, specialtyId, doctorId} |  • Find/Create User        |
     |                           |                                      |  • Create Appt=PENDING     |
     |                           |                                      |  • Create Notification     |
     |                           |<-- 12. HTTP 201 Created -------------|<--- 13. Success Commit ----|
     |                           |--- 14. Save phone to localStorage    |                            |
     |<-- 15. Chuyển Hướng ------|    (Dashboard /dashboard?phone=...)  |                            |
```

### Sơ Đồ 2: Quy trình Tra cứu hồ sơ & Xuất đơn thuốc điện tử PDF bằng Số Điện Thoại
```
[Bệnh Nhân]            [Dashboard UI (/dashboard)]            [API /api/appointments]           [SQLite DB]
     |                           |                                      |                            |
     |--- 1. Nhập SĐT Tra Cứu -->|                                      |                            |
     |       (hoặc từ URL/local) |--- 2. GET /api/appointments?phone=...|                            |
     |                           |                                      |--- 3. Truy vấn quan hệ --->|
     |                           |                                      |  findMany where phone=...  |
     |                           |                                      |  include: MedicalRecord,   |
     |                           |                                      |           Prescriptions    |
     |                           |<-- 4. HTTP 200 OK {appointments: []}-|<--- 5. Trả về dữ liệu -----|
     |<-- 6. Render 3 Tab Hồ Sơ -|   (Lịch Hẹn, Bệnh Án, Đơn Thuốc)     |                            |
     |                           |                                      |                            |
     |--- 7. Bấm "In Đơn Thuốc" >|--- 8. Mở Hộp Thoại In Ấn (Print) --->|                            |
     |       (Xuất PDF Toa Thuốc |   (Đầy đủ chẩn đoán, toa thuốc,      |                            |
     |        có Chữ ký & Con dấu|    chữ ký bác sĩ & dấu phòng khám)   |                            |
```

### Sơ Đồ 3: Quy trình Hủy lịch khám trực tuyến & Thông báo đa chiều
```
[Bệnh Nhân]             [Dashboard UI]                   [API PATCH /appointments]         [Admin & Doctor]
     |                        |                                     |                              |
     |--- 1. Bấm "Hủy Lịch" ->|                                     |                              |
     |--- 2. Xác nhận hủy --->|--- 3. PATCH /api/appointments ----->|                              |
     |                        |       {appointmentId, status:       |--- 4. Update DB: ----------->|
     |                        |        "CANCELLED"}                 |  • Appt.status="CANCELLED"   |
     |                        |                                     |  • Create Notifications      |
     |                        |<-- 5. HTTP 200 OK {success: true} --|<--- 6. Trả về thành công ----|
     |                        |--- 7. Xóa ca khám khỏi State UI     |                              |
     |<-- 8. Toast Thành Công-|                                     |==== 9. Dispatch Alert ======>|
     |   ("Đã hủy lịch khám") |                                     |  (Hàng chờ bác sĩ tự động    |
     |                        |                                     |   gỡ bỏ ca khám đã hủy)      |
```

### Sơ Đồ 4: Quy trình Khôi phục mật khẩu qua OTP SMS cho Khách vãng lai
```
[Khách Vãng Lai]         [Login UI (/login)]            [API /forgot & /reset-password]         [SQLite DB]
     |                           |                                      |                            |
     |--- 1. Bấm Quên Mật Khẩu ->|                                      |                            |
     |--- 2. Nhập SĐT Đã Đặt --->|--- 3. POST /api/auth/forgot-password>|                            |
     |                           |       {phone: "0901234567"}          |--- 4. Kiểm tra User SĐT -->|
     |                           |<-- 5. HTTP 200 OK {otp: "123456"} ---|<--- 6. Sinh mã OTP 6 số ---|
     |<-- 7. Hiển thị Form OTP --|   (Mô phỏng gửi SMS OTP đến SĐT)     |                            |
     |                           |                                      |                            |
     |--- 8. Nhập OTP + Pass Mới>|--- 9. POST /api/auth/reset-password->|                            |
     |                           |       {phone, otp, newPassword}      |--- 10. Hash Bcrypt & ----->|
     |                           |                                      |    Update passwordHash     |
     |                           |<-- 11. HTTP 200 OK {success: true} --|<--- 12. Cập nhật xong -----|
     |<-- 13. Tự Động Đăng Nhập -|   (Chuyển hướng vào Dashboard)       |                            |
```

---

## 6. DANH SÁCH CÁC ENDPOINT API PHỤC VỤ BỆNH NHÂN

| Phương thức | Đường dẫn Endpoint | Chức năng chi tiết |
| :--- | :--- | :--- |
| `GET` | `/api/specialties` | Lấy danh sách 10 chuyên khoa khám bệnh |
| `GET` | `/api/doctors?specialtyId=...` | Lấy danh sách 12 bác sĩ chuyên khoa (lọc theo khoa hoặc tất cả) |
| `GET` | `/api/appointments/available-slots` | Tính toán và trả về toàn bộ 16 suất khám kèm trạng thái *Còn chỗ / Đã kín* |
| `POST` | `/api/appointments` | Đặt lịch khám mới (Tự động liên kết / tạo tài khoản bệnh nhân theo SĐT) |
| `PATCH` | `/api/appointments` | Bệnh nhân hủy lịch khám (`status: CANCELLED`) hoặc cập nhật lịch hẹn |
| `GET` | `/api/appointments?phone=...` | Tra cứu toàn bộ lịch hẹn, hồ sơ bệnh án & đơn thuốc theo Số Điện Thoại |
| `GET` | `/api/appointments?patientId=...` | Lấy danh sách ca khám của bệnh nhân đã đăng nhập |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản bằng Số Điện Thoại và Mật Khẩu |
| `POST` | `/api/auth/register` | Đăng ký tài khoản bệnh nhân mới bằng Số Điện Thoại |
| `POST` | `/api/auth/forgot-password` | Gửi mã OTP xác thực khôi phục mật khẩu về Số Điện Thoại |
| `POST` | `/api/auth/reset-password` | Xác thực mã OTP và cập nhật mật khẩu mới |
| `PUT` | `/api/auth/profile` | Chỉnh sửa thông tin cá nhân, cập nhật Avatar và đổi mật khẩu |
| `GET` | `/api/auth/me` | Lấy thông tin phiên làm việc hiện tại từ Session Cookie |
| `POST` | `/api/auth/logout` | Đăng xuất tài khoản và xóa Cookie phiên làm việc |

---

## 7. CÁC ĐIỂM NHẤN VỀ TRẢI NGHIỆM NGƯỜI DÙNG (UX/UI HIGHLIGHTS)

1. **Không Rào Cản (Zero-Friction Booking):** Bệnh nhân không bắt buộc phải tạo tài khoản trước, hoàn tất đặt lịch khám trong 3 bước rõ ràng chỉ trong vòng 60 giây.
2. **Hiển thị toàn bộ suất khám trực quan:** Phân chia rõ ràng Ca Sáng (08:00 – 11:30) và Ca Chiều (13:30 – 17:00), màu sắc phân biệt rõ suất còn trống và suất đã kín.
3. **Nút chọn nhanh ngày khám:** Các nút *Hôm Nay*, *Ngày Mai*, *+2 Ngày* giúp bệnh nhân đặt lịch nhanh mà không cần mở lịch phức tạp.
4. **Số Điện Thoại Đa Năng:** Vừa là tên đăng nhập, vừa là mã tra cứu hồ sơ trực tuyến, vừa là số nhận thông báo lịch hẹn.
5. **Thiết Kế Trợ Năng Y Tế (Accessible Medical Typography):** Kích thước chữ (Font-size) trong mục Lịch sử khám & Đơn thuốc được tăng lớn, bố cục rõ ràng, trực quan, giúp bệnh nhân ở mọi lứa tuổi (đặc biệt là người lớn tuổi) dễ dàng đọc kết quả và hướng dẫn dùng thuốc.
6. **Nhận Diện Thương Hiệu Đồng Bộ (CarePlus+ Favicon & Identity):** Tích hợp biểu tượng nhịp tim y tế sắc nét đa nền tảng (`favicon.ico`, `favicon.svg`, `icon.png`), tối ưu hiển thị trên tab trình duyệt và màn hình di động.
7. **Hủy lịch khám tiện lợi:** Bệnh nhân có thể tự hủy lịch trực tuyến trên Dashboard khi bận việc đột xuất, hệ thống phản hồi tức thì.
8. **Đơn Thuốc Điện Tử Xuất Bản In PDF:** Toa thuốc điện tử chuẩn hóa đầy đủ thông tin phòng khám CarePlus+, chữ ký bác sĩ, liều dùng và sẵn sàng xuất bản in PDF mọi lúc.
9. **Cá Nhân Hóa Toàn Diện:** Bệnh nhân dễ dàng tải ảnh đại diện từ máy tính hoặc lựa chọn các avatar mẫu đẹp mắt để hoàn thiện hồ sơ của mình.

---
*Tài liệu được biên soạn và cập nhật theo phiên bản hệ thống Phòng Khám CarePlus+ 2026.*
