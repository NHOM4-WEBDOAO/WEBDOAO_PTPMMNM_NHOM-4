const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// Khởi tạo bảng lưu trữ thông tin xác thực 2 bước (2FA) & bảo mật
query.run(`
  CREATE TABLE IF NOT EXISTS user_security (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    two_factor_enabled INTEGER DEFAULT 0,
    two_factor_otp TEXT,
    two_factor_expires DATETIME,
    last_password_change DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`).catch(() => {});

// Danh sách các mật khẩu yếu phổ biến thường gặp
const COMMON_WEAK_PASSWORDS = [
  '123456', '12345678', '123456789', 'password', 'qwerty',
  '111111', 'admin123', 'iloveyou', 'aura123', 'aura2026'
];

/**
 * Helper: Tạo mã OTP 6 chữ số ngẫu nhiên
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 1. POST /api/security/check-password-strength
 * Phân tích độ an toàn mật khẩu (Password Strength Checker)
 * Public API - không cần token
 */
router.post('/check-password-strength', (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp mật khẩu cần kiểm tra độ an toàn.'
    });
  }

  let score = 0;
  const suggestions = [];

  // 1. Kiểm tra danh sách mật khẩu yếu phổ biến
  const isCommon = COMMON_WEAK_PASSWORDS.includes(password.toLowerCase());
  if (isCommon) {
    return res.json({
      success: true,
      score: 10,
      level: 'Rất yếu',
      isCommon: true,
      suggestions: ['Mật khẩu này quá phổ biến và dễ bị đoán. Hãy chọn mật khẩu phức tạp hơn!']
    });
  }

  // 2. Độ dài
  if (password.length >= 12) {
    score += 35;
  } else if (password.length >= 8) {
    score += 25;
  } else if (password.length >= 6) {
    score += 15;
  } else {
    suggestions.push('Độ dài mật khẩu nên có tối thiểu 8 ký tự.');
  }

  // 3. Có chữ thường
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    suggestions.push('Nên bổ sung thêm chữ cái viết thường (a-z).');
  }

  // 4. Có chữ hoa
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    suggestions.push('Nên bổ sung thêm chữ cái viết hoa (A-Z).');
  }

  // 5. Có chữ số
  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    suggestions.push('Nên bổ sung thêm số (0-9).');
  }

  // 6. Có ký tự đặc biệt
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    score += 15;
  } else {
    suggestions.push('Nên bổ sung thêm ký tự đặc biệt (ví dụ: @, #, $, %, !).');
  }

  // Xác định cấp độ
  let level = 'Yếu';
  if (score >= 85) level = 'Rất mạnh';
  else if (score >= 65) level = 'Mạnh';
  else if (score >= 45) level = 'Trung bình';

  res.json({
    success: true,
    score,
    level,
    isCommon: false,
    suggestions: suggestions.length > 0 ? suggestions : ['Mật khẩu đạt tiêu chuẩn an toàn cao!']
  });
});

/**
 * 2. GET /api/security/status
 * Lấy trạng thái cài đặt bảo mật và xác thực 2 bước của tài khoản
 * Protected API
 */
router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await query.get('SELECT id, email, is_verified FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    const sec = await query.get('SELECT * FROM user_security WHERE user_id = ?', [req.user.id]);
    const twoFactorEnabled = Boolean(sec && sec.two_factor_enabled === 1);

    let securityScore = 40;
    if (user.is_verified === 1) securityScore += 30;
    if (twoFactorEnabled) securityScore += 30;

    res.json({
      success: true,
      security: {
        userId: user.id,
        email: user.email,
        isEmailVerified: user.is_verified === 1,
        twoFactorEnabled,
        securityScore,
        securityLevel: securityScore >= 80 ? 'Rất cao' : securityScore >= 50 ? 'Khá' : 'Cần cải thiện'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi truy xuất bảo mật: ' + err.message });
  }
});

/**
 * 3. POST /api/security/2fa/request-otp
 * Yêu cầu gửi mã OTP để bắt đầu kích hoạt xác thực 2 bước (2FA)
 * Protected API
 */
router.post('/2fa/request-otp', verifyToken, async (req, res) => {
  try {
    const user = await query.get('SELECT id, email, name FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 phút

    // Lưu hoặc cập nhật OTP vào user_security
    const existing = await query.get('SELECT id FROM user_security WHERE user_id = ?', [user.id]);
    if (existing) {
      await query.run(
        'UPDATE user_security SET two_factor_otp = ?, two_factor_expires = ? WHERE user_id = ?',
        [otp, expires, user.id]
      );
    } else {
      await query.run(
        'INSERT INTO user_security (user_id, two_factor_enabled, two_factor_otp, two_factor_expires) VALUES (?, 0, ?, ?)',
        [user.id, otp, expires]
      );
    }

    res.json({
      success: true,
      message: `Mã OTP xác thực 2 bước đã được tạo thành công cho ${user.email}.`,
      devInfo: {
        email: user.email,
        otp,
        expiresIn: '10 phút'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi gửi yêu cầu OTP 2FA: ' + err.message });
  }
});

/**
 * 4. POST /api/security/2fa/enable
 * Xác nhận mã OTP để chính thức bật xác thực 2 bước
 * Protected API
 */
router.post('/2fa/enable', verifyToken, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã OTP 6 chữ số.' });
    }

    const sec = await query.get('SELECT * FROM user_security WHERE user_id = ?', [req.user.id]);
    if (!sec || !sec.two_factor_otp) {
      return res.status(400).json({ success: false, message: 'Chưa có yêu cầu OTP nào được tạo hoặc OTP đã hết hạn.' });
    }

    if (sec.two_factor_expires && new Date(sec.two_factor_expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Mã OTP xác thực đã hết hạn. Vui lòng lấy mã mới.' });
    }

    if (sec.two_factor_otp.trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Mã OTP xác thực không chính xác.' });
    }

    // Cập nhật bật 2FA
    await query.run(
      'UPDATE user_security SET two_factor_enabled = 1, two_factor_otp = NULL, two_factor_expires = NULL WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Kích hoạt xác thực 2 bước (2FA) bảo vệ tài khoản thành công!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi kích hoạt 2FA: ' + err.message });
  }
});

/**
 * 5. POST /api/security/2fa/disable
 * Hủy kích hoạt xác thực 2 bước (yêu cầu mật khẩu để xác minh danh tính)
 * Protected API
 */
router.post('/2fa/disable', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu tài khoản để xác nhận hủy 2FA.' });
    }

    const user = await query.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không chính xác.' });
    }

    await query.run(
      'UPDATE user_security SET two_factor_enabled = 0, two_factor_otp = NULL, two_factor_expires = NULL WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Đã hủy kích hoạt xác thực 2 bước (2FA) thành công.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi hủy kích hoạt 2FA: ' + err.message });
  }
});

/**
 * 6. POST /api/security/2fa/verify-login
 * Xác thực OTP 2FA trong quá trình đăng nhập để nhận JWT Token
 * Public API
 */
router.post('/2fa/verify-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và mã OTP 2FA.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await query.get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
    }

    const sec = await query.get('SELECT * FROM user_security WHERE user_id = ?', [user.id]);
    if (!sec || sec.two_factor_enabled !== 1 || !sec.two_factor_otp) {
      return res.status(400).json({ success: false, message: 'Yêu cầu 2FA không tồn tại hoặc tài khoản chưa bật 2FA.' });
    }

    if (sec.two_factor_otp.trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Mã OTP xác thực 2FA không chính xác.' });
    }

    // Xóa OTP sau khi dùng
    await query.run('UPDATE user_security SET two_factor_otp = NULL, two_factor_expires = NULL WHERE user_id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Xác thực 2 bước thành công! Đăng nhập hoàn tất.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xác thực 2FA đăng nhập: ' + err.message });
  }
});

module.exports = router;
