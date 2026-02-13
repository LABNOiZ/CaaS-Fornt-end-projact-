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

    <div class="relative z-10 w-full max-w-sm">
        
        <div class="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center transform transition-all duration-500 hover:scale-[1.02]">
            
            <div class="flex justify-center mb-6">
                <div class="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce">
                    <div class="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                    
                    <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <h2 class="text-2xl font-bold mb-3 text-white drop-shadow-md tracking-wide">เสร็จสมบูรณ์!</h2>
            
            <p class="text-blue-200 text-sm mb-8 leading-relaxed font-light">
                บัญชี Admin ถูกสร้างเรียบร้อยแล้ว<br>
                กด <span class="font-bold text-white">ต่อไป</span> เพื่อเริ่มตั้งค่าความปลอดภัย (2FA)
            </p>

            <button 
                @click="goToNextStep" 
                class="group w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-indigo-500/40 flex justify-center items-center gap-2"
            >
                <span>ต่อไป</span>
                <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
        </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' 
import bgLogin from '@/assets/bg-login_1.png'
import { ArrowRightIcon } from '@heroicons/vue/24/solid'

const router = useRouter()

const goToNextStep = () => {
  router.push('/install/two-factor-intro')
}
</script>