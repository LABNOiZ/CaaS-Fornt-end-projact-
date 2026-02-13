<template>
  <aside class="w-72 bg-white flex flex-col h-full font-prompt border-r border-gray-100 overflow-hidden">

    <nav class="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
      
      <router-link 
        to="/branch/dashboard" 
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:pl-6"
        active-class="bg-blue-50 text-blue-600 font-bold shadow-sm"
      >
        <HomeIcon class="w-6 h-6 flex-shrink-0" />
        <span class="text-base truncate">Dashboard</span>
      </router-link>
      
      <router-link 
        to="/branch/approval" 
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:pl-6"
        active-class="bg-blue-50 text-blue-600 font-bold shadow-sm"
      >
        <ClipboardDocumentCheckIcon class="w-6 h-6 flex-shrink-0" />
        <span class="text-base truncate">อนุมัติคำร้องขอ</span>
      </router-link>

      <router-link 
        to="/branch/settings" 
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:pl-6"
        active-class="bg-blue-50 text-blue-600 font-bold shadow-sm"
      >
        <CogIcon class="w-6 h-6 flex-shrink-0" />
        <span class="text-base truncate">การตั้งค่า</span>
      </router-link>

      <div class="pt-4 mt-2 border-t border-gray-100">
        <button @click="handleLogout" 
          class="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold flex justify-center items-center gap-2 transition-all duration-200 shadow-sm">
           <span class="text-base">ออกจากระบบ</span>
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
        </button>
      </div>
    
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  HomeIcon, 
  ClipboardDocumentCheckIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()

const handleLogout = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('roleId')
  router.push('/login')
}
</script>

<style scoped>
/* ซ่อน Scrollbar ทุกกรณี */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.font-prompt {
  font-family: 'Prompt', sans-serif;
}
</style>