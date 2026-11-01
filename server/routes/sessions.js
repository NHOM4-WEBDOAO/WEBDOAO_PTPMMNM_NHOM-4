const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Khởi tạo bảng login_sessions nếu chưa có
query.run(`
  CREATE TABLE IF NOT EXISTS login_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ip_address TEXT DEFAULT '127.0.0.1',
    user_agent TEXT DEFAULT 'Unknown',
    device_type TEXT DEFAULT 'Desktop',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`).catch(() => {});

// Helper phát hiện loại thiết bị từ User-Agent
function detectDevice(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'Mobile';
  if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
  return 'Desktop';
}

/**
 * 1. GET /api/sessions - Lấy danh sách các phiên đăng nhập của người dùng
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const sessions = await query.all(
      'SELECT id, ip_address, user_agent, device_type, is_active, created_at, last_active FROM login_sessions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, sessions: sessions || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách phiên: ' + err.message });
  }
});

/**
 * 2. POST /api/sessions/record - Ghi nhận phiên đăng nhập mới
 */
router.post('/record', verifyToken, async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || req.body.userAgent || 'Chrome / Windows';
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const deviceType = detectDevice(userAgent);

    const result = await query.run(
      'INSERT INTO login_sessions (user_id, ip_address, user_agent, device_type, is_active) VALUES (?, ?, ?, ?, 1)',
      [req.user.id, ipAddress, userAgent, deviceType]
    );

    res.status(201).json({
      success: true,
      message: 'Đã ghi nhận phiên đăng nhập thành công!',
      sessionId: result.lastID,
      deviceType
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi ghi nhận phiên: ' + err.message });
  }
});

/**
 * 3. DELETE /api/sessions/:id - Đăng xuất / thu hồi 1 phiên cụ thể
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const session = await query.get(
      'SELECT * FROM login_sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên đăng nhập hoặc không có quyền.' });
    }

    await query.run(
      'UPDATE login_sessions SET is_active = 0, last_active = CURRENT_TIMESTAMP WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Đã thu hồi phiên đăng nhập thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi thu hồi phiên: ' + err.message });
  }
});

/**
 * 4. POST /api/sessions/revoke-all - Đăng xuất khỏi tất cả các thiết bị khác
 */
router.post('/revoke-all', verifyToken, async (req, res) => {
  try {
    await query.run(
      'UPDATE login_sessions SET is_active = 0, last_active = CURRENT_TIMESTAMP WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ success: true, message: 'Đã đăng xuất khỏi tất cả các thiết bị khác thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi đăng xuất thiết bị: ' + err.message });
  }
});

/**
 * 5. GET /api/sessions/active-count - Đếm số lượng phiên đang hoạt động
 */
router.get('/active-count', verifyToken, async (req, res) => {
  try {
    const row = await query.get(
      'SELECT COUNT(*) as count FROM login_sessions WHERE user_id = ? AND is_active = 1',
      [req.user.id]
    );
    res.json({ success: true, activeCount: row ? row.count : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi đếm số phiên: ' + err.message });
  }
});

module.exports = router;