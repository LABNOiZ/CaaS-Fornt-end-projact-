import api from './api' 

const generateSecureRandomString = (length = 32) => {
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const authService = {
  // 1. Login 
  async login(email, password) {
    const currentNonce = generateSecureRandomString(32);
    const currentState = generateSecureRandomString(32);

    sessionStorage.setItem('authState', currentState);
    sessionStorage.setItem('authNonce', currentNonce);

    try {
      const response = await api.post('/web/auth/login', { 
        email: email,
        password: password,
        nonce: currentNonce, 
        state: currentState  
      }, { 
        secure: true
      });

      const responseData = response.data;
      console.log("-----------------------------------------");
      console.log("🔎 ตรวจสอบความถูกต้องของ State:");
      console.log("จดไว้ในเครื่อง:", currentState);
      console.log("แนทส่งกลับมา:", responseData.state);
      console.log("-----------------------------------------");

      //  ด่านที่ 1: ตรวจสอบ State (ป้องกัน CSRF)
      // เช็คว่าถ้ามี state ส่งกลับมา มันต้องตรงกับที่สร้างไว้
      if (responseData.state && responseData.state !== currentState) {
        throw new Error("STATE_MISMATCH: ข้อมูล State ไม่ตรงกัน (เสี่ยงโดนโจมตี CSRF)");
      }

      //  ด่านที่ 2: ตรวจสอบ Nonce จาก id_token 
      if (responseData.id_token) {
        // ถอดรหัส JWT (Base64) ท่อนที่ 2 (Payload)
        const base64Url = responseData.id_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // แปลงให้อ่านภาษาไทย/อักขระพิเศษ
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedIdToken = JSON.parse(jsonPayload);

        // เช็คว่า nonce ใน token ตรงกับที่เราส่งไปไหม
        if (decodedIdToken.nonce !== currentNonce) {
          throw new Error("NONCE_MISMATCH: ข้อมูล Nonce ไม่ตรงกัน (เสี่ยงโดนโจมตี Replay Attack)");
        }
      }
      
      //  ผ่านทุกด่าน ล้างค่าใน session ทิ้งเพื่อความสะอาด
      //sessionStorage.removeItem('authState');
      //sessionStorage.removeItem('authNonce');

      // ส่ง response กลับไปให้ Component ใช้งานต่อ
      return response;

    } catch (error) {
      // ถ้า Error หรือ Validate ไม่ผ่าน ก็ล้าง session ทิ้งเหมือนกัน
      //sessionStorage.removeItem('authState');
      //sessionStorage.removeItem('authNonce');
      throw error;
    }
    
  },

  // 2. Register 
  register(userData) {
    return api.post('/web/auth/register', userData, { secure: true }) 
  },
  
  // 3. Setup Qr2FA 
  get2FAQR(email) {
    return api.post('/web/auth/setup-2fa', { email: email }, { secure: true })
  },

  // 4. ยืนยัน 2FA 
  verify2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { email: email, code: code.toString() }, { secure: true})
  },

  // 5. ยืนยัน 2FA 
  verifyLogin2FA(email, code) {
    return api.post('/web/auth/verify-2fa', { email: email, code: code.toString() }, { secure: true }) 
  },

  // 6. ต่ออายุ Token 
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
  
  // 10. Logout 
  logout() {
    return api.post('/web/auth/logout', {}, { secure: true }) 
  },
  //  ยืนยัน 2FA ตอนตั้งค่า/รีเซ็ต 
  confirmSetup2FA(email, code) {
    return api.post('/web/auth/confirm-setup-2fa', { email: email, code: code.toString() }, { secure: true,encrypt: false})
  }
}