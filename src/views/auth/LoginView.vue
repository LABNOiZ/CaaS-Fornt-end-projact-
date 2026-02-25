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

    <div class="relative z-10 w-full max-w-md p-6 md:p-8 m-4">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
      
      <div class="relative z-20">
        
        <div class="text-center mb-6">
          <img 
            src="@/assets/logo.png" 
            alt="Company Logo" 
            class="h-16 md:h-20 mx-auto mb-4 drop-shadow-xl transition-all duration-300"
          />
          <h2 class="text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-md">
            Welcome
          </h2>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <div>
            <label class="block text-blue-100 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">Email</label>
            <input 
              v-model="email" 
              @input="isError = false"
              type="email" 
              class="w-full rounded-xl border border-white/10 bg-white/20 p-2.5 md:p-3 text-white placeholder-blue-200/70 focus:bg-white/30 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-inner"
            />
          </div>

          <div>
            <label class="block text-blue-100 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">Password</label>
            <div class="relative">
              <input 
                v-model="password" 
                @input="isError = false"
                :type="showPassword ? 'text' : 'password'"
                class="w-full rounded-xl border border-white/10 bg-white/20 p-2.5 md:p-3 pr-10 text-white placeholder-blue-200/70
               focus:bg-white/30 focus:border-blue-300 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all 
               duration-300 backdrop-blur-sm shadow-inner"
              />
              
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors focus:outline-none"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="text-xs text-blue-100/80 bg-blue-900/30 border border-blue-500/30 p-2.5 rounded-lg flex items-start gap-2">
            <InformationCircleIcon class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>ใช้ Email และ Password ที่ทีมงานสร้างให้เท่านั้น</p>
          </div>

          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="isError" class="bg-red-500/20 border border-red-500/50 rounded-lg p-2.5 ">
              <p class="text-red-200 text-sm font-bold text-center flex items-center justify-center gap-2">
                <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
                <span>{{ errorMessage || 'Email หรือ Password ไม่ถูกต้อง' }}</span>
              </p>
            </div>
          </transition>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500
             text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 
             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
             flex justify-center items-center gap-2"
          >
            <ArrowPathIcon v-if="isLoading" class="animate-spin h-5 w-5 text-white" />
            <span v-if="isLoading">Verifying...</span>
            <span v-else>Sign In</span>
          </button>

          <div class="text-center pt-1">
            <router-link to="/forgot-password" class="text-xs text-blue-200 hover:text-white hover:underline transition-colors">
                Forgot password?
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <div class="absolute bottom-2 text-center w-full z-10">
       <p class="text-blue-200/40 text-[10px] md:text-xs">© NovaPay System. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService' 
import bgLogin from '@/assets/bg-login_1.png'
import { 
  InformationCircleIcon, 
  ExclamationCircleIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const email = ref('')
const password = ref('')
const isError = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  isError.value = false
  errorMessage.value = ''
  isLoading.value = true

  // 1. ล้าง Storage เก่าเสมอ
  sessionStorage.clear()

  try {
    console.log("Attempting Login...")
    
    // ยิง API Login
    const response = await authService.login(email.value, password.value)
    const data = response.data
    console.log("Login Response:", data)
    
    // 2. เช็ค Status: OTP / SETUP
    if (data.status === 'OTP_REQUIRED') {
        sessionStorage.setItem('auth_email', email.value)
        router.push('/login-2fa') 
        return 
    }

    if (data.status === 'SETUP_REQUIRED') {
        sessionStorage.setItem('auth_email', email.value) 
        router.push('/install/two-factor-intro') 
        return 
    }

    // 3. เช็ค Token (กรณี Login สำเร็จ)
    if (data.token || data.accessToken) {
        const token = data.token || data.accessToken
        sessionStorage.setItem('token', token)
        
        // 🔹 เก็บ Refresh Token (ถ้ามี) สำหรับ Silent Refresh
        if (data.refreshToken) {
            sessionStorage.setItem('refreshToken', data.refreshToken)
        }
        
        // หา Role ID
        let userRole = data.roleId || data.role

        if (!userRole) {
            console.log("Fetching User Profile...")
            const profileRes = await userService.getProfile()
            userRole = Number(profileRes.data.roleId)
        }
        
        console.log("User Role:", userRole)
        sessionStorage.setItem('roleId', userRole)

        // Redirect ตาม Role
        handleRedirect(userRole)
    } 
    else {
        throw new Error(data.message || 'Login Failed (Unknown Response)')
    }

  } catch (error) {
    console.error("Login Error:", error)
    isError.value = true
    
    //  อัปเดตการดักจับ Error ให้ครอบคลุมทุกเคสและเป็นภาษาไทย
    if (error.response) {
        // มีการตอบกลับมาจาก Server แต่เป็น Error (เช่น 400, 401, 500)
        const status = error.response.status
        const serverMsg = error.response.data?.error || error.response.data?.message
        
        if (status === 401 || status === 400) {
            errorMessage.value = serverMsg || 'Email หรือ Password ไม่ถูกต้อง'
        } else if (status === 500) {
            errorMessage.value = 'ระบบขัดข้องชั่วคราว ไม่สามารถเชื่อมต่อ Server ได้ '
        } else {
            errorMessage.value = serverMsg || `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (Code: ${status})`
        }
    } else if (error.request) {
        // ส่ง Request ไปแล้ว แต่ไม่ได้ Response กลับมา (Server ปิด, เน็ตพัง)
        errorMessage.value = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต'
    } else {
        // Error อื่นๆ
        errorMessage.value = 'เกิดข้อผิดพลาด: ' + error.message
    }
  } finally {
    isLoading.value = false
  }
}

const handleRedirect = (roleId) => {
    // Case 1: Role 6 = Default (Installer)
    if (roleId === 6) {
        sessionStorage.setItem('is_installer', 'true')
        router.push('/install/create-admin')
        return
    } 
    
    // User ทั่วไป (Admin, Branch, CallCenter)
    sessionStorage.removeItem('is_installer')

    if (roleId === 2) {
        router.push('/admin/dashboard')
    } 
    else if (roleId === 4) { 
        router.push('/callcenter/search-customer')
    } 
    else if (roleId === 3) { 
        router.push('/branch/dashboard') 
    } 
    else {
        console.error("Unknown Role ID:", roleId)
        isError.value = true
        errorMessage.value = `บัญชีนี้ไม่มีสิทธิ์เข้าใช้งาน (Role: ${roleId})`
        sessionStorage.clear()
    }
}
</script>