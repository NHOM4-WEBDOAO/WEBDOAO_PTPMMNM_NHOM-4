const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Đảm bảo bảng posts có cột likes (Tự động khởi tạo nếu chưa có)
async function ensureLikesColumn() {
  try {
    const cols = await query.all(`PRAGMA table_info(posts)`);
    const hasLikes = cols && cols.some(c => c.name === 'likes');
    if (!hasLikes) {
      await query.run(`ALTER TABLE posts ADD COLUMN likes INTEGER DEFAULT 0`);
    }
  } catch (err) {
    // Bỏ qua nếu cột đã tồn tại
  }
}
ensureLikesColumn();

// Helper to convert title to slug
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
 * GET /api/posts
 * Xem danh sách bài viết & Tìm kiếm bài viết
 */
router.get('/', async (req, res) => {
  try {
    const { q, category, limit = 20, page = 1 } = req.query;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    let sql = `
      SELECT p.*, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Search query
    if (q && q.trim()) {
      sql += ` AND (p.title LIKE ? OR p.summary LIKE ? OR p.content LIKE ?)`;
      const searchTerm = `%${q.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category && category.trim() && category !== 'Tất cả') {
      sql += ` AND p.category = ?`;
      params.push(category.trim());
    }

    // Count total matching
    const countSql = sql.replace('SELECT p.*, u.avatar as author_avatar', 'SELECT COUNT(*) as total');
    const totalRow = await query.get(countSql, params);
    const total = totalRow ? totalRow.total : 0;

    sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const posts = await query.all(sql, params);

    // Get categories list for filter dropdown
    const categories = await query.all(`
      SELECT DISTINCT category FROM posts WHERE category IS NOT NULL AND category != ''
    `);

    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách bài viết:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải danh sách bài viết.' });
  }
});

/**
 * GET /api/posts/featured/trending
 * Lấy Top 5 bài viết thịnh hành nhất và tính toán thời gian đọc (Reading Time)
 */
router.get('/featured/trending', async (req, res) => {
  try {
    const trendingPosts = await query.all(`
      SELECT id, title, slug, category, summary, thumbnail, views, likes, created_at,
             ROUND((LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1) / 200.0 + 0.5) as reading_minutes
      FROM posts 
      ORDER BY (COALESCE(views, 0) * 1 + COALESCE(likes, 0) * 3) DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      message: 'Lấy danh sách bài viết thịnh hành thành công!',
      trending: trendingPosts
    });
  } catch (error) {
    console.error('Lỗi lấy bài viết thịnh hành:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
});

/**
 * GET /api/posts/tags/popular
 * Lấy danh sách các Hashtag thời trang thịnh hành nhất
 */
router.get('/tags/popular', (req, res) => {
  const popularTags = [
    { tag: '#OOTD', name: 'Trang phục trong ngày', count: 12 },
    { tag: '#Streetwear', name: 'Thời trang dạo phố', count: 9 },
    { tag: '#Minimalism', name: 'Phong cách tối giản', count: 8 },
    { tag: '#Summer2026', name: 'Bộ sưu tập mùa hè', count: 15 },
    { tag: '#AuraFashion', name: 'Phong cách AURA', count: 20 }
  ];
  res.json({ success: true, tags: popularTags });
});

/**
 * GET /api/posts/:id
 * Xem chi tiết bài viết và tăng lượt xem
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await query.get(`
      SELECT p.*, u.name as author_full_name, u.avatar as author_avatar, u.email as author_email
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ? OR p.slug = ?
    `, [id, id]);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    }

    // Increment views asynchronously
    query.run('UPDATE posts SET views = views + 1 WHERE id = ?', [post.id]).catch(console.error);
    post.views += 1;

    // Get related posts
    const related = await query.all(`
      SELECT id, title, slug, thumbnail, category, created_at, views
      FROM posts
      WHERE id != ? AND category = ?
      ORDER BY created_at DESC LIMIT 3
    `, [post.id, post.category]);

    res.json({
      success: true,
      post,
      related
    });
  } catch (error) {
    console.error('Lỗi lấy chi tiết bài viết:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tải chi tiết bài viết.' });
  }
});

/**
 * POST /api/posts
 * Tạo bài viết mới (Cần đăng nhập)
 */
router.post('/', verifyToken, upload.single('thumbnailFile'), async (req, res) => {
  try {
    const { title, category, summary, content, thumbnailUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung bài viết là bắt buộc.' });
    }

    let finalThumbnail = thumbnailUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80';
    if (req.file) {
      finalThumbnail = '/uploads/' + req.file.filename;
    }

    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = 'bai-viet-' + Date.now();
    let uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const user = await query.get('SELECT id, name FROM users WHERE id = ?', [req.user.id]);
    const authorName = user ? user.name : 'Tác giả';

    const result = await query.run(`
      INSERT INTO posts (title, slug, category, summary, content, thumbnail, author_id, author_name, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      title.trim(),
      uniqueSlug,
      category ? category.trim() : 'Xu hướng',
      summary ? summary.trim() : title.trim(),
      content.trim(),
      finalThumbnail,
      req.user.id,
      authorName
    ]);

    const newPost = await query.get('SELECT * FROM posts WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Tạo bài viết mới thành công!',
      post: newPost
    });
  } catch (error) {
    console.error('Lỗi tạo bài viết:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo bài viết mới.' });
  }
});

/**
 * PUT /api/posts/:id
 * Cập nhật thông tin bài viết (Tác giả hoặc Admin)
 */
router.put('/:id', verifyToken, upload.single('thumbnailFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, summary, content, thumbnailUrl } = req.body;

    const post = await query.get('SELECT * FROM posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết để cập nhật.' });
    }

    // Permission check: only author or admin
    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa bài viết của người khác.' });
    }

    let finalThumbnail = post.thumbnail;
    if (req.file) {
      finalThumbnail = '/uploads/' + req.file.filename;
    } else if (thumbnailUrl && thumbnailUrl.trim()) {
      finalThumbnail = thumbnailUrl.trim();
    }

    await query.run(`
      UPDATE posts 
      SET title = ?, category = ?, summary = ?, content = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title ? title.trim() : post.title,
      category ? category.trim() : post.category,
      summary ? summary.trim() : post.summary,
      content ? content.trim() : post.content,
      finalThumbnail,
      id
    ]);

    const updatedPost = await query.get('SELECT * FROM posts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cập nhật bài viết thành công!',
      post: updatedPost
    });
  } catch (error) {
    console.error('Lỗi cập nhật bài viết:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật bài viết.' });
  }
});

/**
 * POST /api/posts/:id/like
 * Thả tim / Tăng lượt thích bài viết (Nguyễn Như Hồng Hạnh - hanhnguyen230505-code)
 */
router.post('/:id/like', async (req, res) => {
  try {
    await ensureLikesColumn();
    const { id } = req.params;

    const post = await query.get('SELECT id, likes FROM posts WHERE id = ? OR slug = ?', [id, id]);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
    }

    const newLikes = (post.likes || 0) + 1;
    await query.run('UPDATE posts SET likes = ? WHERE id = ?', [newLikes, post.id]);

    res.json({
      success: true,
      message: 'Thả tim bài viết thành công!',
      likes: newLikes
    });
  } catch (error) {
    console.error('Lỗi thả tim bài viết:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thả tim bài viết.' });
  }
});

/**
 * DELETE /api/posts/:id
 * Xóa thông tin bài viết (Tác giả hoặc Admin)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await query.get('SELECT * FROM posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại hoặc đã bị xóa.' });
    }

    // Permission check
    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa bài viết này.' });
    }

    await query.run('DELETE FROM posts WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Đã xóa bài viết thành công!'
    });
  } catch (error) {
    console.error('Lỗi xóa bài viết:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa bài viết.' });
  }
});

module.exports = router;