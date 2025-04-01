import api from './api';

// Lấy danh sách tất cả users (chỉ admin)
export const getAllUsers = async () => {
  try {
    const res = await api.get('/auth/users');
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
    throw error;
  }
};

export const disableUser = async (userId) => {
  try {
    const res = await api.put(`/users/disable/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi vô hiệu hóa user:", error);
    throw error;
  }
};

// Cập nhật thông tin profile
export const updateProfile = async (profileData) => {
  try {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    throw error;
  }
};

// Đổi mật khẩu
export const changePassword = async (passwordData) => {
  try {
    const res = await api.put('/users/change-password', {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    throw error;
  }
};

