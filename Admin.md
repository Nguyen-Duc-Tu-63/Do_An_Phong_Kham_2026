# PHÂN TÍCH CHI TIẾT HỆ THỐNG DÀNH CHO QUẢN LÝ & LỄ TÂN (ADMIN & RECEPTIONIST SYSTEM)
## PHÒNG KHÁM ĐA KHOA CAREPLUS+

---

## MỤC LỤC
1. [Tổng Quan Phân Hệ Quản Trị & Lễ Tân (Admin Subsystem Overview)](#1-tổng-quan-phân-hệ-quản-trị--lễ-tân)
2. [Các Công Nghệ & Thư Viện Được Sử Dụng](#2-các-công-nghệ--thư-viện-được-sử-dụng)
3. [Kiến Trúc & Mô Hình Dữ Liệu Liên Quan](#3-kiến-trúc--mô-hình-dữ-liệu-liên-quan)
4. [Toàn Bộ Luồng Xử Lý Nghiệp Vụ Của Quản Trị Viên & Lễ Tân (Admin Workflows & Life-Cycle)](#4-toàn-bộ-luồng-xử-lý-nghiệp-vụ-của-quản-trị-viên--lễ-tân)
   - [Luồng 1: Xác Thực, Phân Quyền & Kiểm Soát Truy Cập (Authentication & RBAC)](#luồng-1-xác-thực-phân-quyền--kiểm-soát-truy-cập-rbac)
   - [Luồng 2: Dashboard Giám Sát Điều Hành & Thống Kê Phân Tích (BI Charts & Live KPIs)](#luồng-2-dashboard-giám-sát-điều-hành--thống-kê-phân-tích-bi-charts--live-kpis)
   - [Luồng 3: Quản Lý, Lọc & Điều Phối Lịch Hẹn Đa Chiều (Appointment Matrix & Filtering)](#luồng-3-quản-lý-lọc--điều-phối-lịch-hẹn-đa-chiều-appointment-matrix--filtering)
   - [Luồng 4: Phân Công Bác Sĩ Cho Ca Khám Tự Động (Smart Dispatch & Conflict Guard)](#luồng-4-phân-công-bác-sĩ-cho-ca-khám-tự-động-smart-dispatch--conflict-guard)
   - [Luồng 5: Quy Trình Xử Lý Đổi Lịch Khẩn Cấp (Emergency Reassignment Command Center)](#luồng-5-quy-trình-xử-lý-đổi-lịch-khẩn-cấp-emergency-reassignment-command-center)
   - [Luồng 6: Quản Trị Danh Mục Chuyên Khoa, Tìm Kiếm, Chỉnh Sửa & Xóa An Toàn (Specialty Full CRUD)](#luồng-6-quản-trị-danh-mục-chuyên-khoa-tìm-kiếm-chỉnh-sửa--xóa-an-toàn-specialty-full-crud)
   - [Luồng 7: Quản Lý Đội Ngũ, Tìm Kiếm, Chỉnh Sửa & Xóa Hồ Sơ Bác Sĩ (Doctor Full CRUD & Safe Decommissioning)](#luồng-7-quản-lý-đội-ngũ-tìm-kiếm-chỉnh-sửa--xóa-hồ-sơ-bác-sĩ-doctor-full-crud--safe-decommissioning)
   - [Luồng 8: Giám Sát Ca Hủy Lịch & Tái Phục Hồi Suất Khám (Slot Reclamation & Audit)](#luồng-8-giám-sát-ca-hủy-lịch--tái-phục-hồi-suất-khám-slot-reclamation--audit)
   - [Luồng 9: Trung Tâm Thông Báo Thời Gian Thực (Real-time Notification Dispatching)](#luồng-9-trung-tâm-thông-báo-thời-gian-thực-real-time-notification-dispatching)
5. [Sơ Đồ Luồng Dữ Liệu & Trình Tự Thực Thi (Sequence Diagrams)](#5-sơ-đồ-luồng-dữ-liệu--trình-tự-thực-thi)
   - [Sơ đồ 1: Luồng Phân công Bác sĩ cho lịch khám tự động (Assign Workflow)](#sơ-đồ-1-luồng-phân-công-bác-sĩ-cho-lịch-khám-tự-động)
   - [Sơ đồ 2: Luồng Điều phối khẩn cấp 4 bên khi Bác sĩ báo bận (Emergency Reassignment Workflow)](#sơ-đồ-2-luồng-điều-phối-khẩn-cấp-4-bên-khi-bác-sĩ-báo-bận)
   - [Sơ đồ 3: Luồng Onboarding Bác Sĩ Mới & Tự Động Sinh Lịch Trực (Doctor Creation Workflow)](#sơ-đồ-3-luồng-onboarding-bác-sĩ-mới--tự-động-sinh-lịch-trực)
   - [Sơ đồ 4: Luồng Xóa / Cho Thôi Công Tác Bác Sĩ An Toàn (Safe Delete Doctor Workflow)](#sơ-đồ-4-luồng-xóa--cho-thôi-công-tác-bác-sĩ-an-toàn)
   - [Sơ đồ 5: Luồng Xóa / Dọn Dẹp Chuyên Khoa An Toàn (Safe Delete Specialty Workflow)](#sơ-đồ-5-luồng-xóa--dọn-dẹp-chuyên-khoa-an-toàn)
6. [Danh Sách Các Endpoint API Phục Vụ Phân Hệ Quản Trị](#6-danh-sách-các-endpoint-api-phục-vụ-phân-hệ-quản-trị)
7. [Các Điểm Nhấn Về Trải Nghiệm & Thiết Kế UI/UX (Admin UX/UI Highlights)](#7-các-điểm-nhấn-về-trải-nghiệm--thiết-kế-uiux)
8. [Danh Mục Tài Khoản Quản Lý Mẫu & Hướng Dẫn Vận Hành](#8-danh-mục-tài-khoản-quản-lý-mẫu--hướng-dẫn-vận-hành)

---

## 1. TỔNG QUAN PHÂN HỆ QUẢN TRỊ & LỄ TÂN

Phân hệ **Quản Trị Viên & Lễ Tân (Admin & Receptionist Portal / Workspace)** đóng vai trò là **"Trung tâm điều hành và chỉ huy tác chiến số" (Digital Command & Operations Center)** của Phòng Khám Đa Khoa CarePlus+. Phân hệ này giải quyết các bài toán cốt lõi trong vận hành y tế:

- **Giám sát thời gian thực (Real-time Operations Monitoring):** Nắm bắt toàn bộ bức tranh vận hành trong ngày: tổng số lượt đăng ký khám, tỷ lệ hoàn tất khám, số ca bị hủy, các ca đang chờ phân công và cảnh báo đột xuất.
- **Trung tâm điều phối thông minh (Smart Dispatching):** Tự động tiếp nhận các ca đặt lịch khám tự động (`AUTO_ASSIGN`) từ bệnh nhân, cho phép Lễ tân phân công bác sĩ chuyên khoa còn trống lịch chỉ với 1 thao tác nhanh, ngăn ngừa 100% tình trạng trùng lịch (Conflict Prevention).
- **Phản ứng khẩn cấp 4 bên (Emergency Reassignment Command):** Tiếp nhận ngay lập tức tín hiệu *"Báo bận đột xuất"* từ các bác sĩ, làm nổi bật nút cảnh báo đỏ nhấp nháy trên giao diện Admin, hỗ trợ chọn bác sĩ thay thế cùng chuyên môn hoặc đổi giờ hẹn mà không làm gián đoạn điều trị của bệnh nhân.
- **Quản trị danh mục chuyên môn & nhân sự y tế (Resource Provisioning):** Cung cấp bộ công cụ CRUD để thêm mới chuyên khoa, khởi tạo hồ sơ bác sĩ đầy đủ bằng cấp/học vị/giá khám, đồng thời tự động kích hoạt lịch làm việc chuẩn hóa từ Thứ 2 đến Thứ 6.
- **Báo cáo kinh doanh & Phân tích chuyên sâu (Business Intelligence Charts):** Trực quan hóa dữ liệu qua biểu đồ cột phân bổ tải khám theo chuyên khoa và biểu đồ đường theo dõi xu hướng khám bệnh 7 ngày.

---

## 2. CÁC CÔNG NGHỆ & THƯ VIỆN ĐƯỢC SỬ DỤNG

| Công nghệ / Thư viện | Phiên bản / Phân loại | Mục đích & Ứng dụng trong phân hệ Admin |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `v14.2+` (React 18) | Nền tảng Full-stack cho cổng Admin (`/admin`), kết hợp Server Components để nạp dữ liệu nhanh và Client Components quản lý trạng thái tương tác biểu đồ, tab và modal. |
| **TypeScript** | `v5.x` | Định nghĩa hệ thống kiểu dữ liệu chặt chẽ (`Appointment`, `DoctorInfo`, `Specialty`, `NotificationItem`, `UserSession`, `AppointmentStatus`), ngăn ngừa lỗi undefined hoặc sai lệch schema khi tính toán KPI. |
| **TailwindCSS** | `v3.4+` | Xây dựng giao diện Dashboard điều hành chuẩn Enterprise: hệ màu tương phản cao (Slate Dark `#0f172a`, Emerald `#10b981`, Rose `#e11d48`, Amber `#d97706`), hiệu ứng chuyển động (`animate-bounce`, `animate-pulse`), và bố cục responsive. |
| **Recharts** | `v2.x` | Thư viện biểu đồ SVG React trực quan: vẽ `BarChart` phân bổ lượt khám theo Chuyên khoa và `LineChart` xu hướng tăng trưởng lịch khám 7 ngày với tooltip động và lưới tọa độ `CartesianGrid`. |
| **Prisma ORM** | `v5.18+` | Thực hiện các câu truy vấn phức tạp: Aggregation (`_count`), lọc đa điều kiện (`whereClause`), truy vấn lồng nhau (`include`) và cập nhật trạng thái lịch khám an toàn. |
| **SQLite (dev.db)** | Relational Database | Cơ sở dữ liệu quan hệ ACID hỗ trợ giao dịch kiểm tra trùng lịch (Conflict Check) và cập nhật đồng thời nhiều bảng liên quan. |
| **Bcrypt.js** | `v2.4+` | Tự động băm mật khẩu bảo mật một chiều (`password123`, Salt Rounds = 10) khi Admin khởi tạo tài khoản bác sĩ mới. |
| **Lucide React** | `v0.427+` | Bộ biểu tượng SVG quản trị chuyên nghiệp (`Shield`, `Calendar`, `AlertOctagon`, `Stethoscope`, `Users`, `BarChart3`, `CheckCircle2`, `Filter`, `Layers`, `Plus`, `Clock`...). |
| **Sonner** | `v1.5+` | Hiển thị Toast thông báo tương tác tức thời (phân công thành công, đổi bác sĩ khẩn cấp thành công, thêm chuyên khoa/bác sĩ mới, cảnh báo lỗi trùng lịch). |
| **HTTP-Only Cookies & RBAC** | Security Architecture | Quản lý phiên làm việc của Quản lý & Lễ tân, chặn đứng tấn công XSS và bảo vệ nghiêm ngặt các route chỉ dành cho vai trò `ADMIN`. |

---

## 3. KIẾN TRÚC & MÔ HÌNH DỮ LIỆU LIÊN QUAN

```
+-----------------------------------------------------------------------------------+
|                               User (Admin / Lễ Tân)                               |
|   id: String (UUID) | fullName | email | phone | role: "ADMIN" | avatarUrl        |
+-----------------------------------------------------------------------------------+
        |                                                   |
        | 1-N (Tạo / Quản lý)                               | 1-N (Nhận cảnh báo)
        v                                                   v
+-------------------------------+                  +--------------------------------+
|           Specialty           |                  |          Notification          |
| id: String | name: String     |                  | id: String | userId: String    |
| description: String | iconUrl |                  | appointmentId: String?         |
+-------------------------------+                  | message: String | isRead: Bool |
        | 1-N                                      | type: URGENT_DOCTOR_BUSY / ... |
        v                                          +--------------------------------+
+------------------------------------+                              ^
|             DoctorInfo             |                              |
| id: String | userId (FK -> User)   |                              |
| specialtyId (FK -> Specialty)      |                              |
| degree | experienceYears | bio     |                              |
| consultationFee: Float             |                              |
+------------------------------------+                              |
        | 1-N                                | 1-N                  | 1-N
        v                                    v                      |
+----------------------+           +------------------------------------+
|    DoctorSchedule    |           |            Appointment             |
| id: String           |           | id: String (UUID)                  |
| doctorId: String     |           | patientId: String (FK -> User)     |
| dayOfWeek: Int (0-6) |           | doctorId: String? (FK -> Doctor)   |
| startTime: "08:00"   |           | specialtyId: String (FK -> Spec)   |
| endTime: "17:00"     |           | appointmentDate: "YYYY-MM-DD"      |
| slotDuration: 30     |           | appointmentTime: "HH:mm"           |
+----------------------+           | status: PENDING / CONFIRMED / ...  |
                                   | bookingType: SELF_SELECTED / AUTO  |
                                   | patientNotes: String?              |
                                   +------------------------------------+
                                                     | 1-1
                                                     v
                                           +--------------------+
                                           |   MedicalRecord    |
                                           | (Hồ sơ bệnh án)    |
                                           +--------------------+
```

### Vòng đời & Ma Trận Trạng Thái Lịch Hẹn Dưới Góc Nhìn Admin:

```
                  +----------------------------------------------+
                  |  Bệnh nhân đặt lịch (Tự động AUTO_ASSIGN)   |
                  +----------------------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |      Trạng thái: PENDING      |
                         |     (Chờ Admin phân BS)       |
                         +-------------------------------+
                                         |
                       [Admin bấm "Phân Bác Sĩ"]
                                         |
                                         v
+--------------------------------------------------------------------------------+
|                             Trạng thái: CONFIRMED                              |
|          (Đã phân công bác sĩ thành công - Bệnh nhân vào hàng chờ khám)        |
+--------------------------------------------------------------------------------+
     |                                                                   |
     | [Bác sĩ bấm Báo Bận Khẩn]                       [Bác sĩ hoàn tất khám]
     v                                                                   v
+----------------------------------+                   +-------------------------+
| Trạng thái: NEEDS_REASSIGNMENT   |                   |  Trạng thái: COMPLETED  |
| (Nút đỏ nhấp nháy trên Admin UI) |                   |  (Đã khám & Kê đơn xong)|
+----------------------------------+                   +-------------------------+
     |                                                                   |
     | [Admin chọn "Đổi Bác Sĩ Gấp"]                                     |
     +--------------> Chuyển về CONFIRMED                                |
                                                                         v
+--------------------------------------------------------------------------------+
|                             Trạng thái: CANCELLED                              |
|           (Bị hủy bởi Bệnh nhân hoặc Lễ tân -> Giải phóng suất khám)           |
+--------------------------------------------------------------------------------+
```

---

## 4. TOÀN BỘ LUỒNG XỬ LÝ NGHIỆP VỤ CỦA QUẢN TRỊ VIÊN & LỄ TÂN

### Luồng 1: Xác Thực, Phân Quyền & Kiểm Soát Truy Cập (Authentication & RBAC)
- **Cơ chế bảo vệ cổng quản trị:**
  - Khi người dùng truy cập route `/admin`, hàm `loadAdminData()` trong [`src/app/admin/page.tsx`](file:///d:/PhongKham2026/src/app/admin/page.tsx) lập tức gửi request `GET /api/auth/me`.
  - Backend [`src/lib/auth.ts`](file:///d:/PhongKham2026/src/lib/auth.ts) đọc cookie bảo mật `phongkham_session_user` để giải mã và xác minh phiên đăng nhập.
  - Nếu `!meData.user` hoặc `meData.user.role !== 'ADMIN'`, hệ thống phát Toast lỗi: *"Giao diện dành riêng cho Quản lý / Lễ tân"* và tự động điều hướng sang `/login`.
- **Hỗ trợ chuyển đổi vai trò nhanh (Role Switcher):** Thanh `RoleSwitcherBanner` trên đầu trang cho phép chuyển đổi 1-click giữa tài khoản Quản lý (`admin@clinic.com`) và Lễ tân (`receptionist@clinic.com`) để kiểm thử vận hành.

---

### Luồng 2: Dashboard Giám Sát Điều Hành & Thống Kê Phân Tích (BI Charts & Live KPIs)
Tại tab **"Thống Kê Biểu Đồ" (`dashboard`)**, Admin được cung cấp bức tranh toàn cảnh về hoạt động khám chữa bệnh được chuẩn hóa theo **Múi giờ Việt Nam (`Asia/Ho_Chi_Minh` - GMT+7)**, thông qua **5 Thẻ Chỉ Số KPI Trực Quan**, **4 Thẻ Vận Hành Nhanh** và **4 Phân Hệ Biểu Đồ Đa Chiều**:

#### 1. Bộ 5 Thẻ Chỉ Số KPI Điều Hành (Real-time Executive Metric Cards):
1. **Lịch Khám Hôm Nay (`stats.kpis.totalToday`):**
   - Đếm chính xác số ca hẹn trong ngày theo chuẩn GMT+7.
   - Hiển thị chi tiết số ca đã khám xong (`completedToday`) và số ca đang chờ khám (`confirmedToday`).
   - Ghi chú ngày tháng thực tế (ví dụ: *Thứ Sáu, 28 tháng 8, 2026*).
2. **Đã Khám Xong (`stats.kpis.completedToday` & `completedTotal`):**
   - Số ca hoàn tất khám bệnh trong ngày và tổng số ca toàn hệ thống.
   - Tính toán **Tỷ lệ hoàn thành khám** (`completionRate = Completed / (Total - Cancelled) %`).
3. **Chờ Phân Bác Sĩ (`stats.kpis.pendingCount`):**
   - Số ca bệnh nhân chọn đặt tự động đang chờ chỉ định bác sĩ (`status = 'PENDING'`).
   - Tự động hiển thị trạng thái *"Đã phân hết"* hoặc *"Cần xử lý gấp"*.
4. **Cần Đổi Bác Sĩ Gấp (`stats.kpis.needsReassignmentCount`):**
   - Thẻ màu đỏ hồng nổi bật với hiệu ứng cảnh báo nhấp nháy khi có ca báo bận đột xuất cần can thiệp khẩn cấp.
   - Kèm thông số tổng ca đã hủy lịch (`cancelledCount`).
5. **Doanh Thu Ước Tính (`stats.kpis.todayRevenue` & `totalRevenue`):**
   - Tính toán tổng doanh thu hôm nay và doanh thu tích lũy toàn hệ thống dựa trên đơn giá khám tư vấn (`consultationFee`) của bác sĩ phụ trách.

#### 2. Hệ Thống 4 Phân Hệ Biểu Đồ & Báo Cáo Phân Tích Chuyên Sâu (BI Multi-Dimensional Analytics):
- **Phân hệ 1: Xu Hướng Đặt Khám Đa Đường (`AreaChart` với Gradient & Bộ lọc 7 / 14 Ngày):**
  - Cho phép quản trị viên chuyển đổi linh hoạt giữa góc nhìn **7 Ngày Gần Nhất** hoặc **14 Ngày**.
  - Hiển thị 2 vùng dữ liệu song song: *Tổng ca hẹn đăng ký* (`#4fc3a1`) và *Số ca đã hoàn tất khám* (`#3b82f6`).
  - Dữ liệu hoàn toàn thực tế dựa trên các ca khám phát sinh trong cơ sở dữ liệu (loại bỏ hoàn toàn dữ liệu giả/ngẫu nhiên).
  - Custom Tooltip hiển thị chi tiết: Tổng ca, Đã khám xong, Đang chờ và Đã hủy theo từng ngày.
- **Phân hệ 2: Cơ Cấu Trạng Thái Lịch Khám Toàn Hệ Thống (`PieChart` / Donut Chart):**
  - Biểu đồ vành khăn hiển thị tỉ trọng 5 trạng thái: *Đã hoàn thành (Xanh lá), Đã xác nhận (Xanh dương), Chờ phân bác sĩ (Cam), Cần đổi bác sĩ (Đỏ), Đã hủy (Xám)*.
  - Trung tâm biểu đồ hiển thị Tổng số ca khám toàn diện.
  - Bảng Legend kèm số lượng cụ thể và tỷ lệ phần trăm (%) tương ứng.
- **Phân hệ 3: Lượng Khám & Doanh Thu Theo Chuyên Khoa (`BarChart` Cột Kép):**
  - So sánh trực quan giữa *Tổng ca đặt* và *Ca đã khám xong* cho toàn bộ các chuyên khoa.
  - Nhãn trục hoành tự động xoay góc nghiên `-25°` tránh đè chữ.
- **Phân hệ 4: Bảng Xếp Hạng Bác Sĩ Nổi Bật (Doctor Performance Leaderboard):**
  - Xếp hạng Top các bác sĩ có số lượt khám và doanh thu cao nhất phòng khám.
  - Hiển thị huy hiệu thứ hạng (🥇 1, 🥈 2, 🥉 3...), Avatar, Học vị, Chuyên khoa và Doanh thu đóng góp.
- **Phân hệ 5: Phân Bổ Ca Khám Theo Khung Giờ (Peak Hours Distribution):**
  - Thống kê tỷ trọng **Ca Sáng (08:00 - 11:30)** so với **Ca Chiều (13:30 - 17:00)**.
  - Biểu đồ cột phân bổ từng khung giờ (08:00, 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00), hỗ trợ phòng khám chủ động điều phối bác sĩ và nhân sự vào các khung giờ cao điểm.

---

### Luồng 3: Quản Lý, Lọc & Điều Phối Lịch Hẹn Đa Chiều (Appointment Matrix & Filtering)
Tab **"Bảng Tổng Hợp Lịch Hẹn" (`appointments`)** quản lý toàn bộ dữ liệu lịch khám của phòng khám:

#### 1. Bộ Lọc 3 Chiều Kết Hợp (Multi-faceted Fast Filters):
- **Lọc theo Trạng thái:** *Tất cả, Chờ sắp xếp bác sĩ (`PENDING`), Đã xác nhận (`CONFIRMED`), Đã hoàn thành khám (`COMPLETED`), Cần đổi bác sĩ gấp (`NEEDS_REASSIGNMENT`), Đã hủy lịch (`CANCELLED`)*.
- **Lọc theo Chuyên khoa:** Cho phép chọn xem lịch của một chuyên khoa cụ thể.
- **Lọc theo Bác sĩ:** Lọc riêng lịch khám của từng bác sĩ trong danh bạ 30 bác sĩ phòng khám.

#### 2. Bảng Dữ Liệu Tương Tác:
- **Thông tin bệnh nhân:** Họ và tên, số điện thoại liên hệ trực tiếp.
- **Chuyên khoa & Bác sĩ phụ trách:** Nếu ca khám chưa có bác sĩ, bảng hiển thị nhãn màu hổ phách: `Chưa phân công (Tự động)`.
- **Thời gian khám:** Ngày khám định dạng Tiếng Việt chuẩn xác kèm giờ khám cụ thể (VD: *Thứ Năm, 27 tháng 8, 2026 lúc 09:30*).
- **Huy hiệu trạng thái trực quan (`Badge`):** Sử dụng các gam màu chuẩn y khoa:
  - `Đã xác nhận (Chờ khám)`: Xanh ngọc viền emerald.
  - `Đã hoàn thành khám`: Xanh lam viền blue.
  - `Chờ sắp xếp bác sĩ`: Hổ phách viền amber.
  - `Cần đổi bác sĩ gấp`: Đỏ viền rose nhấp nháy.
  - `Đã hủy lịch`: Xám viền slate.
- **Cột Thao Tác Động:**
  - Nút **"Phân Bác Sĩ"** xuất hiện trên các dòng `PENDING`.
  - Nút **"Đổi Bác Sĩ Gấp"** màu đỏ xuất hiện trên các dòng `NEEDS_REASSIGNMENT`.

---

### Luồng 4: Phân Công Bác Sĩ Cho Ca Khám Tự Động (Smart Dispatch & Conflict Guard)
Khi bệnh nhân chọn đặt khám nhanh mà không chỉ định bác sĩ (`bookingType = 'AUTO_ASSIGN'`), lịch hẹn sẽ ở trạng thái `PENDING`.

```
[Bệnh nhân đặt khám] ---> [Appointment: PENDING] ---> [Admin UI: Nút "Phân Bác Sĩ"]
                                                                  |
                                                                  v
                                                     [Mở Modal: Chọn Bác Sĩ]
                                                                  |
                                                                  v
                                              [API: POST /api/appointments/assign]
                                                                  |
                                                                  v
                                         +------------------------------------------------+
                                         | Backend kiểm tra Conflict (Trùng ngày & giờ):  |
                                         | - Nếu TRÙNG: HTTP 409 (Báo lỗi cho Admin)      |
                                         | - Nếu TRỐNG: Cập nhật status = CONFIRMED       |
                                         +------------------------------------------------+
```

1. **Khởi chạy Modal Phân Công:** Lễ tân bấm **"Phân Bác Sĩ"**, Modal hiển thị tóm tắt thông tin: Chuyên khoa, Thời gian, Tên bệnh nhân.
2. **Bộ lọc danh sách bác sĩ tự động:** Dropdown chỉ liệt kê các bác sĩ thuộc đúng chuyên khoa của ca khám đó (`doctors.filter(d => d.specialtyId === appt.specialtyId)`).
3. **Cơ chế bảo vệ chống trùng lịch (Conflict Guardrail Backend):**
   - API [`POST /api/appointments/assign`](file:///d:/PhongKham2026/src/app/api/appointments/assign/route.ts) tiến hành truy vấn cơ sở dữ liệu để tìm xem bác sĩ được chọn đã có lịch khám nào khác vào cùng `appointmentDate` và `appointmentTime` (loại trừ các ca `CANCELLED`) hay chưa:
   ```typescript
   const conflict = await prisma.appointment.findFirst({
     where: {
       doctorId,
       appointmentDate: appt.appointmentDate,
       appointmentTime: appt.appointmentTime,
       status: { notIn: ['CANCELLED'] },
       id: { not: appointmentId },
     },
   });
   ```
   - Nếu phát hiện trùng giờ, API từ chối với mã lỗi `409 Conflict`: *"Selected doctor already has an appointment at this time slot."*
   - Nếu hợp lệ, hệ thống cập nhật `doctorId`, chuyển trạng thái thành **`CONFIRMED`**, lịch hẹn chính thức xuất hiện trên Bàn làm việc của Bác sĩ được phân công.

---

### Luồng 5: Quy Trình Xử Lý Đổi Lịch Khẩn Cấp (Emergency Reassignment Command Center)

#### 1. Bối cảnh & Tầm quan trọng:
Khi bác sĩ đang có lịch khám nhưng gặp sự cố đột xuất (ốm sốt, việc khẩn cấp) và kích hoạt *"Báo bận đột xuất"*, phân hệ Admin đóng vai trò là chốt chặn xử lý khủng hoảng để bảo vệ quyền lợi của bệnh nhân.

#### 2. Các bước phản ứng nhanh của Quản lý / Lễ tân:
1. **Báo động thị giác tức thời (Visual Alarm):**
   - Nút cảnh báo đỏ nhấp nháy chuyển động (`animate-bounce`) hiển thị trên Header Admin: **`Có X Lịch Cần Đổi Bác Sĩ Gấp!`**.
   - Tab **"Xử Lý Đổi Lịch Khẩn"** hiển thị badge đếm số lượng ca cần xử lý.
2. **Tiếp nhận & Mở Modal Điều Phối Khẩn:**
   - Lễ tân bấm **"Phân Bác Sĩ Thay Thế"**.
   - Modal cho phép:
     - Chọn bác sĩ thay thế cùng chuyên khoa.
     - Điều chỉnh lại **Ngày khám hẹn lại** (nếu bệnh nhân đồng ý dời ngày).
     - Điều chỉnh lại **Giờ khám hẹn lại** (nếu dời khung giờ).
3. **Thực thi qua API chuyên biệt [`POST /api/appointments/reassign`](file:///d:/PhongKham2026/src/app/api/appointments/reassign/route.ts):**
   - Kiểm tra trùng lịch đối với bác sĩ thay thế vào khung giờ mục tiêu.
   - Cập nhật thông tin bác sĩ mới, ngày/giờ khám mới và chuyển trạng thái về lại **`CONFIRMED`**.
   - Đồng bộ dữ liệu lập tức hiển thị trên Dashboard của Bệnh nhân với tên bác sĩ mới mà bệnh nhân không cần phải thao tác đặt lại.

---

### Luồng 6: Quản Trị Danh Mục Chuyên Khoa, Tìm Kiếm, Chỉnh Sửa & Xóa An Toàn (Specialty Full CRUD)
Tab **"Quản Lý Chuyên Khoa" (`specialties`)** cung cấp giải pháp quản trị toàn diện các phân khoa khám chữa bệnh:

#### 1. Tìm kiếm & Thống Kê Nhân Sự / Lịch Hẹn Thời Gian Thực:
- **Thanh tìm kiếm tức thì:** Tìm kiếm chuyên khoa theo *Tên chuyên khoa* hoặc *Mô tả bệnh lý tiếp nhận*.
- **Bộ đếm tương tác trên từng Card:**
  - Hiển thị số lượng Bác sĩ trực thuộc khoa (`specDoctors.length`).
  - Hiển thị số ca lịch hẹn đã tiếp nhận (`specAppointments.length`).
  - Preview danh sách Avatar của các bác sĩ đang công tác tại chuyên khoa.

#### 2. Thêm Chuyên Khoa Mới (Specialty Creation):
- Admin bấm **"+ Thêm Chuyên Khoa Mới"**.
- Điền các trường thông tin:
  - `Tên Chuyên Khoa *` (Ví dụ: *Khoa Thần Kinh Học, Khoa Ung Bướu, Khoa Phục Hồi Chức Năng*).
  - `Biểu Tượng Đại Diện (Icon)`: Dropdown chọn biểu tượng y tế trực quan (*Tim Mạch, Nhi Khoa, Da Liễu, Nội Khoa, Tai Mũi Họng, Mắt, Răng Hàm Mặt, Cơ Xương Khớp, Chuyên Khoa Khác*).
  - `Mô Tả Chuyên Khoa & Bệnh Lý Tiếp Nhận *`: Chi tiết về nhóm bệnh lý, kỹ thuật chẩn đoán và điều trị tiếp nhận.
- Backend `POST /api/specialties`:
  - Kiểm tra chống trùng lặp tên chuyên khoa (`nameConflict check`).
  - Lưu vào bảng `Specialty` và tự động hiển thị trong trang chủ, form đặt lịch của bệnh nhân và bộ lọc Admin.

#### 3. Chỉnh Sửa Thông Tin Chuyên Khoa ([`PUT /api/specialties`](file:///d:/PhongKham2026/src/app/api/specialties/route.ts)):
- Admin bấm nút **Sửa** (icon `Pencil`) trên thẻ chuyên khoa.
- Mở **Modal Chỉnh Sửa Thông Tin Chuyên Khoa** nạp sẵn dữ liệu hiện hành.
- Cho phép điều chỉnh: Tên chuyên khoa, Biểu tượng y khoa và Đoạn mô tả bệnh lý.
- Xử lý Backend:
  - Xác thực ID và tính hợp lệ của dữ liệu.
  - Ngăn chặn việc trùng tên với các chuyên khoa khác đang có trong hệ thống.
  - Cập nhật dữ liệu tức thì và bắn thông báo Toast thành công.

#### 4. Quy Trình Xóa Chuyên Khoa An Toàn ([`DELETE /api/specialties`](file:///d:/PhongKham2026/src/app/api/specialties/route.ts)):
- Admin bấm nút **Xóa** (icon `Trash2` màu đỏ) trên thẻ chuyên khoa.
- Mở **Modal Xác Nhận Cảnh Báo Nguy Cơ (`AlertTriangle`)** hiển thị rõ:
  - Tên chuyên khoa sắp xóa.
  - Số lượng Bác sĩ và số lượng Lịch hẹn liên quan bị ảnh hưởng.
- **Thuật toán dọn dẹp liên hoàn 6 bước Backend:**
  1. Xóa toàn bộ lịch trực tuần `DoctorSchedule` của tất cả bác sĩ thuộc chuyên khoa này.
  2. Dọn dẹp đơn thuốc (`Prescription`) và hồ sơ bệnh án (`MedicalRecord`) liên quan.
  3. Dọn dẹp các thông báo (`Notification`) và hủy bỏ các ca khám (`Appointment`) thuộc chuyên khoa.
  4. Xóa hồ sơ chuyên môn `DoctorInfo` của các bác sĩ trong khoa.
  5. Xóa tài khoản `User` của các bác sĩ trực thuộc để giải phóng tài nguyên.
  6. Xóa bản ghi `Specialty` và gửi thông báo `Notification` ghi nhận sự kiện tới Quản trị viên.

---

### Luồng 7: Quản Lý Đội Ngũ, Tìm Kiếm, Chỉnh Sửa & Xóa Hồ Sơ Bác Sĩ (Doctor Full CRUD & Safe Decommissioning)
Tab **"Quản Lý Bác Sĩ" (`doctors`)** cung cấp bộ công cụ quản trị nhân sự y tế toàn diện:

#### 1. Bộ lọc & Tìm kiếm Thông minh (Real-time Search & Filter):
- **Thanh tìm kiếm tức thì:** Tìm kiếm bác sĩ linh hoạt theo *Họ tên, Địa chỉ Email, Học vị/Bằng cấp, Số điện thoại hoặc Chuyên khoa*.
- **Dropdown lọc theo Chuyên khoa:** Cho phép chọn lọc nhanh các bác sĩ thuộc từng khoa (ví dụ: *Khoa Tim Mạch (3 BS)*), hiển thị số lượng bác sĩ theo thời gian thực.
- **Trạng thái rỗng trực quan:** Khi không tìm thấy kết quả, giao diện hiển thị thông báo hướng dẫn quản trị viên thay đổi từ khóa.

#### 2. Thẻ Bác Sĩ Đa Chiều & Thao Tác Tác Nghiệp:
Mỗi bác sĩ được thể hiện qua Thẻ hồ sơ chuyên nghiệp:
- **Thông tin nhận diện:** Ảnh đại diện (Avatar), Huy hiệu Chuyên khoa, Họ tên, Học vị.
- **Thông tin liên hệ & Chuyên môn:** Email, Số điện thoại, Đoạn trích dẫn Tiểu sử / Thành tựu lâm sàng.
- **Thông số vận hành:** Giá khám tư vấn ($/VND) và Thâm niên kinh nghiệm (Năm).
- **Bộ nút tác vụ nhanh (Quick Action Buttons):**
  - Nút **Sửa (Icon Bút chì `Pencil`)**: Mở Modal Chỉnh sửa hồ sơ.
  - Nút **Xóa (Icon Thùng rác `Trash2` màu đỏ)**: Mở Modal Xác nhận cho thôi công tác.

#### 3. Quy trình 1-Bước Thêm Bác Sĩ Mới (Doctor Onboarding):
Khi Admin bấm **"+ Thêm Bác Sĩ Mới"**:
- Nhập: Họ tên, Email, Số điện thoại, Chọn Chuyên khoa, Học vị, Kinh nghiệm (năm), Giá khám ($), URL Avatar và Tóm tắt tiểu sử.
- Gửi yêu cầu `POST /api/doctors`:
  1. Tạo tài khoản `User` với `role = 'DOCTOR'`, băm mật khẩu `password123` bằng Bcrypt (`saltRounds = 10`).
  2. Tạo bản ghi `DoctorInfo` liên kết quan hệ 1-1 với `User` và 1-N với `Specialty`.
  3. Tự động sinh 5 lịch làm việc chuẩn từ Thứ 2 đến Thứ 6 (08:00 - 17:00, slot 30 phút).

#### 4. Quy trình Chỉnh Sửa Thông Tin Bác Sĩ ([`PUT /api/doctors`](file:///d:/PhongKham2026/src/app/api/doctors/route.ts)):
- Khi bấm nút **Sửa**:
  - Modal **"Chỉnh Sửa Thông Tin Bác Sĩ"** tự động nạp toàn bộ dữ liệu hiện tại của bác sĩ vào form.
  - Admin có thể cập nhật: *Họ tên, Email, Số điện thoại, Chuyên khoa phụ trách, Học vị, Số năm kinh nghiệm, Giá khám tư vấn, URL Ảnh đại diện và Tiểu sử*.
- **Xử lý Backend (`PUT /api/doctors`):**
  - Kiểm tra trùng lặp email với các tài khoản khác trong hệ thống (`emailConflict check`).
  - Cập nhật đồng bộ cả 2 bảng `User` (Họ tên, Email, SĐT, Avatar) và `DoctorInfo` (Chuyên khoa, Học vị, Kinh nghiệm, Giá khám, Bio).
  - Trả về dữ liệu cập nhật và phát thông báo Toast thành công tức thì.

#### 5. Quy trình Xóa / Cho Thôi Công Tác Bác Sĩ An Toàn ([`DELETE /api/doctors`](file:///d:/PhongKham2026/src/app/api/doctors/route.ts)):
- **Cơ chế an toàn phòng ngừa rủi ro y tế:**
  Khi một bác sĩ nghỉ việc hoặc ngừng cộng tác, phòng khám không thể xóa đơn giản vì sẽ làm mất dữ liệu lịch hẹn của bệnh nhân đã đặt. Hệ thống triển khai **Thuật toán giải phóng an toàn 7 bước**:
  1. Mở **Modal Cảnh Báo Nguy Cơ (`AlertTriangle`)** hiển thị rõ họ tên, chuyên khoa, email và cảnh báo các ca khám bị ảnh hưởng.
  2. Khi Admin xác nhận, API `DELETE /api/doctors?id={id}` được kích hoạt.
  3. **Bảo vệ lịch hẹn bệnh nhân:** Tìm toàn bộ các ca khám đang chờ (`CONFIRMED`, `PENDING`) của bác sĩ này và tự động chuyển sang trạng thái **`NEEDS_REASSIGNMENT`** (Cần đổi bác sĩ gấp) đồng thời gỡ bỏ `doctorId = null`.
  4. Gỡ liên kết `doctorId` khỏi các lịch khám cũ để đảm bảo tính toàn vẹn dữ liệu.
  5. Xóa toàn bộ lịch trực tuần trong `DoctorSchedule`.
  6. Xóa bản ghi `DoctorInfo` và tài khoản `User` của bác sĩ.
  7. **Phát tín hiệu khẩn cấp cho Quản trị viên:** Tự động tạo bản ghi `Notification` cảnh báo: *"Bác sĩ [Tên] đã được xóa/cho ngừng công tác. Các lịch hẹn liên quan đã được chuyển sang trạng thái chờ điều phối lại."*
  8. Nút đỏ nhấp nháy **`Có X Lịch Cần Đổi Bác Sĩ Gấp!`** trên Header lập tức kích hoạt để Lễ tân điều phối bác sĩ khác thay thế ngay cho bệnh nhân.

---

### Luồng 8: Giám Sát Ca Hủy Lịch & Tái Phục Hồi Suất Khám (Slot Reclamation & Audit)
- Khi Bệnh nhân bấm hủy lịch từ trang cá nhân, hoặc Bác sĩ / Lễ tân hủy ca khám:
  - Request `PATCH /api/appointments` cập nhật `status = 'CANCELLED'`.
  - Backend tự động tạo bản ghi `Notification` gửi cho Quản lý thông báo:
    > *"Lịch hẹn của bệnh nhân [Tên BN] ([Tên Chuyên Khoa]) ngày [Ngày] lúc [Giờ] đã bị hủy."*
  - Khung giờ bị hủy ngay lập tức được giải phóng khỏi danh sách bận (vì các truy vấn kiểm tra trùng lịch luôn loại trừ `status = 'CANCELLED'`), cho phép bệnh nhân khác có thể đặt ngay vào khung giờ đó.

---

### Luồng 9: Trung Tâm Thông Báo Thời Gian Thực (Real-time Notification Dispatching)
Hệ thống thông báo (`Notification`) phục vụ việc kết nối giữa Bác sĩ, Bệnh nhân và Quản trị viên:
- **Loại `NEW_BOOKING`:** Bắn thông báo về Admin mỗi khi có bệnh nhân mới đặt lịch trực tuyến.
- **Loại `URGENT_DOCTOR_BUSY`:** Bắn cảnh báo khẩn cấp khi bác sĩ kích hoạt báo bận.
- **Loại `CANCELLED`:** Báo động khi có ca khám bị hủy.
- **Cơ chế đánh dấu đã đọc:** Admin có thể đánh dấu đã đọc từng thông báo hoặc toàn bộ danh sách thông qua API `PUT /api/notifications`.

---

## 5. SƠ ĐỒ LUỒNG DỮ LIỆU & TRÌNH TỰ THỰC THI

### Sơ đồ 1: Luồng Phân công Bác sĩ cho lịch khám tự động
```
[Bệnh Nhân]            [Lễ Tân / Admin]           [Admin Portal UI]         [API /appointments/assign]       [SQLite DB]
     |                        |                          |                             |                          |
     |-- 1. Đặt lịch AUTO --->|                          |                             |                          |
     |   (Status: PENDING)    |-- 2. Xem danh sách ----->|                             |                          |
     |                        |   lịch hẹn chờ           |                             |                          |
     |                        |-- 3. Bấm Phân Bác Sĩ --->|                             |                          |
     |                        |   (Chọn BS cùng khoa)    |-- 4. POST /assign --------->|                          |
     |                        |                          |   (appointmentId, doctorId) |                          |
     |                        |                          |                             |-- 5. Query conflict ---->|
     |                        |                          |                             |   (same date, time, doc) |
     |                        |                          |                             |<-- 6. No Conflict -------|
     |                        |                          |                             |-- 7. Update status ----->|
     |                        |                          |                             |   (status=CONFIRMED)     |
     |                        |                          |<-- 8. HTTP 200 OK ----------|<--- 8. Commit Success ---|
     |                        |<-- 9. Toast Thành Công --|                             |                          |
     |<-- 10. Xem BS Phụ Trách                           |                             |                          |
```

### Sơ đồ 2: Luồng Điều phối khẩn cấp 4 bên khi Bác sĩ báo bận
```
[Bác Sĩ]            [SQLite DB]           [Admin / Lễ Tân (UI)]         [API /appointments/reassign]       [Bệnh Nhân (UI)]
   |                     |                         |                                  |                           |
   |-- 1. Báo bận khẩn ->|                         |                                  |                           |
   |   (status=NEEDS_    |-- 2. Alert Badge ------>|                                  |                           |
   |    REASSIGNMENT)    |   (Nút đỏ nhấp nháy)    |                                  |                           |
   |                     |                         |-- 3. Bấm "Phân BS Thay Thế" ---->|                           |
   |                     |                         |   (Chọn BS mới, ngày, giờ mới)   |                           |
   |                     |                         |-- 4. POST /appointments/reassign |                           |
   |                     |                         |                                  |-- 5. Conflict Check ----->|
   |                     |                         |                                  |<-- 6. Passed -------------|
   |                     |                         |                                  |-- 7. Update Appt -------->|
   |                     |                         |                                  |   (status=CONFIRMED)      |
   |                     |                         |<-- 8. HTTP 200 OK ---------------|<-- 8. Success ------------|
   |                     |                         |-- 9. Toast: "Đổi BS thành công"  |                           |
   |                     |                         |                                  |                           |<-- 10. Thấy BS mới
```

### Sơ đồ 3: Luồng Onboarding Bác Sĩ Mới & Tự Động Sinh Lịch Trực
```
[Quản Trị Viên]            [Admin Portal (UI)]               [API /api/doctors]                [SQLite Database]
       |                            |                                |                                 |
       |--- 1. Bấm Thêm Bác Sĩ ---->|                                |                                 |
       |--- 2. Nhập thông tin & --->|--- 3. POST /api/doctors ------>|                                 |
       |       submit form          |   (fullName, email, fee, bio...)                                |
       |                            |                                |--- 4. Bcrypt.hash('password123')|
       |                            |                                |--- 5. Create User (DOCTOR) ---->|
       |                            |                                |--- 6. Create DoctorInfo ------->|
       |                            |                                |--- 7. Loop Mon -> Fri: -------->|
       |                            |                                |       Create 5x DoctorSchedule  |
       |                            |                                |       (08:00 - 17:00, 30m slots)|
       |                            |<-- 8. HTTP 201 Created --------|<--- 9. Hoàn tất chuỗi ghi DB ---|
       |<-- 10. Toast Thành Công ---|                                |                                 |
       |    (Thẻ BS mới xuất hiện)  |                                |                                 |
```

### Sơ đồ 4: Luồng Xóa / Cho Thôi Công Tác Bác Sĩ An Toàn (Safe Delete Doctor Workflow)
```
[Quản Trị Viên]            [Admin Portal (UI)]               [API /api/doctors (DELETE)]       [SQLite Database]
       |                            |                                |                                 |
       |--- 1. Bấm Icon Xóa (Trash)->|                               |                                 |
       |--- 2. Mở Modal Cảnh Báo --->|                               |                                 |
       |--- 3. Xác nhận Xóa -------->|--- 4. DELETE /api/doctors ---->|                                 |
       |                            |      (?id=doctorId)            |--- 5. Update Appt chờ: -------->|
       |                            |                                |       status=NEEDS_REASSIGNMENT |
       |                            |                                |       doctorId=null             |
       |                            |                                |--- 6. Delete DoctorSchedule --->|
       |                            |                                |--- 7. Delete DoctorInfo & User->|
       |                            |                                |--- 8. Create Admin Notif ------>|
       |                            |<-- 9. HTTP 200 OK -------------|<--- 9. Success Commit ----------|
       |<-- 10. Toast Thành Công ---|                                |                                 |
       |    (Kích hoạt nút Đổi BS)  |                                |                                 |
```

### Sơ đồ 5: Luồng Xóa / Dọn Dẹp Chuyên Khoa An Toàn (Safe Delete Specialty Workflow)
```
[Quản Trị Viên]            [Admin Portal (UI)]               [API /api/specialties (DELETE)]   [SQLite Database]
       |                            |                                |                                 |
       |--- 1. Bấm Icon Xóa (Trash)->|                               |                                 |
       |--- 2. Modal Cảnh Báo Nguy Cơ|                               |                                 |
       |       (Hiện số BS & ca hẹn)|                               |                                 |
       |--- 3. Xác nhận Xóa -------->|--- 4. DELETE /api/specialties->|                                 |
       |                            |      (?id=specialtyId)         |--- 5. Delete Schedules của BS-->|
       |                            |                                |--- 6. Clean Appts & Records --->|
       |                            |                                |--- 7. Delete DoctorInfo & Users>|
       |                            |                                |--- 8. Delete Specialty -------->|
       |                            |                                |--- 9. Create Admin Notif ------>|
       |                            |<-- 10. HTTP 200 OK ------------|<--- 10. Hoàn tất chuỗi xóa DB---|
       |<-- 11. Toast Thành Công ---|                                |                                 |
```

---

## 6. DANH SÁCH CÁC ENDPOINT API PHỤC VỤ PHÂN HỆ QUẢN TRỊ

| Phương thức | Đường dẫn API | Mục đích nghiệp vụ & Tham số xử lý |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Xác thực người dùng hiện tại, kiểm tra vai trò `role === 'ADMIN'`, lấy `fullName` và `avatarUrl`. |
| `GET` | `/api/admin/stats` | Trả về dữ liệu tổng hợp KPI (tổng hôm nay, hoàn thành, chờ phân, đã hủy, cần đổi gấp), phân bổ chuyên khoa và xu hướng 7 ngày. |
| `GET` | `/api/appointments` | Truy vấn toàn bộ lịch khám. Hỗ trợ query params: `?status=...&specialtyId=...&doctorId=...&date=...`. |
| `POST` | `/api/appointments/assign` | Phân công bác sĩ cho ca khám `PENDING`. Body: `{ appointmentId, doctorId }`. Tự động kiểm tra conflict và chuyển sang `CONFIRMED`. |
| `POST` | `/api/appointments/reassign` | Đổi bác sĩ thay thế và dời lịch cho ca `NEEDS_REASSIGNMENT`. Body: `{ appointmentId, doctorId, appointmentDate?, appointmentTime? }`. |
| `PATCH` | `/api/appointments` | Cập nhật thông tin bổ sung, dời ngày giờ hoặc hủy lịch khám (`status = 'CANCELLED'`). Tự động phát thông báo hủy ca. |
| `GET` | `/api/specialties` | Lấy danh sách toàn bộ chuyên khoa kèm số lượng bác sĩ và lịch hẹn trực thuộc (`_count: { doctors, appointments }`). |
| `POST` | `/api/specialties` | Tạo mới chuyên khoa khám bệnh với chống trùng tên. Body: `{ name, description, iconUrl? }`. |
| `PUT` | `/api/specialties` | Chỉnh sửa thông tin chuyên khoa (Tên, Biểu tượng, Mô tả bệnh lý). Body: `{ id, name, description, iconUrl }`. |
| `DELETE` | `/api/specialties` | Xóa an toàn chuyên khoa (`?id=...`). Tự động dọn dẹp lịch trực, ca khám và tài khoản bác sĩ trực thuộc. |
| `GET` | `/api/doctors` | Lấy danh sách toàn bộ hồ sơ bác sĩ kèm chuyên khoa và lịch trực. Hỗ trợ lọc `?specialtyId=...`. |
| `POST` | `/api/doctors` | Khởi tạo tài khoản Bác sĩ mới + Hồ sơ DoctorInfo + Tự động sinh 5 lịch trực tuần (Thứ 2 - Thứ 6). |
| `PUT` | `/api/doctors` | Cập nhật thông tin bác sĩ (Họ tên, Email, SĐT, Chuyên khoa, Học vị, Kinh nghiệm, Giá khám, Tiểu sử, Avatar). |
| `DELETE` | `/api/doctors` | Xóa/cho thôi công tác bác sĩ (`?id=...`). Tự động chuyển ca khám đang chờ sang `NEEDS_REASSIGNMENT` và hủy lịch trực. |
| `GET` | `/api/notifications` | Lấy 20 thông báo mới nhất gửi đến tài khoản quản trị viên. |
| `PUT` | `/api/notifications` | Đánh dấu một hoặc tất cả thông báo của Admin là đã đọc (`isRead = true`). |

---

## 7. CÁC ĐIỂM NHẤN VỀ TRẢI NGHIỆM & THIẾT KẾ UI/UX

1. **Giao diện Trung tâm Chỉ huy Đẳng cấp (Command Center Dark Aesthetics):**
   - Header bảng điều khiển sử dụng tông nền tối `bg-slate-900` kết hợp viền `border-slate-800` và huy hiệu `Badge emerald`, tôn vinh vị thế quản trị của người dùng.
2. **Cảnh báo Thông minh Phản xạ Nhanh (Reactive Emergency UI):**
   - Khi có bất kỳ bác sĩ nào báo bận, nút đỏ **`Có X Lịch Cần Đổi Bác Sĩ Gấp!`** tự động xuất hiện với hiệu ứng chuyển động nhún nảy `animate-bounce` và chuyển trực tiếp người dùng đến tab giải quyết sự cố chỉ bằng 1 click.
3. **Trực quan hóa Dữ liệu Tương tác (Interactive Charting):**
   - Hệ thống biểu đồ `Recharts` tích hợp Tooltip tùy biến và Grid kẻ mờ giúp người quản lý phân tích khối lượng tải công việc và phát hiện chuyên khoa quá tải chỉ trong vài giây.
4. **Cơ chế Chống Lỗi Tuyệt Đối (Safe Guardrails):**
   - Modal phân công và đổi bác sĩ tự động lọc danh sách chỉ hiển thị các bác sĩ cùng chuyên khoa tương ứng, đồng thời Backend chặn hoàn toàn tình trạng đặt trùng khung giờ với mã lỗi rõ ràng.
5. **Đồng bộ Thời gian Thực (Seamless React State Synchronization):**
   - Sau mỗi thao tác (phân công, đổi lịch, thêm chuyên khoa, thêm bác sĩ), hàm `loadAdminData()` tự động tái đồng bộ dữ liệu mà không cần tải lại toàn bộ trang (Zero Full Page Reload).

---

## 8. DANH MỤC TÀI KHOẢN QUẢN LÝ MẪU & HƯỚNG DẪN VẬN HÀNH

Hệ thống được cấu hình sẵn 2 tài khoản quản trị cấp cao phụ trách điều hành phòng khám:

| STT | Họ và Tên | Chức Danh / Vai Trò | Email Đăng Nhập | Số Điện Thoại | Mật Khẩu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **BS. Trần Văn Hùng** | Quản Lý Phụ Trách Phòng Khám | `admin@clinic.com` | `0909000001` | `password123` |
| 2 | **Nguyễn Thị Mai** | Trưởng Bộ Phận Lễ Tân & Điều Phối | `receptionist@clinic.com` | `0909000002` | `password123` |

### Hướng Dẫn Vận Hành Thường Nhật Dành Cho Lễ Tân:
1. **Đầu ca làm việc (07:30 sáng):**
   - Đăng nhập vào `/admin` bằng tài khoản `receptionist@clinic.com`.
   - Kiểm tra thẻ **"Tổng Hôm Nay"** để nắm số ca hẹn khám trong ngày.
   - Kiểm tra thẻ **"Chờ Phân Bác Sĩ"**: nếu có ca `PENDING`, bấm phân công bác sĩ phụ trách ngay để bệnh nhân nhận được thông tin xác nhận.
2. **Trong ca làm việc:**
   - Theo dõi thanh cảnh báo đỏ: nếu xuất hiện thông báo đổi lịch khẩn, ưu tiên xử lý ngay tại tab **"Xử Lý Đổi Lịch Khẩn"**.
   - Phối hợp với bệnh nhân qua số điện thoại hiển thị trên bảng nếu cần điều chỉnh lại giờ khám.
3. **Mở rộng phòng khám:**
   - Khi có bác sĩ mới gia nhập hoặc mở thêm chuyên khoa, sử dụng các nút **"+ Thêm Chuyên Khoa Mới"** và **"+ Thêm Bác Sĩ Mới"** để hệ thống tự động thiết lập toàn bộ tài khoản và lịch trực mà không cần can thiệp thủ công vào cơ sở dữ liệu.

---
*Tài liệu được biên soạn và cập nhật theo phiên bản hệ thống Phòng Khám CarePlus+ 2026.*
