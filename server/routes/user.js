const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');

// GET /api/user/profile - Lấy hồ sơ cá nhân
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await query.get(
            'SELECT id, name, email, phone, address, avatar, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        // Lấy thêm danh sách đơn hàng của người dùng này
        const orders = await query.all(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        res.json({ success: true, user, orders: orders || [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + err.message });
    }
});

// PUT /api/user/profile - Cập nhật thông tin cá nhân
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Họ tên không được để trống' });
        }

        await query.run(
            'UPDATE users SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name.trim(), phone ? phone.trim() : null, address ? address.trim() : null, req.user.id]
        );

        res.json({ success: true, message: 'Cập nhật thông tin cá nhân thành công!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật: ' + err.message });
    }
});

// POST /api/user/avatar - Upload đổi ảnh đại diện Avatar
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn file hình ảnh' });
        }

        const avatarUrl = '/uploads/' + req.file.filename;
        await query.run(
            'UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [avatarUrl, req.user.id]
        );

        res.json({ success: true, message: 'Cập nhật ảnh đại diện thành công!', avatar: avatarUrl });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi tải ảnh đại diện: ' + err.message });
    }
});

module.exports = router;
