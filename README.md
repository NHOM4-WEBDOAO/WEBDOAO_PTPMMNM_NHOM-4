#  AURA FASHION - HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ THỜI TRANG MÃ NGUỒN MỞ

> **Đề tài môn học:** Phát triển Phần mềm Mã Nguồn Mở (PTPMMNM)  
> **Đơn vị thực hiện:** Nhóm 4  
> **Kho lưu trữ chính (Upstream):** [NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4](https://github.com/NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4)

---

##  BẢNG THÀNH VIÊN & PHÂN CHIA VAI TRÒ DỰ ÁN

| STT | Họ và tên | GitHub Account | Vai trò môn học | Quyền hạn GitHub | Phân hệ phụ trách chính |
|:---:|:---|:---|:---|:---:|:---|
| **1** | **Phan Tấn Kiệt** *(Trưởng nhóm)* | [`@Kietphan2812`](https://github.com/Kietphan2812) | **Maintainer** | **Maintain** | Quản lý Hồ sơ (`/api/user`), Giỏ hàng & Điều phối Git Flow |
| **2** | **Nguyễn Nữ Hồng Nhung** | [`@tho2050`](https://github.com/tho2050) | **Product Manager** | **Write** | Cửa hàng, Sản phẩm (`/api/products`) & Yêu thích (`/api/wishlist`) |
| **3** | **Nguyễn Thế Nhất** | [`@thenhat7789-pixel`](https://github.com/thenhat7789-pixel) | **Security Officer** | **Write** | Xác thực JWT, Bảo mật 2FA (`/api/security`) & Quản lý phiên (`/api/sessions`) |
| **4** | **Nguyễn Như Hồng Hạnh** | [`@hanhnguyen230505-code`](https://github.com/hanhnguyen230505-code) | **Content Reviewer** | **Write** | Tạp chí Blog (`/api/posts`), Thả tim Like Post & Bình luận (`/api/comments`) |
| **5** | **Dương Quốc Bảo** | [`@KazueWB`](https://github.com/KazueWB) | **Orders & Admin Manager** | **Write** | Quy trình Đặt hàng (`/api/orders`), Mã giảm giá (`/api/coupons`) & Dashboard (`/api/stats`) |

---

##  GIỚI THIỆU TỔNG QUAN

**AURA FASHION** là nền tảng website thương mại điện tử chuyên ngành thời trang cao cấp, được thiết kế và triển khai tuân thủ nghiêm ngặt các nguyên lý phát triển phần mềm mã nguồn mở:
- **Kiến trúc tinh gọn, không phụ thuộc nặng:** Xây dựng trên nền Node.js & Express.js RESTful API, cơ sở dữ liệu SQLite chống SQL Injection hoàn toàn bằng Parameterized Queries.
- **Frontend Single Page Application (SPA):** Giao diện Vanilla JavaScript hiện đại, tốc độ phản hồi nhanh, hỗ trợ Responsive toàn diện trên Desktop, Tablet và Mobile.
- **Quy trình chuẩn DevSecOps:** Tích hợp kiểm thử tự động Jest & Supertest, rà soát lỗ hổng bảo mật GitHub CodeQL, Secret Scanning, Push Protection và quản lý phụ thuộc tự động qua Dependabot.

---

##  CÁC TÍNH NĂNG NỔI BẬT

### 1. Quản lý Định danh, Bảo mật & Xác thực 2 bước (2FA)
- Đăng ký tài khoản, gửi email kích hoạt chứa mã OTP 6 số qua Nodemailer.
- Mã hóa mật khẩu bảo mật cao bằng thư viện `bcryptjs` với salt rounds chuẩn.
- Cấp phát Json Web Token (JWT) có chữ ký số bảo vệ toàn bộ các endpoint riêng tư.
- **Xác thực 2 bước (2FA via Email OTP):** Bảo vệ tài khoản 2 lớp, yêu cầu mã OTP khi đăng nhập.
- **Quản lý phiên & Giám sát thiết bị (Session Audit):** Ghi vết IP, User-Agent, phát hiện loại thiết bị và hỗ trợ đăng xuất từ xa khỏi các phiên lạ.
- Đánh giá độ mạnh mật khẩu theo thời gian thực (Password Strength Checker).

### 2. Cửa hàng Thời trang & Quản lý Sản phẩm
- Danh mục sản phẩm phong phú: Áo, Quần, Blazer, Váy đầm, Phụ kiện.
- Bộ lọc đa tiêu chí: Lọc theo danh mục, khoảng giá (`minPrice`, `maxPrice`), tìm kiếm tức thì và sắp xếp giá tăng/giảm dần.
- Modal chi tiết sản phẩm: Xem ảnh phóng to, mô tả chất liệu, bảng chọn Size (S, M, L, XL), chọn màu sắc và số lượng.
- **Danh sách yêu thích (Wishlist):** Cho phép người dùng lưu lại các sản phẩm ưng ý chỉ với 1 click.
- Quản trị viên (Admin) toàn quyền thêm mới (upload ảnh Multer), sửa giá bán, cập nhật tồn kho hoặc xóa sản phẩm.

### 3. Tạp chí Thời trang, Blog & Cộng đồng
- Chuyên mục bài viết phong cách, xu hướng thời trang và cẩm nang phối đồ (Mix & Match).
- Tự động tạo slug URL thân thiện với công cụ tìm kiếm (Chuẩn SEO).
- **Tính năng tương tác động:** Thả tim bài viết (`POST /api/posts/:id/like`) và hệ thống bình luận cộng đồng.
- Chuẩn hóa hình ảnh tỉ lệ vàng 16:9 và tuân thủ bộ quy tắc ứng xử cộng đồng văn minh **Contributor Covenant v2.1**.

### 4. Giỏ hàng, Quy trình Đặt hàng & Mã giảm giá (Coupons)
- Giỏ hàng động trực quan, lưu trữ linh hoạt, cập nhật số lượng tức thì.
- Hỗ trợ cả khách mua vãng lai (Guest Checkout) và thành viên đăng nhập.
- Áp dụng mã giảm giá voucher khuyến mãi (Coupon) trừ tiền trực tiếp vào hóa đơn.
- Quản lý vòng đời đơn hàng: *Chờ xử lý (Pending) ➔ Đang vận chuyển (Shipping) ➔ Hoàn thành (Delivered) ➔ Đã hủy (Cancelled)*.
- Cho phép khách hàng chủ động hủy đơn khi đơn hàng còn ở trạng thái `pending`.

### 5. Bảng điều khiển Quản trị (Admin Analytics Dashboard)
- Thống kê trực quan thời gian thực: Tổng doanh thu, số lượng đơn hàng, số lượng thành viên và tồn kho sản phẩm.
- Quản lý danh sách đơn hàng, xem chi tiết từng món hàng và cập nhật trạng thái vận chuyển.

---

##  HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY HỆ THỐNG

### 1. Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 18.0.0` (LTS khuyến nghị).
- **Git:** Đã cài đặt trên máy tính.

### 2. Cài đặt các bước
```bash
# 1. Sao chép kho mã nguồn về máy
git clone https://github.com/NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4.git
cd WEBDOAO_PTPMMNM_NHOM-4

# 2. Cài đặt các gói thư viện phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển
npm start
```

### 3. Truy cập ứng dụng
Mở trình duyệt web và truy cập vào đường dẫn:  
 **http://localhost:5000**

---

## 👤 TÀI KHOẢN THỬ NGHIỆM HỆ THỐNG

Hệ thống đã nạp sẵn cơ sở dữ liệu mẫu cùng 2 tài khoản thử nghiệm với đầy đủ quyền hạn:

| Phân loại | Địa chỉ Email | Mật khẩu mặc định | Vai trò & Quyền hạn |
|:---|:---|:---:|:---|
| **Quản trị viên (Admin)** | `admin@fashionhub.vn` | `Admin@123` | Quản trị toàn hệ thống, xem bảng thống kê doanh thu, duyệt đơn hàng, quản lý sản phẩm |
| **Khách hàng (User)** | `khachhang@fashionhub.vn` | `User@123` | Trải nghiệm mua sắm, yêu thích sản phẩm, đặt hàng, quản lý hồ sơ và viết bài blog |

>  **Mẹo đăng nhập nhanh:** Tại giao diện Đăng Nhập, hệ thống đã bố trí sẵn các nút bấm chọn nhanh tài khoản thử nghiệm giúp đăng nhập tức thì mà không cần gõ phím thủ công.

---

##  KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (UNIT TESTING)

Hệ thống được bao phủ kiểm thử tự động toàn diện bằng **Jest** và **Supertest**, đảm bảo 100% các Test Suites vượt qua kiểm thử:

```bash
# Chạy toàn bộ các bộ bài kiểm thử tự động
npm test

# Chạy kiểm thử kèm bảng thống kê độ bao phủ mã nguồn (Code Coverage)
npm test -- --coverage
```

### Kết quả kiểm định chất lượng:
- **Test Suites:** `13 passed, 13 total` (100% Pass)
- **Test Cases:** `107 passed, 107 total` (100% Pass)
- **Độ bao phủ hàm (Functions):** `80.00%`
- **Độ bao phủ dòng lệnh (Lines):** `71.64%`

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN CHI TIẾT

```text
WEBDOAO_PTPMMNM_NHOM-4/
├── .github/
│   └── workflows/
│       └── ci.yml               # Quy trình CI tự động chạy kiểm thử trên GitHub Actions mỗi khi mở PR
├── server/
│   ├── config/
│   │   ├── db.js                # Kết nối SQLite, khởi tạo cấu trúc bảng & nạp dữ liệu mẫu ban đầu
│   │   └── mailer.js            # Dịch vụ Nodemailer gửi mã OTP kích hoạt & bảo mật 2FA
│   ├── middleware/
│   │   ├── auth.js              # Middleware xác thực JWT token, phân quyền Admin (requireAdmin)
│   │   └── upload.js            # Middleware Multer kiểm soát tải ảnh đại diện & ảnh sản phẩm
│   └── routes/
│       ├── auth.js              # API Đăng ký, đăng nhập JWT, kích hoạt OTP, quên & đặt lại mật khẩu
│       ├── security.js          # API Bảo mật 2FA via OTP Email, kiểm tra độ mạnh mật khẩu chuẩn OWASP
│       ├── sessions.js          # API Quản lý phiên truy cập, audit thiết bị, thu hồi phiên từ xa
│       ├── user.js              # API Hồ sơ cá nhân, cập nhật thông tin, lịch sử mua sắm
│       ├── products.js          # API Quản lý danh mục, sản phẩm, bộ lọc giá và tìm kiếm
│       ├── wishlist.js          # API Quản lý danh sách sản phẩm yêu thích (Wishlist)
│       ├── orders.js            # API Quy trình đặt hàng, tra cứu chi tiết, hủy đơn & cập nhật trạng thái
│       ├── coupons.js           # API Áp dụng mã giảm giá voucher khuyến mãi thời gian thực
│       ├── stats.js             # API Thống kê tổng hợp số liệu doanh thu & đơn hàng cho Admin Dashboard
│       ├── posts.js             # API Quản trị bài viết blog, đếm view, thả tim Like Post
│       └── comments.js          # API Bình luận và phản hồi bài viết cộng đồng
├── public/
│   ├── css/
│   │   ├── style.css            # Hệ thống Design System, biến CSS, Typography, Header, Footer, Toast
│   │   ├── shop.css             # Giao diện cửa hàng, danh mục sản phẩm, bộ lọc, modal xem chi tiết
│   │   ├── blog.css             # Giao diện tạp chí thời trang, lưới bài viết 16:9, khung tìm kiếm
│   │   ├── auth.css             # Giao diện modal đăng nhập, đăng ký, xác thực OTP 2FA
│   │   ├── profile.css          # Giao diện trang cá nhân, đổi avatar, lịch sử mua hàng, danh sách thiết bị
│   │   └── admin.css            # Giao diện bảng điều khiển quản trị, thống kê doanh thu, quản lý đơn
│   ├── js/
│   │   ├── api.js               # Thư viện tiện ích gọi fetch API, tự động đính kèm JWT Bearer token & Toast
│   │   ├── app.js               # Điều hướng Hash Router cho SPA, quản lý Modal, chuyển đổi Light/Dark Mode
│   │   ├── auth.js              # Xử lý form đăng nhập, đăng ký, xác minh OTP, quên mật khẩu
│   │   ├── shop.js              # Hiển thị sản phẩm, lọc danh mục, giỏ hàng, đặt hàng, danh sách Wishlist
│   │   ├── blog.js              # Hiển thị bài viết xu hướng, tìm kiếm thời gian thực, thả tim và bình luận
│   │   ├── icons.js             # Bộ biểu tượng FontAwesome SVG nhúng tối ưu tốc độ tải trang
│   │   ├── profile.js           # Cập nhật thông tin cá nhân, tải avatar, đổi mật khẩu, quản lý phiên
│   │   └── admin.js             # Dashboard thống kê doanh thu, duyệt và cập nhật trạng thái đơn hàng
│   ├── uploads/                 # Thư mục lưu trữ hình ảnh tải lên của hệ thống
│   └── index.html               # Trang ứng dụng Single Page Application (SPA) chính
├── tests/                       # Trọn bộ 13 file kiểm thử tự động Jest & Supertest (107 tests PASS 100%)
│   ├── auth.test.js             # 10 tests: Đăng ký, đăng nhập JWT, gửi OTP email, quên mật khẩu
│   ├── security.test.js         # 12 tests: Bảo mật 2FA OTP, kiểm tra độ mạnh mật khẩu chuẩn NIST
│   ├── sessions.test.js         # 7 tests: Quản lý phiên, audit thiết bị, đăng xuất thiết bị từ xa
│   ├── middleware.test.js       # 10 tests: Xác thực Bearer token và phân quyền requireAdmin
│   ├── user.test.js             # 4 tests: Hồ sơ cá nhân, đổi mật khẩu, xem lịch sử đơn hàng
│   ├── products.test.js         # 8 tests: CRUD sản phẩm, danh mục, bộ lọc giá và tìm kiếm
│   ├── wishlist.test.js         # 7 tests: Thêm, xóa và kiểm tra danh sách sản phẩm yêu thích
│   ├── orders.test.js           # 8 tests: Đặt hàng, tính tiền giỏ hàng, cập nhật trạng thái đơn
│   ├── coupons.test.js          # 6 tests: Áp dụng mã giảm giá phần trăm và số tiền cố định
│   ├── stats.test.js            # 2 tests: API thống kê tổng doanh thu, đơn hàng cho Admin
│   ├── posts.test.js            # 15 tests: CRUD bài viết, tìm kiếm từ khóa, đếm view, thả tim Like
│   ├── comments.test.js         # 4 tests: Bình luận bài viết, xóa bình luận vi phạm
│   └── health.test.js           # 2 tests: Trạng thái hoạt động máy chủ server health check
├── docs/                        # Tài liệu phân tích thiết kế hệ thống và báo cáo dự án
│   ├── BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.md    # Tài liệu phân tích & thiết kế hệ thống chi tiết
│   ├── BAO_CAO_PHAN_TICH_THIET_KE_HE_THONG.html  # Bản HTML chuẩn in ấn / xuất PDF báo cáo
│   ├── PHAN_CONG_NHIEM_VU_5_THANH_VIEN.md        # Bảng phân công chi tiết 5 thành viên
│   └── SO_TAY_DO_AN_NHOM_4.md                    # Sổ tay hướng dẫn phát triển và quy trình đồ án
├── database.sqlite              # Cơ sở dữ liệu SQLite độc lập
├── server.js                    # Tệp tin khởi chạy máy chủ Node.js Express
├── CONTRIBUTING.md              # Quy chuẩn đóng góp mã nguồn & đặc tả chi tiết 5 thành viên
├── CODE_OF_CONDUCT.md          # Bộ quy tắc ứng xử cộng đồng Contributor Covenant v2.1
├── SECURITY.md                  # Chính sách quản trị bảo mật thông tin & tiếp nhận lỗ hổng
├── LICENSE                      # Giấy phép mã nguồn mở MIT License
└── package.json                 # Quản lý phụ thuộc và kịch bản npm scripts
```

---

## 📜 CHÍNH SÁCH MÃ NGUỒN MỞ & TÀI LIỆU QUẢN TRỊ

Dự án AURA FASHION được vận hành theo các tiêu chuẩn mã nguồn mở quốc tế:
1. **Hướng dẫn đóng góp (Contributing Guidelines):** Xem chi tiết tại [CONTRIBUTING.md](CONTRIBUTING.md).
2. **Quy tắc ứng xử cộng đồng (Code of Conduct):** Xem chi tiết tại [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
3. **Chính sách an toàn thông tin (Security Policy):** Xem chi tiết tại [SECURITY.md](SECURITY.md).
4. **Bản quyền mã nguồn:** Được phát hành theo giấy phép mã nguồn mở tự do [MIT License](LICENSE).

---

© 2026 - **Nhóm 4 | Môn Phát triển Phần mềm Mã Nguồn Mở (PTPMMNM)**. All rights reserved.