# 📊 TÀI LIỆU THIẾT KẾ SƠ ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAM SPECIFICATION)
## DỰ ÁN: HỆ THỐNG QUẢN LÝ & ĐẶT LỊCH PHÒNG KHÁM ĐA KHOA CAREPLUS 2026

---

## 📌 TỔNG QUAN VỀ SƠ ĐỒ HOẠT ĐỘNG TRONG ĐỒ ÁN
Sơ đồ hoạt động (Activity Diagram) trong UML mô tả các luồng nghiệp vụ (Business Workflows) động của hệ thống, bao gồm các bước tuần tự, các điểm rẽ nhánh điều kiện (Decision Points), các luồng song song (Fork/Join) và các bên tham gia thông qua kỹ thuật **Phân làn trách nhiệm (Swimlanes / Partitions)**.

Trong đồ án phòng khám CarePlus 2026, có **5 quy trình nghiệp vụ cốt lõi** cần được mô hình hóa:
1. **Quy trình 1**: Đặt lịch khám bệnh trực tuyến & Tính toán slot trống (Core Booking Engine).
2. **Quy trình 2**: Bác sĩ tiến hành khám bệnh & Kê đơn thuốc điện tử (Clinical Consultation).
3. **Quy trình 3**: Trợ lý ảo AI Chatbot tư vấn triệu chứng & Phân luồng chuyên khoa (AI Triage).
4. **Quy trình 4**: Báo bận đột xuất & Điều phối lại bác sĩ khám (Urgent Reassignment).
5. **Quy trình 5**: Đăng ký, Đăng nhập & Phân quyền truy cập (Authentication & RBAC).

---

## 1. SƠ ĐỒ HOẠT ĐỘNG 1: ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN
> **Mục tiêu**: Thể hiện toàn bộ quy trình người bệnh lựa chọn dịch vụ, hệ thống kiểm tra tình trạng slot giờ trống trong CSDL và phát hành phiếu hẹn.

```mermaid
graph TD
    Start([● Bắt đầu: Truy cập /book]) --> Step1[Chọn 1 trong 10 Chuyên khoa khám]
    Step1 --> DecisionType{Hình thức chọn bác sĩ?}
    
    DecisionType -->|Tự chọn bác sĩ| Step2A[Chọn Bác sĩ từ danh sách]
    DecisionType -->|Hệ thống tự xếp| Step2B[Đánh dấu AUTO_ASSIGN]
    
    Step2A --> Step3[Chọn Ngày khám bệnh]
    Step2B --> Step3
    
    Step3 --> API_Slots[Gửi Request GET /api/appointments/available-slots]
    API_Slots --> QueryDB[(Truy vấn Lịch trực & Các lịch hẹn đã đặt)]
    QueryDB --> CalcSlots[Tính toán số lượng slot còn trống từng khung giờ]
    
    CalcSlots --> DisplaySlots[Hiển thị danh sách khung giờ sáng / chiều]
    DisplaySlots --> CheckAvailable{Còn slot trống không?}
    
    CheckAvailable -->|Hết tất cả slot| NoticeFull[Thông báo: Ngày này đã kín lịch. Vui lòng chọn ngày khác]
    NoticeFull --> Step3
    
    CheckAvailable -->|Còn slot khả dụng| Step4[Người bệnh chọn khung giờ mong muốn]
    Step4 --> Step5[Nhập thông tin: Họ tên, Số điện thoại, Email, Ghi chú triệu chứng]
    
    Step5 --> ValidateForm{Kiểm tra tính hợp lệ - Zod Validation}
    ValidateForm -->|Dữ liệu không hợp lệ| ShowFormError[Hiển thị lỗi: SĐT sai định dạng / Thiếu thông tin]
    ShowFormError --> Step5
    
    ValidateForm -->|Dữ liệu chuẩn xác| ConfirmModal[Hiển thị Modal tóm tắt phiếu đặt lịch]
    ConfirmModal --> UserConfirm{Xác nhận đặt lịch?}
    
    UserConfirm -->|Hủy bỏ / Sửa lại| Step4
    UserConfirm -->|Đồng ý đặt| PostBooking[Gửi POST /api/appointments]
    
    PostBooking --> CreateDB[(Tạo mới Appointment với trạng thái PENDING/CONFIRMED)]
    CreateDB --> GenSuccess[Trả về mã lịch hẹn & Cập nhật UI thông báo thành công]
    GenSuccess --> End([● Kết thúc: Chuyển hướng về Dashboard / Chi tiết lịch hẹn])
```

### 💡 Quy tắc nghiệp vụ (Business Rules) áp dụng:
* **Khóa ngày quá khứ**: Không cho phép chọn ngày nhỏ hơn ngày hiện tại (`appointmentDate >= today`).
* **Tính toán slot trống**: Mỗi ca khám có thời lượng quy chuẩn (ví dụ: 30 phút/slot). Slot đã có lịch hẹn được xác nhận sẽ bị vô hiệu hóa (disabled).
* **Auto-assign engine**: Nếu chọn `AUTO_ASSIGN`, hệ thống tự động tìm bác sĩ thuộc chuyên khoa có ít lịch hẹn nhất trong khung giờ đó để cân bằng tải.

---

## 2. SƠ ĐỒ HOẠT ĐỘNG 2: BÁC SĨ KHÁM BỆNH & KÊ ĐƠN THUỐC ĐIỆN TỬ
> **Mục tiêu**: Thể hiện quy trình làm việc chuẩn y khoa tại bàn khám bệnh (`/doctor`) của Bác sĩ.

```mermaid
graph TD
    StartDoc([● Bắt đầu ca trực: Bác sĩ truy cập /doctor]) --> ViewQueue[Xem danh sách bệnh nhân có lịch hẹn trong ngày]
    ViewQueue --> SelectPatient[Chọn bệnh nhân kế tiếp trong danh sách chờ]
    
    SelectPatient --> OpenExamModal[Mở giao diện Khám bệnh & Bệnh án]
    OpenExamModal --> InputSymptoms[Bác sĩ ghi nhận triệu chứng & tiền sử bệnh]
    InputSymptoms --> InputDiagnosis[Nhập kết luận Chẩn đoán y khoa]
    
    InputDiagnosis --> AddPrescription{Bệnh nhân có cần kê đơn thuốc không?}
    
    AddPrescription -->|Có kê đơn| LoopDrug[Thêm từng loại thuốc vào đơn]
    LoopDrug --> DrugDetail[Nhập: Tên thuốc, Hàm lượng, Liều lượng, Số ngày sử dụng]
    DrugDetail --> MoreDrug{Thêm loại thuốc khác?}
    MoreDrug -->|Còn thuốc| LoopDrug
    MoreDrug -->|Đã đủ thuốc| InputAdvice[Nhập lời dặn dò bác sĩ & Hẹn ngày tái khám]
    
    AddPrescription -->|Không cần thuốc| InputAdvice
    
    InputAdvice --> ReviewRecord[Kiểm tra lại toàn bộ hồ sơ bệnh án]
    ReviewRecord --> ConfirmSubmit[Bấm Hoàn tất ca khám]
    
    ConfirmSubmit --> SaveDB[(Lưu MedicalRecord + PrescriptionItems vào CSDL)]
    SaveDB --> UpdateAppt[(Cập nhật trạng thái Appointment = COMPLETED)]
    UpdateAppt --> NotifyPatient[Tạo bản ghi Notification gửi tới Bệnh nhân]
    NotifyPatient --> EndDoc([● Kết thúc: Ca khám hoàn thành, quay lại hàng chờ])
```

---

## 3. SƠ ĐỒ HOẠT ĐỘNG 3: TRỢ LÝ ẢO AI CHATBOT TƯ VẤN TRIỆU CHỨNG Y TẾ
> **Mục tiêu**: Thể hiện luồng tương tác thông minh giữa người bệnh và AI CareBot, tích hợp cảnh báo cấp cứu và gợi ý chuyển luồng khám.

```mermaid
graph TD
    StartAI([● Người dùng mở Widget Chatbot]) --> SendMsg[Người dùng nhập câu hỏi hoặc triệu chứng bệnh]
    SendMsg --> ClientPost[Gửi POST /api/ai-chat]
    
    ClientPost --> EmergencyFilter{Có chứa từ khóa Cấp cứu nguy kịch?}
    EmergencyFilter -->|Đau thắt ngực dữ dội, ngất xỉu, khó thở sâu, đột quỵ...| TriggerEmergency[Kích hoạt Cảnh báo Khẩn cấp]
    TriggerEmergency --> ShowHotline[Hiển thị cảnh báo đỏ + Nút gọi ngay Hotline cấp cứu 115]
    ShowHotline --> EndEmergency([● Kết thúc luồng khẩn cấp])
    
    EmergencyFilter -->|Triệu chứng thông thường| AIService[Gửi Prompt ngữ cảnh tới Google Gemini AI]
    AIService --> QuerySpec[(Truy vấn danh mục 10 Chuyên khoa & Đội ngũ Bác sĩ)]
    QuerySpec --> GenResponse[AI tổng hợp: Lời khuyên sơ bộ + Nhận diện Chuyên khoa phù hợp]
    
    GenResponse --> ReturnJSON[Trả về kết quả kèm danh sách bác sĩ chuyên khoa tiêu biểu]
    ReturnJSON --> RenderChat[Giao diện Chatbot hiển thị tin nhắn & Thẻ chuyên khoa gợi ý]
    
    RenderChat --> UserAction{Hành động tiếp theo của người dùng?}
    UserAction -->|Tiếp tục hỏi thêm| SendMsg
    UserAction -->|Bấm 'Đặt lịch với Chuyên khoa này'| RedirectBook[Chuyển hướng người dùng sang trang /book kèm chuyên khoa đã chọn]
    RedirectBook --> EndAI([● Kết thúc tư vấn, vào quy trình đặt lịch])
```

---

## 4. SƠ ĐỒ HOẠT ĐỘNG 4: XỬ LÝ BIẾN ĐỘNG CA TRỰC & ĐIỀU PHỐI LẠI BÁC SĨ (REASSIGNMENT)
> **Mục tiêu**: Thể hiện tính năng phục hồi ca trực và bảo toàn lịch hẹn của bệnh nhân khi bác sĩ gặp trường hợp bất khả kháng.

```mermaid
graph TD
    StartUrgent([● Bác sĩ phát sinh sự cố đột xuất]) --> DoctorReport[Bác sĩ gửi yêu cầu Báo bận đột xuất qua hệ thống]
    DoctorReport --> SystemFlag[(Hệ thống quét các lịch hẹn bị ảnh hưởng)]
    SystemFlag --> UpdatePending[(Chuyển trạng thái lịch hẹn sang: NEEDS_REASSIGNMENT)]
    
    UpdatePending --> AdminAlert[Phát tín hiệu cảnh báo khẩn cấp trên Dashboard Admin]
    AdminAlert --> AdminOpen[Quản trị viên mở Modal: Điều phối bác sĩ thay thế]
    
    AdminOpen --> FindReplacement[(Hệ thống lọc danh sách bác sĩ cùng chuyên khoa còn slot trống)]
    FindReplacement --> CheckReplacements{Có bác sĩ thay thế khả dụng?}
    
    CheckReplacements -->|Không có bác sĩ trống| ManualContact[Admin gọi điện trực tiếp thông báo và dời ngày khám theo ý bệnh nhân]
    ManualContact --> UpdateDate[(Cập nhật ngày mới hoặc hủy hoàn phí)]
    
    CheckReplacements -->|Tìm thấy bác sĩ phù hợp| AdminSelect[Admin chọn Bác sĩ thay thế tốt nhất]
    AdminSelect --> ConfirmReassign[Admin xác nhận Điều phối ca khám]
    
    ConfirmReassign --> UpdateDB[(Cập nhật doctorId mới & Khôi phục trạng thái CONFIRMED)]
    UpdateDB --> SendNotification[Gửi thông báo cập nhật bác sĩ mới cho Bệnh nhân]
    SendNotification --> EndReassign([● Kết thúc: Lịch khám được cứu hộ thành công])
```

---

## 5. SƠ ĐỒ HOẠT ĐỘNG 5: ĐĂNG NHẬP, ĐĂNG KÝ & PHÂN QUYỀN TRUY CẬP (RBAC)
> **Mục tiêu**: Thể hiện cơ chế bảo mật xác thực danh tính và điều hướng người dùng theo vai trò (`ADMIN`, `DOCTOR`, `PATIENT`).

```mermaid
graph TD
    StartAuth([● Truy cập trang Đăng nhập /login]) --> InputCreds[Nhập Số điện thoại & Mật khẩu]
    InputCreds --> PostAuth[Gửi POST /api/auth/login]
    
    PostAuth --> FindUser[(Truy vấn bảng User theo SĐT)]
    FindUser --> UserExists{Người dùng có tồn tại?}
    
    UserExists -->|Không tìm thấy| ErrorNotFound[Báo lỗi: Số điện thoại chưa được đăng ký]
    ErrorNotFound --> InputCreds
    
    UserExists -->|Có tài khoản| VerifyPass{So sánh mật khẩu với bcrypt.compare}
    VerifyPass -->|Sai mật khẩu| ErrorPass[Báo lỗi: Mật khẩu không chính xác]
    ErrorPass --> InputCreds
    
    VerifyPass -->|Mật khẩu đúng| CreateCookie[Tạo Session Token & Lưu vào HTTP-Only Cookie]
    CreateCookie --> CheckRole{Kiểm tra vai trò người dùng - Role}
    
    CheckRole -->|Role == 'ADMIN'| NavAdmin[Điều hướng tự động vào Cổng Quản Trị /admin]
    CheckRole -->|Role == 'DOCTOR'| NavDoctor[Điều hướng tự động vào Bàn Bác Sĩ /doctor]
    CheckRole -->|Role == 'PATIENT'| NavPatient[Điều hướng tự động vào Cổng Bệnh Nhân /dashboard]
    
    NavAdmin --> EndAuth([● Đăng nhập thành công])
    NavDoctor --> EndAuth
    NavPatient --> EndAuth
```

---

## 6. HƯỚNG DẪN ĐƯA VÀO BÁO CÁO ĐỒ ÁN
* **Vị trí đề xuất trong Báo cáo**:
  * Đặt tại **Chương 4: Thiết kế chi tiết hệ thống** (Detailed System Design) hoặc **Mục 3.3: Thiết kế các quy trình nghiệp vụ**.
* **Cách xuất ảnh**:
  * Copy từng khối mã `mermaid` ở trên vào [Mermaid Live Editor](https://mermaid.live) hoặc [Draw.io](https://app.diagrams.net) để xuất định dạng PNG/SVG chất lượng cao (300 DPI) chèn vào Microsoft Word hoặc LaTeX.
