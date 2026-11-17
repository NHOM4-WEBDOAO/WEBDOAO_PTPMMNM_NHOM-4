const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Đảm bảo bảng wishlist đã được khởi tạo trong SQLite
async function ensureWishlistTable() {
  await query.exec(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );
  `);
}

/**
 * GET /api/wishlist
 * Lấy danh sách sản phẩm yêu thích của người dùng hiện tại
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    await ensureWishlistTable();
    const userId = req.user.id;

    const items = await query.all(`
      SELECT w.id as wishlist_id, w.created_at as added_at,
             p.id as product_id, p.name, p.slug, p.price, p.original_price, p.image, p.stock,
             c.name as category_name
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      count: items.length,
      wishlist: items
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách yêu thích:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải danh sách yêu thích' });
  }
});

/**
 * POST /api/wishlist/:productId
 * Thêm sản phẩm vào danh sách yêu thích
 */
router.post('/:productId', verifyToken, async (req, res) => {
  try {
    await ensureWishlistTable();
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    // Kiểm tra sản phẩm có tồn tại trong hệ thống không
    const product = await query.get('SELECT id, name FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    // Kiểm tra đã có trong danh sách yêu thích chưa
    const existing = await query.get('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existing) {
      return res.status(200).json({ success: true, message: 'Sản phẩm đã có trong danh sách yêu thích', isWishlisted: true });
    }

    await query.run('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, productId]);

    res.status(201).json({
      success: true,
      message: `Đã thêm "${product.name}" vào danh sách yêu thích`,
      isWishlisted: true
    });
  } catch (error) {
    console.error('Lỗi thêm sản phẩm yêu thích:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm sản phẩm yêu thích' });
  }
});

/**
 * DELETE /api/wishlist/:productId
 * Xóa sản phẩm khỏi danh sách yêu thích
 */
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    await ensureWishlistTable();
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    await query.run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);

    res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
      isWishlisted: false
    });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm yêu thích:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa sản phẩm yêu thích' });
  }
});

/**
 * GET /api/wishlist/check/:productId
 * Kiểm tra trạng thái sản phẩm đã được yêu thích hay chưa
 */
router.get('/check/:productId', verifyToken, async (req, res) => {
  try {
    await ensureWishlistTable();
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    const existing = await query.get('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);

    res.json({
      success: true,
      productId,
      isWishlisted: Boolean(existing)
    });
  } catch (error) {
    console.error('Lỗi kiểm tra yêu thích:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi kiểm tra yêu thích' });
  }
});

module.exports = router;