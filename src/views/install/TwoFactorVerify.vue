<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div class="absolute inset-0 z-0" :style="{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90"></div>

    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

    <div class="relative z-10 w-full max-w-lg p-6">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20 p-8">
        
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30 shadow-inner">
              <ShieldCheckIcon class="w-8 h-8 text-blue-100" />
          </div>
          
          <h2 class="text-3xl font-bold text-white tracking-wide drop-shadow-md mb-2">
            Verify Setup
          </h2>
          <p class="text-blue-100/80 text-sm">
            Step 3: Enter the code from your authenticator app to finish setup.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-4 text-center">
              One-time code
            </label>
            <div class="flex justify-center gap-2 md:gap-3">
               <input 
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  v-model="otpDigits[index]"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  ref="otpInputs"
                  @input="handleOtpInput(index, $event)"
                  @keydown.delete="handleOtpDelete(index, $event)"
                  @paste="handleOtpPaste"
                  class="w-10 h-12 md:w-12 md:h-14 rounded-xl border border-white/20 bg-white/10 text-white text-2xl font-mono text-center focus:bg-white/20 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all shadow-inner"
                  :disabled="isLoading"
               />
            </div>
          </div>

          <div v-if="isError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-3 animate-pulse">
            <p class="text-red-100 text-sm font-medium text-center flex items-center justify-center gap-2">
              <ExclamationCircleIcon class="w-5 h-5" />
              {{ errorMessage }}
            </p>
          </div>

          <div class="space-y-3 pt-2">
            <button 
              type="submit" 
              :disabled="isLoading || otpDigits.join('').length < 6"
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500
              text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/30 transform 
              hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50 
              disabled:cursor-not-allowed flex justify-center items-center gap-2 text-base"
            >
              <CheckCircleIcon v-if="!isLoading" class="w-5 h-5" />
              <ArrowPathIcon v-else class="animate-spin h-5 w-5 text-white/80" />
              
              <span v-if="isLoading">Verifying...</span>
              <span v-else>Finish Setup</span>
            </button>

            <button 
              type="button" 
              @click="$router.back()" 
              :disabled="isLoading"
              class="w-full bg-white/5 hover:bg-white/10 text-blue-100 font-bold py-3 rounded-xl 
              border border-white/10 transition-all flex justify-center items-center gap-2 text-sm"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              Back
            </button>
          </div>

        </form>
      </div>
    </div>

    <div class="absolute bottom-4 w-full text-center z-10">
       <p class="text-blue-200/20 text-[10px] tracking-widest uppercase">
         NovaPay System &copy; 2025
       </p>
    </div>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/authService'
import { getUserProfile } from '@/services/adminService'
import bgLogin from '@/assets/bg-login_1.png'
import { 
    ShieldCheckIcon, 
    ExclamationCircleIcon, 
    CheckCircleIcon, 
    ArrowLeftIcon 
} from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// ✅ State ใหม่สำหรับ OTP แยกช่อง
const otpDigits = ref(['', '', '', '', '', '']) 
const otpInputs = ref([]) 

const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const email = route.query.email || sessionStorage.getItem('install_email') || sessionStorage.getItem('auth_email')

// --- Logic จัดการ Input 6 ช่อง ---
const handleOtpInput = (index, event) => {
    isError.value = false
    const val = event.target.value
    // ถ้าเป็นตัวเลข ให้ขยับไปช่องถัดไป
    if (val && index < 5) {
        otpInputs.value[index + 1].focus()
    }
}

const handleOtpDelete = (index, event) => {
    // ถ้ากด Backspace และช่องนี้ว่าง ให้ถอยกลับไปลบช่องก่อนหน้า
    if (!otpDigits.value[index] && index > 0) {
        otpDigits.value[index - 1] = ''
        otpInputs.value[index - 1].focus()
    }
}

const handleOtpPaste = (event) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text').slice(0, 6).split('')
    pastedData.forEach((char, index) => {
        if (index < 6) otpDigits.value[index] = char
    })
    const lastIndex = Math.min(pastedData.length, 5)
    nextTick(() => otpInputs.value[lastIndex].focus())
}

const handleSubmit = async () => {
  isError.value = false
  errorMessage.value = ''

  // รวม Array เป็น String เดียว
  const otpCode = otpDigits.value.join('')

  if (otpCode.length < 6) return
  if (!email) {
      errorMessage.value = "ไม่พบข้อมูล Email (กรุณาเริ่มใหม่)"
      return
  }

  isLoading.value = true

  try {
    console.log(`Verifying OTP for ${email}...`)
    const response = await authService.verify2FA(email, otpCode)
    
    const token = response?.data?.accessToken || response?.data?.token || response?.data?.data?.accessToken

    if (token) {
        sessionStorage.setItem('token', token)
        console.log("Token saved to SessionStorage!")

        let userRoleId = response.data.roleId 

        if (!userRoleId) {
            try {
                const profileRes = await getUserProfile()
                userRoleId = profileRes.data.roleId || profileRes.data.role 
            } catch (err) {
                console.error("Failed to fetch profile:", err)
            }
        }

        if (userRoleId) {
            sessionStorage.setItem('roleId', userRoleId)
        }
        
        const origin = sessionStorage.getItem('setupOrigin')
        
        if (origin === 'settings') {
            console.log("Redirecting back to Settings...")
            sessionStorage.removeItem('setupOrigin')
            if (userRoleId === 4) router.push({ name: 'CallCenter2FA' })
            else router.push({ name: 'SettingsTwoFactor' }) 
        } else {
            router.push('/install/two-factor-complete') 
        }

    } else {
        throw new Error("ยืนยันตัวตนผ่าน แต่ไม่ได้รับ Token จาก Server")
    }

  } catch (error) {
    console.error("2FA Failed:", error)
    isError.value = true
    // Clear OTP เมื่อผิดพลาด
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => otpInputs.value[0]?.focus())
    
    if (error.response) {
        if (error.response.status === 400) {
            errorMessage.value = "รหัส OTP ไม่ถูกต้อง"
        } else if (error.response.data && error.response.data.message) {
            errorMessage.value = error.response.data.message
        } else {
            errorMessage.value = `เกิดข้อผิดพลาด (${error.response.status})`
        }
    } else {
        errorMessage.value = 'ไม่สามารถเชื่อมต่อ Server ได้'
    }
  } finally {
    isLoading.value = false
  }
}
</script>