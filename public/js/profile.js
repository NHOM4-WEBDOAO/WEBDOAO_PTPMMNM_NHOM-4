/**
 * Profile Module: Quản lý thông tin cá nhân và lịch sử đơn hàng
 * Tác giả: Phan Tấn Kiệt (Trưởng nhóm)
 */

const profile = {
    state: {
        user: null,
        orders: []
    },

    init: async () => {
        if (!auth.state.isLoggedIn) return;
        await profile.loadProfile();
    },

    loadProfile: async () => {
        try {
            const res = await api.get('/user/profile');
            if (res.success) {
                profile.state.user = res.user;
                profile.state.orders = res.orders || [];
                profile.renderProfile();
            }
        } catch (err) {
            console.warn('Lỗi tải thông tin cá nhân:', err.message);
        }
    },

    renderProfile: () => {
        const container = document.getElementById('profile-content-container');
        if (!container || !profile.state.user) return;

        const u = profile.state.user;
        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        const phoneInput = document.getElementById('profile-phone');
        const addressInput = document.getElementById('profile-address');

        if (nameInput) nameInput.value = u.name || '';
        if (emailInput) emailInput.value = u.email || '';
        if (phoneInput) phoneInput.value = u.phone || '';
        if (addressInput) addressInput.value = u.address || '';

        // Render danh sách đơn hàng đã mua
        const ordersContainer = document.getElementById('my-orders-list');
        if (ordersContainer) {
            if (profile.state.orders.length === 0) {
                ordersContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 30px;">Bạn chưa có đơn hàng nào.</div>';
            } else {
                ordersContainer.innerHTML = profile.state.orders.map(o => `
          <div style="border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 12px; background: var(--bg-card);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <strong>Đơn hàng #${o.id}</strong>
              <span class="badge badge-primary">${o.status}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              Ngày đặt: ${new Date(o.created_at).toLocaleDateString('vi-VN')} • Tổng tiền: <strong style="color: var(--rose);">${(o.total_amount || 0).toLocaleString('vi-VN')}đ</strong>
            </div>
          </div>
        `).join('');
            }
        }
    },

    updateProfile: async (e) => {
        if (e) e.preventDefault();
        const name = document.getElementById('profile-name').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const address = document.getElementById('profile-address').value.trim();

        try {
            const res = await api.put('/user/profile', { name, phone, address });
            showToast(res.message, 'success', 'Thành công');
            await profile.loadProfile();
        } catch (err) {
            showToast(err.message, 'error', 'Lỗi cập nhật');
        }
    }
};