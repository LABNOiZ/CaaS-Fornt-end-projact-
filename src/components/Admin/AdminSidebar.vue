<template>
  <aside class="w-full h-full bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col font-sans">
    
    <nav class="flex-1 overflow-y-auto py-6">
      <div class="px-6 mb-3 text-xs font-bold text-blue-600/80 tracking-widest uppercase">
        ภาพรวมระบบ
      </div>
      
      <ul class="space-y-2 mb-8">
        <li>
          <router-link 
            to="/admin/dashboard" 
            class="flex items-center px-6 py-3 mx-3 rounded-xl transition-all duration-200 group"
            active-class="bg-blue-600 text-white shadow-md shadow-blue-500/30"
            :class="!$route.path.includes('/dashboard') ? 'text-gray-600 hover:bg-white/50 hover:text-blue-600' : ''"
          >
            <HomeIcon class="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
            <span class="text-sm font-medium">Dashboard</span>
          </router-link>
        </li>

        <li>
          <router-link 
            to="/admin/web-users" 
            class="flex items-center px-6 py-3 mx-3 rounded-xl transition-all duration-200 group"
            active-class="bg-blue-600 text-white shadow-md shadow-blue-500/30"
            :class="!$route.path.includes('/web-users') ? 'text-gray-600 hover:bg-white/50 hover:text-blue-600' : ''"
          >
            <GlobeAltIcon class="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
            <span class="text-sm font-medium">ผู้ใช้งาน Web</span>
          </router-link>
        </li>

        <li>
          <router-link 
            to="/admin/admin-history" 
            class="flex items-center px-6 py-3 mx-3 rounded-xl transition-all duration-200 group"
            active-class="bg-blue-600 text-white shadow-md shadow-blue-500/30"
            :class="!$route.path.includes('/admin-history') ? 'text-gray-600 hover:bg-white/50 hover:text-blue-600' : ''"
          >
            <ClockIcon class="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
            <span class="text-sm font-medium">ประวัติแอดมิน</span>
          </router-link>
        </li>
      </ul>

      <div class="px-6 mb-3 text-xs font-bold text-blue-600/80 tracking-widest uppercase">
          การตั้งค่า
      </div>
      
      <ul class="space-y-2">
          <li>
             <router-link 
                 to="/admin/settings/profile"
                 class="flex items-center px-6 py-3 mx-3 rounded-xl transition-all duration-200 group"
                 :class="isSettings ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'"
              >
                  <Cog6ToothIcon class="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                  <span class="text-sm font-medium">ตั้งค่าส่วนตัว</span>
              </router-link>
          </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-white/40 bg-white/30 backdrop-blur-sm">
      <button @click="logout" class="w-full bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-bold shadow-sm flex justify-center items-center gap-2 group">
        <span>ออกจากระบบ</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { HomeIcon, GlobeAltIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const isSettings = computed(() => {
  return route.path.includes('/settings')
})

const logout = () => {
  // ✅ Fixed: Use sessionStorage.clear() to match your Auth logic
  sessionStorage.clear()
  
  router.push('/login')
}
</script>