import { defineConfig, loadEnv } from 'vite' 
import vue from '@vitejs/plugin-vue'
import path from 'path'

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
      host: devHost,        
      port: devPort,
      strictPort: true,     
      proxy: {
        '/api': {
          // ชี้เป้าไปที่ BFF  
          target: 'http://localhost:3000', 
          changeOrigin: true,
          // ปรับเป็น false เพราะคุยกับ BFF ในเครื่องตัวเองผ่าน http ธรรมดา
          secure: false, 
        }
      }
    }
  }
})