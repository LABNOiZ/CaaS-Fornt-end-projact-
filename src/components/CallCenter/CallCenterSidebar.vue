<template>
  <aside class="w-64 bg-white shadow-md flex flex-col z-20 h-screen">
    <nav 
      class="flex-2 p-5 space-y-2 overflow-y-auto">
      <router-link 
        to="/callcenter/search-customer" 
        class="flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        active-class="bg-blue-50 text-blue-600 font-bold"
      >
        <MagnifyingGlassIcon class="w-6 h-6" />
        <span class="text-base">ค้นหาลูกค้า</span>
      </router-link>
      
      <router-link 
        to="/callcenter/customer-history" 
        class="flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        active-class="bg-blue-50 text-blue-600 font-bold"
      >
        <ClockIcon class="w-6 h-6" />
        <span class="text-base">ดูประวัติลูกค้า</span>
      </router-link>

      <router-link 
        to="/callcenter/settings/profile" 
        class="flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        active-class="bg-blue-50 text-blue-600 font-bold"
        >
          <CogIcon class="w-6 h-6" />
          <span class="text-base">ตั้งค่าส่วนตัว</span>
        </router-link>
    
    </nav>

    <div class="p-4 border-t">
      <button @click="handleLogout" 
        class="w-full bg-gray-200 text-gray-700 py-4 rounded-md hover:bg-gray-300 font-bold flex justify-center items-center gap-2 transition">
         <span class="text-lg">ออกจากระบบ</span>
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

import { 
  MagnifyingGlassIcon, 
  ClockIcon, 
  ArrowRightOnRectangleIcon,
  CogIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()

const handleLogout = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('roleId')
  router.push('/login')
}
</script>