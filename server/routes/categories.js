const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

// Middleware Rate Limiting bảo vệ các endpoint quản trị nhạy cảm
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

// Helper tạo slug từ tên danh mục
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * GET /api/categories
 * Lấy danh sách toàn bộ danh mục kèm số lượng sản phẩm thực tế (product_count)
 */
router.get('/', async (req, res) => {
  try {
    const categories = await query.all(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `);

    res.json({
      success: true,
      message: 'Lấy danh sách danh mục thành công!',
      categories: categories || []
    });
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải danh mục.' });
  }
});

/**
 * GET /api/categories/:slug
 * Xem chi tiết danh mục và các sản phẩm thuộc danh mục đó
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await query.get(
      'SELECT * FROM categories WHERE slug = ? OR id = ?',
      [slug, slug]
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục này.' });
    }

    const products = await query.all(
      'SELECT id, name, slug, price, original_price, image FROM products WHERE category_id = ? ORDER BY created_at DESC',
      [category.id]
    );

    res.json({
      success: true,
      category: {
        ...category,
        products: products || []
      }
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết danh mục:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
});

/**
 * POST /api/categories
 * Quản trị viên thêm mới danh mục thời trang
 */
router.post('/', requireAdmin, rateLimiter, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc.' });
    }

    let slug = slugify(name);
    if (!slug) slug = 'danh-muc-' + Date.now();

    // Kiểm tra trùng lặp slug
    const existing = await query.get('SELECT id FROM categories WHERE slug = ?', [slug]);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const defaultImage = image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80';

    const result = await query.run(`
      INSERT INTO categories (name, slug, description, image)
      VALUES (?, ?, ?, ?)
    `, [name.trim(), slug, description ? description.trim() : '', defaultImage]);

    const newCategory = await query.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Thêm danh mục thời trang mới thành công!',
      category: newCategory
    });
  } catch (error) {
    console.error('Lỗi thêm danh mục:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo danh mục.' });
  }
});

/**
 * PUT /api/categories/:id
 * Quản trị viên cập nhật danh mục
 */
router.put('/:id', requireAdmin, rateLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await query.get('SELECT * FROM categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }

    await query.run(`
      UPDATE categories
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          image = COALESCE(?, image)
      WHERE id = ?
    `, [name ? name.trim() : null, description ? description.trim() : null, image || null, id]);

    const updated = await query.get('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công!',
      category: updated
    });
  } catch (error) {
    console.error('Lỗi cập nhật danh mục:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
});

/**
 * DELETE /api/categories/:id
 * Quản trị viên xóa danh mục
 */
router.delete('/:id', requireAdmin, rateLimiter, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await query.get('SELECT * FROM categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }

    await query.run('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa danh mục thời trang thành công!'
    });
  } catch (error) {
    console.error('Lỗi xóa danh mục:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa danh mục.' });
  }
});

module.exports = router;