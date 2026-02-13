<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
    
    <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
      <div class="bg-blue-50 p-1.5 rounded-full">
        <LockClosedIcon class="h-4 w-4 text-blue-600" />
      </div>
      เปลี่ยนรหัสผ่าน
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      
      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">รหัสผ่านเดิม</label>
        <PasswordInput 
          v-model="form.oldPassword" 
          placeholder="ระบุรหัสผ่านปัจจุบัน" 
          @input="clearError"
          class="text-xs" 
        />
      </div>

      <hr class="border-gray-100" />

      <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">รหัสผ่านใหม่</label>
        <PasswordInput 
          v-model="form.newPassword" 
          placeholder="ระบุรหัสผ่านใหม่" 
          @input="clearError"
          class="text-xs"
        />

         <div>
        <label class="block text-xs font-bold text-gray-600 mb-1">ยืนยันรหัสผ่านใหม่</label>
        <PasswordInput 
          v-model="form.confirmPassword" 
          placeholder="ระบุรหัสผ่านใหม่อีกครั้ง" 
          @input="clearError"
          class="text-xs"
        />
      </div>
        <PasswordRules 
          :password="form.newPassword" 
          @check-valid="(isValid) => isPasswordValid = isValid" 
          class="mt-2 text-[10px]" 
        />
      </div>

      <div v-if="errorMessage" class="bg-red-50 text-red-500 text-xs font-bold p-2 rounded-lg flex items-center gap-2 animate-pulse">
        <ExclamationCircleIcon class="h-4 w-4 flex-shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="successMessage" class="bg-green-50 text-green-600 text-xs font-bold p-2 rounded-lg flex items-center gap-2">
        <CheckCircleIcon class="h-4 w-4 flex-shrink-0" />
        <span>{{ successMessage }}</span>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button 
          type="button" 
          @click="resetForm" 
          class="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition text-xs"
        >
          ล้างค่า
        </button>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-xs shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="animate-spin mr-1.5 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
          บันทึก
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userService } from '@/services/userService'
import PasswordInput from '@/components/PasswordInput.vue'
import PasswordRules from '@/components/PasswordRules.vue'

import { 
  LockClosedIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isPasswordValid = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const clearError = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const resetForm = () => {
  form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  clearError()
}

const handleSubmit = async () => {
  clearError()

  if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMessage.value = 'รหัสผ่านใหม่ไม่ตรงกัน'
    return
  }

  if (!isPasswordValid.value) {
    errorMessage.value = 'รหัสผ่านใหม่ไม่ผ่านเงื่อนไขความปลอดภัย'
    return
  }

  isLoading.value = true
  try {
    await userService.changePassword({
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword,
        confirmPassword: form.value.confirmPassword
    })

    successMessage.value = 'เปลี่ยนรหัสผ่านสำเร็จแล้ว'
    form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }

  } catch (error) {
    console.error("Change Password Error:", error)
    errorMessage.value = error.response?.data?.message || 'รหัสผ่านเดิมไม่ถูกต้อง หรือเกิดข้อผิดพลาด'
  } finally {
    isLoading.value = false
  }
}
</script>