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

    <div class="relative z-10 w-full max-w-lg">
        
        <div class="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center relative pb-20">
            
            <h2 class="text-2xl font-bold mb-6 text-white tracking-tight drop-shadow-md">Scan QR Code</h2>
            
            <div class="text-left mb-8 space-y-3 px-2">
                <p class="text-sm text-blue-100 font-light leading-relaxed">
                    <span class="font-bold text-blue-300 mr-1">1.</span> Install <span class="font-bold text-white">Google Authenticator</span> app on your mobile device.
                </p>
                <p class="text-sm text-blue-100 font-light leading-relaxed">
                    <span class="font-bold text-blue-300 mr-1">2.</span> Open the app and scan the barcode below:
                </p>
            </div>

            <div class="bg-white p-4 rounded-2xl inline-flex mb-4 shadow-lg shadow-black/20 relative">
                
                <div v-if="otpAuthUrl">
                    <qrcode-vue 
                        :value="otpAuthUrl" 
                        :size="180" 
                        level="H" 
                        class="mx-auto"
                        render-as="svg"
                    />
                </div>

                <img 
                  v-else-if="fallbackQrUrl" 
                  :src="fallbackQrUrl" 
                  alt="QR Code" 
                  class="w-[180px] h-[180px] object-contain mx-auto"
                />
                
                <div v-else-if="isLoading" class="flex flex-col items-center justify-center w-[180px] h-[180px] text-gray-400">
                   <ArrowPathIcon class="w-10 h-10 animate-spin mb-3 text-blue-500" />
                   <span class="text-xs font-bold text-blue-400">กำลังโหลด QR Code...</span>
                </div>

                <div v-else class="flex flex-col items-center justify-center w-[180px] h-[180px] text-red-500 p-2">
                   <ExclamationCircleIcon class="w-10 h-10 mb-2" />
                   <span class="text-xs mb-2 text-center font-bold">{{ errorMessage || 'ไม่สามารถสร้าง QR Code ได้' }}</span>
                   <button @click="fetchQRCode" class="text-xs underline text-blue-600 hover:text-blue-800 font-bold">ลองใหม่</button>
                </div>
            </div>

            <div class="absolute bottom-6 right-8">
                <button 
                    @click="goToNextStep" 
                    :disabled="(!otpAuthUrl && !fallbackQrUrl) || isLoading"
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-sm"
                >
                    <span>ถัดไป</span>
                    <ArrowRightIcon class="w-4 h-4" />
                </button>
            </div>

        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue' 
import { authService } from '@/services/authService'
import bgLogin from '@/assets/bg-login_1.png'
import { ArrowPathIcon, ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()

const otpAuthUrl = ref('')      
const fallbackQrUrl = ref('')   
const isLoading = ref(false)
const errorMessage = ref('')

const currentEmail = ref(
    route.query.email || 
    sessionStorage.getItem('auth_email') || 
    sessionStorage.getItem('install_email') || 
    ''
)

const fetchQRCode = async () => {
    isLoading.value = true
    errorMessage.value = ''
    otpAuthUrl.value = ''
    fallbackQrUrl.value = ''
    
    try {
        if (!currentEmail.value) {
            throw new Error("ไม่พบข้อมูล Email กรุณา Login ใหม่")
        }

        console.log("Fetching QR for:", currentEmail.value)

        const response = await authService.get2FAQR(currentEmail.value)
        const data = response.data
        const secretKey = data.secretKey 
        const rawImageUrl = data.qrCodeUrl

        if (secretKey) {
            const appName = 'NovaPay'
            const label = `${appName}:${currentEmail.value}`
            otpAuthUrl.value = `otpauth://totp/${label}?secret=${secretKey}&issuer=${appName}`
            sessionStorage.setItem('tempSecret', secretKey)
        } 
        else if (rawImageUrl) {
            const cleanBase64 = rawImageUrl.replace(/\s/g, '')
            fallbackQrUrl.value = cleanBase64.startsWith('data:image') 
                ? cleanBase64 
                : `data:image/png;base64,${cleanBase64}`
        } 
        else {
            throw new Error('Server ไม่ส่งข้อมูล QR กลับมา')
        }

    } catch (error) {
        console.error("QR Code Error:", error)
        if (error.response && error.response.status === 403) {
             errorMessage.value = 'Session หมดอายุหรือไม่มีสิทธิ์ (กรุณา Login ใหม่)'
        } else if (error.message) {
             errorMessage.value = error.message
        } else {
             errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
        }
    } finally {
        isLoading.value = false
    }
}

const goToNextStep = () => {
    router.push({ 
        path: '/install/two-factor-verify', 
        query: { email: currentEmail.value } 
    })
}

onMounted(() => {
    fetchQRCode()
})
</script>