<template>
  <div class="w-full">
    
    <header class="mb-5">
      <h2 class="text-xl font-bold text-gray-800">Branch Dashboard</h2>
    </header>

    <h3 class="text-base font-bold mb-3 text-gray-800 flex items-center gap-2">
        System Activity
    </h3>
      
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        
        <div class="bg-yellow-400 rounded-xl p-5 text-gray-900 shadow-sm hover:shadow-md transition relative overflow-hidden group h-40 flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-sm mb-1">รอการอนุมัติคำร้องขอเปลี่ยนที่อยู่บัตรแข็ง</h4>
            </div>
            
            <div class="mt-1 flex items-baseline gap-2">
              <div v-if="isLoading" class="animate-pulse h-10 w-24 bg-black/10 rounded"></div>
              
              <template v-else>
                <span class="text-5xl font-bold tracking-tight">{{ stats.pendingCount }}</span>
                <span class="text-xs font-medium opacity-80 mt-2">รายการ</span>
              </template>
            </div>

            <div class="text-[10px] opacity-70 mt-auto pt-2 border-t border-black/10 flex justify-between items-center">
                <div>
                  <p>อัปเดตล่าสุด: {{ currentDateTime }}</p>
                </div>
                <button @click="fetchDashboardData" class="hover:bg-black/10 p-1 rounded-full transition" title="รีเฟรชข้อมูล">
                   <ArrowPathIcon class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
                </button>
            </div>
        </div>

        <div class="bg-green-500 rounded-xl p-5 text-white shadow-sm hover:shadow-md transition relative overflow-hidden group h-40 flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-sm mb-1">อนุมัติคำร้องขอเปลี่ยนที่อยู่บัตรแข็งแล้ว</h4>
            </div>
            
            <div class="mt-1 flex items-baseline gap-2">
              <div v-if="isLoading" class="animate-pulse h-10 w-24 bg-white/20 rounded"></div>
              <template v-else>
                <span class="text-5xl font-bold tracking-tight">{{ stats.approvedCount }}</span>
                <span class="text-xs font-medium opacity-80 mt-2">รายการ</span>
              </template>
            </div>

            <div class="text-[10px] opacity-70 mt-auto pt-2 border-t border-white/20 flex justify-between items-center">
                <div>
                  <p>อัปเดตล่าสุด: {{ currentDateTime }}</p>
                </div>
                <button @click="fetchDashboardData" class="hover:bg-white/20 p-1 rounded-full transition" title="รีเฟรชข้อมูล">
                   <ArrowPathIcon class="w-3.5 h-3.5 text-white" :class="{ 'animate-spin': isLoading }" />
                </button>
            </div>
        </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

// Import Service
import { getBranchDashboardStats } from '@/services/branchService'

// ใช้ตัวแปรเดียวเก็บทั้ง "วันที่ และ เวลา"
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
    //  อัปเดตวันที่และเวลาพร้อมกัน (Format: 30/01/2569 14:30)
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