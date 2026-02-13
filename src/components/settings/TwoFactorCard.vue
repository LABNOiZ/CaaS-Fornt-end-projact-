<template>
  <div>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      <div class="flex items-center gap-4">
        <div class="bg-green-100 p-3 rounded-full">
           <ShieldCheckIcon class="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide">2FA Status</h3>
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold text-green-600">Active</span>
            <span class="text-sm text-gray-400 font-medium">for {{ currentUserEmail || 'loading...' }}</span>
          </div>
        </div>
      </div>

      <button 
        @click="openDeleteModal"
        class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all active:scale-95 text-sm flex items-center gap-2"
      >
        <NoSymbolIcon class="h-4 w-4" />
        reset 2FA
      </button>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden transform transition-all scale-100 p-6">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
             <ExclamationTriangleIcon class="h-6 w-6 text-orange-500" />
          </div>
          <h3 class="text-lg font-bold text-gray-800">ยืนยันการปิด 2FA</h3>
        </div>

        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon class="h-8 w-8 text-blue-500" />
          </div>
          <p class="text-base font-bold text-gray-800">ใส่รหัสผ่านเพื่อยืนยัน</p>
          <p class="text-xs text-gray-500 mt-1">โปรดระบุรหัสผ่าน Login ของคุณเพื่อยืนยันการทำรายการ</p>
        </div>

        <div class="mb-6">
          <label class="block text-xs font-bold text-gray-600 mb-1 text-left">Password</label>
          <PasswordInput 
            v-model="confirmPassword" 
            placeholder="กรอกรหัสผ่านเพื่อยืนยัน..."
            class="text-sm"
          />
          <div v-if="errorMessage" class="flex items-center gap-1.5 mt-2 text-red-500 animate-pulse">
             <ExclamationCircleIcon class="h-4 w-4" />
             <span class="text-xs font-bold">{{ errorMessage }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            @click="closeModal" 
            class="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition text-sm"
          >
            ยกเลิก
          </button>
          
          <button 
            @click="handleSubmit" 
            :disabled="isLoading"
            class="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition text-sm shadow-sm flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>ยืนยัน</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/userService' 
import PasswordInput from '@/components/PasswordInput.vue'

import { 
  ShieldCheckIcon, 
  NoSymbolIcon, 
  ExclamationTriangleIcon, 
  LockClosedIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const showModal = ref(false)
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// เก็บข้อมูล 2 ค่า (Email สำหรับ QR Code, UserID สำหรับยิง API Reset)
const currentUserEmail = ref('')
const currentUserId = ref('') 

// โหลดข้อมูล Profile เพื่อเอา Email และ UserId
onMounted(async () => {
  try {
    const res = await userService.getProfile()
    currentUserEmail.value = res.data.email 
    currentUserId.value = res.data.userId || res.data.id // เผื่อ Backend ส่งมาเป็น id หรือ userId
    
    console.log("Profile Loaded:", { 
        email: currentUserEmail.value, 
        id: currentUserId.value 
    })
  } catch (error) {
    console.error("Failed to load profile", error)
  }
})

const openDeleteModal = () => {
  confirmPassword.value = ''
  errorMessage.value = ''
  showModal.value = true 
}

const closeModal = () => { showModal.value = false }

const handleSubmit = async () => {
  if (!confirmPassword.value) {
    errorMessage.value = 'กรุณากรอกรหัสผ่าน'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // เช็คว่ามี ID ไหม (ถ้าไม่มี แสดงว่าโหลด Profile ไม่สมบูรณ์)
    if (!currentUserId.value) {
        throw new Error("ไม่พบข้อมูล User ID (กรุณา Refresh หน้าจอแล้วลองใหม่)")
    }

    // 1. เรียก API ลบ 2FA (ส่ง userId ตาม API ใหม่)
    // หมายเหตุ: ต้องมั่นใจว่าใน userService.js แก้ให้รับ parameter แรกเป็น userId แล้ว
    await userService.resetTwoFactor(currentUserId.value, confirmPassword.value)
    
    // 2. Set flag ว่ามาจาก settings
    sessionStorage.setItem('setupOrigin', 'settings') 
    
    // 3. บันทึกอีเมลลง Session เพื่อให้หน้า QR Code ดึงไปใช้สร้าง Label (Google Authenticator)
    sessionStorage.setItem('auth_email', currentUserEmail.value) 
    
    showModal.value = false
    
    // 4. Redirect ไปหน้าเริ่ม Setup 2FA ใหม่
    router.push({ name: 'TwoFactorIntro' }) 

  } catch (error) {
    console.error(error)
    if (error.response && error.response.status === 403) {
        errorMessage.value = 'รหัสผ่านไม่ถูกต้อง'
    } else {
        errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการทำรายการ'
    }
  } finally {
    isLoading.value = false
  }
}
</script>