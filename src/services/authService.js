import api from './api' 

export const authService = {
  // 1. Login 
  login(email, password) {
    return api.post('/web/auth/login', { 
      email: email,
      password: password
    })
  },

  // 2. Register
  register(userData) {
    return api.post('/web/auth/register', userData)
  },
  
  // 3. Setup Qr2FA
  get2FAQR(email) {
    return api.post('/web/auth/setup-2fa', {
      email: email
    })
  },

  // 4. ยืนยัน 2FA (ตอน Setup)
  verify2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { 
        email: email,
        code: parseInt(code) 
    })
  },

  // 5. ยืนยัน 2FA (ตอน Login Step 2)
  verifyLogin2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { 
        email: email,
        code: code.toString() 
    })
  },

  // 6. ต่ออายุ Token (Refresh Token)
  refreshToken(refreshToken) {
    return api.post('/web/auth/refresh-token', {
        refreshToken: refreshToken
    })
  },

  //  7.  ลืมรหัสผ่าน - ขอ OTP
  requestPasswordResetOTP(email) {
    return api.post('/web/auth/forgot-password', { 
        email: email 
    })
  },

  //  8.  ลืมรหัสผ่าน - ตรวจสอบ OTP
  verifyResetOTP(email, otp) {
    return api.post('/web/auth/verify-otp', { 
        email: email, 
        otp: otp.toString() 
    })
  },

  //  9.  ลืมรหัสผ่าน - ตั้งรหัสผ่านใหม่
  resetPassword(email, newPassword) {
    return api.post('/web/auth/reset-password', { 
        email: email, 
        newPassword: newPassword 
    })
  }

}