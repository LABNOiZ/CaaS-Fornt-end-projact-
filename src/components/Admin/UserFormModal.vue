<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
      
      <div class="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
         <h3 class="font-bold text-base text-gray-800 flex items-center gap-2">
             <div class="w-1 h-4 bg-blue-500 rounded-full"></div>
             {{ isEditMode ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}
         </h3>
         <button @click="$emit('close')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-red-500 transition duration-200">
            <XMarkIcon class="w-5 h-5 stroke-2" />
         </button>
      </div>
      
      <div class="p-6 overflow-y-auto no-scrollbar flex-1">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">ชื่อจริง (ไทย) <span class="text-red-500">*</span></label>
               <input 
                 v-model="form.firstNameTh" 
                 @input="handleThaiInput($event, 'firstNameTh')"
                 type="text" 
                 class="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" 
                 required 
               />
             </div>
             <div>
               <label class="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">นามสกุล (ไทย) <span class="text-red-500">*</span></label>
               <input 
                 v-model="form.lastNameTh" 
                 @input="handleThaiInput($event, 'lastNameTh')"
                 type="text" 
                 class="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" 
                 required 
               />
             </div>
           </div>

           <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">First Name (Eng) <span class="text-red-500">*</span></label>
               <input 
                 v-model="form.firstName" 
                 @input="handleEngInput($event, 'firstName')"
                 type="text" 
                 class="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" 
                 required 
               />
             </div>
             <div>
               <label class="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Last Name (Eng) <span class="text-red-500">*</span></label>
               <input 
                 v-model="form.lastName" 
                 @input="handleEngInput($event, 'lastName')"
                 type="text" 
                 class="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" 
                 required 
               />
             </div>
           </div>
           
           <div>
             <label class="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Email <span class="text-red-500">*</span></label>
             <input v-model="form.email" type="email" :disabled="isEditMode" :class="isEditMode ? 
             'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50/50'" class="w-full border border-gray-200 p-2.5 rounded-xl text-sm
              focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"  />
           </div>

           <div v-if="!isEditMode" class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
              <PasswordInput v-model="form.password" label="Password" placeholder="กำหนดรหัสผ่าน" @input="formError = ''" />
              <PasswordInput v-model="form.confirmPassword" label="Confirm Password" placeholder="ยืนยันรหัสผ่าน" @input="formError = ''" />
              <PasswordRules :password="form.password" @check-valid="(isValid) => isPasswordValid = isValid" class="text-[10px]" />
           </div>

           <div class="relative">
             <label class="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Role <span class="text-red-500">*</span></label>
             <div class="relative">
                <select v-model="form.roleId" class="w-full border border-gray-200 p-2.5 pr-10 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer" required>
                  <option value="" disabled>-- เลือกบทบาทผู้ใช้งาน --</option>
                  <option v-for="role in displayedRoleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
                </select>
                <ChevronDownIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
           </div>

           <div v-if="isBranchManagerSelected" class="animate-fade-in-down">
             <label class="block text-[11px] font-bold text-blue-600 mb-1.5 uppercase tracking-wide">เลขสาขา (Branch Number)</label>
             <input v-model="form.branchNumber" @input="handleNumberInput" type="text" class="w-full border border-blue-200 p-2.5 rounded-xl text-sm bg-blue-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono tracking-wider" placeholder="เช่น 102" required />
           </div>

           <div v-if="formError" class="text-red-500 text-xs font-bold flex items-center gap-2 animate-pulse bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
               <ExclamationTriangleIcon class="w-5 h-5 shrink-0" /> {{ formError }}
           </div>
          
          <div class="flex gap-3 pt-4 border-t border-gray-100 mt-2">
            <button type="button" @click="$emit('close')" class="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition text-sm">ยกเลิก</button>
            <button type="submit" class="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm">{{ isEditMode ? 'บันทึกแก้ไข' : 'สร้างบัญชี' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { XMarkIcon, ExclamationTriangleIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import PasswordInput from '@/components/PasswordInput.vue'
import PasswordRules from '@/components/PasswordRules.vue'
import { createWebUser, updateWebUser } from '@/services/adminService'

const props = defineProps({
  userToEdit: { type: Object, default: null }
})
const emit = defineEmits(['close', 'success'])

const isEditMode = computed(() => !!props.userToEdit)
const formError = ref('')
const isPasswordValid = ref(false)

const masterRoleOptions = [
  { label: 'Admin', value: 2 },  
  { label: 'Call Center', value: 4 }, 
  { label: 'Branch Manager', value: 3 } 
]

const displayedRoleOptions = computed(() => {
  if (isEditMode.value) {
    return masterRoleOptions.filter(role => role.value !== 2)
  }
  return masterRoleOptions
})

const form = ref({
  firstName: '', lastName: '', firstNameTh: '', lastNameTh: '',
  email: '', password: '', confirmPassword: '', roleId: '', branchNumber: ''
})

const isBranchManagerSelected = computed(() => form.value.roleId === 3)

// --- Input Filters ---

const handleThaiInput = (e, field) => {
    const val = e.target.value.replace(/[^ก-ฮะ-์]/g, '')
    form.value[field] = val
    e.target.value = val 
}

const handleEngInput = (e, field) => {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '')
    form.value[field] = val
    e.target.value = val 
}

const handleNumberInput = (e) => {
  const val = e.target.value.replace(/\D/g, '')
  form.value.branchNumber = val
  e.target.value = val
}

const splitName = (fullName) => {
    if (!fullName || fullName === '-') return { first: '', last: '' }
    const parts = fullName.trim().split(' ') 
    const first = parts[0] || ''
    const last = parts.slice(1).join(' ') || '' 
    return { first, last }
}

watch(() => props.userToEdit, (newUser) => {
  if (newUser) {
    let fTh = newUser.firstNameTh
    let lTh = newUser.lastNameTh
    if (!fTh && !lTh && newUser.displayFullNameTh) {
        const { first, last } = splitName(newUser.displayFullNameTh)
        fTh = first
        lTh = last
    }

    let fEn = newUser.firstName
    let lEn = newUser.lastName
    if (!fEn && !lEn && newUser.displayFullNameEn) {
        const { first, last } = splitName(newUser.displayFullNameEn)
        fEn = first
        lEn = last
    }

    form.value = {
      firstName: fEn || '',
      lastName: lEn || '',
      firstNameTh: fTh || '',
      lastNameTh: lTh || '',
      email: newUser.email || '',
      password: '', 
      confirmPassword: '',
      roleId: newUser.roleId,
      branchNumber: newUser.branchNumber === '-' ? '' : newUser.branchNumber
    }
  } else {
    form.value = {
      firstName: '', lastName: '', firstNameTh: '', lastNameTh: '',
      email: '', password: '', confirmPassword: '', roleId: '', branchNumber: ''
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  formError.value = ''
  
  if (!isEditMode.value) {
     if (form.value.password !== form.value.confirmPassword) {
       formError.value = 'รหัสผ่านไม่ตรงกัน'; return 
     }
     if (!isPasswordValid.value) {
       formError.value = 'รหัสผ่านไม่ผ่านเงื่อนไขความปลอดภัย'; return 
     }
  }

  const payload = {
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    firstNameTh: form.value.firstNameTh,
    lastNameTh: form.value.lastNameTh,
    roleId: form.value.roleId,
    branchCode: isBranchManagerSelected.value ? form.value.branchNumber : ""
  }

  try {
    if (isEditMode.value) {
      await updateWebUser(props.userToEdit.id, payload)
      emit('success', 'แก้ไขข้อมูลสำเร็จ')
    } else {
      await createWebUser({ ...payload, password: form.value.password })
      emit('success', 'สร้าง User สำเร็จ')
    }
    emit('close') 
  } catch (error) {
    formError.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  }
}
</script>

<style scoped>
/* ซ่อน Scrollbar แต่ยังเลื่อนได้ */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>