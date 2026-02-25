import axios from 'axios'
import router from '@/router' // นำเข้า router เพื่อความเนียนในการเปลี่ยนหน้า

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// --- ตัวแปรสำหรับระบบ Lock และ Queue ---
let isRefreshing = false;
let failedQueue = [];

// ฟังก์ชันสำหรับจัดการ Request ที่ค้างอยู่ (แก้ให้ Robust ขึ้น)
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    
    // เช็ค Path ให้แม่นยำขึ้นเพื่อป้องกัน Loop
    const isAuthPath = config.url.includes('/login') || config.url.includes('/refresh-token')

    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ถ้าเจอ 401 หรือ 403 และยังไม่เคยลอง Retry ใน Request นี้
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      
      // 1. ถ้ากำลัง Refresh อยู่ ให้เข้าคิวรอ Token ใหม่
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }

      // 2. เริ่มกระบวนการ Refresh Token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("No refresh token available");

        console.log(" Attempting to Refresh Token...");

        // ใช้ axios ตัวหลักยิงไปที่ Endpoint (ไม่ใช้ api instance เพื่อเลี่ยง interceptor ตัวเอง)
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/web/auth/refresh-token`, {
            refreshToken: refreshToken
        });

        const data = response.data.data || response.data; 
        const newToken = data.accessToken || data.token;
        const newRefreshToken = data.refreshToken;

        if (newToken) {
            //  เก็บ Token ใหม่
            sessionStorage.setItem('token', newToken);
            
            //  อัปเดต Refresh Token ตัวใหม่ (ถ้า Backend ส่งมาให้)
            if (newRefreshToken) {
                sessionStorage.setItem('refreshToken', newRefreshToken);
            }

            //  อัปเดต Header สำหรับ Request ถัดๆ ไป
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            //  ปล่อย Request ที่ค้างอยู่ในคิวทั้งหมด
            processQueue(null, newToken);
            
            //  ยิง Request เดิมซ้ำอีกครั้งด้วย Token ใหม่
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
        } else {
            throw new Error("Invalid response structure from Refresh Token API");
        }

      } catch (err) {
        //  ถ้า Refresh ไม่สำเร็จ ให้เคลียร์คิวและเตะไปหน้า Login
        processQueue(err, null);
        sessionStorage.clear();
        
        // ใช้ router.replace จะเนียนกว่า window.location ใน Vue
        if (router) {
            router.replace('/login');
        } else {
            window.location.href = '/login';
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)

export default api