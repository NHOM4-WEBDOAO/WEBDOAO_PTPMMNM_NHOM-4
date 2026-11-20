const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Product Reviews Routes (/api/reviews) - Kiểm thử bởi Nguyễn Nữ Hồng Nhung', () => {
  let userToken;
  let otherUserToken;
  let adminToken;
  let createdReviewId;
  const testProductId = 1;

  beforeAll(() => {
    userToken = jwt.sign(
      { id: 2, email: 'khachhang@fashionhub.vn', name: 'Khách Hàng', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    otherUserToken = jwt.sign(
      { id: 99, email: 'other@fashionhub.vn', name: 'Người Lạ', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    adminToken = jwt.sign(
      { id: 1, email: 'admin@fashionhub.vn', name: 'Admin', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/reviews/product/:productId', () => {
    it('lấy danh sách đánh giá của sản phẩm thành công (200)', async () => {
      const res = await request(app).get(`/api/reviews/product/${testProductId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.reviews)).toBe(true);
      expect(res.body).toHaveProperty('avg_rating');
      expect(res.body).toHaveProperty('total_reviews');
    });
  });

  describe('POST /api/reviews (Gửi đánh giá)', () => {
    it('từ chối gửi đánh giá khi chưa đăng nhập (401)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({ product_id: testProductId, rating: 5, comment: 'Chất vải rất đẹp!' });
      expect(res.statusCode).toBe(401);
    });

    it('trả về 400 nếu thiếu số sao hoặc nhận xét', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: testProductId });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('trả về 400 nếu số sao ngoài khoảng 1-5', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: testProductId, rating: 6, comment: 'Quá 5 sao' });
      expect(res.statusCode).toBe(400);
    });

    it('gửi đánh giá sản phẩm thành công khi hợp lệ (201)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          product_id: testProductId,
          rating: 5,
          comment: 'Form áo rất vừa vặn, giao hàng nhanh chóng 5 sao!'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.review).toHaveProperty('id');
      expect(res.body.review.rating).toBe(5);
      createdReviewId = res.body.review.id;
    });
  });

  describe('DELETE /api/reviews/:id (Xóa đánh giá)', () => {
    it('từ chối người dùng khác xóa đánh giá không phải của mình (403)', async () => {
      const res = await request(app)
        .delete(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('cho phép tác giả xóa đánh giá của mình thành công (200)', async () => {
      const res = await request(app)
        .delete(`/api/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('thành công');
    });
  });
});