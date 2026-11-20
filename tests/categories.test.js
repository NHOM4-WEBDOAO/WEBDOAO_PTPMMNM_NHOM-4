const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Categories Routes (/api/categories) - Kiểm thử bởi Nguyễn Nữ Hồng Nhung', () => {
  let adminToken;
  let userToken;
  let createdCategoryId;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: 1, email: 'admin@fashionhub.vn', name: 'Admin Aura', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    userToken = jwt.sign(
      { id: 2, email: 'khachhang@fashionhub.vn', name: 'Khách Hàng', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/categories (Danh sách danh mục)', () => {
    it('1. lấy toàn bộ danh mục kèm số lượng sản phẩm product_count (200)', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.categories)).toBe(true);
      expect(res.body.categories.length).toBeGreaterThan(0);
      expect(res.body.categories[0]).toHaveProperty('product_count');
    });
  });

  describe('GET /api/categories/:slug (Chi tiết danh mục)', () => {
    it('2. lấy chi tiết danh mục hợp lệ kèm danh sách sản phẩm (200)', async () => {
      const res = await request(app).get('/api/categories/ao-thoi-trang');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.category).toHaveProperty('products');
      expect(Array.isArray(res.body.category.products)).toBe(true);
    });

    it('3. báo lỗi 404 khi truy cập danh mục không tồn tại', async () => {
      const res = await request(app).get('/api/categories/slug-khong-ton-tai-999');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/categories (Thêm danh mục mới)', () => {
    it('4. từ chối người dùng thông thường khi tạo danh mục (403)', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Bộ Sưu Tập Giày' });
      expect(res.statusCode).toBe(403);
    });

    it('5. Quản trị viên thêm danh mục thời trang mới thành công (201)', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Đồ Thể Thao Năng Động ${Date.now()}`,
          description: 'Quần áo tập gym, yoga thoáng khí'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.category).toHaveProperty('id');
      createdCategoryId = res.body.category.id;
    });
  });

  describe('DELETE /api/categories/:id (Xóa danh mục)', () => {
    it('6. Quản trị viên xóa danh mục thành công (200)', async () => {
      const res = await request(app)
        .delete(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('thành công');
    });
  });
});