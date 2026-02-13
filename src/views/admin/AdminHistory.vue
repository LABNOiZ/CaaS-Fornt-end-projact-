<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50 px-4 pt-3 pb-2 font-sans">

    <div class="flex-none mb-3 flex items-center gap-2">
        <div class="bg-blue-100 p-1.5 rounded-lg">
            <ClipboardDocumentListIcon class="w-5 h-5 text-blue-600" />
        </div>
        <h2 class="text-lg font-extrabold text-gray-800 tracking-tight leading-none">ประวัติแอดมิน (Admin Logs)</h2>
    </div>

    <div class="flex-none bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
        <div class="flex flex-col xl:flex-row gap-3 items-end">
            
            <div class="flex-1 w-full">
                <label class="block text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-wider">ค้นหาชื่อผู้ใช้ <span class="text-red-500">*</span></label>
                <div class="relative">
                    <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        v-model="searchQuery" 
                        @keyup.enter="handleSearch"
                        type="text" 
                        placeholder="ระบุชื่อเพื่อค้นหา..."
                        class="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition h-[34px]"
                        :class="{'border-red-300 bg-red-50 focus:ring-red-200': isError}"
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
                class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 h-[34px] text-xs disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px] justify-center"
            >
                <span v-if="!isLoading">ค้นหา</span>
                <span v-else>Loading...</span>
            </button>

        </div>
        
        <div v-if="isError" class="mt-2 text-[10px] text-red-500 font-bold flex items-center gap-1 animate-pulse">
            ⚠️ กรุณาระบุชื่อผู้ใช้ก่อนค้นหา
        </div>
    </div>

    <div class="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
        
        <div class="flex-none px-4 py-2.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-bold text-xs text-gray-700 uppercase tracking-wide">
               รายการบันทึก (Logs)
            </h3>
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="logs.length > 0"></span>
                <span class="text-[10px] text-gray-500">
                   พบ <span class="font-bold text-blue-600">{{ logs.length }}</span> รายการ
                </span>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative">
            <table class="w-full text-left border-collapse">
                <thead class="bg-white text-gray-500 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th class="px-4 py-2.5 w-32 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">วัน / เวลา</th>
                        <th class="px-4 py-2.5 w-40 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Name</th>
                        <th class="px-4 py-2.5 w-32 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Activity</th>
                        <th class="px-4 py-2.5 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Details</th>
                        <th class="px-4 py-2.5 w-20 text-center bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">Role ID</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="(log, index) in paginatedLogs" :key="index" class="hover:bg-blue-50/30 transition duration-150 group">
                        
                        <td class="px-4 py-2.5 whitespace-nowrap align-top">
                            <div class="font-bold text-gray-700 text-[11px]">{{ formatDate(log.actionDate) }}</div>
                            <div class="text-[9px] text-gray-400 font-mono mt-0.5">{{ log.actionTime }}</div>
                        </td>
                        
                        <td class="px-4 py-2.5 align-top">
                            <div class="font-bold text-gray-800 text-[11px]">{{ log.fullNameTh || '-' }}</div>
                        </td>
                        
                        <td class="px-4 py-2.5 align-top">
                            <span class="px-2 py-0.5 rounded text-[9px] font-bold border inline-block whitespace-nowrap bg-blue-50 text-blue-600 border-blue-100">
                                {{ log.action }}
                            </span>
                        </td>
                        
                        <td class="px-4 py-2.5 text-gray-600 text-[11px] align-top leading-relaxed">
                            {{ log.details }}
                        </td>
                        
                        <td class="px-4 py-2.5 text-center text-gray-500 text-[10px] align-top font-mono">
                            {{ log.roleId }}
                        </td>

                    </tr>
                    
                    <tr v-if="logs.length === 0 && !isLoading">
                        <td colspan="5" class="h-64 text-center">
                            <div class="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                <div class="bg-gray-50 p-3 rounded-full">
                                    <DocumentIcon class="w-8 h-8 text-gray-300" />
                                </div>
                                <div class="text-xs">
                                    <p class="font-bold text-gray-500">ไม่พบข้อมูลประวัติ</p>
                                    <p class="text-[10px] mt-1">ลองระบุชื่อผู้ใช้และกดค้นหาใหม่</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="isLoading" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 backdrop-blur-[1px]">
                <span class="animate-spin text-2xl mb-2 text-blue-600">⏳</span>
                <span class="font-bold text-gray-600 text-xs tracking-wide">กำลังโหลดข้อมูล...</span>
            </div>
        </div>

        <div v-if="logs.length > 0" class="flex-none px-3 py-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center z-20">
            <div class="text-[10px] text-gray-500 font-medium">
                หน้า <span class="font-bold text-gray-800">{{ currentPage }}</span> / {{ totalPages }} (ทั้งหมด {{ logs.length }})
            </div>
            <div class="flex gap-1.5">
                <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 h-[26px] shadow-sm"
                    :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-white hover:text-blue-600 hover:border-blue-300'"
                >
                    <ChevronLeftIcon class="w-3 h-3" /> ก่อนหน้า
                </button>
                
                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 h-[26px] shadow-sm"
                    :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-white hover:text-blue-600 hover:border-blue-300'"
                >
                    ถัดไป <ChevronRightIcon class="w-3 h-3" />
                </button>
            </div>
        </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { searchAdminLogs } from '@/services/adminService'
import { 
    DocumentIcon, 
    MagnifyingGlassIcon, 
    ClipboardDocumentListIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline' 

const logs = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const isError = ref(false)

const currentPage = ref(1)
const itemsPerPage = 5 

const today = new Date().toISOString().split('T')[0]
const startDate = ref(today)
const endDate = ref(today)
const startTime = ref('00:00')
const endTime = ref('23:59')

const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return logs.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(logs.value.length / itemsPerPage)
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const formatDate = (dateString) => {
    if(!dateString) return '-'
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
}

const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        isError.value = true
        return
    }

    isError.value = false
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

        const response = await searchAdminLogs(payload)
        logs.value = response.data 

    } catch (error) {
        console.error("Search Log Error:", error)
        if(error.response && error.response.status === 403) {
             alert("คุณไม่มีสิทธิ์เข้าถึงข้อมูลประวัตินี้ (403 Forbidden)")
        }
        logs.value = []
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
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
</style>