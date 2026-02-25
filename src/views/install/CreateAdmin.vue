<template>
  <div class="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans p-4">
    
    <div class="absolute inset-0 z-0" :style="{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-purple-900/80"></div>

    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

    <div class="relative z-10 w-full max-w-lg">
        <div class="bg-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/20">
            
            <h2 class="text-center text-xl font-bold mb-3 text-white tracking-tight drop-shadow-md">สร้างบัญชี Admin</h2>

            <form @submit.prevent="handleRegister" class="space-y-2">
                
                <div v-if="apiError" class="bg-red-500/20 text-red-200 p-1.5 rounded-lg text-xs text-center border border-red-500/50 flex items-center justify-center gap-2">
                    <ExclamationCircleIcon class="h-3 w-3 shrink-0" />
                    {{ apiError }}
                </div>

                <div>
                    <label class="block text-blue-200 text-[10px] font-bold mb-1 uppercase tracking-wider ml-1">ข้อมูลภาษาไทย</label>
                    <div class="flex gap-2">
                        <input v-model="firstNameTh" type="text" placeholder="ชื่อ (ไทย)" class="w-1/2 rounded-xl border border-white/10 bg-white/20 p-2 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs" required />
                        <input v-model="lastNameTh" type="text" placeholder="นามสกุล (ไทย)" class="w-1/2 rounded-xl border border-white/10 bg-white/20 p-2 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs" required />
                    </div>
                </div>

                <div>
                    <label class="block text-blue-200 text-[10px] font-bold mb-1 uppercase tracking-wider ml-1">ข้อมูลภาษาอังกฤษ</label>
                    <div class="flex gap-2">
                        <input v-model="firstNameEn" type="text" placeholder="First Name" class="w-1/2 rounded-xl border border-white/10 bg-white/20 p-2 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs" required />
                        <input v-model="lastNameEn" type="text" placeholder="Last Name" class="w-1/2 rounded-xl border border-white/10 bg-white/20 p-2 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs" required />
                    </div>
                </div>

                <div>
                    <label class="block text-blue-200 text-[10px] font-bold mb-1 uppercase tracking-wider ml-1">อีเมล</label>
                    <input v-model="email" type="email" placeholder="example@novapay.com" class="w-full rounded-xl border border-white/10 bg-white/20 p-2 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs" required />
                </div>

                <div class="flex gap-2">
                    <div class="w-1/2">
                        <label class="block text-blue-200 text-[10px] font-bold mb-1 uppercase tracking-wider ml-1">รหัสผ่าน</label>
                        <div class="relative">
                            <input 
                                v-model="password" 
                                :type="showPassword ? 'text' : 'password'"
                                class="w-full rounded-xl border border-white/10 bg-white/20 p-2 pr-8 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs"
                                required 
                            />
                            <button type="button" @click="showPassword = !showPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors outline-none">
                                <EyeIcon v-if="!showPassword" class="w-3 h-3" />
                                <EyeSlashIcon v-else class="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div class="w-1/2">
                        <label class="block text-blue-200 text-[10px] font-bold mb-1 uppercase tracking-wider ml-1">ยืนยันรหัสผ่าน</label>
                        <div class="relative">
                            <input 
                                v-model="confirmPassword" 
                                :type="showConfirmPassword ? 'text' : 'password'"
                                class="w-full rounded-xl border border-white/10 bg-white/20 p-2 pr-8 text-white placeholder-blue-200/50 focus:bg-white/30 focus:border-blue-300 focus:ring-1 focus:ring-blue-400/30 outline-none transition-all shadow-inner text-xs"
                                required 
                            />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors outline-none">
                                <EyeIcon v-if="!showConfirmPassword" class="w-3 h-3" />
                                <EyeSlashIcon v-else class="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="pt-0 pl-1">
                     <PasswordRules :password="password" @check-valid="(val) => isRulePassed = val" />
                </div>

                <div class="pt-2">
                    <FormAlert :message="currentErrorMessage" class="mb-2 text-[10px]" />

                    <button
                        type="submit"
                        :disabled="!canSubmit || isLoading"
                        :class="canSubmit ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg cursor-pointer transform hover:-translate-y-0.5' : 'bg-white/10 cursor-not-allowed text-white/50 border border-white/10'"
                        class="w-full text-white py-2.5 rounded-xl transition-all duration-200 font-bold text-xs flex justify-center items-center gap-2 shadow-blue-900/20"
                    >
                        <ArrowPathIcon v-if="isLoading" class="animate-spin h-4 w-4 text-white" />
                        <span v-if="isLoading">กำลังประมวลผล...</span>
                        <span v-else>สร้างบัญชี Admin</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <div class="absolute bottom-2 text-center w-full z-10">
       <p class="text-blue-200/30 text-[10px] uppercase tracking-widest">© NovaPay System. All rights reserved.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import PasswordInput from '@/components/PasswordInput.vue' //  ไม่ใช้แล้ว
import PasswordRules from '@/components/PasswordRules.vue'
import FormAlert from '@/components/FormAlert.vue'
import { authService } from '@/services/authService'
import bgLogin from '@/assets/bg-login_1.png'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid' 

const router = useRouter()
const firstNameTh = ref('')
const lastNameTh = ref('')
const firstNameEn = ref('')
const lastNameEn = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isRulePassed = ref(false)
const isLoading = ref(false)
const apiError = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const currentErrorMessage = computed(() => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return "รหัสผ่านไม่ตรงกัน"
  }
  if (password.value && !isRulePassed.value) {
    return "เงื่อนไขการตั้งรหัสผ่านไม่ถูกต้อง"
  }
  return ""
})

const canSubmit = computed(() => {
  return isRulePassed.value &&
         (password.value === confirmPassword.value) &&
         password.value !== '' &&
         email.value !== '' &&
         firstNameTh.value.trim() !== '' &&
         lastNameTh.value.trim() !== '' &&
         firstNameEn.value.trim() !== '' &&
         lastNameEn.value.trim() !== ''
})

const handleRegister = async () => {
  apiError.value = ''
  isLoading.value = true

  try {
    const payload = {
        email: email.value,
        password: password.value,
        firstName: firstNameEn.value,  
        lastName: lastNameEn.value,    
        firstNameTh: firstNameTh.value,
        lastNameTh: lastNameTh.value,  
        roleId: 2
    }
    await authService.register(payload)

    sessionStorage.clear()
    const loginRes = await authService.login(email.value, password.value)
    const loginData = loginRes.data
    
    if (loginData.token || loginData.accessToken || loginData.status === 'SETUP_REQUIRED') {
        const token = loginData.token || loginData.accessToken
        if (token) sessionStorage.setItem('token', token)

        sessionStorage.setItem('install_email', email.value)
        sessionStorage.setItem('setupOrigin', 'install_flow')
        
        router.push('/install/success')
    } else {
        throw new Error("สร้างบัญชีสำเร็จ แต่การเข้าสู่ระบบอัตโนมัติล้มเหลว")
    }

  } catch (error) {
    console.error("❌ Process Error:", error)
    if (error.response && error.response.status === 400) {
        apiError.value = "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น"
    } else if (error.response && error.response.data && error.response.data.message) {
        apiError.value = error.response.data.message
    } else {
        apiError.value = "เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถดำเนินการได้")
    }
  } finally {
    isLoading.value = false
  }
}
</script>