const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Middleware Rate Limiting bảo vệ các endpoint xác thực nhạy cảm (Vượt qua CodeQL)
const rateLimitMap = new Map();
const rateLimiter = (req, res, next) => {
  const key = req.user ? `user_${req.user.id}` : (req.ip || 'anonymous');
  const now = Date.now();
  const limit = 60;
  const windowMs = 60 * 1000;

  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }
  rateLimitMap.set(key, record);

  if (record.count > limit) {
    return res.status(429).json({ success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' });
  }
  next();
};

// Tự động khởi tạo bảng reviews nếu chưa có
let tablePromise = null;
function ensureTable() {
  if (!tablePromise) {
    tablePromise = query.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
  }
  return tablePromise;
}

/**
 * GET /api/reviews/product/:productId
 * Lấy danh sách đánh giá và điểm sao trung bình của sản phẩm
 */
router.get('/product/:productId', async (req, res) => {
  try {
    await ensureTable();
    const { productId } = req.params;
    const reviews = await query.all(`
      SELECT r.*, u.avatar as user_avatar 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [productId]);

    const stats = await query.get(`
      SELECT 
        ROUND(AVG(rating), 1) as avg_rating,
        COUNT(*) as total_reviews
      FROM reviews
      WHERE product_id = ?
    `, [productId]);

    res.json({
      success: true,
      reviews: reviews || [],
      avg_rating: stats && stats.avg_rating ? stats.avg_rating : 5.0,
      total_reviews: stats ? stats.total_reviews : 0
    });
  } catch (error) {
    console.error('Lỗi lấy đánh giá sản phẩm:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải đánh giá.' });
  }
});

/**
 * POST /api/reviews
 * Gửi đánh giá sao mới cho sản phẩm (Yêu cầu đăng nhập + Rate Limiter)
 */
router.post('/', verifyToken, rateLimiter, async (req, res) => {
  try {
    await ensureTable();
    const { product_id, rating, comment } = req.body;
    if (!product_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã sản phẩm, số sao đánh giá (1-5) và nội dung nhận xét.'
      });
    }

    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Điểm đánh giá phải là số nguyên từ 1 đến 5 sao.'
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await query.get('SELECT id FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
    }

    const user = await query.get('SELECT name FROM users WHERE id = ?', [req.user.id]);
    const userName = user ? user.name : 'Khách hàng';

    const result = await query.run(`
      INSERT INTO reviews (product_id, user_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `, [product_id, req.user.id, userName, numRating, comment.trim()]);

    const newReview = await query.get('SELECT * FROM reviews WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Gửi đánh giá sản phẩm thành công! Cảm ơn bạn đã phản hồi.',
      review: newReview
    });
  } catch (error) {
    console.error('Lỗi gửi đánh giá sản phẩm:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi gửi đánh giá.' });
  }
});

/**
 * DELETE /api/reviews/:id
 * Xóa đánh giá (Chỉ người viết hoặc Quản trị viên + Rate Limiter)
 */
router.delete('/:id', verifyToken, rateLimiter, async (req, res) => {
  try {
    await ensureTable();
    const { id } = req.params;
    const review = await query.get('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Đánh giá không tồn tại.' });
    }

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa đánh giá của người khác.' });
    }

    await query.run('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ success: true, message: 'Đã xóa đánh giá sản phẩm thành công!' });
  } catch (error) {
    console.error('Lỗi xóa đánh giá:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa đánh giá.' });
  }
});

module.exports = router;