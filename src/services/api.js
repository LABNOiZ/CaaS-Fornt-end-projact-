import axios from 'axios'
import router from '@/router'
import { authService } from './authService'

const api = axios.create({
  baseURL: '/api/v1', 
  withCredentials: true, // เพื่อให้ส่ง HttpOnly Cookie ไปหา BFF
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  // หน้าบ้านส่งข้อมูลเพียวๆ ไปเลย ไม่ต้องเข้ารหัสแล้ว BFF จะจัดการให้
  console.log('Test นะครับ: Request Interceptor ทำงานแล้ว! Config ที่ส่งออกไป:', config);
  return config;
}, (error) => Promise.reject(error))

api.interceptors.response.use(
  (response) => {
    // รับ JSON ธรรมดาที่ BFF ถอดรหัสมาให้แล้ว
    return response;
  },
  async (error) => {
    // ... (โค้ดดักจับ 401 และ Refresh Token เดิมของคุณ เก็บไว้ได้เลย เขียนมาดีแล้วครับ) ...
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 ) {
    }
    return Promise.reject(error);
  }
)

export default api