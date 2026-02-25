<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in border border-gray-100">
      
      <div class="p-6 text-center">
         <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon class="w-8 h-8 text-red-500" />
         </div>

         <h4 class="text-gray-800 font-bold text-base mb-1">ยืนยันการระงับบัญชี?</h4>
         <p class="text-gray-500 text-xs mb-4">
             คุณต้องการระงับบัญชี <span class="font-bold text-gray-800">{{ user?.displayFullNameEn }}</span> ใช่หรือไม่?
             <br><span class="text-[10px] text-red-400">(ผู้ใช้จะไม่สามารถเข้าสู่ระบบได้)</span>
         </p>

         <div class="text-left mb-4">
            <label class="block text-[10px] font-bold text-gray-600 mb-1">กรุณากรอกรหัสผ่านของคุณ (Admin) เพื่อยืนยัน</label>
            
            <PasswordInput 
                v-model="adminConfirmPassword" 
                placeholder="Admin Password" 
                class="text-xs" 
                @input="errorMessage = ''"
            />

            <div v-if="errorMessage" class="flex items-center gap-1 mt-2 text-red-500">
                <ExclamationCircleIcon class="w-4 h-4" />
                <span class="text-[10px] font-bold">{{ errorMessage }}</span>
            </div>
         </div>

         <div class="flex justify-center gap-3">
             <button 
                @click="$emit('close')" 
                class="flex-1 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-bold text-xs transition"
             >
                ยกเลิก
             </button>
             
             <button 
                @click="handleConfirm" 
                :disabled="!adminConfirmPassword || isLoading"
                class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-bold 
                text-xs shadow-red-200 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2 items-center"
             >
                <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
                <span v-else>ยืนยันระงับ</span>
             </button>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline' 
import PasswordInput from '@/components/PasswordInput.vue'
import { deleteWebUser } from '@/services/adminService'

const props = defineProps({
  user: { type: Object, required: true }
})
const emit = defineEmits(['close', 'success'])

const adminConfirmPassword = ref('')
const errorMessage = ref('') //  ตัวแปรเก็บข้อความ Error
const isLoading = ref(false) //  ตัวแปรเช็คสถานะ Loading

const handleConfirm = async () => {
  if (!adminConfirmPassword.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // ส่งรหัสผ่าน Admin ไปด้วย 
    await deleteWebUser(props.user.id, adminConfirmPassword.value)
    
    emit('success', 'ระงับบัญชีเรียบร้อยแล้ว')
    emit('close')
  } catch (error) {
    console.error("Suspend Error:", error)
    
    //  ดึง Error จาก key "error" ก่อน (ตาม API ของคุณ)
    errorMessage.value =  error.response?.data?.message || 
                         'รหัสผ่านไม่ถูกต้อง หรือ Server Error'
    
    // เคลียร์รหัสผ่านเพื่อให้ User พิมพ์ใหม่
    adminConfirmPassword.value = '' 
  } finally {
    isLoading.value = false
  }
}
</script>