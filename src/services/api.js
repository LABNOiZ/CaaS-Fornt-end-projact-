import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// --- ตัวแปรสำหรับระบบ Lock ---
let isRefreshing = false;
let failedQueue = [];

// ฟังก์ชันสำหรับจัดการ Request ที่ค้างอยู่
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

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    // เช็คว่าไม่ใช่ Path สำหรับ Login/Refresh เพื่อกัน Loop
    const isAuthPath = config.url.includes('/login') || config.url.includes('/refresh-token')

    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ถ้า Error 401 หรือ 403 และยังไม่เคย Retry
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      
      // กรณีที่มีการ Refresh อยู่แล้ว ให้เข้าคิวรอ
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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("No refresh token available");

        console.log("Attempting Refresh Token...");

        // ยิง Refresh Token
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/web/auth/refresh-token`, {
            refreshToken: refreshToken
        });

        //  จุดสำคัญ: เช็คโครงสร้างข้อมูลให้ดี
        // บางที Server ส่งมาใน response.data.data หรือ response.data เฉยๆ
        const data = response.data.data || response.data; 
        
        const newToken = data.accessToken || data.token;
        const newRefreshToken = data.refreshToken;

        if (newToken) {
            // 1. เก็บ Token ใหม่
            sessionStorage.setItem('token', newToken);
            
            //  2. สำคัญมาก: ต้องเก็บ Refresh Token ตัวใหม่ด้วย (ถ้ามี)
            // เพราะตัวเก่าใช้ไม่ได้แล้ว (One-time use)
            if (newRefreshToken) {
                console.log("Updated new Refresh Token");
                sessionStorage.setItem('refreshToken', newRefreshToken);
            }

            // 3. อัปเดต Header
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            // 4. เคลียร์คิวที่รออยู่ให้ทำงานต่อ
            processQueue(null, newToken);
            
            return api(originalRequest);
        } else {
            throw new Error("No access token in response");
        }

      } catch (err) {
        console.error("Refresh failed:", err);
        processQueue(err, null);
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)

export default api