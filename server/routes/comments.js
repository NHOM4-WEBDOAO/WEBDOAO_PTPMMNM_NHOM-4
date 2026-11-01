const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Tự động khởi tạo bảng comments nếu chưa có
query.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`).catch(() => {});

// GET /api/comments/post/:postId - Lấy danh sách bình luận của bài viết
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await query.all(
      `SELECT c.*, u.name as user_name, u.avatar as user_avatar 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = ? 
       ORDER BY c.created_at DESC`,
      [req.params.postId]
    );
    res.json({ success: true, comments: comments || [] });
  } catch (err) {
    res.json({ success: true, comments: [] });
  }
});

// POST /api/comments - Gửi bình luận mới
router.post('/', verifyToken, async (req, res) => {
  const { postId, content } = req.body;
  if (!postId || !content) {
    return res.status(400).json({ success: false, message: 'Thiếu mã bài viết hoặc nội dung bình luận!' });
  }
  try {
    await query.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, req.user.id, content.trim()]
    );
    res.status(201).json({ success: true, message: 'Đã gửi bình luận thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi gửi bình luận: ' + err.message });
  }
});

module.exports = router;