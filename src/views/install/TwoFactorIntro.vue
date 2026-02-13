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
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>

    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

    <div class="relative z-10 w-full max-w-xl">
        <div class="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-all hover:scale-[1.01]">
            
            <div class="mb-6">
                <span class="text-blue-200 text-[10px] font-bold uppercase tracking-wider bg-blue-900/40 border border-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    Setup Security
                </span>
                <h2 class="text-2xl font-bold mt-4 text-white drop-shadow-md">Two-factor authentication</h2>
                <p class="text-blue-100 text-sm mt-2 font-light">
                    เพิ่มความปลอดภัยอีกขั้นให้กับบัญชีผู้ดูแลระบบ
                </p>
            </div>
            
            <div class="bg-blue-900/20 rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
                
                <div class="flex items-start gap-4">
                    <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-white">
                        <ShieldCheckIcon class="w-8 h-8" />
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-sm tracking-wide">ระบบบังคับเปิดใช้งาน 2FA</h3>
                        <p class="text-blue-200 text-xs mt-1 leading-relaxed font-light">
                            กรุณาตั้งค่า Authenticator App<br>เพื่อใช้ในการเข้าสู่ระบบครั้งถัดไป
                        </p>
                    </div>
                </div>

                <button 
                    @click="goNext" 
                    class="group whitespace-nowrap bg-white text-blue-900 hover:bg-blue-50 px-5 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-sm font-bold flex items-center gap-2"
                >
                    <PlusIcon class="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>ตั้งค่า Authenticator</span>
                </button>

            </div>

        </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import bgLogin from '@/assets/bg-login_1.png'
import { ShieldCheckIcon, PlusIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// ดึง Email จาก Session ที่หน้า TwoFactorCard ฝังไว้
const email = sessionStorage.getItem('install_email') || sessionStorage.getItem('auth_email')

const goNext = () => {
    // ส่ง Email แนบไปกับ URL เลย เพื่อกันเหนียว
    router.push({
        path: '/install/two-factor-qr',
        query: { email: email }
    })
}
</script>