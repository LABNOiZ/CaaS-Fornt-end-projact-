<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in border border-gray-100">
      
      <div class="p-6 text-center">
         <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              :class="isAlreadySuspended ? 'bg-gray-100' : 'bg-red-100'">
            <ExclamationTriangleIcon class="w-8 h-8" :class="isAlreadySuspended ? 'text-gray-400' : 'text-red-500'" />
         </div>

         <h4 class="text-gray-800 font-bold text-base mb-1">
             {{ isAlreadySuspended ? 'บัญชีนี้ถูกระงับแล้ว' : 'ยืนยันการระงับบัญชี?' }}
         </h4>
         
         <p class="text-gray-500 text-xs mb-4">
             <template v-if="isAlreadySuspended">
                 บัญชี <span class="font-bold text-gray-800">{{ user?.displayFullNameEn }}</span><br>
                 อยู่ในสถานะระงับการใช้งานเรียบร้อยแล้ว
             </template>
             <template v-else>
                 คุณต้องการระงับบัญชี <span class="font-bold text-gray-800">{{ user?.displayFullNameEn }}</span> ใช่หรือไม่?<br>
                 <span class="text-[10px] text-red-400">(ผู้ใช้จะไม่สามารถเข้าสู่ระบบได้)</span>
             </template>
         </p>

         <div v-if="!isAlreadySuspended" class="text-left mb-4">
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
                {{ isAlreadySuspended ? 'ปิดหน้าต่าง' : 'ยกเลิก' }}
             </button>
             
             <button 
                v-if="!isAlreadySuspended"
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
import { ref, computed } from 'vue'
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline' 
import PasswordInput from '@/components/PasswordInput.vue'
import { deleteWebUser } from '@/services/adminService'

const props = defineProps({
  user: { type: Object, required: true }
})
const emit = defineEmits(['close', 'success'])

const adminConfirmPassword = ref('')
const errorMessage = ref('') 
const isLoading = ref(false) 

// 🎯 เช็คว่าบัญชีนี้ถูกระงับไปแล้วหรือยัง (เช็คจาก INACTIVE หรือ SUSPENDED)
const isAlreadySuspended = computed(() => {
  return props.user?.status === 'INACTIVE' || props.user?.status === 'SUSPENDED'
})

const handleConfirm = async () => {
  if (!adminConfirmPassword.value || isAlreadySuspended.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await deleteWebUser(props.user.id, adminConfirmPassword.value)
    
    emit('success', 'ระงับบัญชีเรียบร้อยแล้ว')
    emit('close')
  } catch (error) {
    console.error("Suspend Error:", error)
    
    errorMessage.value =  error.response?.data?.message || 'รหัสผ่านไม่ถูกต้อง หรือ Server Error'
    adminConfirmPassword.value = '' 
  } finally {
    isLoading.value = false
  }
}
</script>