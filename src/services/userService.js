import api from './api'

export const userService = {
  // 1. ดึงข้อมูลโปรไฟล์ตัวเอง (มีอีเมลและข้อมูลส่วนตัว ให้เข้ารหัสตอนขากลับ)
  getProfile() {
    return api.get('/web/users/profile', { secure: true })
  },

  // 2. เปลี่ยนรหัสผ่านตัวเอง (ส่ง Password ต้องเข้ารหัสชัวร์ๆ)
  changePassword(data) {
    return api.post('/web/users/change-password', data, { secure: true })
  },

  // 3. Reset 2FA ตัวเอง (ส่ง Password ยืนยัน)
  resetTwoFactor(userId, password) {
    return api.post('/web/users/reset-2fa', { targetUserId: userId, password: password }, { secure: true })
  }
}