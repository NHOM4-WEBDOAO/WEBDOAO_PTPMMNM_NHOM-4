const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { query } = require('../server/config/db');
const { JWT_SECRET } = require('../server/middleware/auth');

jest.mock('../server/config/mailer', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true })
}));

describe('Security & 2FA Routes (/api/security)', () => {
  let userToken = '';
  let testUserId = null;
  const testEmail = `sec_user_${Date.now()}@example.com`;
  const testPassword = 'Password@123';

  beforeAll(async () => {
    // Tạo tài khoản test
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(testPassword, 10);
    const res = await query.run(
      'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, 1)',
      ['Security Test User', testEmail, hash, 'user']
    );
    testUserId = res.lastID;

    userToken = jwt.sign(
      { id: testUserId, email: testEmail, name: 'Security Test User', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    if (testUserId) {
      await query.run('DELETE FROM user_security WHERE user_id = ?', [testUserId]);
      await query.run('DELETE FROM users WHERE id = ?', [testUserId]);
    }
  });

  describe('POST /api/security/check-password-strength', () => {
    it('trả về 400 nếu không truyền password', async () => {
      const res = await request(app)
        .post('/api/security/check-password-strength')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('phát hiện mật khẩu phổ biến/yếu (isCommon = true)', async () => {
      const res = await request(app)
        .post('/api/security/check-password-strength')
        .send({ password: '123456' });
      expect(res.statusCode).toBe(200);
      expect(res.body.isCommon).toBe(true);
      expect(res.body.level).toBe('Rất yếu');
    });

    it('đánh giá điểm cao cho mật khẩu phức tạp, an toàn', async () => {
      const res = await request(app)
        .post('/api/security/check-password-strength')
        .send({ password: 'AuraFashion@2026!Secured' });
      expect(res.statusCode).toBe(200);
      expect(res.body.score).toBeGreaterThanOrEqual(80);
      expect(res.body.level).toBe('Rất mạnh');
    });
  });

  describe('GET /api/security/status', () => {
    it('từ chối khi chưa đăng nhập (401)', async () => {
      const res = await request(app).get('/api/security/status');
      expect(res.statusCode).toBe(401);
    });

    it('trả về thông tin bảo mật của tài khoản khi có token (200)', async () => {
      const res = await request(app)
        .get('/api/security/status')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.security.email).toBe(testEmail);
      expect(res.body.security).toHaveProperty('twoFactorEnabled');
    });
  });

  describe('POST /api/security/2fa/request-otp & /enable & /disable', () => {
    let generatedOtp = '';

    it('tạo mã OTP 2FA thành công khi có token', async () => {
      const res = await request(app)
        .post('/api/security/2fa/request-otp')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.devInfo).toHaveProperty('otp');
      generatedOtp = res.body.devInfo.otp;
    });

    it('báo lỗi khi gửi sai mã OTP kích hoạt 2FA (400)', async () => {
      const res = await request(app)
        .post('/api/security/2fa/enable')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ otp: '000000' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('kích hoạt 2FA thành công khi gửi đúng mã OTP (200)', async () => {
      const res = await request(app)
        .post('/api/security/2fa/enable')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ otp: generatedOtp });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Kiểm tra lại trạng thái
      const statusRes = await request(app)
        .get('/api/security/status')
        .set('Authorization', `Bearer ${userToken}`);
      expect(statusRes.body.security.twoFactorEnabled).toBe(true);
    });

    it('từ chối hủy 2FA nếu mật khẩu xác nhận không đúng (400)', async () => {
      const res = await request(app)
        .post('/api/security/2fa/disable')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ password: 'WrongPassword@999' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('hủy kích hoạt 2FA thành công khi mật khẩu xác nhận chính xác (200)', async () => {
      const res = await request(app)
        .post('/api/security/2fa/disable')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ password: testPassword });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Kiểm tra lại trạng thái
      const statusRes = await request(app)
        .get('/api/security/status')
        .set('Authorization', `Bearer ${userToken}`);
      expect(statusRes.body.security.twoFactorEnabled).toBe(false);
    });
  });

  describe('POST /api/security/2fa/verify-login', () => {
    it('báo lỗi 400 nếu thiếu email hoặc otp', async () => {
      const res = await request(app)
        .post('/api/security/2fa/verify-login')
        .send({ email: testEmail });
      expect(res.statusCode).toBe(400);
    });

    it('báo lỗi 404 nếu email người dùng không tồn tại', async () => {
      const res = await request(app)
        .post('/api/security/2fa/verify-login')
        .send({ email: 'nonexistent@example.com', otp: '123456' });
      expect(res.statusCode).toBe(404);
    });
  });
});
