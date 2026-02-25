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
                        <input v-model="searchInput" @keyup.enter="handleSearch" type="text" placeholder="พิมพ์ชื่อ-นามสกุล (ไทย)..." class="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition h-[36px]" />
                    </div>
                    <button @click="handleSearch" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 h-[36px] text-xs disabled:opacity-50 min-w-[70px] justify-center">
                        <span v-if="!isLoading">ค้นหา</span>
                        <span v-else>ค้นหา</span>
                    </button>
                </div>
                <button @click="openAddModal" class="bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 h-[36px] text-xs whitespace-nowrap">
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
            <h3 class="font-bold text-xs text-gray-700 uppercase tracking-wide">รายชื่อผู้ใช้งาน</h3>
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="filteredUsers.length > 0"></span>
                <span class="text-[10px] text-gray-500">พบ <span class="font-bold text-blue-600">{{ filteredUsers.length }}</span> บัญชี</span>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative">
            <table class="w-full text-left border-collapse table-fixed"> 
                <thead class="bg-white text-gray-500 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th class="px-4 py-2.5 w-[20%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">ชื่อ-นามสกุล</th>
                        <th class="px-4 py-2.5 w-[20%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Email</th>
                        <th class="px-4 py-2.5 w-[12%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Role</th>
                        <th class="px-4 py-2.5 w-[8%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 text-center">Branch</th>
                        <th class="px-4 py-2.5 w-[10%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 text-center">Status</th>
                        <th class="px-4 py-2.5 w-[15%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Created By</th>
                        <th class="px-4 py-2.5 w-[12%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Date</th>
                        <th class="px-4 py-2.5 w-[9%] bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 text-right pr-6">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="(user, index) in filteredUsers" :key="user.id || index" class="hover:bg-blue-50/30 transition duration-150 group">
                        <td class="px-4 py-2.5 align-middle truncate">
                            <div class="flex items-center gap-2">
                                <div class="bg-gray-100 p-1 rounded-full shrink-0"><UserCircleIcon class="w-6 h-6 text-gray-400" /></div>
                                <div class="flex flex-col min-w-0"> 
                                    <span class="font-bold text-gray-800 text-[11px] truncate">{{ user.displayFullNameTh }}</span>
                                    <span class="text-[9px] text-gray-400 font-mono truncate">{{ user.displayFullNameEn }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-2.5 align-middle text-[11px] text-gray-600 font-medium truncate">{{ user.email }}</td>
                        
                        <td class="px-4 py-2.5 align-middle">
                            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block whitespace-nowrap shadow-sm" 
                                :class="{
                                    'bg-blue-100 text-blue-700 border-blue-200': user.roleId === 2, 
                                    'bg-pink-100 text-pink-700 border-pink-200': user.roleId === 4, 
                                    'bg-purple-100 text-purple-700 border-purple-200': user.roleId === 3
                                }">
                                {{ getRoleLabel(user.roleId) }}
                            </span>
                        </td>

                        <td class="px-4 py-2.5 align-middle text-center text-[10px] text-gray-500 font-mono">{{ user.branchNumber !== null ? user.branchNumber : '-' }}</td>
                        
                        <td class="px-4 py-2.5 align-middle text-center">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                                :class="user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'">
                                <span class="w-1.5 h-1.5 rounded-full" :class="user.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'"></span>
                                {{ user.status }}
                            </span>
                        </td>

                        <td class="px-4 py-2.5 align-middle text-[10px] text-gray-500 truncate">{{ user.createdBy }}</td>
                        <td class="px-4 py-2.5 align-middle text-[10px] text-gray-500 font-mono">{{ user.createdAt }}</td>
                        <td class="px-4 py-2.5 align-middle text-right pr-4">
                            <div class="flex justify-end gap-1">
                                <button @click="openReset2FAModal(user)" :disabled="user.status === 'SUSPENDED'" class="p-1 rounded hover:bg-orange-50 text-orange-400 hover:text-orange-600 transition disabled:opacity-30 disabled:cursor-not-allowed" title="Reset 2FA"><ShieldExclamationIcon class="w-4 h-4" /></button>
                                <button @click="openEditModal(user)" :disabled="user.roleId === 2 || user.status === 'SUSPENDED'" class="p-1 rounded hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition disabled:opacity-30 disabled:cursor-not-allowed" title="Edit"><PencilSquareIcon class="w-4 h-4" /></button>
                                <button @click="openSuspendModal(user)" :disabled="user.roleId === 2" class="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed" title="Delete/Suspend"><TrashIcon class="w-4 h-4" /></button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="filteredUsers.length === 0 && !isLoading">
                        <td colspan="8" class="h-64 text-center">
                            <div class="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                <div class="bg-gray-50 p-3 rounded-full"><InboxIcon class="w-8 h-8 text-gray-300" /></div>
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

    <UserFormModal 
        v-if="isUserFormOpen" 
        :userToEdit="editingUser"
        @close="closeUserForm" 
        @success="handleSuccess"
    />

    <Reset2FAModal 
        v-if="isReset2FAOpen"
        :user="userToReset2FA"
        @close="closeReset2FAModal"
        @success="handleSuccess"
    />

    <SuspendUserModal 
        v-if="isSuspendOpen"
        :user="userToSuspend"
        @close="closeSuspendModal"
        @success="handleSuccess"
    />

    <div v-if="showSuccessAlert" class="toast toast-top toast-end z-[100] mt-16 min-w-[320px] transition-all duration-300">
       
       <div role="alert" :class="['alert shadow-xl flex items-center gap-3 animate-bounce-in text-white border-none', 
           alertType === 'success' ? 'alert-success bg-green-500' : 'alert-error bg-red-500']">
          
          <svg v-if="alertType === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <span class="font-bold text-sm tracking-wide">{{ successMessage }}</span>
       </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, TrashIcon, InboxIcon, UserCircleIcon, ShieldExclamationIcon } from '@heroicons/vue/24/outline'

import UserFormModal from '@/components/Admin/UserFormModal.vue'
import Reset2FAModal from '@/components/Admin/Reset2FAModal.vue'
import SuspendUserModal from '@/components/Admin/SuspendUserModal.vue'

import { getWebUsers, searchWebUsers } from '@/services/adminService'

// State สำหรับจัดการ Modal
const isUserFormOpen = ref(false)
const editingUser = ref(null)

const isReset2FAOpen = ref(false)
const userToReset2FA = ref(null)

const isSuspendOpen = ref(false)
const userToSuspend = ref(null)

// State อื่นๆ
const users = ref([])
const searchInput = ref('')
const isLoading = ref(false)
const showSuccessAlert = ref(false)
const successMessage = ref('')
const alertType = ref('success') // เพิ่ม state สำหรับ type
const currentRoleFilter = ref('ALL')

const masterRoleOptions = [
  { label: 'Admin', value: 2 },  
  { label: 'Call Center', value: 4 }, 
  { label: 'Branch Manager', value: 3 } 
]

// --- Computed ---
const filteredUsers = computed(() => {
    if (currentRoleFilter.value === 'ALL') return users.value
    return users.value.filter(user => user.roleId === currentRoleFilter.value)
})

const getRoleLabel = (id) => {
  const found = masterRoleOptions.find(r => r.value === id)
  if (found) {
      if (id === 3) return 'Branch Manager' 
      return found.label 
  }
  return 'Unknown'
}

// --- API Calls ---
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
  if (!query) { fetchUsers(); return }
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
  if (!Array.isArray(data)) { users.value = []; return }
  users.value = data.map(u => {
    let thName = u.fullName || u.fullNameTh || ''
    if (!thName && u.firstNameTh && u.lastNameTh) thName = `${u.firstNameTh} ${u.lastNameTh}`
    let enName = u.fullNameEng || u.fullNameEn || ''
    if (!enName) enName = (u.firstName && u.lastName) ? `${u.firstName} ${u.lastName}` : '-'
    
    return {
      id: u.userId || u.id,
      displayFullNameTh: thName || '-', 
      displayFullNameEn: enName, 
      firstName: u.firstName || '', lastName: u.lastName || '',
      firstNameTh: u.firstNameTh || '', lastNameTh: u.lastNameTh || '',
      email: u.email || '-',
      roleId: u.roleId,
      branchNumber: u.branchCode || null,
      status: u.status, 
      createdBy: u.createdBy || 'System',
      createdAt: u.createdAt || '-',
    }
  })
}

// 1. User Form (Create/Edit)
const openAddModal = () => {
  editingUser.value = null
  isUserFormOpen.value = true
}
const openEditModal = (user) => {
  editingUser.value = user
  isUserFormOpen.value = true
}
const closeUserForm = () => {
  isUserFormOpen.value = false
  editingUser.value = null
}

// 2. Reset 2FA
const openReset2FAModal = (user) => {
   userToReset2FA.value = user
   isReset2FAOpen.value = true
}
const closeReset2FAModal = () => {
   isReset2FAOpen.value = false
   userToReset2FA.value = null
}

// 3. Suspend
const openSuspendModal = (user) => {
  userToSuspend.value = user
  isSuspendOpen.value = true
}
const closeSuspendModal = () => {
  isSuspendOpen.value = false
  userToSuspend.value = null
}

// Global Success Handler
const handleSuccess = (msg, type = 'success') => { // รองรับ type
  fetchUsers() 
  successMessage.value = msg
  alertType.value = type
  showSuccessAlert.value = true
  setTimeout(() => { showSuccessAlert.value = false }, 3000)
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 10px; }

/* Animation สำหรับ Toast */
@keyframes fade-in-left {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-bounce-in {
  animation: fade-in-left 0.3s ease-out forwards;
}
</style>