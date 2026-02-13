<template>
  <div class="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div class="absolute inset-0 z-0" :style="{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

    <div class="relative z-10 w-full max-w-md max-h-[95vh] flex flex-col">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        
        <div class="text-center mb-4">
          <h2 class="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md mb-1">
            {{ headerTitle }}
          </h2>
          <p class="text-blue-200 text-xs md:text-sm">{{ headerSubtitle }}</p>
        </div>

        <form v-if="currentStep === 1" @submit.prevent="handleRequestOTP" class="space-y-4 animate-fade-in">
           <div>
              <label class="block text-[10px] md:text-xs font-bold text-blue-200 uppercase mb-1">Email Address</label>
              <input 
                v-model="email" 
                type="email" 
                placeholder="ระบุอีเมลของคุณ"
                class="w-full rounded-xl border border-white/10 bg-white/20 p-2.5 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-sm"
                required
              />
           </div>
           
           <button type="submit" :disabled="isLoading" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-sm">
             <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
             <span>ส่งรหัส OTP</span>
           </button>
        </form>

        <form v-else-if="currentStep === 2" @submit.prevent="handleVerifyOTP" class="space-y-5 animate-fade-in">
           <div>
              <label class="block text-[10px] md:text-xs font-bold text-blue-200 uppercase mb-3 text-center">OTP CODE</label>
              <div class="flex justify-center gap-2">
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
                    class="w-10 h-12 md:w-12 md:h-14 rounded-lg border border-white/20 bg-white/10 text-white text-xl md:text-2xl font-mono text-center focus:bg-white/20 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all shadow-inner"
                 />
              </div>
           </div>

           <button type="submit" :disabled="isLoading || otpDigits.join('').length !== 6" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-sm">
             <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
             <span>ยืนยัน OTP</span>
           </button>

           <div class="text-center">
              <button type="button" @click="currentStep = 1" class="text-xs text-blue-300 hover:text-white underline transition-colors">กรอกอีเมลใหม่</button>
           </div>
        </form>

        <form v-else-if="currentStep === 3" @submit.prevent="handleResetPassword" class="space-y-3 animate-fade-in">
           
           <div>
              <label class="block text-[10px] md:text-xs font-bold text-blue-200 uppercase mb-1">New Password</label>
              <div class="relative">
                <input 
                    v-model="newPassword" 
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="กำหนดรหัสผ่านใหม่"
                    class="w-full rounded-xl border border-white/10 bg-white/20 p-2.5 pr-10 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-sm"
                    required
                />
                <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors outline-none">
                    <EyeIcon v-if="!showNewPassword" class="w-4 h-4" />
                    <EyeSlashIcon v-else class="w-4 h-4" />
                </button>
              </div>
           </div>
           
           <div>
              <label class="block text-[10px] md:text-xs font-bold text-blue-200 uppercase mb-1">Confirm Password</label>
              <div class="relative">
                <input 
                    v-model="confirmPassword" 
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                    class="w-full rounded-xl border border-white/10 bg-white/20 p-2.5 pr-10 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-sm"
                    required
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors outline-none">
                    <EyeIcon v-if="!showConfirmPassword" class="w-4 h-4" />
                    <EyeSlashIcon v-else class="w-4 h-4" />
                </button>
              </div>
           </div>

           <div class="bg-blue-900/30 p-2.5 rounded-lg border border-blue-500/20">
              <PasswordRules :password="newPassword" @check-valid="(val) => isPasswordValid = val" />
           </div>

           <button type="submit" :disabled="isLoading || !isPasswordValid" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-2 text-sm">
             <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
             <span>บันทึกรหัสผ่านใหม่</span>
           </button>
        </form>

        <div v-else-if="currentStep === 4" class="text-center py-6 animate-bounce-in">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-white mb-2">สำเร็จ!</h3>
            <p class="text-blue-200 text-sm">เปลี่ยนรหัสผ่านเรียบร้อยแล้ว</p>
            <p class="text-blue-300 text-xs mt-3 animate-pulse">กำลังกลับไปหน้า Login...</p>
        </div>

        <div v-if="errorMessage" class="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center flex items-center justify-center gap-2 animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
        </div>

        <div v-if="currentStep !== 4" class="text-center mt-4">
            <router-link to="/login" class="text-xs md:text-sm text-blue-300 hover:text-white transition-colors flex items-center justify-center gap-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับไปหน้าเข้าสู่ระบบ
            </router-link>
        </div>

      </div>
    </div>
    
    <div class="absolute bottom-2 text-center w-full z-10">
       <p class="text-blue-200/40 text-[10px] md:text-xs">© NovaPay System. All rights reserved.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import bgLogin from '@/assets/bg-login_1.png'
import PasswordRules from '@/components/PasswordRules.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

const router = useRouter()

// State
const currentStep = ref(1) 
const isLoading = ref(false)
const errorMessage = ref('')

// Form Data
const email = ref('')
const otpDigits = ref(['', '', '', '', '', '']) 
const otpInputs = ref([]) 
const newPassword = ref('')
const confirmPassword = ref('')
const isPasswordValid = ref(false)
const showNewPassword = ref(false) 
const showConfirmPassword = ref(false) 

// Header Dynamic Text
const headerTitle = computed(() => {
    switch(currentStep.value) {
        case 1: return 'Forgot Password'
        case 2: return 'Verify OTP'
        case 3: return 'Reset Password'
        default: return ''
    }
})

const headerSubtitle = computed(() => {
    switch(currentStep.value) {
        case 1: return 'กรอกอีเมลเพื่อรับรหัสยืนยัน'
        case 2: return `รหัส OTP ถูกส่งไปที่ ${email.value}`
        case 3: return 'กำหนดรหัสผ่านใหม่ของคุณ'
        default: return ''
    }
})

// --- Logic OTP Input ---
const handleOtpInput = (index, event) => {
    const val = event.target.value
    if (val && index < 5) {
        otpInputs.value[index + 1].focus()
    }
}

const handleOtpDelete = (index, event) => {
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

// --- Logic API ---

const handleRequestOTP = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        await authService.requestPasswordResetOTP(email.value)
        currentStep.value = 2 
        nextTick(() => {
            if(otpInputs.value[0]) otpInputs.value[0].focus()
        })
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'ไม่พบอีเมลในระบบ'
    } finally {
        isLoading.value = false
    }
}

const handleVerifyOTP = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const fullOtp = otpDigits.value.join('') 
        await authService.verifyResetOTP(email.value, fullOtp)
        currentStep.value = 3 
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'รหัส OTP ไม่ถูกต้อง'
        otpDigits.value = ['', '', '', '', '', '']
        nextTick(() => otpInputs.value[0].focus())
    } finally {
        isLoading.value = false
    }
}

const handleResetPassword = async () => {
    errorMessage.value = ''
    
    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'รหัสผ่านยืนยันไม่ตรงกัน'
        return
    }

    if (!isPasswordValid.value) {
        errorMessage.value = 'รหัสผ่านไม่ผ่านเงื่อนไขความปลอดภัย'
        return
    }

    isLoading.value = true
    try {
        await authService.resetPassword(email.value, newPassword.value)
        currentStep.value = 4
        setTimeout(() => {
            router.push('/login')
        }, 3000)
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
.animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
.animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

/* Custom Scrollbar สำหรับกล่องภายใน */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>