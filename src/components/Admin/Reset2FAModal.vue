<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in border border-gray-100">
      <div class="p-6 text-center">
         <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldExclamationIcon class="w-8 h-8 text-orange-500" />
         </div>
         <h4 class="text-gray-800 font-bold text-base mb-1">ยืนยัน Reset 2FA?</h4>
         <p class="text-gray-500 text-xs mb-4">
            คุณต้องการรีเซ็ต 2FA ของ <br>
            <span class="font-bold text-gray-800">{{ user?.displayFullNameEn }}</span> ใช่หรือไม่? <br>
            <span class="text-[10px] text-red-500">(User จะต้องสแกน QR Code ใหม่ในการ Login ครั้งถัดไป)</span>
         </p>
         
         <div class="text-left mb-4">
            <label class="block text-[10px] font-bold text-gray-600 mb-1">กรุณากรอกรหัสผ่านของคุณ (Admin) เพื่อยืนยัน</label>
            
            <PasswordInput 
                v-model="adminConfirmPassword" 
                placeholder="Admin Password" 
                class="text-xs" 
                @input="errorMessage = ''"
            />

            <div v-if="errorMessage" class="flex items-center gap-1 mt-2 text-red-500 ">
                <ExclamationCircleIcon class="w-4 h-4" />
                <span class="text-[10px] font-bold">{{ errorMessage }}</span>
            </div>
         </div>

         <div class="flex justify-center gap-3">
             <button @click="$emit('close')" class="flex-1 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-bold text-xs">ยกเลิก</button>
             <button 
               @click="handleConfirm" 
               :disabled="!adminConfirmPassword || isLoading"
               class="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-bold text-xs shadow-orange-200 shadow-md disabled:opacity-50 flex justify-center gap-2"
             >
               <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
               <span v-else>ยืนยัน</span>
             </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShieldExclamationIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import PasswordInput from '@/components/PasswordInput.vue'
import { adminResetTwoFactor } from '@/services/adminService'

const props = defineProps({
  user: { type: Object, required: true }
})
const emit = defineEmits(['close', 'success'])

const adminConfirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleConfirm = async () => {
   if (!adminConfirmPassword.value) return
   
   isLoading.value = true
   errorMessage.value = '' // เคลียร์ error เก่าก่อน

   try {
       await adminResetTwoFactor(props.user.id, adminConfirmPassword.value)
       emit('success', 'รีเซ็ต 2FA สำเร็จ')
       emit('close')
   } catch (error) {
       console.error("Reset 2FA Error:", error)
       //  แสดง Error ใน UI แทน Alert
       errorMessage.value = error.response?.data?.error || 'รหัสผ่านไม่ถูกต้อง หรือ Server Error'
       adminConfirmPassword.value = '' // เคลียร์รหัสผ่านให้พิมพ์ใหม่
   } finally {
       isLoading.value = false
   }
}
</script>