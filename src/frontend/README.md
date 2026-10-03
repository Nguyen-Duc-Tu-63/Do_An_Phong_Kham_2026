# 🖥️ THƯ MỤC GIAO DIỆN NGƯỜI DÙNG (FRONTEND & CLIENT UI)

## 📌 Tổng Quan
Tầng Frontend chịu trách nhiệm hiển thị giao diện, điều hướng trang, xử lý tương tác người dùng và kết nối với Backend APIs.

## 📂 Cấu Trúc Các Tệp & Thư Mục Frontend
```text
src/
├── app/                         # Các trang giao diện chính (App Router)
│   ├── page.tsx                 # Trang chủ phòng khám (Landing Page, Bác sĩ, Chuyên khoa, Giới thiệu)
│   ├── layout.tsx               # Bố cục chung toàn ứng dụng (Navbar, Chat Widget, Footer, Toaster)
│   ├── book/page.tsx            # Trang đặt lịch khám trực tuyến thông minh
│   ├── dashboard/page.tsx       # Cổng thông tin cá nhân của bệnh nhân (Lịch hẹn, Bệnh án)
│   ├── doctor/page.tsx          # Bàn làm việc & Khám bệnh của Bác sĩ (Kê đơn, Cập nhật bệnh án)
│   ├── admin/page.tsx           # Bảng điều khiển quản trị viên (Admin Portal & Thống kê doanh thu)
│   ├── login/page.tsx           # Trang đăng nhập hệ thống
│   └── register/page.tsx        # Trang đăng ký tài khoản bệnh nhân
│
├── components/                  # Thư viện thành phần giao diện (UI Components)
│   ├── layout/                  # Navbar, Footer
│   ├── chat/                    # Hộp thoại AI Chatbot CarePlus tư vấn sức khỏe 24/7
│   └── ui/                      # Các thành phần giao diện cơ bản (Button, Input, Card, Modal,...)
│
├── frontend/                    # Điểm quản lý tập trung phân hệ Frontend
│   ├── components/              # Export các components giao diện
│   ├── index.ts                 # Điểm xuất khẩu tập trung
│   └── README.md                # Tài liệu mô tả tầng Frontend
│
└── public/                      # Tài nguyên tĩnh (Hình ảnh, Logo, Banner, Icons)
```
