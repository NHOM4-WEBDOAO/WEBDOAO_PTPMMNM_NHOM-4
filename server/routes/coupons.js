const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

let tablePromise = null;
function ensureTable() {
  if (!tablePromise) {
    tablePromise = (async () => {
      await query.run(`
        CREATE TABLE IF NOT EXISTS coupons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          discount_percent INTEGER DEFAULT 0,
          discount_amount REAL DEFAULT 0,
          min_order_value REAL DEFAULT 0,
          max_discount REAL DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const count = await query.get('SELECT COUNT(*) as count FROM coupons');
      if (count && count.count === 0) {
        await query.run(
          'INSERT INTO coupons (code, discount_percent, min_order_value, max_discount) VALUES (?, ?, ?, ?)',
          ['AURA10', 10, 100000, 50000]
        );
        await query.run(
          'INSERT INTO coupons (code, discount_amount, min_order_value) VALUES (?, ?, ?)',
          ['FREESHIP', 30000, 200000]
        );
      }
    })();
  }
  return tablePromise;
}

// GET /api/coupons - Lấy danh sách mã giảm giá đang hoạt động
router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const coupons = await query.all(
      'SELECT id, code, discount_percent, discount_amount, min_order_value, max_discount FROM coupons WHERE is_active = 1'
    );
    res.json({ success: true, coupons: coupons || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tải mã giảm giá: ' + err.message });
  }
});

// POST /api/coupons/apply - Áp dụng mã giảm giá cho giỏ hàng
router.post('/apply', async (req, res) => {
  try {
    await ensureTable();
    const { code, totalAmount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mã giảm giá!' });
    }

    const coupon = await query.get(
      'SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1',
      [code.trim()]
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn!' });
    }

    const orderTotal = Number(totalAmount) || 0;
    if (orderTotal < coupon.min_order_value) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${(coupon.min_order_value).toLocaleString('vi-VN')}đ để dùng mã này!`
      });
    }

    let discount = 0;
    if (coupon.discount_percent > 0) {
      discount = (orderTotal * coupon.discount_percent) / 100;
      if (coupon.max_discount > 0 && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else if (coupon.discount_amount > 0) {
      discount = coupon.discount_amount;
    }

    if (discount > orderTotal) discount = orderTotal;
    const finalAmount = orderTotal - discount;

    res.json({
      success: true,
      message: `Áp dụng mã ${coupon.code} thành công! Giảm ${discount.toLocaleString('vi-VN')}đ`,
      coupon: {
        code: coupon.code,
        discount,
        finalAmount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tính toán giảm giá: ' + err.message });
  }
});

// POST /api/coupons - Admin tạo mã giảm giá mới
router.post('/', requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { code, discount_percent, discount_amount, min_order_value, max_discount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá không được để trống!' });
    }

    await query.run(
      `INSERT INTO coupons (code, discount_percent, discount_amount, min_order_value, max_discount)
       VALUES (?, ?, ?, ?, ?)`,
      [
        code.trim().toUpperCase(),
        Number(discount_percent) || 0,
        Number(discount_amount) || 0,
        Number(min_order_value) || 0,
        Number(max_discount) || 0
      ]
    );

    res.status(201).json({ success: true, message: 'Tạo mã giảm giá mới thành công!' });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá này đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: 'Lỗi tạo mã: ' + err.message });
  }
});

module.exports = router;