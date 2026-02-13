import { defineConfig, loadEnv } from 'vite' // 1. import loadEnv มาด้วย
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 2. เปลี่ยน export default เป็น function เพื่อรับค่า mode (dev/prod)
export default defineConfig(({ mode }) => {
  
  // 3. โหลดค่าจาก .env เข้ามาเก็บในตัวแปร env
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          // 4. ✅ ใช้ค่าจาก .env แทนการ Hardcode IP
          target: env.VITE_TARGET_URL, 
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})