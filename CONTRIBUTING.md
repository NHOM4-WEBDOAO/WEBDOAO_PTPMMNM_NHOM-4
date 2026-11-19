# Hướng dẫn đóng góp - AURA FASHION

Cảm ơn bạn đã tham gia phát triển dự án AURA FASHION (Nhóm 4, môn PTPMMNM). Vui lòng đọc kỹ hướng dẫn này trước khi gửi code.

## Vai trò trong nhóm

| Vai trò | Quyền GitHub | Thành viên |
|---|---|---|
| Quản trị viên | Admin | Phan tấn kiêt |
| Người duy trì | Maintain | Phan Tấn Kiệt |
| Người đóng góp | Write 1 | Nguyễn Thế Nhất |
| Người đóng góp | Write 2 | Nguyễn Như Hồng Hạnh |
| Người đóng góp | Write 3 | Dương Quốc Bảo |
| Người đóng góp | Write 4 | Nguyễn Nữ Hồng Nhung |

## Phân công file và vị trí kích hoạt của 5 thành viên (bao gồm Trưởng nhóm)

| Thành viên | File chức năng cần tạo | File Test cần viết | Vị trí mở kích hoạt trong code |
|---|---|---|---|
| **1. Nguyễn Thế Nhất** | • `server/routes/auth.js`<br>• `server/routes/security.js`<br>• `server/routes/sessions.js`<br>• `server/config/mailer.js`<br>• `server/middleware/auth.js`<br>• `public/js/auth.js`<br>• `public/css/auth.css` | • `tests/auth.test.js`<br>• `tests/security.test.js`<br>• `tests/sessions.test.js`<br>• `tests/middleware.test.js` | • `server.js`: mở `/api/auth`, `/api/security`, `/api/sessions`<br>• `public/index.html`: mở `auth.css` và `auth.js` |
| **2. Dương Quốc Bảo** | • `server/routes/orders.js`<br>• `server/routes/stats.js`<br>• `public/js/admin.js`<br>• `public/css/admin.css` | • `tests/orders.test.js`<br>• `tests/stats.test.js` | • `server.js` (dòng 29-30): mở `/api/orders` & `/api/stats`<br>• `public/index.html`: mở `admin.css` và `admin.js` |
| **3. Nguyễn Như Hồng Hạnh** | • `server/routes/posts.js`<br>• `public/js/blog.js`<br>• `public/css/blog.css` | • `tests/posts.test.js` | • `server.js` (dòng 33): mở `/api/posts`<br>• `public/index.html`: mở `blog.css` và `blog.js` |
| **4. Nguyễn Nữ Hồng Nhung** | • `server/routes/products.js`<br>• `public/js/shop.js`<br>• `public/css/shop.css` | • `tests/products.test.js` | • `server.js` (dòng 36): mở `/api/products`<br>• `public/index.html`: mở `shop.css` và `shop.js` |
| **5. Phan Tấn Kiệt (Trưởng nhóm)** | • `server/routes/user.js`<br>• `public/js/profile.js`<br>• `public/css/profile.css` | • `tests/user.test.js` | • `server.js` (dòng 27): mở `app.use('/api/user', ...)`<br>• `public/index.html`: mở `profile.css` và `profile.js` |

> **Mẹo:** Toàn bộ code hoàn chỉnh và test đã được sao lưu tại nhánh `backup/full-project-with-tests`. Thành viên chỉ cần lấy đúng file của mình và tạo PR.

## Cài đặt môi trường

Yêu cầu: **Node.js** (phiên bản LTS) và **Git**.

```bash
git clone https://github.com/NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4.git
cd WEBDOAO_PTPMMNM_NHOM-4
npm install
node server.js
```

Sau đó mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là `http://localhost:5000`).

## Quy trình làm việc

1. Cập nhật nhánh `main` mới nhất:
```bash
git checkout main
git pull
```
2. Tạo nhánh mới cho công việc của bạn:
```bash
git checkout -b feat/ten-chuc-nang
```
3. Viết code, tự chạy thử trước khi commit.
4. Commit và push:
```bash
git add .
git commit -m "feat: thêm chức năng"
git push -u origin feat/ten-chuc-nang
```
5. Mở **Pull Request** vào nhánh `main` và mô tả rõ bạn đã làm gì.
6. Chờ ít nhất **1 thành viên** review và duyệt trước khi merge.

**Không commit trực tiếp vào `main`.**

## Quy ước đặt tên nhánh
- `feat/...`: chức năng mới
- `fix/...`: sửa lỗi
- `docs/...`: tài liệu
- `refactor/...`: tái cấu trúc code

## Quy ước commit
Dùng dạng `loại: mô tả ngắn` theo chuẩn Conventional Commits:
- `feat: thêm chức năng`
- `fix: sửa lỗi phát sinh`
- `docs: cập nhật tài liệu`

## Quy ước code
- Đặt tên biến, hàm rõ nghĩa, nhất quán.
- Không đưa file nhạy cảm (`.env`, mật khẩu, khóa JWT, thông tin Nodemailer) lên GitHub.
- Không commit thư mục `node_modules/` và `database.sqlite`.
- Mỗi Pull Request chỉ nên làm một việc.

## Báo lỗi và đề xuất
Tạo **Issue** mới trên GitHub, ghi rõ:
- Các bước tái hiện lỗi
- Kết quả mong đợi và kết quả thực tế
- Ảnh chụp màn hình (nếu có)

## Quy tắc ứng xử
Tôn trọng, lịch sự và hỗ trợ lẫn nhau trong nhóm eheh.

---

## 🛡️ CHI TIẾT PHÂN HỆ BẢO MẬT & QUẢN LÝ PHIÊN (Contributor 1 - Nguyễn Thế Nhất)

Phân hệ An toàn thông tin, Xác thực 2 bước (2FA via Email OTP) và Quản lý phiên truy cập (Session Audit) do **Nguyễn Thế Nhất** (Security & Auth Officer) đảm nhiệm toàn diện:

### 1. Các file đóng góp chính:
- **Backend Security API:** `server/routes/security.js` (Xử lý toàn bộ logic kiểm tra độ mạnh mật khẩu, cấp phát mã OTP 6 số qua email, kích hoạt và vô hiệu hóa bảo mật hai lớp 2FA).
- **Backend Sessions API:** `server/routes/sessions.js` (Ghi nhận thông tin thiết bị, địa chỉ IP, User-Agent, truy vấn danh sách phiên hoạt động và thu hồi phiên làm việc từ xa).
- **Email Service:** `server/config/mailer.js` (Tích hợp dịch vụ gửi email mã xác thực OTP bảo mật cao).
- **Unit Tests:** `tests/security.test.js` & `tests/sessions.test.js` (Bộ 19 bài kiểm thử tự động độc lập đạt PASS 100%).
- **Frontend Security UI:** `public/js/security.js`, `public/js/profile.js` và `public/css/profile.css` (Giao diện trung tâm tài khoản, bảng hiển thị phiên làm việc và modal nhập mã OTP).

### 2. Các tính năng nổi bật:
- **Xác thực 2 bước (Two-Factor Authentication - 2FA):** Tạo và gửi mã OTP 6 số ngẫu nhiên qua email có hiệu lực trong 5 phút. Khi người dùng bật 2FA, hệ thống yêu cầu xác minh OTP hợp lệ mới hoàn tất đăng nhập.
- **Phân tích độ mạnh mật khẩu (Password Strength Checker):** Đánh giá mật khẩu theo 5 tiêu chí bảo mật (độ dài, chữ hoa, chữ thường, chữ số, ký tự đặc biệt) và lập tức cảnh báo nếu trùng với mật khẩu yếu phổ biến.
- **Giám sát thiết bị & Phiên làm việc (Session Management & Audit):** Tự động phát hiện loại thiết bị (Desktop, Mobile), trình duyệt, hệ điều hành và địa chỉ IP của mỗi lần truy cập.
- **Thu hồi phiên làm việc từ xa (Remote Revocation):** Cho phép người dùng chủ động đăng xuất khỏi một thiết bị lạ hoặc đăng xuất toàn bộ các phiên khác chỉ với 1 cú click.

### 3. Danh sách RESTful API Bảo mật & Phiên (Security & Sessions):

| Phương thức | Đường dẫn API | Chức năng chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **POST** | `/api/security/check-password-strength` | Phân tích độ an toàn và điểm bảo mật của mật khẩu | Công khai (Tất cả) |
| **GET** | `/api/security/status` | Lấy trạng thái kích hoạt bảo mật 2FA của tài khoản | Đã đăng nhập (User/Admin) |
| **POST** | `/api/security/2fa/request-otp` | Cấp phát và gửi mã OTP 6 số xác thực về Email | Đã đăng nhập (User/Admin) |
| **POST** | `/api/security/2fa/enable` | Xác minh OTP và chính thức kích hoạt bảo mật 2 bước | Đã đăng nhập (User/Admin) |
| **POST** | `/api/security/2fa/disable` | Hủy kích hoạt bảo mật 2 bước theo yêu cầu | Đã đăng nhập (User/Admin) |
| **POST** | `/api/security/2fa/verify-login` | Xác thực bước hai khi đăng nhập tài khoản có bật 2FA | Công khai (Tất cả) |
| **GET** | `/api/sessions` | Lấy danh sách toàn bộ các phiên và thiết bị đang hoạt động | Đã đăng nhập (User/Admin) |
| **POST** | `/api/sessions/record` | Ghi nhận phiên đăng nhập mới kèm IP và thiết bị | Đã đăng nhập (User/Admin) |
| **DELETE**| `/api/sessions/:id` | Thu hồi / Đăng xuất một phiên làm việc cụ thể từ xa | Đã đăng nhập (User/Admin) |
| **POST** | `/api/sessions/revoke-all` | Đăng xuất toàn bộ các thiết bị và phiên làm việc khác | Đã đăng nhập (User/Admin) |
| **GET** | `/api/sessions/active-count` | Đếm tổng số thiết bị đang đăng nhập cùng tài khoản | Đã đăng nhập (User/Admin) |

### 4. Lệnh kiểm thử tự động phân hệ Bảo mật & Phiên:
```bash
npx jest tests/security.test.js tests/sessions.test.js
```
*(Kết quả: 19/19 tests pass 100%)*

---

## 📝 CHI TIẾT PHÂN HỆ BÀI VIẾT BLOG & BÌNH LUẬN (Contributor 2 - Nguyễn Như Hồng Hạnh)

Phân hệ Tạp chí Thời trang, Quản trị bài viết Blog, Thả tim và Hệ thống bình luận cộng đồng do **Nguyễn Như Hồng Hạnh** (`hanhnguyen230505-code` - Blog & Content Reviewer) đảm nhiệm toàn diện:

### 1. Các file đóng góp chính:
- **Backend Posts API:** `server/routes/posts.js` (Xử lý toàn bộ logic CRUD bài viết tin tức xu hướng, phân trang, bộ lọc danh mục, tìm kiếm theo từ khóa, tạo slug tiếng Việt tự động, upload ảnh bìa qua Multer, tự động đếm lượt xem và API Thả tim bài viết).
- **Backend Comments API:** `server/routes/comments.js` (Xử lý thêm bình luận mới, hiển thị danh sách bình luận theo từng bài viết và xóa bình luận vi phạm).
- **Unit Tests:** `tests/posts.test.js` & `tests/comments.test.js` (Bộ 19 bài kiểm thử tự động độc lập đạt PASS 100%).
- **Frontend Logic & Stylesheet:** `public/js/blog.js` và `public/css/blog.css` (Giao diện tạp chí thời trang hiện đại dạng lưới thẻ card, modal chi tiết bài viết, nút thả tim tương tác động và khung gửi bình luận).

### 2. Các tính năng nổi bật:
- **Không gian Xu hướng & Phong cách Thời trang:** Cung cấp các bài viết chuyên sâu về phối đồ (Mix & Match), xu hướng thời trang theo mùa và cẩm nang phong cách.
- **Tìm kiếm & Phân loại thông minh:** Cho phép tìm kiếm bài viết tức thì theo từ khóa, lọc theo danh mục (`Xu hướng`, `Phối đồ`, `Tin tức`, `Bộ sưu tập`).
- **Tương tác Thả tim (Like Post) & Bình luận:** Độc giả có thể nhấn biểu tượng trái tim để thể hiện sự yêu thích bài viết và đăng nhập để gửi bình luận đóng góp ý kiến.
- **Chuẩn hóa SEO & Tối ưu hình ảnh:** Hệ thống tự động chuyển tiêu đề bài viết thành slug URL thân thiện chuẩn SEO; ảnh bìa được khuyến nghị tỉ lệ chuẩn 16:9 với dung lượng dưới 2MB.
- **Tiêu chuẩn bình luận văn minh:** Tuân thủ bộ quy tắc ứng xử quốc tế Contributor Covenant v2.1 (`CODE_OF_CONDUCT.md`), nghiêm cấm mọi ngôn từ khiêu khích hoặc spam quảng cáo.

### 3. Danh sách RESTful API Blog & Bình luận:

| Phương thức | Đường dẫn API | Chức năng chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **GET** | `/api/posts` | Lấy danh sách bài viết (hỗ trợ phân trang, tìm kiếm `q`, lọc `category`) | Công khai (Tất cả) |
| **GET** | `/api/posts/:id` | Xem chi tiết bài viết và tự động tăng 1 lượt xem | Công khai (Tất cả) |
| **POST** | `/api/posts` | Đăng bài viết mới (hỗ trợ upload ảnh bìa Multer) | Đã đăng nhập (Tác giả/Admin) |
| **PUT** | `/api/posts/:id` | Chỉnh sửa nội dung và thông tin bài viết | Tác giả hoặc Admin |
| **POST** | `/api/posts/:id/like` | Thả tim / Tăng số lượt thích cho bài viết | Công khai (Tất cả) |
| **DELETE**| `/api/posts/:id` | Xóa bài viết khỏi hệ thống | Tác giả hoặc Admin |
| **GET** | `/api/comments/post/:postId` | Lấy toàn bộ danh sách bình luận của bài viết | Công khai (Tất cả) |
| **POST** | `/api/comments` | Gửi bình luận nhận xét bài viết mới | Đã đăng nhập (User/Admin) |
| **DELETE**| `/api/comments/:id` | Xóa bình luận bài viết | Người viết hoặc Admin |

### 4. Lệnh kiểm thử tự động phân hệ Blog & Bình luận:
```bash
npx jest tests/posts.test.js tests/comments.test.js
```
*(Kết quả: 19/19 tests pass 100%)*

---
---

## 📦 CHI TIẾT PHÂN HỆ ĐƠN HÀNG, MÃ GIẢM GIÁ & QUẢN TRỊ ADMIN (Contributor 3 - Dương Quốc Bảo)

Phân hệ Quản lý Đơn hàng, Giỏ hàng, Mã giảm giá và Bảng điều khiển Quản trị (Admin Dashboard) do **Dương Quốc Bảo** (Orders & Admin Manager) đảm nhiệm toàn diện:

### 1. Các file đóng góp chính:
- **Backend API:** 
  + `server/routes/orders.js`: Xử lý toàn bộ logic đặt hàng, sinh mã vận đơn, lịch sử mua sắm, tra cứu đơn hàng công khai, hủy đơn và cập nhật trạng thái đơn hàng.
  + `server/routes/coupons.js`: Quản lý kho mã giảm giá (voucher), kiểm tra điều kiện áp dụng theo % hoặc tiền cố định.
  + `server/routes/stats.js`: Thống kê tổng hợp số liệu doanh thu thời gian thực (loại trừ đơn hủy), tổng số đơn, tổng khách hàng và sản phẩm bán chạy.
- **Unit Tests:**
  + `tests/orders.test.js`: Bộ 11 bài kiểm thử tự động quy trình đặt hàng, tra cứu mã đơn và hủy đơn hàng.
  + `tests/coupons.test.js`: Bộ 6 bài kiểm thử áp dụng mã giảm giá và giới hạn đơn hàng.
  + `tests/stats.test.js`: Bộ 2 bài kiểm thử thống kê doanh thu và phân quyền Admin.
- **Frontend Logic & Stylesheet:**
  + `public/js/admin.js`: Bảng điều khiển quản trị, vẽ card thống kê, bộ lọc trạng thái đơn và duyệt giao hàng.
  + `public/css/admin.css`: Giao diện Admin chuyên nghiệp, bảng dữ liệu responsive và badges trạng thái.

### 2. Các tính năng nổi bật:
- **Quy trình đặt hàng linh hoạt:** Hỗ trợ cả khách vãng lai và thành viên đăng nhập, tự động tính tổng tiền giỏ hàng, sinh mã vận đơn `ORD-xxxxxx-xxx`.
- **Tra cứu đơn hàng trực tuyến:** Khách hàng có thể tra cứu tình trạng vận chuyển theo mã vận đơn mà không cần đăng nhập.
- **Tự động hủy đơn an toàn:** Cho phép khách hàng hủy đơn hàng nhanh khi đơn còn đang ở trạng thái chờ xử lý (`pending`).
- **Kho Voucher thông minh:** Áp dụng mã giảm giá phần trăm hoặc giảm trực tiếp tiền mặt, kiểm tra đơn hàng tối thiểu.
- **Dashboard Admin trực quan:** Thống kê doanh thu thực tế, biểu đồ đơn hàng và thông tin khách hàng mới.

### 3. Danh sách RESTful API Đơn hàng & Quản trị:

| Phương thức | Đường dẫn API | Chức năng chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **POST** | `/api/orders` | Đặt hàng mới (hỗ trợ cả khách vãng lai và thành viên) | Công khai (Tất cả) |
| **GET** | `/api/orders/my-orders` | Xem lịch sử đơn hàng của tài khoản đang đăng nhập | Đã đăng nhập (User) |
| **GET** | `/api/orders/track/:code` | Tra cứu chi tiết tiến độ đơn hàng theo mã vận đơn | Công khai (Tất cả) |
| **PUT** | `/api/orders/:id/cancel` | Khách hàng tự hủy đơn hàng khi ở trạng thái pending | Người đặt hoặc Admin |
| **GET** | `/api/orders/all` | Quản trị viên xem và lọc toàn bộ danh sách đơn hàng | Quản trị viên (Admin) |
| **PUT** | `/api/orders/:id/status` | Quản trị viên duyệt và cập nhật trạng thái đơn hàng | Quản trị viên (Admin) |
| **GET** | `/api/coupons` | Lấy danh sách mã giảm giá voucher đang kích hoạt | Công khai (Tất cả) |
| **POST** | `/api/coupons/apply` | Áp dụng mã giảm giá vào đơn hàng | Công khai (Tất cả) |
| **GET** | `/api/stats/dashboard` | Thống kê tổng doanh thu, số đơn, số người dùng | Quản trị viên (Admin) |

### 4. Lệnh kiểm thử tự động phân hệ Đơn hàng & Admin:
```bash
npx jest tests/orders.test.js tests/coupons.test.js tests/stats.test.js
```
*(Kết quả: Trọn bộ 19 bài tests PASS 100%)*


## 👗 CHI TIẾT PHÂN HỆ CỬA HÀNG & QUẢN LÝ SẢN PHẨM (Contributor 4 - Nguyễn Nữ Hồng Nhung)

Phân hệ Quản lý sản phẩm, Danh mục và Cửa hàng thời trang (Shop) do **Nguyễn Nữ Hồng Nhung** (Admin / Owner) đảm nhiệm toàn diện:

### 1. Các file đóng góp chính:
- **Backend API:** `server/routes/products.js` (Xử lý toàn bộ logic CRUD sản phẩm, phân loại danh mục, tìm kiếm, lọc theo khoảng giá, sắp xếp giá bán và upload hình ảnh qua Multer).
- **Unit Tests:** `tests/products.test.js` (Bộ 8 bài kiểm thử tự động độc lập đạt PASS 100%).
- **Frontend Logic:** `public/js/shop.js` (Hiển thị danh sách sản phẩm dạng lưới, bộ lọc danh mục động, tìm kiếm thời gian thực, xem chi tiết sản phẩm, chọn size/màu và thêm vào giỏ hàng).
- **Frontend Stylesheet:** `public/css/shop.css` (Giao diện cửa hàng thời trang responsive, thiết kế card sản phẩm hiện đại, hiệu ứng hover, badge giảm giá và bộ lọc giá).

### 2. Các tính năng nổi bật:
- **Lưới sản phẩm thời trang hiện đại:** Hiển thị ảnh sản phẩm sắc nét, tên, giá bán, giá gốc và nhãn giảm giá nổi bật.
- **Bộ lọc đa tiêu chí thông minh:** Lọc theo danh mục (Áo, Quần, Áo khoác, Váy đầm, Phụ kiện), tìm kiếm theo từ khóa và lọc theo khoảng giá.
- **Sắp xếp linh hoạt:** Sắp xếp sản phẩm theo giá tăng dần, giá giảm dần hoặc sản phẩm mới nhất.
- **Modal chi tiết sản phẩm:** Xem ảnh lớn, mô tả chất liệu, chọn Size (S, M, L, XL), chọn màu sắc và số lượng trước khi thêm vào giỏ hàng.
- **Quản lý sản phẩm (CRUD dành cho Admin):** Thêm sản phẩm mới với ảnh tải lên từ máy tính, chỉnh sửa thông tin giá và tồn kho, xóa sản phẩm.

### 3. Danh sách RESTful API Cửa hàng (Shop & Products):

| Phương thức | Đường dẫn API | Chức năng chi tiết | Quyền hạn |
| :---: | :--- | :--- | :---: |
| **GET** | `/api/products/categories/all` | Lấy toàn bộ danh mục sản phẩm | Công khai (Tất cả) |
| **GET** | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ lọc theo `category`, `search`, `minPrice`, `maxPrice`, `sort`) | Công khai (Tất cả) |
| **GET** | `/api/products/:id` | Xem chi tiết sản phẩm theo ID hoặc Slug | Công khai (Tất cả) |
| **POST** | `/api/products` | Thêm sản phẩm thời trang mới (hỗ trợ upload ảnh Multer) | Quản trị viên (Admin) |
| **PUT** | `/api/products/:id` | Cập nhật thông tin, giá bán và tồn kho sản phẩm | Quản trị viên (Admin) |
| **DELETE**| `/api/products/:id` | Xóa sản phẩm khỏi hệ thống | Quản trị viên (Admin) |

### 4. Lệnh kiểm thử tự động phân hệ Sản phẩm:
```bash
npx jest tests/products.test.js
```
*(Kết quả: 8/8 tests pass 100%)*