<template>
  <nav class="w-full h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 transition-all duration-300 relative z-50">
    
    <div class="flex-1">
      <a class="text-xl font-bold text-blue-600 tracking-tight cursor-pointer hover:opacity-80 transition">
        {{ title }}
      </a>
    </div>

    <div class="flex-none gap-4 flex items-center">
      
      <div class="hidden md:block text-right">
        <p class="text-sm font-bold text-gray-800 leading-tight">{{ fullName }}</p>
        <p class="text-[11px] text-gray-500 font-medium">{{ email }}</p> 
      </div>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar border border-gray-200 bg-gray-50 hover:bg-gray-100 transition">
          <div class="w-10 h-10 rounded-full flex items-center justify-center">
            <UserIcon class="w-6 h-6 text-gray-500" />
          </div>
        </div>

        <ul tabindex="-1" class="menu menu-sm dropdown-content mt-2 w-52 p-2 shadow-xl bg-white rounded-xl border border-gray-100 z-[100]">
          <li class="menu-title text-gray-400 text-xs px-2 pb-1">Account</li>
          <li>
            <router-link :to="`${basePath}/settings/profile`" @click="closeDropdown" class="text-gray-700 font-medium py-2">
              Profile
            </router-link>
          </li>
          <li>
            <router-link :to="`${basePath}/settings/password`" @click="closeDropdown" class="text-gray-700 font-medium py-2">
              Change Password
            </router-link>
          </li>
          <div class="divider my-1 border-gray-100"></div> 
          <li>
            <a @click="handleLogout" class="text-red-600 font-bold hover:bg-red-50 py-2">Logout</a>
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
import { UserIcon } from '@heroicons/vue/24/solid' 

const props = defineProps({
  title: {
    type: String,
    default: 'NovaPay System'
  }
})

const router = useRouter()
const fullName = ref('Loading...')
const email = ref('')

// คำนวณ Path หลักตาม Role
const basePath = computed(() => {
  const roleId = Number(sessionStorage.getItem('roleId'))
  switch (roleId) {
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
  try {
    const response = await getUserProfile()
    const user = response.data

    // ✅ แก้ไข Logic การแสดงชื่อให้ตรงกับ API (fullNameTh / fullNameEng)
    if (user.fullNameTh) {
        fullName.value = user.fullNameTh
    } else if (user.fullNameEng) {
        fullName.value = user.fullNameEng
    } else {
        fullName.value = "Unknown User"
    }

    email.value = user.email || '-'

  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    fullName.value = "Guest"
  }
})

const handleLogout = () => {
  sessionStorage.clear()
  router.push('/') 
}
</script>