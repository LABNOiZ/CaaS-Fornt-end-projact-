import { defineConfig, loadEnv } from 'vite' 
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs' 
import https from 'https' 

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const devPort = parseInt(env.VITE_DEV_PORT) || 5173
  const devHost = env.VITE_DEV_HOST || 'localhost'

  return {
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // ✅ 1. กลับมาเปิดใช้ HTTPS หน้าบ้านด้วยไฟล์ที่สร้างจาก mkcert
      https: {
        key: fs.readFileSync(path.resolve(__dirname, './localhost+3-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, './localhost+3.pem')),
      },          
      host: devHost,        
      port: devPort,
      strictPort: true,     
      proxy: {
        '/api': {
          target: env.VITE_TARGET_URL, 
          changeOrigin: true,
          // ✅ 2. ปิดการตรวจสอบเพื่อไม่ให้ติด Error 500 หรือ self-signed
          secure: true, 
           
          agent: new https.Agent({
            ca: fs.readFileSync(path.resolve(__dirname, 'certs/kong_cert.crt'))
            //rejectUnauthorized: false 
          })
        }
      }
    }
  }
})