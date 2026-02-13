<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50 px-4 pt-3 pb-2 font-sans">
    
    <div class="flex-none flex items-center gap-2 mb-3">
        <div class="bg-blue-100 p-1.5 rounded-lg">
            <ClipboardDocumentListIcon class="w-5 h-5 text-blue-600" />
        </div>
        <h2 class="text-lg font-extrabold text-gray-800 tracking-tight leading-none">ประวัติธุรกรรมของลูกค้า</h2>
    </div>

    <div class="flex-none bg-white p-3 rounded-xl mb-3 shadow-sm border border-gray-200">
      <div class="flex flex-col xl:flex-row gap-3 items-end">
        
        <div class="flex-1 w-full">
          <label class="block text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-wider">ค้นหาลูกค้า</label>
          <div class="relative">
            <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery" 
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="ระบุชื่อ-นามสกุล..."
              class="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition h-[34px]"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <div class="flex items-center gap-2">
             <div class="flex flex-col">
                <label class="text-[9px] text-gray-400 font-bold mb-0.5">เริ่มต้น</label>
                <input type="date" v-model="startDate" class="px-1.5 py-0 border border-gray-300 rounded text-[11px] text-gray-600 focus:ring-1 focus:ring-blue-500 outline-none h-[24px] bg-white"/>
             </div>
             <div class="flex flex-col">
                <label class="text-[9px] text-gray-400 font-bold mb-0.5">เวลา</label>
                <input type="time" v-model="startTime" class="px-1.5 py-0 border border-gray-300 rounded text-[11px] text-gray-600 focus:ring-1 focus:ring-blue-500 outline-none h-[24px] bg-white"/>
             </div>
          </div>

          <div class="h-6 w-[1px] bg-gray-300 mx-1"></div>

          <div class="flex items-center gap-2">
             <div class="flex flex-col">
                <label class="text-[9px] text-gray-400 font-bold mb-0.5">สิ้นสุด</label>
                <input type="date" v-model="endDate" class="px-1.5 py-0 border border-gray-300 rounded text-[11px] text-gray-600 focus:ring-1 focus:ring-blue-500 outline-none h-[24px] bg-white"/>
             </div>
             <div class="flex flex-col">
                <label class="text-[9px] text-gray-400 font-bold mb-0.5">เวลา</label>
                <input type="time" v-model="endTime" class="px-1.5 py-0 border border-gray-300 rounded text-[11px] text-gray-600 focus:ring-1 focus:ring-blue-500 outline-none h-[24px] bg-white"/>
             </div>
          </div>
        </div>

        <button 
            @click="handleSearch"
            :disabled="isLoading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 h-[34px] text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            <span v-if="!isLoading">ค้นหา</span>
            <span v-else>Loading...</span>
        </button>

      </div>
    </div>

    <div class="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      
      <div class="flex-none px-4 py-2.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 class="font-bold text-xs text-gray-700 uppercase tracking-wide">
           รายการกิจกรรมล่าสุด
        </h3>
        <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="logs.length > 0"></span>
            <span class="text-[10px] text-gray-500">
               พบ <span class="font-bold text-gray-800">{{ logs.length }}</span> รายการ
            </span>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative p-0">
        <table class="w-full text-left border-collapse">
          <thead class="bg-white text-gray-500 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-2.5 w-32 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">วัน / เวลา</th>
              <th class="px-4 py-2.5 w-40 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">ลูกค้า</th>
              <th class="px-4 py-2.5 w-32 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">กิจกรรม</th>
              <th class="px-4 py-2.5 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">รายละเอียด</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(log, index) in paginatedLogs" :key="index" class="hover:bg-blue-50/30 transition duration-150 group">
              
              <td class="px-4 py-2.5 whitespace-nowrap align-top">
                 <div class="font-bold text-gray-700 text-[11px]">{{ log.displayDate }}</div>
                 <div class="text-[9px] text-gray-400 font-mono">{{ log.displayTime }}</div>
              </td>
              
              <td class="px-4 py-2.5 align-top">
                 <div class="font-bold text-gray-800 text-[11px]">{{ log.fullNameTh }}</div>
              </td>
              
              <td class="px-4 py-2.5 align-top">
                 <span 
                   class="px-2 py-0.5 rounded text-[9px] font-bold border inline-block whitespace-nowrap shadow-sm"
                   :class="getActionClass(log.activity)"
                 >
                   {{ log.activity }}
                 </span>
              </td>
              
              <td class="px-4 py-2.5 text-gray-600 text-[11px] align-top leading-relaxed">
                  {{ log.details }}
              </td>

            </tr>
            <tr v-if="logs.length === 0 && !isLoading">
                <td colspan="4" class="h-64 text-center">
                    <div class="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                        <div class="bg-gray-50 p-3 rounded-full">
                            <DocumentMagnifyingGlassIcon class="w-8 h-8 text-gray-300" />
                        </div>
                        <div class="text-xs">
                            <p class="font-bold text-gray-500">ไม่พบข้อมูลกิจกรรม</p>
                            <p class="text-[10px] mt-1">ลองเปลี่ยนเงื่อนไขการค้นหา หรือระบุช่วงเวลาใหม่</p>
                        </div>
                    </div>
                </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="isLoading" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 backdrop-blur-[1px]">
            <ArrowPathIcon class="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <span class="font-bold text-gray-600 text-xs tracking-wide">กำลังโหลดข้อมูล...</span>
        </div>
      </div>

      <div class="flex-none px-3 py-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center z-20">
          <div class="text-[10px] text-gray-500 font-medium">
              หน้า <span class="font-bold text-gray-800">{{ logs.length > 0 ? currentPage : 0 }}</span> จาก {{ totalPages }}
          </div>
          <div class="flex gap-1.5">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1 || logs.length === 0"
                class="px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 h-[26px] shadow-sm"
                :class="currentPage === 1 || logs.length === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-white hover:text-blue-600 hover:border-blue-300'"
              >
                 <ChevronLeftIcon class="w-3 h-3" /> ก่อนหน้า
              </button>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages || totalPages === 0"
                class="px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 h-[26px] shadow-sm"
                :class="currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-white hover:text-blue-600 hover:border-blue-300'"
              >
                 ถัดไป <ChevronRightIcon class="w-3 h-3" />
              </button>
          </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCustomerActivities } from '@/services/callCenterService'
import { 
  MagnifyingGlassIcon, 
  ClipboardDocumentListIcon, 
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline' 

const logs = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const currentPage = ref(1)
//  ใช้ 5 รายการเพื่อให้พื้นที่เหลือและไม่ล้นจอ
const itemsPerPage = 5 

const today = new Date().toISOString().split('T')[0]
const startDate = ref(today)
const endDate = ref(today)
const startTime = ref('00:00')
const endTime = ref('23:59')

//  Logic: เรียงลำดับ + แบ่งหน้า
const sortedLogs = computed(() => {
    if (!logs.value || logs.value.length === 0) return []
    return [...logs.value].sort((a, b) => {
        return parseCustomDate(b.timestamp) - parseCustomDate(a.timestamp)
    })
})

const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedLogs.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(sortedLogs.value.length / itemsPerPage)
})

const parseCustomDate = (dateStr) => {
    if (!dateStr) return new Date(0)
    try {
        const [datePart, timePart] = dateStr.split(' ')
        if (!datePart || !timePart) return new Date(0)
        const [day, month, year] = datePart.split('-')
        return new Date(`${year}-${month}-${day}T${timePart}`)
    } catch (e) {
        return new Date(0)
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const getActionClass = (activity) => {
  if (!activity) return 'bg-gray-100 text-gray-500 border-gray-200'
  const act = activity.toUpperCase()
  
  if (act.includes('VIEW')) return 'bg-blue-50 text-blue-600 border-blue-200' 
  if (act.includes('LOGIN')) return 'bg-green-50 text-green-600 border-green-200' 
  if (act.includes('UPDATE') || act.includes('CHANGE') || act.includes('CREATE')) return 'bg-orange-50 text-orange-600 border-orange-200' 
  if (act.includes('FAIL')) return 'bg-red-50 text-red-600 border-red-200'
  
  return 'bg-gray-50 text-gray-500 border-gray-200'
}

const handleSearch = async () => {
    if(!searchQuery.value) {
        alert('กรุณาระบุชื่อลูกค้า')
        return
    }

    isLoading.value = true
    logs.value = [] 
    currentPage.value = 1 

    try {
        const payload = {
            fullNameTh: searchQuery.value,
            startDate: startDate.value,
            endDate: endDate.value,
            startTime: startTime.value,
            endTime: endTime.value
        }

        const response = await getCustomerActivities(payload)
        const rawData = Array.isArray(response.data) ? response.data : []
        
        logs.value = rawData.map(item => {
            const [datePart, timePart] = (item.timestamp || '').split(' ')
            return {
                ...item,
                displayDate: datePart || '-',
                displayTime: timePart || '-'
            }
        })

    } catch (error) {
        console.error("Error fetching activities:", error)
        if (error.response) {
             if (error.response.status === 404) {
                 logs.value = [] 
             } else if (error.response.status === 403) {
                 alert("⛔ คุณไม่มีสิทธิ์เข้าถึงประวัติลูกค้าส่วนนี้ (403 Forbidden)")
             } else {
                 const msg = error.response.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ"
                 alert(`❌ เกิดข้อผิดพลาด: ${msg}`) 
             }
        } else {
             alert("❌ ไม่สามารถเชื่อมต่อ Server ได้")
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
/* Custom Scrollbar for Webkit */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>