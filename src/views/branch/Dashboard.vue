<template>
  <div class="w-full pb-10">
    
    <header class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-gray-800 tracking-tight">Branch Dashboard</h2>
        <p class="text-sm text-gray-500 mt-1">ภาพรวมและสถานะการทำรายการของสาขา</p>
      </div>
      
      <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
        <div class="flex flex-col text-right">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">อัปเดตล่าสุด</span>
          <span class="text-xs font-medium text-gray-700">{{ currentDateTime || 'กำลังโหลด...' }}</span>
        </div>
        <div class="w-px h-8 bg-gray-200"></div>
        <button 
          @click="fetchDashboardData" 
          :disabled="isLoading"
          class="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors disabled:opacity-50" 
          title="รีเฟรชข้อมูล"
        >
           <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </header>

    <h3 class="text-base font-bold mb-4 text-gray-800 flex items-center gap-2">
      <ChartBarIcon class="w-5 h-5 text-blue-500" />
      System Activity
    </h3>
      
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <div class="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200/50 relative overflow-hidden group min-h-[160px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
            <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white opacity-10 transition-transform group-hover:scale-110 duration-500"></div>
            <div class="absolute right-10 -bottom-10 w-24 h-24 rounded-full bg-white opacity-10"></div>
            
            <div class="relative z-10 flex justify-between items-start">
              <div class="pr-4">
                <h4 class="font-bold text-base leading-tight mb-1 text-white/95">รอการอนุมัติคำร้อง</h4>
                <p class="text-xs text-white/80 font-medium">เปลี่ยนที่อยู่บัตรแข็ง</p>
              </div>
              <div class="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shadow-sm">
                <ClockIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div class="relative z-10 mt-4 flex items-baseline gap-2">
              <div v-if="isLoading" class="animate-pulse h-12 w-20 bg-white/30 rounded-lg"></div>
              <template v-else>
                <span class="text-5xl font-extrabold tracking-tight drop-shadow-sm">{{ stats.pendingCount }}</span>
                <span class="text-sm font-medium text-white/80">รายการ</span>
              </template>
            </div>
        </div>

        <div class="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-200/50 relative overflow-hidden group min-h-[160px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
            <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white opacity-10 transition-transform group-hover:scale-110 duration-500"></div>
            <div class="absolute right-10 -bottom-10 w-24 h-24 rounded-full bg-white opacity-10"></div>

            <div class="relative z-10 flex justify-between items-start">
              <div class="pr-4">
                <h4 class="font-bold text-base leading-tight mb-1 text-white/95">อนุมัติคำร้องแล้ว</h4>
                <p class="text-xs text-white/80 font-medium">เปลี่ยนที่อยู่บัตรแข็ง</p>
              </div>
              <div class="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shadow-sm">
                <CheckCircleIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div class="relative z-10 mt-4 flex items-baseline gap-2">
              <div v-if="isLoading" class="animate-pulse h-12 w-20 bg-white/30 rounded-lg"></div>
              <template v-else>
                <span class="text-5xl font-extrabold tracking-tight drop-shadow-sm">{{ stats.approvedCount }}</span>
                <span class="text-sm font-medium text-white/80">รายการ</span>
              </template>
            </div>
        </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 🎯 เพิ่ม Icon ใหม่ๆ เข้ามาให้ดูโปรขึ้น
import { ArrowPathIcon, ClockIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

import { getBranchDashboardStats } from '@/services/branchService'

const currentDateTime = ref('')
const isLoading = ref(false)

const stats = ref({
  pendingCount: 0,
  approvedCount: 0
})

const fetchDashboardData = async () => {
  isLoading.value = true 
  try {
    const response = await getBranchDashboardStats()
    
    if (response.data) {
       stats.value = {
         pendingCount: response.data.pendingCount || 0,
         approvedCount: response.data.approvedCount || 0
       }
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
  } finally {
    isLoading.value = false
    const now = new Date()
    currentDateTime.value = now.toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>