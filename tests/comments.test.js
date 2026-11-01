const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Blog Comments Routes (/api/comments)', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { id: 2, email: 'khachhang@fashionhub.vn', name: 'Khách hàng', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  test('lấy danh sách bình luận của bài viết thành công (200)', async () => {
    const res = await request(app).get('/api/comments/post/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('từ chối bình luận khi chưa đăng nhập (401)', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ postId: 1, content: 'Bài viết rất hay!' });
    expect(res.statusCode).toBe(401);
  });

  test('gửi bình luận thành công khi có token (201)', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ postId: 1, content: 'Thời trang AURA thật tuyệt vời!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});