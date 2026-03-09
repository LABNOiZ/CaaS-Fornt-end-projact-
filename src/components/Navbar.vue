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
import { UserIcon, UserCircleIcon, KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid' 
import { userService } from '@/services/userService'

const props = defineProps({
  title: {
    type: String,
    default: 'NovaPay System'
  }
})

const router = useRouter()
const fullName = ref('Loading...')
const email = ref('...')
const roleId = ref(null)

const themeColors = computed(() => {
  const rId = Number(roleId.value)
  if (rId === 4) return { text: 'text-pink-600', icon: 'text-pink-500', bgLight: 'bg-pink-50' }
  else if (rId === 3) return { text: 'text-purple-600', icon: 'text-purple-500', bgLight: 'bg-purple-50' }
  else return { text: 'text-blue-600', icon: 'text-blue-500', bgLight: 'bg-blue-50' }
})

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
    const res = await userService.getProfile()
    const userData = res.data || {}

    // 1. ดักจับชื่อให้ครอบคลุมทุก Format ที่หลังบ้านอาจจะส่งมา
    let displayFullName = userData.fullNameTh 

    // 2. ถ้าไม่มีชื่อเต็ม ลองประกอบจากชื่อและนามสกุล (ถ้ามี)
    /*if (!displayFullName && (userData.firstName || userData.firstNameTh)) {
        const first = userData.firstNameTh || userData.firstName || ''
        const last = userData.lastNameTh || userData.lastName || ''
        displayFullName = `${first} ${last}`.trim()
    }

    // 3.  ไม้ตายสุดท้าย: ถ้าหลังบ้านยังไม่ส่งชื่ออะไรมาเลย ให้เอา Email มาตัด @ ออกให้ดูสวยงามแทน
    if (!displayFullName && userData.email) {
        displayFullName = userData.email.split('@')[0]
    }*/

    fullName.value = displayFullName || 'System User'
    email.value = userData.email || sessionStorage.getItem('email') || '-'

  } catch (error) {
    console.warn("Failed to fetch profile from API:", error)
    // ดึงจาก Session มาโชว์แก้ขัดไปก่อนถ้า API มีปัญหา
    const savedEmail = sessionStorage.getItem('email') || ""
    fullName.value = savedEmail.split('@')[0] || "Guest"
    email.value = savedEmail
  }
})

const handleLogout = () => {
  sessionStorage.clear()
  router.push('/login') 
}
</script>