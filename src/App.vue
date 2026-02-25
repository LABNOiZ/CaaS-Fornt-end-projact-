<template>
  <router-view />

  <div v-if="showTimeoutModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in px-4">
    
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-bounce-in border border-gray-200">
      
      <div class="bg-orange-50 p-6 flex flex-col items-center justify-center border-b border-orange-100">
         <div class="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <ClockIcon class="h-8 w-8 text-orange-500 animate-pulse" />
         </div>
      </div>

      <div class="p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Session กำลังจะหมดอายุ</h3>
        <p class="text-gray-500 mb-4 text-sm leading-relaxed">
          ไม่มีการใช้งานมาสักพัก ระบบจะออกจากระบบอัตโนมัติใน
        </p>
        
        <div class="text-3xl font-extrabold text-red-500 mb-6">
            {{ countdown }} <span class="text-sm font-normal text-gray-400">วินาที</span>
        </div>

        <div class="flex gap-3">
            <button 
              @click="handleLogoutNow"
              class="flex-1 bg-white border border-gray-300 text-gray-600 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition text-sm"
            >
              ออกจากระบบ
            </button>
            <button 
              @click="handleStayConnected"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
            >
              อยู่ในระบบต่อ
            </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' 
import { ClockIcon } from '@heroicons/vue/24/outline'
import { authService } from '@/services/authService'

const router = useRouter()
const route = useRoute()

const showTimeoutModal = ref(false)
const countdown = ref(30) 

let idleTimer = null
let warningInterval = null

// ตั้งเวลา Idle  นาที Testt
const IDLE_LIMIT = 10 * 60 * 1000 
// ตั้งเวลานับถอยหลังแจ้งเตือน (30 วินาที)
const WARNING_LIMIT = 30 

const events = ['click', 'mousemove', 'mousedown', 'scroll', 'keypress', 'touchstart']

// เช็คเงื่อนไขการจับเวลา
const shouldTrackTime = () => {
    const hasToken = sessionStorage.getItem('token');
    const isPublicPage = ['/login', '/login-2fa', '/two-factor-intro'].includes(route.path);
    // ถ้า Modal ขึ้นอยู่ ไม่ต้อง Reset Timer
    return hasToken && !isPublicPage && !showTimeoutModal.value;
}

const resetTimer = () => {
  if (!shouldTrackTime()) {
      clearTimeout(idleTimer);
      return;
  }

  clearTimeout(idleTimer);
  idleTimer = setTimeout(showWarning, IDLE_LIMIT);
}

// 1. แสดง Modal แจ้งเตือน
const showWarning = () => {
    if (!shouldTrackTime()) return;
    
    showTimeoutModal.value = true;
    countdown.value = WARNING_LIMIT;

    warningInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            handleLogoutNow(); 
        }
    }, 1000);
}

//  2. แก้ไข Logic กด "อยู่ในระบบต่อ" ให้ยิง API ต่ออายุ
const handleStayConnected = async () => {
    // หยุดนับถอยหลังก่อน
    clearInterval(warningInterval);

    try {
        const refreshTokenStr = sessionStorage.getItem('refreshToken');
        
        // ถ้ายิง API ต่ออายุ Token
        if (refreshTokenStr) {
             const response = await authService.refreshToken(refreshTokenStr);
             
             // ถ้าได้ Token ใหม่มา ให้บันทึกทับของเดิม
             if (response.data && response.data.token) {
                 sessionStorage.setItem('token', response.data.token);
                 // บาง API ส่ง Refresh Token ตัวใหม่มาด้วย ก็เก็บด้วย
                 if (response.data.refreshToken) {
                     sessionStorage.setItem('refreshToken', response.data.refreshToken);
                 }
             }
        }
    } catch (error) {
        console.error("Session renewal failed:", error);
        // ถ้าต่ออายุไม่ผ่าน (เช่น Refresh Token หมดอายุจริง) ให้ดีดออกเลย
        handleLogoutNow();
        return;
    }

    // ปิด Modal และเริ่มจับเวลาใหม่
    showTimeoutModal.value = false;
    resetTimer();
}

// 3. กด "ออกจากระบบ" หรือ หมดเวลา
const handleLogoutNow = () => {
    clearInterval(warningInterval);
    clearTimeout(idleTimer);
    showTimeoutModal.value = false;

    sessionStorage.clear();
    router.push('/login');
}

onMounted(() => {
  events.forEach(event => window.addEventListener(event, resetTimer))
  resetTimer()
})

onUnmounted(() => {
  events.forEach(event => window.removeEventListener(event, resetTimer))
  clearTimeout(idleTimer)
  clearInterval(warningInterval)
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>

<style>
/* Global Styles */
html, body, #app {
  user-select: none;
  cursor: default; 
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  font-family: 'Sarabun', sans-serif;
}

input, textarea {
  user-select: text;
  cursor: text;
  -webkit-user-select: text;
}
</style>