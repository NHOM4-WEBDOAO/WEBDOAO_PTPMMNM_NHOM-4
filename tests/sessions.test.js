const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { query } = require('../server/config/db');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('Login Sessions & Security Audit Routes (/api/sessions)', () => {
  let userToken = '';
  let testUserId = null;
  let testSessionId = null;
  const testEmail = `session_user_${Date.now()}@example.com`;

  beforeAll(async () => {
    const res = await query.run(
      'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, 1)',
      ['Session Test User', testEmail, 'HashedPass@123', 'user']
    );
    testUserId = res.lastID;

    userToken = jwt.sign(
      { id: testUserId, email: testEmail, name: 'Session Test User', role: 'user' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    if (testUserId) {
      await query.run('DELETE FROM login_sessions WHERE user_id = ?', [testUserId]);
      await query.run('DELETE FROM users WHERE id = ?', [testUserId]);
    }
  });

  it('GET /api/sessions - từ chối khi chưa đăng nhập (401)', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/sessions/record - ghi nhận phiên đăng nhập mới thành công (201)', async () => {
    const res = await request(app)
      .post('/api/sessions/record')
      .set('Authorization', `Bearer ${userToken}`)
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0')
      .send({});

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.deviceType).toBe('Desktop');
    testSessionId = res.body.sessionId;
  });

  it('GET /api/sessions - lấy danh sách phiên của user (200)', async () => {
    const res = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.sessions)).toBe(true);
    expect(res.body.sessions.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/sessions/active-count - đếm số phiên đang hoạt động (200)', async () => {
    const res = await request(app)
      .get('/api/sessions/active-count')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.activeCount).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/sessions/:id - thu hồi 1 phiên đăng nhập thành công (200)', async () => {
    const res = await request(app)
      .delete(`/api/sessions/${testSessionId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/sessions/:id - báo lỗi 404 khi phiên không tồn tại', async () => {
    const res = await request(app)
      .delete('/api/sessions/999999')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });

  it('POST /api/sessions/revoke-all - đăng xuất tất cả các phiên thành công (200)', async () => {
    const res = await request(app)
      .post('/api/sessions/revoke-all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});