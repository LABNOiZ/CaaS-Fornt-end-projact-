<template>
  <nav class="w-full h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 transition-all duration-300 relative z-50">
    
    <div class="flex-1">
      <a :class="['text-xl font-extrabold tracking-tight cursor-pointer hover:opacity-80 transition', themeColors.text]">
        {{ title }}
      </a>
    </div>

    <div class="flex-none gap-4 flex items-center">
      
      <div class="hidden md:flex flex-col items-end mr-1">
        <p class="text-sm font-bold text-gray-800 leading-tight">{{ fullName }}</p>
        <p class="text-[11px] text-gray-400 font-medium">{{ email }}</p> 
      </div>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder border border-gray-100 hover:bg-gray-50 transition">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', themeColors.bgLight]">
             <UserIcon :class="['w-6 h-6', themeColors.icon]" />
          </div>
        </div>

        <ul tabindex="-1" class="menu menu-sm dropdown-content mt-2 w-52 p-2 shadow-xl bg-white rounded-xl border border-gray-100 z-[100]">
          <li class="menu-title text-gray-400 text-xs px-2 pb-1">Account</li>
          <li>
            <router-link :to="`${basePath}/settings/profile`" @click="closeDropdown" class="text-gray-700 font-medium py-2 hover:bg-gray-50">
              <UserCircleIcon class="w-4 h-4 mr-2" /> Profile
            </router-link>
          </li>
          <li>
            <router-link :to="`${basePath}/settings/password`" @click="closeDropdown" class="text-gray-700 font-medium py-2 hover:bg-gray-50">
               <KeyIcon class="w-4 h-4 mr-2" /> Change Password
            </router-link>
          </li>
          <div class="divider my-1 border-gray-100"></div> 
          <li>
            <a @click="handleLogout" class="text-red-600 font-bold hover:bg-red-50 py-2">
               <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" /> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserProfile } from '@/services/adminService'
import { UserIcon, UserCircleIcon, KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid' 

const props = defineProps({
  title: {
    type: String,
    default: 'NovaPay System'
  }
})

const router = useRouter()
const fullName = ref('Loading...')
const email = ref('')
const roleId = ref(null)

//  Logic เลือกสีตาม Role
const themeColors = computed(() => {
  const rId = Number(roleId.value)
  if (rId === 4) { // Call Center
    return { text: 'text-pink-600', icon: 'text-pink-500', bgLight: 'bg-pink-50' }
  } else if (rId === 3) { // Branch Manager
    return { text: 'text-purple-600', icon: 'text-purple-500', bgLight: 'bg-purple-50' }
  } else { // Admin
    return { text: 'text-blue-600', icon: 'text-blue-500', bgLight: 'bg-blue-50' }
  }
})

// Path หลักตาม Role
const basePath = computed(() => {
  const rId = Number(roleId.value)
  switch (rId) {
    case 2: return '/admin'      
    case 3: return '/branch'     
    case 4: return '/callcenter' 
    default: return '/login'     
  }
})

const closeDropdown = () => {
  const elem = document.activeElement
  if (elem) elem.blur()
}

onMounted(async () => {
  roleId.value = sessionStorage.getItem('roleId')

  try {
    const response = await getUserProfile()
    const user = response.data

    //  แก้ไข: ลำดับการเช็คชื่อ (Check ไทยก่อน -> อังกฤษ -> Email)
    if (user.fullNameTh) {
        fullName.value = user.fullNameTh
    } else if (user.firstNameTh && user.lastNameTh) {
        fullName.value = `${user.firstNameTh} ${user.lastNameTh}`
    } else if (user.displayFullNameTh) { // เผื่อ API ส่ง key นี้มา
        fullName.value = user.displayFullNameTh
    } else if (user.fullNameEng) {
        fullName.value = user.fullNameEng
    } else if (user.firstName && user.lastName) {
        fullName.value = `${user.firstName} ${user.lastName}`
    } else {
        fullName.value = user.email || "Unknown User"
    }

    email.value = user.email || '-'

    if (user.roleId) {
        roleId.value = user.roleId
        sessionStorage.setItem('roleId', user.roleId)
    }

  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    fullName.value = "Guest"
  }
})

const handleLogout = () => {
  sessionStorage.clear()
  router.push('/login') 
}
</script>