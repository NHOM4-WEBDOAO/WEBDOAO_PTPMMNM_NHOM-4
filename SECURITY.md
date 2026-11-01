# CHÍNH SÁCH BẢO MẬT & QUẢN TRỊ AN TOÀN THÔNG TIN
## DỰ ÁN THƯƠNG MẠI ĐIỆN TỬ AURA FASHION
**Đề tài môn học:** Phát triển phần mềm mã nguồn mở (PTPMMNM) - Nhóm 4

---

## 1. Mục Tiêu & Cam Kết Bảo Mật (Security Objectives)
Hệ thống **AURA FASHION** cam kết bảo vệ dữ liệu khách hàng, đảm bảo tính toàn vẹn của giao dịch thương mại điện tử và tuân thủ các nguyên tắc an toàn mã nguồn mở theo chuẩn của tổ chức **OWASP (Open Web Application Security Project)** và **GitHub Security Standards**.

Mọi thành viên trong nhóm phát triển đều tuân thủ nguyên tắc: *"Bảo mật từ thiết kế" (Security by Design)* trong suốt vòng đời phát triển phần mềm (SDLC).

---

## 2. Các Phiên Bản Được Hỗ Trợ (Supported Versions)

Chúng tôi cung cấp các bản vá lỗi bảo mật, nâng cấp thư viện phụ thuộc và kiểm tra định kỳ cho các phiên bản sau:

| Phiên bản | Nhánh Git | Trạng thái bảo mật | Ghi chú |
| :---: | :---: | :---: | :--- |
| **v1.0.x** | `main` |  **Được hỗ trợ đầy đủ** | Phiên bản sản xuất ổn định (Production Release) |
| **Beta/Dev** | `feature/*` | ⚠️ Kiểm thử tự động | Quét kiểm tra qua GitHub Actions CI trước khi merge |
| **< v1.0** | - | ❌ Hết hạn hỗ trợ | Bản phác thảo khung sườn ban đầu |

---

## 3. Phân Loại Mức Độ Nghiêm Trọng (Vulnerability Severity Levels)

Nhóm phân loại lỗ hổng dựa trên chuẩn đánh giá bảo mật quốc tế **CVSS v3.1**:

| Cấp độ | Điểm CVSS | Ví dụ lỗ hổng | Thời gian phản hồi (SLA) |
| :--- | :---: | :--- | :---: |
| **CRITICAL (Khẩn cấp)** | 9.0 - 10.0 | Thực thi mã từ xa (RCE), lộ toàn bộ cơ sở dữ liệu, rò rỉ khóa `JWT_SECRET` | **Trong vòng 12 giờ** |
| **HIGH (Cao)** | 7.0 - 8.9 | Tấn công tiêm mã độc SQL (SQL Injection), vượt quyền Admin (Privilege Escalation), bypass đăng nhập | **Trong vòng 24 giờ** |
| **MEDIUM (Trung bình)** | 4.0 - 6.9 | Tấn công XSS (Cross-Site Scripting), CSRF, brute-force mã OTP không có giới hạn | **Trong vòng 48 giờ** |
| **LOW (Thấp)** | 0.1 - 3.9 | Lộ thông tin phiên bản server qua HTTP Header, chuyển hướng mở (Open Redirect) | **Trong vòng 5 ngày** |

---

## 4. Quy Trình Báo Cáo & Xử Lý Lỗ Hổng (Vulnerability Disclosure Policy)

Chúng tôi khuyến khích các nhà nghiên cứu bảo mật và cộng đồng thực hiện **Công bố có trách nhiệm (Responsible Disclosure)**:

### 4.1. Kênh tiếp nhận an toàn
Vui lòng **KHÔNG TẠO ISSUE CÔNG KHAI** khi phát hiện vấn đề bảo mật. Hãy sử dụng một trong hai phương thức bảo mật sau:
1. **Private Vulnerability Reporting:** Mở tab [Security ➔ Report a vulnerability](https://github.com/NHOM4-WEBDOAO/WEBDOAO_PTPMMNM_NHOM-4/security/advisories/new) trên GitHub repo.
2. **Email Đội ngũ Phụ trách:** Gửi thông tin trực tiếp tới:
   - Trưởng nhóm: `kietphan28122004@gmail.com` (Phan Tấn Kiệt)
   - Chuyên trách Xác thực & Bảo mật: `thenhat7789@gmail.com` (Nguyễn Thế Nhất)

### 4.2. Quy trình xử lý theo thời gian (Response SLA)
1. **Xác nhận (T + 24h):** Đội ngũ an ninh nhóm tiếp nhận báo cáo, xác thực tính hợp lệ và gửi thông báo đã nhận.
2. **Thẩm định & Tái hiện (T + 48h):** Cô lập phạm vi ảnh hưởng, xây dựng kịch bản kiểm thử (test case) tái hiện lỗi.
3. **Phát hành Bản vá (T + 72h):** Tạo nhánh vá lỗi bảo mật khẩn cấp `hotfix/*`, chạy kiểm thử 100% pass trên CI/CD và merge vào `main`.
4. **Công bố Minh bạch (Security Advisory):** Phát hành tài liệu cảnh báo bảo mật chính thức trên GitHub Security Advisories để ghi nhận công lao người đóng góp.

---

## 5. Các Biện Pháp Kỹ Thuật Đã Triển Khai (Security Defenses in Place)

Hệ thống mã nguồn AURA FASHION đã tích hợp sẵn các lớp phòng thủ kỹ thuật:

1. **Kiểm soát Truy cập & Xác thực (Authentication & Authorization):**
   - Mã hóa mật khẩu người dùng bằng giải thuật `bcryptjs` với độ muối (salt) 10 vòng.
   - Cấp phát định danh bằng **JSON Web Token (JWT)** có chữ ký số bí mật, hỗ trợ xác thực 2 bước (2FA via Email OTP).
   - Middleware `verifyToken` và `requireAdmin` chặn đứng truy cập trái phép cấp API.
2. **Phòng chống Tiêm mã độc (SQL Injection Prevention):**
   - 100% các câu truy vấn cơ sở dữ liệu SQLite đều sử dụng **Parameterized Queries** (Prepared Statements qua dấu `?`), không nối chuỗi trực tiếp.
3. **Quản lý Phiên & Kiểm tra Thiết bị (Session & Audit Logging):**
   - Lưu vết lịch sử IP, phân loại thiết bị (Desktop/Mobile), hỗ trợ thu hồi phiên và đăng xuất từ xa khi nghi ngờ lộ mật khẩu.
4. **Tự động hóa An ninh DevSecOps:**
   - **GitHub CodeQL Analysis:** Phân tích mã nguồn tĩnh tự động (SAST) ngăn chặn lỗ hổng ngay từ khâu Pull Request.
   - **Dependabot Alerts & Updates:** Giám sát 24/7 và tự động vá lỗi chuỗi cung ứng phần mềm npm (Supply Chain Security).
   - **Secret Scanning & Push Protection:** Chặn đứng việc vô tình commit các chuỗi nhạy cảm (.env, mật khẩu, API keys) lên GitHub.

---

## 6. Đội Ngũ Quản Trị An Ninh Thông Tin (Security Team)

| Thành viên | Trách nhiệm an ninh | Email liên hệ |
| :--- | :--- | :--- |
| **Phan Tấn Kiệt** | Trưởng nhóm - Điều phối tiếp nhận & Phê duyệt bản vá bảo mật | `kietphan28122004@gmail.com` |
| **Nguyễn Thế Nhất** | Kỹ sư An ninh & Xác thực - Phân tích lỗ hổng Auth, JWT, Sessions | `thenhat7789@gmail.com` |
| **Dương Quốc Bảo** | Quản trị Hệ thống & Đơn hàng - An toàn giao dịch & Dữ liệu Admin | `zuongqb2202@gmail.com` |
| **Nguyễn Nữ Hồng Nhung** | Quản trị Kho mã nguồn (Owner/Admin) - Cấu hình quyền hạn GitHub | `tho2050py@gmail.com` |
| **Nguyễn Như Hồng Hạnh** | Kiểm duyệt Nội dung - Phòng chống XSS trong bài viết Blog & Comment | `hanhnguyen230505@gmail.com` |

---
*© 2026 Nhóm 4 - Phát triển phần mềm mã nguồn mở. Tất cả quyền được bảo lưu.*
