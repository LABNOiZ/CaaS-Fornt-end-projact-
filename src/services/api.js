import axios from 'axios'
import router from '@/router'
import { authService } from './authService'
// 1. เปลี่ยนจาก importX509 เป็น importSPKI
import { generateKeyPair, exportJWK, compactDecrypt, importSPKI, CompactEncrypt } from 'jose'

const api = axios.create({
  baseURL: import.meta.env.VITE_TARGET_URL + '/api/v1',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// ==========================================
// 🛡️ Request Interceptor (ขาไป: สร้างกุญแจ, แนบ Header, และเข้ารหัสข้อมูล)
// ==========================================
api.interceptors.request.use(async (config) => {
  if (config.secure) {
    try {
      // 1. สร้างกุญแจชั่วคราวของเรา
      const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256', { extractable: true });
      const publicJwk = await exportJWK(publicKey);
      
      // 2. แนบ Public Key ของเราไปที่ Header
      config.headers['X-Client-Public-Key'] = JSON.stringify(publicJwk);
      config._privateKey = privateKey; // ซ่อนไว้ไขขากลับ

      //  3. เข้ารหัสข้อมูลขาไป (Payload) ด้วยกุญแจของ Backend
      if (config.data) {
          // ดึงกุญแจพี่แนทจาก .env 
          let backendPubKeyStr = import.meta.env.VITE_BACKEND_PUBLIC_KEY || '';
          
          // ทำความสะอาดกุญแจ (ลบฟันหนู, แปลง \n)
          const cleanKeyStr = backendPubKeyStr
              .replace(/^"|"$/g, '')      
              .replace(/^'|'$/g, '')      
              .replace(/\\n/g, '\n')      
              .trim();                    

          // 🌟 4. ใช้ importSPKI แทน importX509 (แก้ปัญหา Error สีแดงได้ 100%)
          const backendPubKey = await importSPKI(cleanKeyStr, 'RSA-OAEP-256');

          // แปลง Data เป็น Byte
          const encodedData = new TextEncoder().encode(JSON.stringify(config.data));

          // ทำการเข้ารหัส JWE
          const jweString = await new CompactEncrypt(encodedData)
              .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
              .encrypt(backendPubKey);

          // แปลง Body ให้เหลือแค่ก้อน JWE ส่งไป
          config.data = { payload: jweString }; 
      }
      
    } catch (err) {
      console.error("เข้ารหัสข้อมูลขาไปล้มเหลว:", err);
      return Promise.reject(err);
    }
  }
  return config;
}, (error) => Promise.reject(error))


// --- ระบบ Queue สำหรับต่ออายุ (คงเดิม) ---
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};


// ==========================================
// 🛡️ Response Interceptor (ขากลับ: รับ JWE Text มาไขรหัส)
// ==========================================
api.interceptors.response.use(
  async (response) => {
    const config = response.config;

    if (config.secure && config._privateKey && response.data) {
      if (typeof response.data === 'string') {
        try {
          const { plaintext } = await compactDecrypt(response.data, config._privateKey);
          const jsonString = new TextDecoder().decode(plaintext);
          response.data = JSON.parse(jsonString);
        } catch (error) {
          console.error("ถอดรหัส JWE ล้มเหลว:", error);
          return Promise.reject(new Error("ข้อมูลเข้ารหัสจากเซิร์ฟเวอร์ไม่ถูกต้อง หรือถูกแทรกแซง"));
        }
      } else {
        console.warn("Backend ไม่ได้ส่งข้อมูลขากลับมาเป็น JWE String (ส่งมาเป็น JSON ปกติ)");
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && 
        !originalRequest.url.includes('/login') && 
        !originalRequest.url.includes('/verify-2fa') &&
        !originalRequest.url.includes('/refresh-token')) {
      
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await authService.refreshToken();
          isRefreshing = false;
          processQueue(null);
          return api(originalRequest); 
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          sessionStorage.clear(); 
          router.replace('/login');
          return Promise.reject(refreshError);
        }
      }
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest)).catch(err => Promise.reject(err));
    }
    return Promise.reject(error);
  }
)

export default api