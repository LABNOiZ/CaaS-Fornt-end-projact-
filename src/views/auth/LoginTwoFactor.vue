<template>
  <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div class="absolute inset-0 z-0" :style="{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90"></div>

    <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

    <div class="relative z-10 w-full max-w-lg p-6">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20 p-8">
        <div class="text-center mb-6">
          <img 
            src="@/assets/logo.png" 
            alt="Company Logo" 
            class="h-24 mx-auto mb-4 drop-shadow-xl"
          />
          <h2 class="text-3xl font-bold text-white tracking-wide drop-shadow-md mb-2">
            Verification
          </h2>
          <div class="flex items-center justify-center gap-2 bg-blue-500/10 py-1 px-3 rounded-full 
          w-fit mx-auto border border-blue-400/20">
              <ShieldCheckIcon class="w-4 h-4 text-green-400" />
              <p class="text-blue-100 text-xs font-medium">Two-Factor Authentication</p>
          </div>
        </div>

        <form @submit.prevent="handleVerify" class="space-y-6">
          <div class="flex justify-between items-end px-1 mb-2">
            <label class="text-xs font-bold text-blue-200 uppercase tracking-wider">One Time Code</label>
            <span class="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/20">Step 2/2</span>
          </div>

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
                class="w-10 h-12 md:w-12 md:h-14 rounded-xl border border-white/10 bg-white/10 text-white text-2xl font-mono text-center focus:bg-white/20 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 outline-none transition-all shadow-inner"
                :disabled="isLoading"
             />
          </div>

          <div v-if="isError" class="bg-red-500/20 border border-red-500/30 rounded-lg p-2.5 animate-pulse">
            <p class="text-red-100 text-sm font-medium text-center flex items-center justify-center gap-2">
              <ExclamationCircleIcon class="w-4 h-4" />
              {{ errorMessage }}
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading || otpDigits.join('').length < 6"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
           text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/40 transform 
           hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50 
           disabled:cursor-not-allowed flex justify-center items-center gap-2 text-base"
          >
            <LockClosedIcon v-if="!isLoading" class="w-5 h-5" />
            <ArrowPathIcon v-else class="animate-spin h-5 w-5 text-white/80" />
            <span v-if="isLoading">Verifying...</span>
            <span v-else>Login</span>
          </button>

          <div class="text-center pt-1">
            <button 
                type="button" 
                @click="backToLogin" 
                class="text-xs text-blue-300/70 hover:text-white hover:underline 
                transition-colors flex items-center justify-center mx-auto gap-1"
            >
                <ArrowLeftIcon class="w-3 h-3" />
                กลับไปหน้า Login
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="absolute bottom-4 w-full text-center z-10">
       <p class="text-blue-200/20 text-[10px] tracking-widest uppercase">
         NovaPay System &copy; 2024
       </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'  
import bgLogin from '@/assets/bg-login_1.png'
import { 
    ShieldCheckIcon, 
    ExclamationCircleIcon, 
    LockClosedIcon, 
    ArrowLeftIcon 
} from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()

const otpDigits = ref(['', '', '', '', '', '']) 
const otpInputs = ref([]) 
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const email = ref('') 

onMounted(() => {
  const storedEmail = sessionStorage.getItem('auth_email')
  if (!storedEmail) {
    router.replace('/login') 
    return
  }
  email.value = storedEmail
  nextTick(() => otpInputs.value[0]?.focus())
})

const handleOtpInput = (index, event) => {
    isError.value = false
    errorMessage.value = ''
    const val = event.target.value
    if (val && index < 5) otpInputs.value[index + 1].focus()
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

const handleVerify = async () => {
  if (!email.value) {
      router.replace('/login')
      return
  }
  
  const otpCode = otpDigits.value.join('')
  if (otpCode.length !== 6) {
      isError.value = true
      errorMessage.value = 'กรุณากรอกรหัส 6 หลัก'
      return
  }

  isLoading.value = true
  isError.value = false

  try {
    console.log(`Verifying 2FA for user...`) 
    const response = await authService.verifyLogin2FA(email.value, otpCode)
    const data = response.data
    
    if (data.message === '2FA Verified Success' || response.status === 200) {
        
        const storedNonce = sessionStorage.getItem('authNonce');
        sessionStorage.removeItem('auth_email'); 
        
        sessionStorage.setItem('is_logged_in', 'true');
        
        try {
            let userRole = null;

            if (data.idToken || data.user?.idToken) {
                const tokenToDecode = data.idToken || data.user.idToken;
                sessionStorage.setItem('idToken', tokenToDecode);
                const decodedProfile = jwtDecode(tokenToDecode);
                console.log("ถอดรหัส idToken สำเร็จ:", decodedProfile);
                
                //  เช็ค Nonce 
                if (storedNonce && decodedProfile.nonce) {
                    if (decodedProfile.nonce !== storedNonce) {
                        console.error(" Security Breach: Nonce Mismatch!");
                        sessionStorage.clear(); 
                        throw new Error("Security Alert: ตรวจพบความเสี่ยงด้านความปลอดภัย (Nonce Mismatch)");
                    }
                    console.log(" ยืนยันความปลอดภัย: Nonce ตรงกันเป๊ะ!");
                    sessionStorage.removeItem('authNonce');
                    sessionStorage.removeItem('authState');
                }

                // ดึง Role อย่างรอบคอบ (เผื่อชื่อ Key เปลี่ยนไป)
                userRole = decodedProfile.roleId || decodedProfile.role || decodedProfile.user_role;
                
            } else if (data.roleId || data.role || data.user?.roleId || data.user?.role) {
                userRole = data.roleId || data.role || data.user?.roleId || data.user?.role;
            }
            
            userRole = Number(userRole)
            console.log(" ได้รับ Role ID คือ:", userRole)

            if (!userRole || isNaN(userRole)) {
                throw new Error("Critical: ไม่สามารถระบุข้อมูลสิทธิ์ (Role) จากระบบได้")
            }
            
            sessionStorage.setItem('roleId', userRole)

            // พาเข้าหน้า Dashboard ตามสิทธิ์
            if (userRole === 6) {
                 sessionStorage.setItem('is_installer', 'true')
                 router.replace('/install/create-admin')
            } else if (userRole === 2) {
                 router.replace('/admin/dashboard')
            } else if (userRole === 4) {
                 router.replace('/callcenter/search-customer')
            } else if (userRole === 3) {
                 router.replace('/branch/dashboard')
            } else {
                 throw new Error(`Access Denied: คุณไม่มีสิทธิ์เข้าใช้งานระบบ (Role: ${userRole})`)
            }

        } catch (innerError) {
            console.error("Authorization Error:", innerError)
            sessionStorage.removeItem('is_logged_in') 
            throw new Error(innerError.message || 'ไม่สามารถระบุสิทธิ์การใช้งานได้ กรุณาติดต่อผู้ดูแลระบบ')
        }
    } else {
        throw new Error('Authentication Failed: Invalid response from server')
    }

  } catch (error) {
    console.error("Authentication Error:", error)
    isError.value = true
    otpDigits.value = ['', '', '', '', '', '']
    nextTick(() => otpInputs.value[0]?.focus())

    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message || error.response.data.error || 'รหัส OTP ไม่ถูกต้อง หรือหมดเวลา'
    } else {
        errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    }
  } finally {
    isLoading.value = false
  }
}

const backToLogin = () => {
  sessionStorage.clear() 
  router.replace('/login')
}
</script>