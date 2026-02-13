<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div 
      class="absolute inset-0 z-0"
      :style="{ 
        backgroundImage: `url(${bgLogin})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }">
    </div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90"></div>

    <div class="relative z-10 w-full max-w-sm">
        <div class="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-center min-h-[300px] flex flex-col justify-center items-center">
            
            <h2 class="text-2xl font-bold mb-8 text-gray-800 tracking-tight animate-pulse">กำลังสร้างบัญชี...</h2>
            
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full animate-loading-bar"></div>
            </div>
            
            <p class="text-xs text-gray-400 mt-4">กรุณารอสักครู่</p>

        </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes load {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-loading-bar {
  animation: load 2s ease-in-out forwards;
}
</style>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import bgLogin from '@/assets/bg-login_1.png'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  setTimeout(() => {
    // ไม่ต้องแก้ storage เพราะหน้านี้แค่ redirect แต่ปลายทางใช้ sessionStorage
    router.push({path: '/install/success' })
  }, 2000) 
})
</script>