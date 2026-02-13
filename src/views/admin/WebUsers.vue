<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50 px-4 pt-3 font-sans">

    <div class="flex-none mb-3 flex items-center gap-2">
        <div class="bg-blue-100 p-1.5 rounded-lg">
            <UserCircleIcon class="w-5 h-5 text-blue-600" />
        </div>
        <h2 class="text-lg font-extrabold text-gray-800 tracking-tight leading-none">จัดการผู้ใช้งาน (User Access Management)</h2>
    </div>

    <div class="flex-none bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
        <div class="flex flex-col gap-3">
            
            <div class="flex items-center justify-between">
                
                <div class="flex items-center gap-2">
                    <div class="relative w-[280px]">
                        <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            v-model="searchInput" 
                            @keyup.enter="handleSearch"
                            type="text" 
                            placeholder="พิมพ์ชื่อ-นามสกุล (ไทย)..."
                            class="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg 
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition h-[36px]"
                        />
                    </div>
                    
                    <button 
                        @click="handleSearch"
                        :disabled="isLoading"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 h-[36px] text-xs disabled:opacity-50 min-w-[70px] justify-center"
                    >
                        <span v-if="!isLoading">ค้นหา</span>
                        <span v-else>ค้นหา</span>
                    </button>
                </div>

                <button 
                    @click="openAddModal" 
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 h-[36px] text-xs whitespace-nowrap"
                >
                    <PlusIcon class="w-4 h-4" /> Add User
                </button>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto pb-1">
                <span class="text-[10px] font-bold text-gray-500 mr-1 flex items-center gap-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div> กรอง Role:
                </span>
                <div class="flex gap-1">
                    <button @click="currentRoleFilter = 'ALL'" :class="currentRoleFilter === 'ALL' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all">ทั้งหมด</button>
                    <button @click="currentRoleFilter = 2" :class="currentRoleFilter === 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:text-blue-600 hover:border-blue-200'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all">Admin</button>
                    <button @click="currentRoleFilter = 4" :class="currentRoleFilter === 4 ? 'bg-pink-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:text-pink-600 hover:border-pink-200'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all">Call Center</button>
                    <button @click="currentRoleFilter = 3" :class="currentRoleFilter === 3 ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:text-purple-600 hover:border-purple-200'" class="px-3 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap">Manager</button>
                </div>
            </div>

        </div>
    </div>

    <div class="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative mb-2">
        
        <div class="flex-none px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-bold text-xs text-gray-700 uppercase tracking-wide">
               รายชื่อผู้ใช้งาน
            </h3>
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="filteredUsers.length > 0"></span>
                <span class="text-[10px] text-gray-500">
                   พบ <span class="font-bold text-blue-600">{{ filteredUsers.length }}</span> บัญชี
                </span>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative">
            <table class="w-full text-left border-collapse table-fixed"> 
                <thead class="bg-white text-gray-500 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th class="px-4 py-2.5 w-[20%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">ชื่อ-นามสกุล</th>
                        <th class="px-4 py-2.5 w-[20%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Email</th>
                        <th class="px-4 py-2.5 w-[10%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Role</th>
                        <th class="px-4 py-2.5 w-[8%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 text-center">Branch</th>
                        <th class="px-4 py-2.5 w-[8%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 text-center">Status</th>
                        <th class="px-4 py-2.5 w-[15%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Created By</th>
                        <th class="px-4 py-2.5 w-[12%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Date</th>
                        <th class="px-4 py-2.5 w-[9%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 text-right pr-6">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="(user, index) in filteredUsers" :key="user.id || index" class="hover:bg-blue-50/30 transition duration-150 group">
                        
                        <td class="px-4 py-2.5 align-middle truncate">
                            <div class="flex items-center gap-2">
                                <div class="bg-gray-100 p-1 rounded-full shrink-0">
                                    <UserCircleIcon class="w-6 h-6 text-gray-400" />
                                </div>
                                <div class="flex flex-col min-w-0"> 
                                    <span class="font-bold text-gray-800 text-[11px] truncate">{{ user.displayFullNameTh }}</span>
                                    <span class="text-[9px] text-gray-400 font-mono truncate">{{ user.displayFullNameEn }}</span>
                                </div>
                            </div>
                        </td>

                        <td class="px-4 py-2.5 align-middle text-[11px] text-gray-600 font-medium truncate">
                            {{ user.email }}
                        </td>

                        <td class="px-4 py-2.5 align-middle">
                            <span 
                                class="px-2 py-0.5 rounded text-[9px] font-bold border inline-block whitespace-nowrap"
                                :class="{
                                    'bg-blue-50 text-blue-600 border-blue-100': user.roleId === 2,
                                    'bg-pink-50 text-pink-600 border-pink-100': user.roleId === 4,
                                    'bg-purple-50 text-purple-600 border-purple-100': user.roleId === 3
                                }"
                            >
                                {{ getRoleLabel(user.roleId) }}
                            </span>
                        </td>

                        <td class="px-4 py-2.5 align-middle text-center text-[10px] text-gray-500 font-mono">
                            {{ user.branchNumber !== null ? user.branchNumber : '-' }}
                        </td>

                        <td class="px-4 py-2.5 align-middle text-center">
                            <span 
                                class="w-2 h-2 rounded-full inline-block mr-1"
                                :class="user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'"
                            ></span>
                            <span class="text-[10px] font-bold" :class="user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'">
                                {{ user.status }}
                            </span>
                        </td>

                        <td class="px-4 py-2.5 align-middle text-[10px] text-gray-500 truncate">
                            {{ user.createdBy }}
                        </td>

                        <td class="px-4 py-2.5 align-middle text-[10px] text-gray-500 font-mono">
                            {{ user.createdAt }}
                        </td>

                        <td class="px-4 py-2.5 align-middle text-right pr-4">
                            <div class="flex justify-end gap-1">
                                <button 
                                    @click="openReset2FAModal(user)" 
                                    :disabled="user.status === 'SUSPENDED'"
                                    class="p-1 rounded hover:bg-orange-50 text-orange-400 hover:text-orange-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Reset 2FA"
                                >
                                    <ShieldExclamationIcon class="w-4 h-4" />
                                </button>

                                <button 
                                    @click="openEditModal(user)" 
                                    :disabled="user.roleId === 2 || user.status === 'SUSPENDED'"
                                    class="p-1 rounded hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Edit"
                                >
                                    <PencilSquareIcon class="w-4 h-4" />
                                </button>

                                <button 
                                    @click="confirmSuspend(user)"
                                    :disabled="user.roleId === 2"
                                    class="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Delete/Suspend"
                                >
                                    <TrashIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    
                    <tr v-if="filteredUsers.length === 0 && !isLoading">
                        <td colspan="8" class="h-64 text-center">
                            <div class="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                <div class="bg-gray-50 p-3 rounded-full">
                                    <InboxIcon class="w-8 h-8 text-gray-300" />
                                </div>
                                <span class="text-xs font-medium">ไม่พบข้อมูลผู้ใช้งาน</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="isLoading" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 backdrop-blur-[1px]">
                <span class="animate-spin text-2xl mb-2 text-blue-600">⏳</span>
                <span class="font-bold text-gray-600 text-xs tracking-wide">กำลังโหลดข้อมูล...</span>
            </div>
        </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden transform transition-all scale-100">
        
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
             <h3 class="font-bold text-sm text-gray-800">{{ isEditMode ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}</h3>
             <button @click="closeModal" class="text-gray-400 hover:text-red-500 transition"><XMarkIcon class="w-5 h-5" /></button>
        </div>
        
        <div class="p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form @submit.prevent="handleSubmit" class="space-y-3">
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-gray-600 mb-1">ชื่อจริง (ไทย) <span class="text-red-500">*</span></label>
                <input v-model="form.firstNameTh" type="text" class="w-full border p-2 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-600 mb-1">นามสกุล (ไทย) <span class="text-red-500">*</span></label>
                <input v-model="form.lastNameTh" type="text" class="w-full border p-2 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none" required />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold text-gray-600 mb-1">ชื่อจริง (อังกฤษ) <span class="text-red-500">*</span></label>
                <input v-model="form.firstName" type="text" class="w-full border p-2 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-600 mb-1">นามสกุล (อังกฤษ) <span class="text-red-500">*</span></label>
                <input v-model="form.lastName" type="text" class="w-full border p-2 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            
            <div>
              <label class="block text-[10px] font-bold text-gray-600 mb-1">Email <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" :disabled="isEditMode" :class="isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'" class="w-full border p-2 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none" required />
            </div>

            <div v-if="!isEditMode" class="bg-blue-50 p-3 rounded-lg border border-blue-100">
               <PasswordInput v-model="form.password" label="Password" placeholder="******" @input="formError = ''" class="mb-2" />
               <PasswordInput v-model="form.confirmPassword" label="Confirm Password" placeholder="ยืนยันรหัสผ่าน" @input="formError = ''" />
               <PasswordRules :password="form.password" @check-valid="(isValid) => isPasswordValid = isValid" class="mb-2 text-[10px]" />
               
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-600 mb-1">Role <span class="text-red-500">*</span></label>
              <select v-model="form.roleId" class="w-full border p-2 rounded-lg text-xs bg-gray-50 focus:ring-1 focus:ring-blue-500 outline-none" required>
                <option value="" disabled>-- เลือก Role --</option>
                <option v-for="role in displayedRoleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
              </select>
            </div>

            <div v-if="isBranchManagerSelected" class="animate-fade-in-down">
              <label class="block text-[10px] font-bold text-blue-600 mb-1">เลขสาขา (Branch Number)</label>
              <input v-model="form.branchNumber" @input="handleNumberInput" type="text" class="w-full border p-2 rounded-lg text-xs bg-blue-50 border-blue-200 focus:ring-1 focus:ring-blue-500 outline-none font-mono" placeholder="เช่น 102" required />
            </div>

            <div v-if="formError" class="text-red-500 text-[10px] font-bold flex items-center gap-1 animate-pulse bg-red-50 p-2 rounded border border-red-100">
                <ExclamationTriangleIcon class="w-4 h-4" /> {{ formError }}
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="closeModal" class="flex-1 bg-white border border-gray-300 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50 text-xs">ยกเลิก</button>
              <button type="submit" class="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 text-xs shadow-sm">{{ isEditMode ? 'บันทึกแก้ไข' : 'สร้างบัญชี' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <div v-if="isReset2FAModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in border border-gray-100">
        <div class="p-6 text-center">
             <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldExclamationIcon class="w-8 h-8 text-orange-500" />
             </div>
             <h4 class="text-gray-800 font-bold text-base mb-1">ยืนยัน Reset 2FA?</h4>
             <p class="text-gray-500 text-xs mb-4">
                คุณต้องการรีเซ็ต 2FA ของ <br>
                <span class="font-bold text-gray-800">{{ userToReset2FA?.displayFullNameEn }}</span> ใช่หรือไม่? <br>
                <span class="text-[10px] text-red-500">(User จะต้องสแกน QR Code ใหม่ในการ Login ครั้งถัดไป)</span>
             </p>
             
             <div class="text-left mb-4">
                <label class="block text-[10px] font-bold text-gray-600 mb-1">กรุณากรอกรหัสผ่านของคุณ (Admin) เพื่อยืนยัน</label>
                <PasswordInput v-model="adminConfirmPassword" placeholder="Admin Password" class="text-xs" />
             </div>

             <div class="flex justify-center gap-3">
                 <button @click="closeReset2FAModal" class="flex-1 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-bold text-xs">ยกเลิก</button>
                 <button 
                    @click="handleReset2FAConfirm" 
                    :disabled="!adminConfirmPassword"
                    class="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-bold text-xs shadow-orange-200 shadow-md disabled:opacity-50"
                 >
                    ยืนยัน
                 </button>
             </div>
        </div>
      </div>
    </div>

    <div v-if="showSuccessAlert" class="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none">
       <div class="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-green-100 text-center animate-bounce-in flex flex-col items-center gap-3">
         <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckIcon class="w-6 h-6 text-green-600" />
         </div>
         <h2 class="text-sm font-bold text-gray-800">{{ successMessage }}</h2>
       </div>
    </div>
    
    <div v-if="isSuspendModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in border border-gray-100">
        <div class="p-6 text-center">
             <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon class="w-8 h-8 text-red-500" />
             </div>
             <h4 class="text-gray-800 font-bold text-base mb-1">ยืนยันการระงับบัญชี?</h4>
             <p class="text-gray-500 text-xs mb-4">คุณต้องการระงับบัญชี <span class="font-bold text-gray-800">{{ userToSuspend?.name }}</span> ใช่หรือไม่</p>
             <div class="flex justify-center gap-3">
                 <button @click="closeSuspendModal" class="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-bold text-xs">ยกเลิก</button>
                 <button @click="handleSuspendConfirm" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-bold text-xs shadow-red-200 shadow-md">ยืนยันระงับ</button>
             </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  UserCircleIcon,
  ShieldExclamationIcon 
} from '@heroicons/vue/24/outline' 

import PasswordInput from '@/components/PasswordInput.vue'
import PasswordRules from '@/components/PasswordRules.vue'
import { 
  getWebUsers, 
  searchWebUsers, 
  createWebUser, 
  updateWebUser, 
  deleteWebUser,
  adminResetTwoFactor //  Import service ใหม่
} from '@/services/adminService'

const masterRoleOptions = [
  { label: 'Admin', value: 2 },  
  { label: 'Call Center', value: 4 }, 
  { label: 'Branch Manager', value: 3 } 
]

const users = ref([])
const searchInput = ref('')
const isLoading = ref(false)
const isModalOpen = ref(false)
const isEditMode = ref(false)
const editingUserId = ref(null)
const showSuccessAlert = ref(false)
const successMessage = ref('')
const isSuspendModalOpen = ref(false)
const userToSuspend = ref(null)
const formError = ref('') 
const isPasswordValid = ref(false)

//  ตัวแปรสำหรับ Reset 2FA
const isReset2FAModalOpen = ref(false)
const userToReset2FA = ref(null)
const adminConfirmPassword = ref('')

const currentRoleFilter = ref('ALL')

const form = ref({
  firstName: '', lastName: '',
  firstNameTh: '', lastNameTh: '',
  email: '', password: '', confirmPassword: '', 
  roleId: '', branchNumber: ''
})

const filteredUsers = computed(() => {
    if (currentRoleFilter.value === 'ALL') {
        return users.value
    }
    return users.value.filter(user => user.roleId === currentRoleFilter.value)
})

const displayedRoleOptions = computed(() => {
  if (isEditMode.value) {
    return masterRoleOptions.filter(role => role.value !== 2)
  }
  return masterRoleOptions
})

const getRoleLabel = (id) => {
  const found = masterRoleOptions.find(r => r.value === id)
  if (found) {
      if (id === 3) return 'Branch Manager' 
      return found.label 
  }
  return 'Unknown'
}

const isBranchManagerSelected = computed(() => {
  return form.value.roleId === 3 
})

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await getWebUsers()
    mapUsersData(response.data)
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async () => {
  const query = searchInput.value.toLowerCase().trim()
  if (!query) {
    fetchUsers()
    return
  }
  isLoading.value = true
  try {
    const response = await searchWebUsers(query)
    mapUsersData(response.data)
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
  }
}

const mapUsersData = (data) => {
  if (!Array.isArray(data)) {
      users.value = []
      return
  }

  users.value = data.map(u => {
    let thName = u.fullName || u.fullNameTh || ''
    if (!thName && u.firstNameTh && u.lastNameTh) {
        thName = `${u.firstNameTh} ${u.lastNameTh}`
    }

    let enName = u.fullNameEng || u.fullNameEn || ''
    if (!enName) {
        if (u.firstName && u.lastName) {
            enName = `${u.firstName} ${u.lastName}`
        } else {
            enName = '-'
        }
    }

    return {
      id: u.userId || u.id,
      displayFullNameTh: thName || '-', 
      displayFullNameEn: enName, 
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      firstNameTh: u.firstNameTh || '',
      lastNameTh: u.lastNameTh || '',
      email: u.email || '-',
      roleId: u.roleId,
      branchNumber: u.branchCode || null,
      status: u.status, 
      createdBy: u.createdBy || 'System',
      createdAt: u.createdAt || '-',
    }
  })
}

const handleNumberInput = (e) => {
  form.value.branchNumber = e.target.value.replace(/\D/g, '')
}

const openAddModal = () => {
  isEditMode.value = false
  formError.value = ''
  form.value = { 
    firstName: '', lastName: '', 
    firstNameTh: '', lastNameTh: '',
    email: '', password: '', confirmPassword: '', 
    roleId: '', branchNumber: '' 
  }
  isModalOpen.value = true
}

const openEditModal = (user) => {
  isEditMode.value = true
  editingUserId.value = user.id
  formError.value = ''
  
  form.value = { 
    firstName: user.firstName, 
    lastName: user.lastName,
    firstNameTh: user.firstNameTh,
    lastNameTh: user.lastNameTh,
    email: user.email, 
    password: '', 
    confirmPassword: '',
    roleId: user.roleId, 
    branchNumber: user.branchNumber === '-' ? '' : user.branchNumber
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  formError.value = '' 
  
  if (!isEditMode.value) {
    if (form.value.password !== form.value.confirmPassword) {
      formError.value = 'รหัสผ่านยืนยันไม่ตรงกัน'
      return 
    }
    if (!isPasswordValid.value) {
      formError.value = 'รหัสผ่านไม่ผ่านเงื่อนไขความปลอดภัย'
      return 
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
      await updateWebUser(editingUserId.value, payload)
      successMessage.value = 'แก้ไขข้อมูลสำเร็จ'
    } else {
      await createWebUser({ ...payload, password: form.value.password })
      successMessage.value = 'สร้าง User สำเร็จ'
    }

    closeModal()
    showSuccessAlert.value = true
    fetchUsers() 
    setTimeout(() => { showSuccessAlert.value = false }, 2000)

  } catch (error) {
    console.error('Submit Error:', error)
    formError.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  }
}

// ✅ Functions สำหรับ Reset 2FA
const openReset2FAModal = (user) => {
    userToReset2FA.value = user
    adminConfirmPassword.value = '' // ล้างรหัสผ่านเก่า
    isReset2FAModalOpen.value = true
}

const closeReset2FAModal = () => {
    isReset2FAModalOpen.value = false
    userToReset2FA.value = null
    adminConfirmPassword.value = ''
}

const handleReset2FAConfirm = async () => {
    if (!userToReset2FA.value || !adminConfirmPassword.value) return

    try {
        await adminResetTwoFactor(userToReset2FA.value.id, adminConfirmPassword.value)
        
        closeReset2FAModal()
        showSuccessAlert.value = true
        successMessage.value = 'รีเซ็ต 2FA สำเร็จ'
        setTimeout(() => { showSuccessAlert.value = false }, 2000)
    } catch (error) {
        console.error("Reset 2FA Error:", error)
        alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'รหัสผ่านไม่ถูกต้อง หรือ Server Error'))
    }
}

const confirmSuspend = (user) => {
  userToSuspend.value = {
      ...user,
      name: user.displayFullNameEn 
  }
  isSuspendModalOpen.value = true
}

const closeSuspendModal = () => {
  isSuspendModalOpen.value = false
  userToSuspend.value = null
}

const handleSuspendConfirm = async () => {
  if (!userToSuspend.value) return
  try {
    await deleteWebUser(userToSuspend.value.id)
    closeSuspendModal()
    showSuccessAlert.value = true
    successMessage.value = 'ระงับบัญชีเรียบร้อยแล้ว'
    fetchUsers()
    setTimeout(() => { showSuccessAlert.value = false }, 2000)
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'Error'))
    closeSuspendModal()
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* Custom Scrollbar for Webkit */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}
</style>