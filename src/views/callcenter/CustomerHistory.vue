<template>
  <div class="h-[calc(100vh-8.5rem)] flex flex-col overflow-hidden bg-gray-50 px-6 pt-6 pb-2 font-sans">

    <div class="flex-none mb-4 flex items-center gap-3">
        <div class="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <ClipboardDocumentListIcon class="w-6 h-6 text-white" />
        </div>
        <div>
            <h2 class="text-xl font-extrabold text-gray-800 tracking-tight leading-none">ประวัติธุรกรรมของลูกค้า</h2>
            <p class="text-xs text-gray-500 mt-1 font-medium">Customer Transaction Logs</p>
        </div>
    </div>

    <div class="flex-none bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div class="flex flex-col xl:flex-row gap-4 items-end">
            
            <div class="flex-none w-full max-w-[320px]"> 
                <label class="block text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-wider">ค้นหาลูกค้า</label>
                <div class="relative group">
                    <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        v-model="searchQuery" 
                        @keyup.enter="handleSearch"
                        type="text" 
                        placeholder="ระบุชื่อ-นามสกุล..."
                        class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-[40px]"
                    />
                </div>
            </div>

            <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <div class="flex items-center gap-3 px-2">
                    <div class="flex flex-col">
                        <label class="text-[9px] text-gray-400 font-bold mb-0.5 uppercase">Start Date</label>
                        <input type="date" v-model="startDate" class="px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-600 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white font-medium h-[32px]"/>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-[9px] text-gray-400 font-bold mb-0.5 uppercase">Time</label>
                        <input type="time" v-model="startTime" class="px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-600 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white font-medium h-[32px]"/>
                    </div>
                </div>

                <div class="h-8 w-[1px] bg-gray-300 mx-1"></div>

                <div class="flex items-center gap-3 px-2">
                    <div class="flex flex-col">
                        <label class="text-[9px] text-gray-400 font-bold mb-0.5 uppercase">End Date</label>
                        <input type="date" v-model="endDate" class="px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-600 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white font-medium h-[32px]"/>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-[9px] text-gray-400 font-bold mb-0.5 uppercase">Time</label>
                        <input type="time" v-model="endTime" class="px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-600 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white font-medium h-[32px]"/>
                    </div>
                </div>
            </div>

            <button 
                @click="handleSearch"
                :disabled="isLoading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95 h-[40px] text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center ml-auto xl:ml-0"
            >
                <span v-if="!isLoading">ค้นหา</span>
                <span v-else class="loading loading-spinner loading-xs"></span>
            </button>
        </div>
    </div>

    <div class="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
        
        <div class="flex-none px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 class="font-bold text-sm text-gray-800 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span> รายการกิจกรรมล่าสุด
            </h3>
            <span class="text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100">
                พบ <span class="font-bold text-blue-600 ml-1">{{ logs.length }}</span> รายการ
            </span>
        </div>

        <div class="flex-1 overflow-y-auto no-scrollbar">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50/90 text-gray-500 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                        <th class="px-6 py-3 w-[15%] border-b border-gray-200">วัน / เวลา</th>
                        <th class="px-4 py-3 w-[20%] border-b border-gray-200">ลูกค้า</th>
                        <th class="px-4 py-3 w-[15%] border-b border-gray-200">กิจกรรม</th>
                        <th class="px-4 py-3 border-b border-gray-200">รายละเอียด</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="(log, index) in paginatedLogs" :key="index" class="hover:bg-blue-50/40 transition duration-150 group">
                        
                        <td class="px-6 py-4 whitespace-nowrap align-top">
                            <div class="font-bold text-gray-800 text-xs">{{ log.displayDate }}</div>
                            <div class="text-[10px] text-gray-400 font-mono mt-0.5">{{ log.displayTime }}</div>
                        </td>
                        
                        <td class="px-4 py-4 align-top">
                            <div class="font-bold text-gray-800 text-xs">{{ log.fullNameTh }}</div>
                        </td>
                        
                        <td class="px-4 py-4 align-top">
                            <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border inline-block whitespace-nowrap shadow-sm"
                                  :class="getActionClass(log.activity)">
                                {{ log.activity }}
                            </span>
                        </td>
                        
                        <td class="px-4 py-4 text-gray-600 text-xs align-top leading-relaxed">
                            {{ log.details }}
                        </td>

                    </tr>
                    
                    <tr v-if="logs.length === 0 && !isLoading">
                        <td colspan="4" class="h-64 text-center">
                            <div class="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                <DocumentMagnifyingGlassIcon class="w-10 h-10 text-gray-300" />
                                <div class="text-sm">
                                    <p class="font-bold text-gray-500">ไม่พบข้อมูลกิจกรรม</p>
                                    <p class="text-xs text-gray-400 mt-1">ลองเปลี่ยนเงื่อนไขการค้นหา หรือระบุช่วงเวลาใหม่</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="isLoading" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 backdrop-blur-[2px]">
                <span class="loading loading-spinner loading-lg text-blue-600"></span>
                <span class="font-bold text-gray-600 text-sm tracking-wide mt-4">กำลังโหลดข้อมูล...</span>
            </div>
        </div>

        <div class="flex-none px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center z-20 mt-auto">
            <div class="text-xs text-gray-500 font-medium">
                หน้า <span class="font-bold text-gray-800">{{ logs.length > 0 ? currentPage : 0 }}</span> / {{ totalPages || 1 }}
            </div>
            <div class="flex gap-2">
                <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1 || logs.length === 0"
                    class="px-4 py-2 rounded-lg text-xs font-bold border transition flex items-center gap-2 shadow-sm"
                    :class="currentPage === 1 || logs.length === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-white hover:text-blue-600 hover:border-blue-300 hover:shadow'"
                >
                    <ChevronLeftIcon class="w-3 h-3 stroke-2" /> ก่อนหน้า
                </button>
                
                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages || totalPages === 0"
                    class="px-4 py-2 rounded-lg text-xs font-bold border transition flex items-center gap-2 shadow-sm"
                    :class="currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:bg-white hover:text-blue-600 hover:border-blue-300 hover:shadow'"
                >
                    ถัดไป <ChevronRightIcon class="w-3 h-3 stroke-2" />
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
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline' 

const logs = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const currentPage = ref(1)
const itemsPerPage = 5 // ปรับจำนวนรายการต่อหน้าให้พอดีจอ

const today = new Date().toISOString().split('T')[0]
const startDate = ref(today)
const endDate = ref(today)
const startTime = ref('00:00')
const endTime = ref('23:59')

// Logic: เรียงลำดับ + แบ่งหน้า
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
/* ซ่อน Scrollbar แต่ยังเลื่อนได้ */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>