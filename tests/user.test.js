const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../server/middleware/auth');

describe('User Profile Routes (/api/user)', () => {
    let userToken;

    beforeAll(() => {
        userToken = jwt.sign({ id: 2, email: 'khachhang@fashionhub.vn', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
    });

    test('từ chối khi chưa đăng nhập (401)', async () => {
        const res = await request(app).get('/api/user/profile');
        expect(res.statusCode).toBe(401);
    });

    test('lấy hồ sơ cá nhân thành công khi có token (200)', async () => {
        const res = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('user');
    });

    test('từ chối cập nhật nếu họ tên để trống (400)', async () => {
        const res = await request(app)
            .put('/api/user/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: '' });
        expect(res.statusCode).toBe(400);
    });

    test('cập nhật thông tin cá nhân thành công (200)', async () => {
        const res = await request(app)
            .put('/api/user/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Phan Tấn Kiệt', phone: '0912345678', address: 'TP. Hồ Chí Minh' });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
