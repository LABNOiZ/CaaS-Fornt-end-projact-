<template>
  <div class="w-full space-y-6 pb-8 bg-gray-50/50 p-4 md:p-6 rounded-3xl">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <div class="flex items-center gap-3">
        <span class="p-2 bg-blue-500 rounded-xl shadow-md shadow-blue-100 inline-flex">
          <UserGroupIcon class="w-5 h-5 text-white"/>
        </span>
        <div>
          <h1 class="text-xl font-extrabold text-gray-900 tracking-tight">Branch Dashboard</h1>
          <p class="text-[11px] text-gray-400 font-medium uppercase tracking-wider">สรุปการจัดการคำร้องประจำสาขา</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-sm">
        <div class="flex flex-col items-end pr-2 border-r border-gray-100">
          <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">อัปเดตล่าสุด</span>
          <span class="text-[11px] font-bold text-blue-600">{{ lastUpdated }}</span>
        </div>
        <button @click="refreshData" 
                :disabled="isLoading"
                class="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50 group">
          <ArrowPathIcon :class="{'animate-spin': isLoading}" class="w-4 h-4 text-blue-500" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      
      <div class="relative overflow-hidden group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-orange-100 rounded-lg border border-orange-200/50">
              <ClockIcon class="w-5 h-5 text-orange-600" />
            </div>
            <span class="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">PENDING</span>
          </div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">รอการอนุมัติ</p>
          <h2 class="text-3xl font-black text-gray-900 tracking-tighter">{{ stats.pendingCount }} <span class="text-xs font-bold text-gray-400 ml-1 uppercase">รายการ</span></h2>
        </div>
      </div>

      <div class="relative overflow-hidden group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-emerald-100 rounded-lg border border-emerald-200/50">
              <CheckCircleIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">APPROVED</span>
          </div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">อนุมัติสำเร็จ</p>
          <h2 class="text-3xl font-black text-gray-900 tracking-tighter">{{ stats.approvedCount }} <span class="text-xs font-bold text-gray-400 ml-1 uppercase">รายการ</span></h2>
        </div>
      </div>

      <div class="relative overflow-hidden group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-red-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-red-100 rounded-lg border border-red-200/50">
              <XCircleIcon class="w-5 h-5 text-red-600" />
            </div>
            <span class="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">REJECTED</span>
          </div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ไม่อนุมัติ</p>
          <h2 class="text-3xl font-black text-gray-900 tracking-tighter">{{ stats.rejectedCount }} <span class="text-xs font-bold text-gray-400 ml-1 uppercase">รายการ</span></h2>
        </div>
      </div>

      <div class="relative overflow-hidden group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-100 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-slate-100 rounded-lg border border-slate-200/50">
              <NoSymbolIcon class="w-5 h-5 text-slate-600" />
            </div>
            <span class="text-[9px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">CANCELED</span>
          </div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ยกเลิกรายการ</p>
          <h2 class="text-3xl font-black text-gray-900 tracking-tighter">{{ stats.cancelCount }} <span class="text-xs font-bold text-gray-400 ml-1 uppercase">รายการ</span></h2>
        </div>
      </div>

    </div>

    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-6 pb-3 border-b border-gray-50">
        <div class="flex items-center gap-2.5">
          <div class="p-2 bg-blue-50 rounded-lg border border-blue-100"><ChartBarIcon class="w-4 h-4 text-blue-600" /></div>
          <div>
            <h3 class="text-sm font-extrabold text-gray-800">Weekly Performance Statistics</h3>
            <p class="text-[10px] text-gray-400 font-medium">สถิติ 7 วันย้อนหลัง</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 text-[10px] font-bold text-gray-400">
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Approved</div>
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span> Rejected</div>
          <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-200"></span> Canceled</div>
        </div>
      </div>

      <div class="relative flex items-end justify-between h-48 gap-2 px-3 py-2 bg-gray-50/30 rounded-xl border border-gray-50 shadow-inner">
        
        <div v-for="(day, idx) in dailyStats" :key="idx" 
             class="flex flex-col items-center flex-1 group relative z-10 h-full justify-end hover:bg-gray-100/50 rounded-lg cursor-pointer transition-colors pb-1 pt-8">
          
          <div class="w-full flex items-end justify-center gap-1 h-full">
             <div :style="{ height: day.approved === 0 ? '2%' : `${(day.approved / maxChartValue) * 100}%` }" 
                  class="w-2 md:w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-700 ease-out group-hover:from-blue-700 shadow-sm shadow-blue-100"></div>
             
             <div :style="{ height: day.rejected === 0 ? '2%' : `${(day.rejected / maxChartValue) * 100}%` }" 
                  class="w-2 md:w-4 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all duration-700 ease-out group-hover:from-red-600 shadow-sm shadow-red-100"></div>

             <div :style="{ height: day.cancel === 0 ? '2%' : `${(day.cancel / maxChartValue) * 100}%` }" 
                  class="w-2 md:w-4 bg-slate-200 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-slate-300"></div>
          </div>
          
          <span class="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">{{ day.name }}</span>
          
          <div class="absolute bottom-[80%] left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none shadow-xl whitespace-nowrap mb-2">
             <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1.5">
                   <span class="w-2 h-2 rounded-full bg-blue-400"></span> 
                   <span class="text-gray-300">อนุมัติ:</span> 
                   <span class="font-bold text-white">{{day.approved}}</span>
                </div>
                <div class="flex items-center gap-1.5">
                   <span class="w-2 h-2 rounded-full bg-red-400"></span> 
                   <span class="text-gray-300">ไม่อนุมัติ:</span> 
                   <span class="font-bold text-white">{{day.rejected}}</span>
                </div>
                <div class="flex items-center gap-1.5">
                   <span class="w-2 h-2 rounded-full bg-slate-300"></span> 
                   <span class="text-gray-300">ยกเลิก:</span> 
                   <span class="font-bold text-white">{{day.cancel}}</span>
                </div>
             </div>
             <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 z-[-1]"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  ArrowPathIcon, ClockIcon, CheckCircleIcon, NoSymbolIcon, 
  ChartBarIcon, UserGroupIcon, XCircleIcon
} from '@heroicons/vue/24/outline' 
import { getBranchDashboardStats, getApprovalList } from '@/services/branchService'


const stats = ref({ pendingCount: 0, approvedCount: 0, rejectedCount: 0, cancelCount: 0 })
const rawList = ref([]) 
const isLoading = ref(false)
const lastUpdated = ref('')

const dailyStats = computed(() => {
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateComp = `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}`
    last7Days.push({ 
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      compDate: dateComp,
      approved: 0,
      rejected: 0, 
      cancel: 0 
    })
  }

  rawList.value.forEach(item => {
    let itemDate = '';
    if (item.requestedAt) {
      const parts = item.requestedAt.split(' ')[0].split('-');
      if (parts.length === 3) itemDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else if (item.date) {
        const parts = item.date.split('/')
        if (parts.length === 3) itemDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const dayMatch = last7Days.find(d => itemDate === d.compDate)
    if (dayMatch) {
      if (item.status === 'APPROVED') dayMatch.approved++
      if (item.status === 'REJECTED') dayMatch.rejected++ 
      if (['CANCEL', 'CANCELED'].includes(item.status)) dayMatch.cancel++ 
    }
  })
  return last7Days
})

const maxChartValue = computed(() => {
  if (dailyStats.value.length === 0) return 10 
  
  let max = 0
  dailyStats.value.forEach(day => {
    if (day.approved > max) max = day.approved
    if (day.rejected > max) max = day.rejected 
    if (day.cancel > max) max = day.cancel
  })
  
  return max === 0 ? 10 : Math.ceil(max * 1.2) 
})

const refreshData = async () => {
  isLoading.value = true
  try {
    const resStats = await getBranchDashboardStats()
    if (resStats.data) stats.value = resStats.data

    const resList = await getApprovalList()
    if (resList.data) rawList.value = resList.data

    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    lastUpdated.value = `${dateStr} ${timeStr} น.`;
  } catch (error) {
    console.error("Dashboard Error:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.transition-all {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>