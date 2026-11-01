const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Coupons & Discounts Routes (/api/coupons)', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = jwt.sign(
      { id: 1, email: 'admin@fashionhub.vn', name: 'Admin Aura', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    userToken = jwt.sign(
      { id: 2, email: 'khachhang@fashionhub.vn', name: 'Khách hàng', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  test('GET /api/coupons - Lấy danh sách mã giảm giá thành công (200)', async () => {
    const res = await request(app).get('/api/coupons');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.coupons)).toBe(true);
  });

  test('POST /api/coupons/apply - Từ chối khi không gửi mã giảm giá (400)', async () => {
    const res = await request(app).post('/api/coupons/apply').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/coupons/apply - Báo lỗi khi mã không tồn tại (404)', async () => {
    const res = await request(app).post('/api/coupons/apply').send({ code: 'SAI_MA_999', totalAmount: 500000 });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/coupons/apply - Áp dụng mã hợp lệ thành công (200)', async () => {
    const res = await request(app).post('/api/coupons/apply').send({ code: 'AURA10', totalAmount: 200000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.coupon).toHaveProperty('discount');
    expect(res.body.coupon).toHaveProperty('finalAmount');
  });

  test('POST /api/coupons - Từ chối người dùng thường tạo mã giảm giá (403)', async () => {
    const res = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ code: 'HACK100', discount_percent: 50 });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/coupons - Cho phép Admin tạo mã giảm giá mới (201)', async () => {
    const res = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ code: `SALE${Date.now().toString().slice(-4)}`, discount_percent: 20, min_order_value: 150000 });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});