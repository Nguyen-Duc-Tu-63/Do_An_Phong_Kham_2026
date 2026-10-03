# ⏱️ TÀI LIỆU THIẾT KẾ SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAM SPECIFICATION)
## DỰ ÁN: HỆ THỐNG QUẢN LÝ & ĐẶT LỊCH PHÒNG KHÁM ĐA KHOA CAREPLUS 2026

---

## 📌 TỔNG QUAN VỀ SƠ ĐỒ TUẦN TỰ TRONG ĐỒ ÁN
Sơ đồ tuần tự (Sequence Diagram) là biểu đồ tương tác (Interaction Diagram) quan trọng nhất trong chuẩn UML, mô tả **trật tự giao tiếp theo trục thời gian (từ trên xuống dưới)** giữa các thành phần:
* **Tác nhân (Actor)**: Bệnh nhân, Bác sĩ, Quản trị viên.
* **Giao diện người dùng (Frontend UI / Client View)**: Next.js App Router (React Components, State, Form Hooks).
* **Bộ điều phối API (API Route Handler / Controller)**: Next.js Backend Endpoints (`/api/...`).
* **Tầng nghiệp vụ & Dịch vụ ngoài (Backend Service & External APIs)**: Services, RBAC Auth, Google Gemini AI.
* **Tầng truy cập dữ liệu & Cơ sở dữ liệu (ORM & Database)**: Prisma ORM Client & SQLite (`dev.db`).

Tài liệu này chuẩn hóa **5 kịch bản tuần tự đắt giá nhất** cho báo cáo đồ án tốt nghiệp:
1. **Kịch bản 1**: Đặt lịch khám bệnh trực tuyến & Tính toán slot trống (Online Appointment Booking).
2. **Kịch bản 2**: Đăng nhập, Xác thực danh tính & Cấp quyền phiên làm việc (Authentication & RBAC Session).
3. **Kịch bản 3**: Bác sĩ tiến hành khám bệnh & Kê đơn thuốc điện tử (Clinical Consultation & E-Prescription).
4. **Kịch bản 4**: Trợ lý ảo AI Chatbot tư vấn triệu chứng & Phân luồng y tế (AI Chatbot Consultation & Triage).
5. **Kịch bản 5**: Quản trị viên điều phối lại bác sĩ khi ca trực bị sự cố (Urgent Appointment Reassignment).

---

## 1. SƠ ĐỒ TUẦN TỰ 1: ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN (BOOKING ENGINE)
> **Mô tả**: Thể hiện quy trình 2 pha: (1) Tính toán và tải danh sách slot giờ trống trong CSDL; (2) Gửi form đặt lịch, kiểm tra xung đột trùng lịch và lưu phiếu hẹn.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as 🧑‍💼 Bệnh nhân
    participant UI as 🖥️ Frontend (book/page.tsx)
    participant API as 🔌 API Route (/api/appointments)
    participant Service as ⚙️ AppointmentService
    participant DB as 🗄️ Prisma ORM & Database

    %% Pha 1: Lấy danh sách slot khả dụng
    Note over Patient, DB: PHA 1: KIỂM TRA & TÍNH TOÁN SLOT GIỜ KHẢ DỤNG
    Patient->>UI: Chọn Chuyên khoa, Bác sĩ và Ngày khám mong muốn
    UI->>API: GET /api/appointments/available-slots?date=...&specialtyId=...&doctorId=...
    API->>Service: calculateAvailableSlots(date, specialtyId, doctorId)
    Service->>DB: prisma.schedule.findMany (Lịch trực bác sĩ trong ngày)
    DB-->>Service: Danh sách ca trực (Sáng: 08:00-11:30, Chiều: 13:30-17:00)
    Service->>DB: prisma.appointment.findMany (Lịch đã đặt của ngày đó)
    DB-->>Service: Các khung giờ đã có lịch hẹn (CONFIRMED / PENDING)
    Service->>Service: Thuật toán so khớp: Loại trừ giờ bận, tính slot còn trống
    Service-->>API: Danh sách slots khả dụng [{time: "08:30", available: true},...]
    API-->>UI: 200 OK (Mảng slot giờ)
    UI-->>Patient: Render giao diện chọn khung giờ khám

    %% Pha 2: Xác nhận đặt lịch
    Note over Patient, DB: PHA 2: ĐIỀN THÔNG TIN & XÁC NHẬN ĐẶT LỊCH
    Patient->>UI: Chọn khung giờ, nhập thông tin cá nhân & bấm "Xác nhận đặt lịch"
    UI->>UI: Kiểm tra dữ liệu đầu vào (Zod Schema Validation)
    
    alt Dữ liệu không hợp lệ (Sai SĐT, thiếu tên)
        UI-->>Patient: Báo lỗi trực tiếp trên giao diện form
    else Dữ liệu hợp lệ
        UI->>API: POST /api/appointments (Payload: fullName, phone, doctorId, date, time,...)
        API->>Service: createAppointment(bookingData)
        
        %% Double booking check
        Service->>DB: prisma.appointment.findFirst (Kiểm tra slot vừa chọn có bị đặt trước không)
        DB-->>Service: Kết quả kiểm tra
        
        alt Slot giờ vừa bị người khác đặt trước
            Service-->>API: Conflict Error (Slot không còn khả dụng)
            API-->>UI: 409 Conflict: "Khung giờ này vừa có người đặt, vui lòng chọn giờ khác"
            UI-->>Patient: Hiển thị cảnh báo và làm mới lại danh sách slot
        else Slot vẫn còn trống
            Service->>DB: prisma.appointment.create (Lưu lịch hẹn mới: status = 'CONFIRMED'/'PENDING')
            DB-->>Service: Bản ghi Appointment đã tạo thành công
            Service->>DB: prisma.notification.create (Tạo thông báo xác nhận lịch hẹn)
            DB-->>Service: Notification saved
            Service-->>API: Đối tượng Appointment hoàn chỉnh
            API-->>UI: 201 Created (Kèm Appointment ID)
            UI-->>Patient: Hiển thị màn hình Chúc mừng & Mã phiếu khám bệnh
        end
    end
```

---

## 2. SƠ ĐỒ TUẦN TỰ 2: ĐĂNG NHẬP, XÁC THỰC DANH TÍNH & PHÂN QUYỀN (RBAC)
> **Mô tả**: Thể hiện quy trình bảo mật đăng nhập: kiểm tra tài khoản, xác thực mật khẩu băm bcrypt, cấp cookie HttpOnly và điều hướng theo phân quyền vai trò.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Người dùng
    participant UI as 🖥️ Frontend (login/page.tsx)
    participant API as 🔌 API Route (/api/auth/login)
    participant DB as 🗄️ Prisma ORM & Database
    participant Browser as 🍪 Trình duyệt (Cookie Store)

    User->>UI: Nhập Số điện thoại & Mật khẩu, bấm "Đăng nhập"
    UI->>API: POST /api/auth/login { phone, password }
    API->>DB: prisma.user.findFirst({ where: { phone } })
    DB-->>API: Trả về bản ghi User (id, passwordHash, role, fullName)
    
    alt Không tìm thấy tài khoản
        API-->>UI: 401 Unauthorized: "Số điện thoại không tồn tại trong hệ thống"
        UI-->>User: Hiển thị thông báo lỗi màu đỏ
    else Tìm thấy tài khoản
        API->>API: Gọi hàm bcrypt.compare(password, user.passwordHash)
        
        alt Mật khẩu không chính xác
            API-->>UI: 401 Unauthorized: "Mật khẩu không chính xác"
            UI-->>User: Hiển thị thông báo lỗi
        else Mật khẩu khớp hoàn toàn
            API->>API: Đóng gói User Session Token { id, fullName, role, email }
            API->>Browser: Set-Cookie: phongkham_session_user=...; HttpOnly; Path=/; SameSite=Lax
            API-->>UI: 200 OK { success: true, user: { id, fullName, role } }
            
            Note over UI, User: Điều hướng trang theo Phân quyền (Role-based Navigation)
            alt role === 'ADMIN'
                UI->>UI: router.push('/admin')
            else role === 'DOCTOR'
                UI->>UI: router.push('/doctor')
            else role === 'PATIENT'
                UI->>UI: router.push('/dashboard')
            end
            UI-->>User: Hiển thị Cổng thông tin tương ứng với vai trò
        end
    end
```

---

## 3. SƠ ĐỒ TUẦN TỰ 3: BÁC SĨ KHÁM BỆNH & KÊ ĐƠN THUỐC ĐIỆN TỬ
> **Mô tả**: Thể hiện giao dịch y tế hoàn chỉnh: Bác sĩ nhập triệu chứng, chẩn đoán, kê danh mục thuốc và hệ thống thực hiện Database Transaction để bảo toàn dữ liệu.

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as 👨‍⚕️ Bác sĩ
    participant UI as 🖥️ Bàn khám Bác sĩ (/doctor)
    participant API as 🔌 API Route (/api/medical-records)
    participant Auth as 🛡️ Server Auth (getCurrentUser)
    participant DB as 🗄️ Prisma ORM (Database Transaction)
    participant Patient as 🧑‍💼 Bệnh nhân

    Doctor->>UI: Mở ca khám của bệnh nhân trong hàng chờ
    UI-->>Doctor: Hiển thị form: Tiền sử, Triệu chứng, Chẩn đoán, Danh mục thuốc
    Doctor->>UI: Nhập triệu chứng, kết luận chẩn đoán, kê đơn thuốc và bấm "Hoàn tất ca khám"
    UI->>API: POST /api/medical-records { appointmentId, symptoms, diagnosis, prescriptions: [...] }
    
    API->>Auth: getCurrentUser() (Xác thực bác sĩ từ Session Cookie)
    Auth-->>API: UserSession (role: 'DOCTOR', doctorId: 'doc-123')
    
    alt Người dùng không phải Bác sĩ
        API-->>UI: 403 Forbidden: "Bạn không có quyền thực hiện nghiệp vụ khám bệnh"
        UI-->>Doctor: Báo lỗi quyền truy cập
    else Xác thực Bác sĩ thành công
        API->>DB: prisma.$transaction([ Tạo MedicalRecord, Tạo PrescriptionItems, Cập nhật Appointment ])
        
        critical Thực hiện giao dịch an toàn dữ liệu (Atomic Transaction)
            DB->>DB: 1. Tạo bản ghi MedicalRecord (symptoms, diagnosis, doctorId, patientId)
            DB->>DB: 2. Thêm từng phần tử thuốc vào bảng PrescriptionItem
            DB->>DB: 3. Cập nhật Appointment.status = 'COMPLETED'
            DB->>DB: 4. Tạo bản ghi Notification thông báo cho Bệnh nhân
        end
        
        DB-->>API: Giao dịch thành công hoàn toàn
        API-->>UI: 201 Created (Bệnh án & Đơn thuốc đã lưu)
        UI-->>Doctor: Hiển thị thông báo hoàn tất ca khám, tự động cập nhật hàng chờ
        
        Note over Patient, DB: Bệnh nhân nhận kết quả khám
        Patient->>UI: Mở trang Cổng bệnh nhân (/dashboard)
        UI->>API: GET /api/appointments?patientId=...
        API->>DB: Lấy lịch sử khám kèm MedicalRecord & Prescriptions
        DB-->>API: Dữ liệu hồ sơ bệnh án
        API-->>UI: 200 OK
        UI-->>Patient: Hiển thị Đơn thuốc điện tử & Lời dặn của Bác sĩ
    end
```

---

## 4. SƠ ĐỒ TUẦN TỰ 4: TRỢ LÝ ẢO AI CHATBOT TƯ VẤN Y TẾ (AI TRIAGE)
> **Mô tả**: Thể hiện quy trình tích hợp Trí tuệ nhân tạo (Google Gemini) xử lý ngôn ngữ tự nhiên, phân tích triệu chứng y tế và điều hướng khám bệnh.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Người dùng
    participant Widget as 💬 AI Chat Widget (AIChatBot.tsx)
    participant API as 🔌 API Route (/api/ai-chat)
    participant Triage as ⚡ Emergency Filter
    participant Gemini as 🧠 Google Gemini AI Engine
    participant DB as 🗄️ Prisma Database

    User->>Widget: Nhập triệu chứng: "Tôi bị đau tức ngực bên trái, lan ra sau lưng"
    Widget->>API: POST /api/ai-chat { message: "Tôi bị đau tức ngực bên trái..." }
    
    API->>Triage: Quét tập từ khóa dấu hiệu nguy hiểm (Cấp cứu)
    
    alt Phát hiện nguy cơ cấp cứu khẩn cấp (Emergency: Đột quỵ, Đau ngực dữ dội, Khó thở sâu)
        Triage-->>API: Trigger Emergency Mode
        API-->>Widget: 200 OK { text: "CẢNH BÁO NGUY HIỂM...", isEmergency: true, hotline: "115" }
        Widget-->>User: Hiển thị thẻ đỏ cảnh báo khẩn cấp + Nút bấm gọi ngay Hotline cấp cứu 115
    else Triệu chứng thông thường
        Triage-->>API: Triệu chứng an toàn, chuyển sang AI xử lý
        API->>DB: prisma.specialty.findMany (Lấy danh mục 10 Chuyên khoa & Mô tả)
        DB-->>API: Danh sách chuyên khoa
        
        API->>Gemini: Gửi Prompt (Vai trò Bác sĩ tư vấn sơ bộ + Triệu chứng người dùng + Danh mục khoa)
        Gemini-->>API: Trả về: (1) Phân tích sơ bộ, (2) Chuyên khoa phù hợp nhất: 'Khoa Tim Mạch'
        
        API->>DB: prisma.doctorInfo.findMany (Lấy các bác sĩ tiêu biểu thuộc Khoa Tim Mạch)
        DB-->>API: Danh sách bác sĩ chuyên khoa Tim mạch
        
        API-->>Widget: 200 OK { text: "...", suggestedSpecialty: "Tim Mạch", suggestedDoctors: [...] }
        Widget-->>User: Hiển thị câu trả lời tư vấn + Thẻ gợi ý Khoa Tim Mạch + Nút "Đặt lịch ngay"
        
        User->>Widget: Bấm nút "Đặt lịch ngay với Chuyên khoa Tim Mạch"
        Widget->>Widget: Điều hướng người dùng sang trang /book?specialtyId=cardio-id
    end
```

---

## 5. SƠ ĐỒ TUẦN TỰ 5: ĐIỀU PHỐI LẠI BÁC SĨ KHI CA TRỰC BIẾN ĐỘNG (REASSIGNMENT)
> **Mô tả**: Thể hiện cơ chế phục hồi hệ thống khi Bác sĩ báo bận đột xuất, chuyển lịch hẹn sang trạng thái `NEEDS_REASSIGNMENT` và Quản trị viên can thiệp điều phối.

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as 👨‍⚕️ Bác sĩ gặp sự cố
    actor Admin as 🛠️ Quản trị viên
    participant UI as 🖥️ Cổng Quản Trị (/admin)
    participant API as 🔌 API Endpoints
    participant DB as 🗄️ Prisma Database
    actor Patient as 🧑‍💼 Bệnh nhân

    %% Bác sĩ báo bận
    Doctor->>API: POST /api/doctor/urgent-unavailability { reason: "Cấp cứu viện ngoài", date: "2026-10-04" }
    API->>DB: prisma.appointment.updateMany (status: 'NEEDS_REASSIGNMENT')
    DB-->>API: Đã chuyển trạng thái các ca khám bị ảnh hưởng
    API-->>Doctor: 200 OK (Đã ghi nhận lịch nghỉ đột xuất)

    %% Quản trị viên nhận thông báo và điều phối
    DB->>UI: Dashboard Admin hiển thị cảnh báo: "Có ca khám cần điều phối gấp!"
    Admin->>UI: Bấm vào ca khám bị kẹt (status == 'NEEDS_REASSIGNMENT')
    UI->>API: GET /api/doctors?specialtyId=spec-id (Lấy danh sách bác sĩ cùng chuyên khoa)
    API->>DB: Lấy danh sách bác sĩ thay thế khả dụng
    DB-->>API: Danh sách bác sĩ
    API-->>UI: 200 OK
    
    UI-->>Admin: Hiển thị Modal danh sách bác sĩ thay thế cùng chuyên khoa
    Admin->>UI: Chọn Bác sĩ thay thế mới & bấm "Xác nhận điều phối"
    UI->>API: POST /api/appointments/reassign { appointmentId, newDoctorId }
    
    API->>DB: prisma.appointment.update({ where: { id }, data: { doctorId: newDoctorId, status: 'CONFIRMED' } })
    DB-->>API: Lịch hẹn đã được cập nhật sang Bác sĩ mới
    
    API->>DB: prisma.notification.create (Gửi thông báo đổi bác sĩ cho Bệnh nhân)
    DB-->>API: Đã gửi thông báo
    API-->>UI: 200 OK (Điều phối thành công)
    UI-->>Admin: Cập nhật lại giao diện, trạng thái trở về 'CONFIRMED'
    
    %% Bệnh nhân nhận thông báo
    DB-->>Patient: Thông báo: "Lịch hẹn ngày 04/10 của bạn đã được chuyển sang BS. Nguyễn Văn B tiếp nhận."
```

---

## 6. HƯỚNG DẪN TRÌNH BÀY TRONG BÁO CÁO ĐỒ ÁN
* **Vị trí đề xuất trong Báo cáo**:
  * Đặt tại **Chương 4: Thiết kế chi tiết hệ thống ➔ Mục 4.2: Biểu đồ tuần tự cho các ca sử dụng chính**.
* **Cách thức xuất ảnh chất lượng cao**:
  * Sao chép mã nguồn `mermaid` của từng sơ đồ vào công cụ [Mermaid Live Editor](https://mermaid.live) hoặc [Draw.io](https://app.diagrams.net).
  * Xuất ảnh định dạng PNG (độ phân giải cao) hoặc vector SVG để chèn vào tài liệu báo cáo Word/PDF mà không bị vỡ nét.
