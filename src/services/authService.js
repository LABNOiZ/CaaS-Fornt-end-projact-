import api from './api' 

const generateSecureRandomString = (length = 32) => {
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const authService = {
  // 1. Login 
  login(email, password) {
    const currentNonce = generateSecureRandomString(32);
    const currentState = generateSecureRandomString(32);

    sessionStorage.setItem('authState', currentState);
    sessionStorage.setItem('authNonce', currentNonce);

    return api.post('/web/auth/login', { 
      email: email,
      password: password,
      nonce: currentNonce, 
      state: currentState  
    }, { secure: true }) 
  },

  // 2. Register 
  register(userData) {
    return api.post('/web/auth/register', userData, { secure: true })
  },
  
  // 3. Setup Qr2FA 
  get2FAQR(email) {
    return api.post('/web/auth/setup-2fa', { email: email }, { secure: true })
  },

  // 4. ยืนยัน 2FA (ตอน Setup) 
  verify2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { email: email, code: code.toString() }, { secure: true })
  },

  // 5. ยืนยัน 2FA (ตอน Login Step 2) 
  verifyLogin2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { email: email, code: code.toString() }, { secure: true })
  },

  // 6. ต่ออายุ Token (BFF) - ไม่ต้องส่ง Body แล้ว
  refreshToken() {
    return api.post('/web/auth/refresh-token', {}, { secure: true })
  },

  // 7. ลืมรหัสผ่าน - ขอ OTP
  requestPasswordResetOTP(email) {
    return api.post('/web/auth/forgot-password', { email: email }, { secure: true })
  },

  // 8. ลืมรหัสผ่าน - ตรวจสอบ OTP
  verifyResetOTP(email, otp) {
    return api.post('/web/auth/verify-otp', { email: email, otp: otp.toString() }, { secure: true })
  },

  // 9. ลืมรหัสผ่าน - ตั้งรหัสผ่านใหม่ 
  resetPassword(email, newPassword) {
    return api.post('/web/auth/reset-password', { email: email, newPassword: newPassword }, { secure: true })
  },
  logout() {
    // ยิง POST ไปที่ /web/auth/logout (ไม่ต้องส่ง body ไปเพราะหลังบ้านเช็คจาก Cookie)
    return api.post('/web/auth/logout', {}, { secure: true }) 
  }
}