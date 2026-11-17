const request = require('supertest');
const app = require('../server');

describe('Wishlist Routes (/api/wishlist) - Nguyen Nu Hong Nhung', () => {
  let userToken;
  let testProductId;

  beforeAll(async () => {
    // Đăng nhập lấy token của User
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'khachhang@fashionhub.vn', password: 'User@123' });

    userToken = res.body.token;

    // Lấy 1 ID sản phẩm có sẵn trong Database để test
    const prodRes = await request(app).get('/api/products');
    if (prodRes.body && prodRes.body.products && prodRes.body.products.length > 0) {
      testProductId = prodRes.body.products[0].id;
    } else {
      testProductId = 1;
    }
  });

  describe('Bảo mật & Xác thực token', () => {
    it('từ chối xem danh sách yêu thích khi không gửi token (401)', async () => {
      const res = await request(app).get('/api/wishlist');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('từ chối thêm sản phẩm yêu thích khi chưa đăng nhập (401)', async () => {
      const res = await request(app).post(`/api/wishlist/${testProductId}`);
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Nghiệp vụ Yêu thích sản phẩm', () => {
    it('trả về 404 khi thêm sản phẩm không tồn tại vào wishlist', async () => {
      const res = await request(app)
        .post('/api/wishlist/999999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('thêm sản phẩm vào danh sách yêu thích thành công khi có token (201)', async () => {
      const res = await request(app)
        .post(`/api/wishlist/${testProductId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.success).toBe(true);
      expect(res.body.isWishlisted).toBe(true);
    });

    it('kiểm tra trạng thái sản phẩm đã được yêu thích trả về isWishlisted: true (200)', async () => {
      const res = await request(app)
        .get(`/api/wishlist/check/${testProductId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isWishlisted).toBe(true);
    });

    it('lấy danh sách sản phẩm yêu thích có chứa sản phẩm vừa thêm (200)', async () => {
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.wishlist)).toBe(true);
      expect(res.body.wishlist.some(item => item.product_id === testProductId)).toBe(true);
    });

    it('xóa sản phẩm khỏi danh sách yêu thích thành công (200)', async () => {
      const res = await request(app)
        .delete(`/api/wishlist/${testProductId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isWishlisted).toBe(false);
    });
  });
});