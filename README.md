# AURA FASHION - WEBSITE BÁN QUẦN ÁO THỜI TRANG TRỰC TUYẾN
### Đề tài môn học: Phát triển phần mềm mã nguồn mở (PTPMMNM) - Nhóm 4

---
THÀNH VIÊN: .
PHAN TẤN KIỆT .
NGUYỄN NỮ HỒNG NHUNG .
NGUYỄN NHƯ HỒNG HẠNH .
DƯƠNG QUỐC BẢO .
NGUYỄN THẾ NHẤT
 PHÂN CHIA VAI TRÒ 1 Admin (Owner / Administrator / Quản trị viên): NGUYỄN NỮ HỒNG NHUNG 2 Maintain (Maintainer / Người duy trì): PHAN TẤN KIỆT 3 Write (Contributor / Developer / Người ghi):NGUYỄN THẾ NHẤT 4 Triage (Manager / Người phân loại): DƯƠNG QUỐC BẢO 5 Read (Viewer / Người xem):NGUYỄN NHƯ HỒNG HẠNH

##  Giới Thiệu
Dự án **AURA FASHION** là hệ thống website thương mại điện tử chuyên ngành thời trang được xây dựng hoàn toàn bằng các công nghệ mã nguồn mở (Node.js, Express.js, SQLite, Vanilla CSS/JS, Nodemailer, JWT, bcryptjs).

Hệ thống đáp ứng trọn vẹn và hoàn chỉnh tất cả các yêu cầu theo đề bài:
1. **Đăng ký tài khoản:** Xác thực thông tin, mã hóa mật khẩu bằng bcrypt.
2. **Gửi mail xác nhận:** Tích hợp Nodemailer tự động tạo mã OTP 6 số và gửi email HTML kích hoạt tài khoản.
3. **Đăng nhập:** Cấp phát token bảo mật JWT, ghi nhớ phiên làm việc.
4. **Quên mật khẩu & Tạo lại mật khẩu mới:** Gửi mã xác thực qua email, cho phép nhập OTP và tạo mật khẩu mới an toàn.
5. **Quản lý bài viết thời trang (CRUD & Tìm kiếm):**
   - Tạo bài viết mới (kèm ảnh bìa URL hoặc tải file ảnh).
   - Xem danh sách và xem chi tiết bài viết (tự động đếm lượt xem).
   - Tìm kiếm bài viết theo từ khóa theo thời gian thực và lọc theo chủ đề.
   - Cập nhật bài viết (dành cho tác giả hoặc Admin).
   - Xóa bài viết (có hộp thoại xác nhận).
6. **Quản lý trang cá nhân & Cập nhật thông tin:**
   - Cập nhật họ tên, số điện thoại, địa chỉ giao hàng.
   - Tải lên ảnh đại diện (Avatar).
   - Đổi mật khẩu tài khoản.
   - Xem lịch sử đơn hàng đã mua.
   - Quản lý các bài viết do mình đăng tải.
7. **Thương mại điện tử & Quản trị (Admin):**
   - Danh mục sản phẩm đa dạng (Áo, Quần, Blazer, Váy đầm, Phụ kiện).
   - Lọc sản phẩm, sắp xếp giá, tìm kiếm sản phẩm.
   - Xem chi tiết sản phẩm: chọn Size (S, M, L, XL), chọn Màu sắc, số lượng.
   - Giỏ hàng trực quan, tính toán giá trị đơn hàng.
   - Đặt hàng hỗ trợ phương thức COD hoặc Chuyển khoản QR ngân hàng (VietQR).
   - Trang quản trị (Admin Dashboard) với thống kê doanh thu, đơn hàng, sản phẩm, bài viết và cập nhật trạng thái đơn hàng.
8. **Giao diện hiện đại (Wow factor):** Hỗ trợ chuyển đổi giao diện Sáng / Tối (Light / Dark mode), responsive mượt mà trên máy tính và điện thoại.

---
---

##  CHI TIẾT PHÂN HỆ BLOG & BÀI VIẾT THỜI TRANG (Contributor 2 - Nguyễn Như Hồng Hạnh)

Phân hệ Quản lý tin tức và bài viết thời trang do **Nguyễn Như Hồng Hạnh** đảm nhiệm toàn diện từ Backend đến Frontend:

### 1. Các file đóng góp chính:
- **Backend API:** `server/routes/posts.js` (Xử lý toàn bộ logic CRUD bài viết, tự động đếm lượt xem, tìm kiếm từ khóa và lọc chủ đề).
- **Unit Tests:** `tests/posts.test.js` (14 bài kiểm thử tự động độc lập đạt PASS 100%).
- **Frontend Logic:** `public/js/blog.js` (Hiển thị danh sách bài viết phân trang, tìm kiếm thời gian thực, xem chi tiết và modal soạn thảo).
- **Frontend Stylesheet:** `public/css/blog.css` (Giao diện lưới bài viết 16:9, khung tìm kiếm, layout đọc bài chi tiết và avatar tác giả).

### 2. Các tính năng nổi bật:
- **Lưới bài viết chuẩn tỷ lệ vàng 16:9:** Thiết kế card bài viết hiện đại, hiển thị ảnh bìa sắc nét, nhãn chủ đề và tóm tắt ngắn.
- **Tìm kiếm theo thời gian thực:** Hỗ trợ tìm bài viết theo từ khóa trong tiêu đề và nội dung ngay khi gõ phím.
- **Lọc theo chủ đề thời trang:** Lọc nhanh các bài viết theo xu hướng, phong cách phối đồ, chăm sóc trang phục...
- **Trang đọc bài viết chi tiết:** Tự động tăng lượt xem (`views`), hiển thị thông tin tác giả, ngày đăng và danh sách các bài viết cùng chủ đề liên quan.
- **Quản lý bài viết (CRUD):** Cho phép người dùng đăng nhập viết bài mới, tác giả hoặc Admin có quyền chỉnh sửa và xóa bài viết.

### 3. Danh sách RESTful API Blog:

| Phương thức | Đường dẫn API | Chức năng chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **GET** | `/api/posts` | Lấy danh sách bài viết (hỗ trợ phân trang, tìm kiếm từ khóa `q`, lọc theo `category`) | Công khai (Tất cả) |
| **GET** | `/api/posts/:id` | Xem chi tiết bài viết theo ID và tự động tăng 1 lượt xem | Công khai (Tất cả) |
| **POST** | `/api/posts` | Tạo bài viết thời trang mới (hỗ trợ tải file ảnh bìa) | Đăng nhập (User/Admin) |
| **PUT** | `/api/posts/:id` | Chỉnh sửa và cập nhật bài viết | Chính tác giả hoặc Admin |
| **DELETE**| `/api/posts/:id` | Xóa bài viết khỏi hệ thống | Chính tác giả hoặc Admin |

### 4. Lệnh kiểm thử tự động phân hệ Blog:
```bash
npx jest tests/posts.test.js
```
*(Kết quả: 14/14 tests pass 100%)*
## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu hệ thống
- Đã cài đặt **Node.js** (phiên bản 18 trở lên).

### 2. Khởi chạy hệ thống
Tại thư mục dự án `c:\Users\DELL\Desktop\WEBDOAO_PTPMMNM_NHOM 4`, chạy câu lệnh:
```bash
npm start
```
*(Hoặc `npm run dev`)*

### 3. Truy cập website
Mở trình duyệt web và truy cập vào địa chỉ:
👉 **http://localhost:5000**

---

## 👤 Tài Khoản Thử Nghiệm

Hệ thống đã nạp sẵn dữ liệu mẫu cùng 2 tài khoản thử nghiệm:

| Loại tài khoản | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@fashionhub.vn` | `Admin@123` | Quản trị toàn hệ thống, xem thống kê, quản lý sản phẩm, bài viết & đơn hàng |
| **Khách hàng (User)** | `khachhang@fashionhub.vn` | `User@123` | Mua sắm, quản lý trang cá nhân, viết bài thời trang |

*(💡 Tại hộp thoại Đăng Nhập, có sẵn các nút bấm chọn nhanh tài khoản thử nghiệm giúp đăng nhập tức thì mà không cần gõ phím).*

---


---

## 👤 CHI TIẾT PHÂN HỆ HỒ SƠ NGƯỜI DÙNG & LỊCH SỬ ĐƠN HÀNG (Trưởng nhóm - Phan Tấn Kiệt)

Phân hệ Quản lý hồ sơ người dùng và lịch sử mua sắm do **Phan Tấn Kiệt (Trưởng nhóm / Maintainer)** đảm nhiệm toàn diện từ Backend, Kiểm thử tự động đến Giao diện Frontend:

### 1. Các file đóng góp chính:
- **Backend API:** `server/routes/user.js` (Xử lý các API lấy hồ sơ cá nhân, cập nhật họ tên/SĐT/địa chỉ nhận hàng, đổi avatar và truy xuất lịch sử đơn hàng của người dùng).
- **Unit Tests:** `tests/user.test.js` (4 bài kiểm thử bảo mật & nghiệp vụ tự động đạt PASS 100%).
- **Frontend Logic:** `public/js/profile.js` (Hiển thị hồ sơ, xử lý form cập nhật thông tin và render danh sách đơn hàng đã mua).
- **Frontend Stylesheet:** `public/css/profile.css` (Giao diện Profile dạng lưới 2 cột hiện đại: sidebar avatar & điều hướng bên trái, panel chi tiết & danh sách đơn hàng bên phải).

### 2. Các tính năng nổi bật:
- **Bảo mật truy cập thông tin:** Chỉ người dùng đã đăng nhập với token JWT hợp lệ mới có quyền truy cập và chỉnh sửa hồ sơ.
- **Quản lý thông tin nhận hàng:** Cho phép người dùng linh hoạt cập nhật số điện thoại và địa chỉ giao hàng phục vụ đặt đơn nhanh chóng.
- **Cập nhật ảnh đại diện (Avatar):** Tích hợp tải ảnh trực tiếp, cập nhật ngay lập tức trên hệ thống.
- **Theo dõi lịch sử đơn hàng cá nhân:** Hiển thị chi tiết từng đơn hàng đã đặt gồm mã đơn, ngày mua, trạng thái xử lý và tổng tiền.
- **Kiểm thử tự động toàn diện:** 100% test case độc lập bảo đảm API hoạt động ổn định và chính xác trên môi trường CI/CD.

---
---

## 🛒 CHI TIẾT PHÂN HỆ GIỎ HÀNG, ĐẶT HÀNG & QUẢN TRỊ ADMIN (Contributor 3 - Dương Quốc Bảo)

Phân hệ Giỏ hàng, Quy trình Đặt hàng và Bảng điều khiển Quản trị hệ thống (Admin Portal) do **Dương Quốc Bảo (Contributor 3 / Triage Manager)** đảm nhiệm toàn diện:

### 1. Các file đóng góp chính:
- **Backend API Đơn hàng:** `server/routes/orders.js` (Xử lý quy trình tạo đơn hàng mới, tính toán tiền hàng, lưu chi tiết giỏ hàng và cập nhật trạng thái đơn).
- **Backend API Thống kê:** `server/routes/stats.js` (Tổng hợp số liệu doanh thu, số đơn, sản phẩm, bài viết và khách hàng phục vụ Dashboard).
- **Unit Tests Đơn hàng & Thống kê:** `tests/orders.test.js` (9 test case) và `tests/stats.test.js` (2 test case) đạt chuẩn PASS 100%.
- **Frontend Logic Admin:** `public/js/admin.js` (Hiển thị số liệu thống kê thời gian thực, quản lý và duyệt trạng thái đơn hàng, điều khiển danh mục sản phẩm).
- **Frontend Stylesheet Admin:** `public/css/admin.css` (Giao diện bảng điều khiển thẻ thống kê đa màu sắc, bảng quản lý đơn hàng chuẩn UX/UI responsive).

### 2. Các tính năng nổi bật:
- **Giỏ hàng & Đặt hàng linh hoạt:** Hỗ trợ lưu giỏ hàng, đặt hàng vãng lai (Guest Checkout) hoặc lưu vết lịch sử theo tài khoản người dùng đăng nhập.
- **Thống kê Dashboard trực quan:** Hiển thị tức thì tổng doanh thu thực tế, tổng số đơn hàng đã đặt, số lượng sản phẩm và người dùng đang hoạt động.
- **Quản lý vòng đời đơn hàng:** Cho phép Quản trị viên theo dõi và cập nhật trạng thái xử lý đơn hàng theo 5 giai đoạn: *Chờ xử lý ➔ Đang đóng gói ➔ Đang giao ➔ Đã giao ➔ Đã hủy*.
- **Phân quyền bảo mật:** Sử dụng middleware `requireAdmin` chặn đứng truy cập trái phép của người dùng thông thường vào số liệu tài chính và quản trị.
- **Kiểm thử tự động vững chắc:** Bao phủ 100% các kịch bản ngoại lệ giỏ hàng rỗng, thiếu thông tin giao hàng và phân quyền Admin.

---
---

## 🔐 CHI TIẾT PHÂN HỆ XÁC THỰC, BẢO MẬT & XÁC THỰC 2 BƯỚC 2FA (Contributor 1 - Nguyễn Thế Nhất)

Phân hệ Quản lý tài khoản, Xác thực người dùng và Hệ thống bảo mật 2FA do **Nguyễn Thế Nhất (Contributor 1 / Write Developer)** đảm nhiệm toàn diện:

### 1. Các file đóng góp chính:
- **Backend API Xác thực:** `server/routes/auth.js` (Đăng ký tài khoản, đăng nhập JWT, gửi mã OTP xác nhận tài khoản, quên/đặt lại mật khẩu).
- **Backend API Bảo mật & 2FA:** `server/routes/security.js` (Kiểm tra độ mạnh mật khẩu chuẩn NIST, kích hoạt & xác thực 2 bước 2FA qua OTP).
- **Middleware Phân quyền & Bảo vệ:** `server/middleware/auth.js` (Xác thực Bearer token, phân quyền Quản trị viên requireAdmin).
- **Dịch vụ Email Tự động:** `server/config/mailer.js` (Tích hợp Nodemailer gửi OTP bảo mật dạng email HTML chuẩn thương mại điện tử).
- **Unit Tests Bảo mật & Xác thực:** `tests/auth.test.js`, `tests/middleware.test.js`, `tests/security.test.js` (Pass 100% tất cả các ca kiểm thử).
- **Frontend Logic & Giao diện:** `public/js/auth.js` và `public/css/auth.css` (Giao diện Modal đăng nhập, đăng ký, xác thực OTP mượt mà).

### 2. Các tính năng nổi bật:
- **Đăng ký & Kích hoạt qua OTP:** Tự động tạo mã OTP 6 chữ số ngẫu nhiên có thời hạn, gửi email kích hoạt và mã hóa mật khẩu người dùng bằng bcrypt (salt 10 vòng).
- **Xác thực 2 bước (Two-Factor Authentication - 2FA):** Tăng cường bảo mật cấp cao cho tài khoản người dùng bằng mã OTP 2 lớp khi thực hiện các tác vụ nhạy cảm hoặc đăng nhập.
- **Kiểm tra độ an toàn mật khẩu (Password Strength Checker):** Phân tích thời gian thực cấu trúc mật khẩu, phát hiện các mật khẩu yếu phổ biến và đưa ra khuyến nghị an toàn theo thang điểm.
- **Cơ chế Token an toàn:** Cấp phát Json Web Token (JWT) có chữ ký số bí mật, hỗ trợ truyền qua Authorization Header hoặc Query Parameter phục vụ linh hoạt cho ứng dụng.
- **Bao phủ kiểm thử vững chắc:** Hơn 35 bài kiểm thử chuyên sâu bảo đảm 0 lỗ hổng xác thực, bắt lỗi đầu vào và phòng thủ truy cập trái phép.

### 3. Danh sách RESTful API Bảo mật & 2FA:
| Phương thức | Đường dẫn API | Chức năng chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **POST** | `/api/security/check-password-strength` | Đánh giá độ an toàn mật khẩu, phát hiện mật khẩu yếu, đưa ra gợi ý | Công khai |
| **GET** | `/api/security/status` | Lấy trạng thái kích hoạt 2FA và điểm số bảo mật tài khoản | Đăng nhập |
| **POST** | `/api/security/2fa/request-otp` | Tạo mã OTP kích hoạt xác thực 2 bước gửi về email người dùng | Đăng nhập |
| **POST** | `/api/security/2fa/enable` | Xác nhận mã OTP để chính thức kích hoạt bảo vệ 2FA | Đăng nhập |
| **POST** | `/api/security/2fa/disable` | Hủy xác thực 2 bước (yêu cầu mật khẩu tài khoản để xác nhận) | Đăng nhập |
| **POST** | `/api/security/2fa/verify-login` | Xác thực OTP 2FA trong quá trình đăng nhập để cấp JWT Token | Công khai |

---
---

## 📁 Cấu Trúc Thư Mục Dự Án

```
WEBDOAO_PTPMMNM_NHOM 4/
├── server/
│   ├── config/
│   │   ├── db.js                # Kết nối SQLite, tự động tạo bảng & nạp dữ liệu mẫu
│   │   └── mailer.js            # Cấu hình Nodemailer gửi email OTP & kích hoạt
│   ├── middleware/
│   │   ├── auth.js              # Middleware xác thực JWT & phân quyền Admin
│   │   └── upload.js            # Middleware Multer upload ảnh đại diện và bài viết
│   └── routes/
│       ├── auth.js              # API: Đăng ký, đăng nhập, xác nhận email, quên/đặt lại pass
│       ├── user.js              # API: Trang cá nhân, cập nhật thông tin, avatar, đổi pass
│       ├── posts.js             # API: CRUD bài viết, tìm kiếm bài viết, đếm view
│       ├── products.js          # API: Danh sách sản phẩm, bộ lọc, chi tiết, CRUD sản phẩm
│       ├── orders.js            # API: Đặt hàng, đơn hàng cá nhân, quản trị đơn hàng
│       ├── stats.js             # API: Thống kê doanh thu, đơn hàng cho Admin
│       ├── security.js          # API: Xác thực 2 bước 2FA & kiểm tra độ mạnh mật khẩu
│       ├── coupons.js           # API: Mã giảm giá voucher & khuyến mãi
│       └── comments.js          # API: Bình luận bài viết blog thời trang
├── public/
│   ├── css/
│   │   ├── style.css            # Hệ thống Design System, typography, header, modal, toast
│   │   ├── shop.css             # Banner hero, danh mục, lưới sản phẩm, giỏ hàng, checkout
│   │   ├── blog.css             # Giao diện bài viết thời trang, tìm kiếm, đọc bài, tạo bài
│   │   ├── auth.css             # Giao diện đăng nhập, đăng ký, OTP xác thực email
│   │   ├── profile.css          # Giao diện quản lý trang cá nhân, avatar, đơn hàng
│   │   └── admin.css            # Giao diện quản trị, thống kê số liệu kinh doanh
│   ├── js/
│   │   ├── api.js               # Thư viện gọi API với JWT token tự động & thông báo toast
│   │   ├── auth.js              # Xử lý nghiệp vụ đăng nhập, đăng ký, kích hoạt email, quên mật khẩu
│   │   ├── shop.js              # Xử lý duyệt sản phẩm, lọc danh mục, giỏ hàng, đặt hàng
│   │   ├── blog.js              # Xử lý CRUD bài viết thời trang, tìm kiếm, xem chi tiết
│   │   ├── profile.js           # Xử lý cập nhật thông tin cá nhân, avatar, đổi mật khẩu
│   │   ├── admin.js             # Xử lý bảng điều khiển quản trị, cập nhật trạng thái đơn
│   │   └── app.js               # Điều hướng SPA (Hash router), quản lý modal, Dark/Light mode
│   ├── uploads/                 # Thư mục lưu trữ hình ảnh upload
│   └── index.html               # Trang ứng dụng Single Page Application chính
├── docs/
│   ├── BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.md    # Báo cáo chi tiết phân tích thiết kế hệ thống
│   └── BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.html  # Bản HTML chuẩn in ấn / xuất PDF báo cáo
├── database.sqlite              # Cơ sở dữ liệu SQLite độc lập
├── server.js                    # Tệp khởi chạy máy chủ Express
├── package.json
└── README.md
```

---

## 📄 Tài Liệu Bàn Giao Kèm Theo
1. **Mã nguồn hoàn chỉnh:** Toàn bộ source code của dự án chạy trực tiếp không cần cấu hình phức tạp.
2. **Tài liệu phân tích & thiết kế hệ thống:**
   - Xem định dạng Markdown: [BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.md](docs/BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.md)
   - Xem định dạng HTML có thể mở trên trình duyệt hoặc in ra PDF: [BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.html](docs/BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.html)

---
© 2026 - **Nhóm 4 - Phát triển phần mềm mã nguồn mở**.
