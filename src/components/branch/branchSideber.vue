<template>
  <aside class="w-72 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col font-sans">
    
    <nav class="flex-1 overflow-y-auto py-6">
      <div class="px-6 mb-3 text-[10px] font-extrabold text-blue-600/60 tracking-widest uppercase text-left">
        สาขาบริหาร
      </div>
      
      <ul class="space-y-1.5 mb-8">
        <li v-for="menu in primaryMenus" :key="menu.to">
          <router-link 
            :to="menu.to" 
            class="flex items-center px-6 py-3 mx-3 rounded-xl transition-all duration-300 group text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:pl-8"
            active-class="bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:pl-6"
          >
            <component :is="menu.icon" class="h-5 w-5 mr-3 transition-transform group-hover:scale-110 flex-shrink-0" />
            <span class="text-sm font-bold truncate">{{ menu.label }}</span>
          </router-link>
        </li>
      </ul>

      <div class="px-6 mb-3 text-[10px] font-extrabold text-blue-600/60 tracking-widest uppercase text-left">
        การตั้งค่า
      </div>
      
      <ul class="space-y-1.5">
        <li>
          <router-link 
            to="/branch/settings"
            class="flex items-center px-6 py-3 mx-3 rounded-xl transition-all duration-300 group text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:pl-8"
            active-class="bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:pl-6"
          >
            <CogIcon class="h-5 w-5 mr-3 transition-transform group-hover:scale-110 flex-shrink-0" />
            <span class="text-sm font-bold truncate">การตั้งค่า</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-gray-100 bg-gray-50/50">
      <button @click="handleLogout" class="w-full bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-extrabold shadow-sm flex justify-center items-center gap-2 group">
        <span>ออกจากระบบ</span>
        <ArrowRightOnRectangleIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { HomeIcon, ClipboardDocumentCheckIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const primaryMenus = [
  { to: '/branch/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/branch/approval', label: 'อนุมัติคำร้องขอ', icon: ClipboardDocumentCheckIcon },
]

const handleLogout = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('roleId')
  router.push('/login')
}
</script>