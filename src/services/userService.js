import api from './api'

export const userService = {
  // 1. ดึงข้อมูลโปรไฟล์ตัวเอง (
  getProfile() {
    return api.get('/web/users/profile', { secure: true })
  },

  // 2. เปลี่ยนรหัสผ่านตัวเอง 
  changePassword(data) {
    return api.post('/web/users/change-password', data, { secure: true })
  },

  // 3. Reset 2FA ตัวเอง 
  resetTwoFactor(userId, password) {
    return api.post('/web/users/reset-2fa', 
      { targetUserId: userId, password: password }, 
      { secure: true  }
    )
  }
}