<template>
  <div class="w-full relative">
      
      <transition 
        enter-active-class="transform ease-out duration-300 transition" 
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" 
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
      >
        <div v-if="toast.show" class="fixed top-20 right-5 z-[60] min-w-[300px] shadow-lg rounded-xl overflow-hidden pointer-events-auto border border-gray-100">
           <div :class="toast.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'" class="flex p-4 items-start gap-3 relative overflow-hidden">
              <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'"></div>
              <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-green-500 shrink-0" />
              <XCircleIcon v-else class="h-6 w-6 text-red-500 shrink-0" />
              <div>
                <h3 class="font-bold text-sm">{{ toast.type === 'success' ? 'สำเร็จ!' : 'ผิดพลาด!' }}</h3>
                <div class="text-xs mt-0.5 opacity-90">{{ toast.message }}</div>
              </div>
           </div>
        </div>
      </transition>

      <div class="mb-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
         <div class="flex flex-wrap gap-3 items-end">
            <div class="flex-1 min-w-[250px] max-w-md">
               <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">ค้นหาชื่อ-นามสกุลลูกค้า</label>
               <div class="relative">
                 <input type="text" v-model="filters.search" @keyup.enter="fetchData" placeholder="ระบุชื่อลูกค้า..." 
                 class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block pl-10 p-2.5 transition-all outline-none">
                 <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
               </div>
            </div>
            
            <button @click="fetchData" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all text-sm h-[42px] flex items-center gap-2 active:scale-95">
                <MagnifyingGlassIcon class="w-4 h-4" /> ค้นหา
            </button>

            <button @click="resetFilters" class="bg-white hover:bg-gray-50 text-gray-500 font-bold py-2.5 px-4 rounded-xl border border-gray-200 shadow-sm transition-all h-[42px] flex items-center justify-center active:scale-95" title="ล้างค่า">
                <ArrowPathIcon class="w-4 h-4" />
            </button>
         </div>

         <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100/80">
            <div class="w-full md:w-auto">
               <label class="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">ตั้งแต่ (Start Date)</label>
               <input type="datetime-local" v-model="filters.startDate" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full md:w-56 p-2 cursor-pointer focus:ring-blue-500 outline-none">
            </div>
            <span class="text-gray-300 mt-5 hidden md:block">-</span>
            <div class="w-full md:w-auto">
               <label class="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">ถึง (End Date)</label>
               <input type="datetime-local" v-model="filters.endDate" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full md:w-56 p-2 cursor-pointer focus:ring-blue-500 outline-none">
            </div>
         </div>
      </div>

      <div class="flex items-center justify-between mb-3 px-1">
         <div class="flex gap-1.5 bg-gray-100/70 p-1.5 rounded-xl border border-gray-200/60 overflow-x-auto">
            <button @click="changeTab('ALL')" :class="currentTab === 'ALL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/60'" class="px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap">ทั้งหมด</button>
            <button @click="changeTab('PENDING')" :class="currentTab === 'PENDING' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/60'" class="px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap">รออนุมัติ</button>
            <button @click="changeTab('APPROVED')" :class="currentTab === 'APPROVED' ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'text-gray-500 hover:text-green-600 hover:bg-green-50/60'" class="px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap">อนุมัติแล้ว</button>
            <button @click="changeTab('REJECTED')" :class="currentTab === 'REJECTED' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-gray-500 hover:text-red-600 hover:bg-red-50/60'" class="px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap">ไม่อนุมัติ</button>
            <button @click="changeTab('CANCELED')" :class="currentTab === 'CANCELED' ? 'bg-gray-600 text-white shadow-md shadow-gray-500/20' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/60'" class="px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap">ยกเลิกแล้ว</button>
         </div>
         <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
            เรียงลำดับ: ล่าสุด
         </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm relative flex flex-col">
        
        <div v-if="isLoading" class="absolute inset-0 bg-white/60 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
            <div class="loading loading-spinner loading-lg text-blue-600"></div>
            <p class="text-blue-800 mt-3 text-sm font-bold tracking-wide animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>

        <div class="overflow-x-auto min-h-[350px]">
            <table class="table w-full">
            <thead class="bg-gray-50/80 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                <th class="py-4 pl-5">สถานะ</th>
                <th>วันที่ทำรายการ</th>
                <th>เวลา</th>
                <th>ชื่อ-สกุล ลูกค้า</th>
                <th>พนักงานที่ส่งเรื่อง</th>
                <th class="text-right pr-6">การจัดการ</th>
                </tr>
            </thead>
            
            <tbody class="text-sm divide-y divide-gray-100">
                <tr v-if="!isLoading && paginatedData.length === 0">
                    <td colspan="6" class="h-64 text-center text-gray-400">
                    <div class="flex flex-col items-center justify-center gap-3 opacity-60">
                        <InboxIcon class="w-12 h-12 text-gray-300" />
                        <span class="text-sm font-medium">ไม่พบข้อมูลคำร้องขอในขณะนี้</span>
                    </div>
                    </td>
                </tr>

                <tr v-for="item in paginatedData" :key="item.id" 
                    @click="openDetailsModal(item)"
                    class="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                <td class="pl-5 py-4">
                    <span v-if="item.status === 'APPROVED'" class="bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center w-fit gap-1 shadow-sm">
                        <CheckCircleIcon class="w-3.5 h-3.5" /> อนุมัติ
                    </span>
                    <span v-else-if="item.status === 'REJECTED'" class="bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center w-fit gap-1 shadow-sm">
                        <XCircleIcon class="w-3.5 h-3.5" /> ไม่อนุมัติ
                    </span>
                    <span v-else-if="['CANCEL', 'CANCELED', 'CANCELLED'].includes(item.status)" class="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center w-fit gap-1 shadow-sm">
                        <NoSymbolIcon class="w-3.5 h-3.5" /> ยกเลิก
                    </span>
                    <span v-else class="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center w-fit gap-1 shadow-sm">
                        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> รอตรวจสอบ
                    </span>
                </td>

                <td class="font-medium text-gray-700">{{ item.date }}</td>
                <td class="text-gray-400 font-mono text-xs">{{ item.time }}</td>
                
                <td>
                    <div class="flex flex-col">
                        <span class="font-bold text-gray-800">{{ item.name }}</span>
                        <span v-if="item.cardLastDigits" class="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                            <CreditCardIcon class="w-3 h-3 opacity-70" /> •••• {{ item.cardLastDigits }}
                        </span>
                    </div>
                </td>

                <td>
                    <span class="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                        <UserIcon class="w-3 h-3 text-gray-400" /> {{ item.sender }}
                    </span>
                </td>
                
                <td class="text-right pr-5">
                    <div class="flex justify-end gap-2 items-center">
                        <button class="bg-white group-hover:bg-blue-50 text-blue-600 border border-gray-200 group-hover:border-blue-300 text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1.5 pointer-events-none">
                            <EyeIcon class="w-4 h-4" /> ดูข้อมูล
                        </button>
                    </div>
                </td>
                </tr>
            </tbody>
            </table>
        </div>

        <div v-if="filteredData.length > 0" class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span class="text-xs text-gray-500 font-medium ml-2">
                แสดง <span class="font-bold text-gray-700">{{ paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> 
                ถึง <span class="font-bold text-gray-700">{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> 
                จากทั้งหมด <span class="font-bold text-gray-700">{{ filteredData.length }}</span> รายการ
            </span>

            <div class="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors" :disabled="currentPage === 1" @click="currentPage--">
                    <ChevronLeftIcon class="w-4 h-4" />
                </button>
                <span class="text-xs font-bold text-gray-700 px-3 bg-gray-50 rounded-md py-1">
                    {{ currentPage }} / {{ totalPages }}
                </span>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors" :disabled="currentPage === totalPages" @click="currentPage++">
                    <ChevronRightIcon class="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      <RequestDetailsModal 
         :isOpen="showDetailsModal" 
         :isLoading="isLoadingDetails"
         :isProcessing="isProcessing !== null"
         :details="selectedRequestDetails"
         @close="showDetailsModal = false"
         @approve="handleApprove"
         @reject="handleReject"
      />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' 
import { 
    ArrowPathIcon, MagnifyingGlassIcon, InboxIcon, CheckCircleIcon, XCircleIcon, 
    EyeIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon, NoSymbolIcon, CreditCardIcon
} from '@heroicons/vue/24/outline'

// Import API functions
import { searchApprovals, reviewRequest, getBranchAddressHistory, getBranchCardTracking } from '@/services/branchService'
import RequestDetailsModal from '@/components/branch/RequestDetailsModal.vue'

const approvalData = ref([])
const isLoading = ref(false)
const isProcessing = ref(null) 
const currentTab = ref('ALL') 

const showDetailsModal = ref(false)
const isLoadingDetails = ref(false) 
const selectedRequestDetails = ref(null)

const toast = ref({ show: false, type: 'success', message: '' })

const currentPage = ref(1)
const itemsPerPage = 5

const filters = ref({ search: '', startDate: '', endDate: '' })

const SESSION_KEY = 'branch_approval_state'

onMounted(() => {
  const savedState = sessionStorage.getItem(SESSION_KEY)
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      filters.value = parsed.filters
      currentTab.value = parsed.currentTab
    } catch (e) { sessionStorage.removeItem(SESSION_KEY) }
  }
  fetchData() 
})

watch([filters, currentTab], () => {
  const stateToSave = { filters: filters.value, currentTab: currentTab.value }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave))
  currentPage.value = 1
}, { deep: true }) 

const resetFilters = () => {
    filters.value = { search: '', startDate: '', endDate: '' }
    currentTab.value = 'ALL'
    sessionStorage.removeItem(SESSION_KEY)
    fetchData() 
}

const changeTab = (tab) => { currentTab.value = tab }

// ปรับปรุงฟังก์ชันแปลงวันที่รองรับ "DD-MM-YYYY HH:mm"
const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: '', time: '' }
    const [date, time] = dateTimeStr.split('T')
    return { date, time }
}

const getTimestamp = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 0
    try {
        const parts = dateStr.split('/')
        if(parts.length === 3) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${timeStr}:00`).getTime()
        }
        return new Date(`${dateStr}T${timeStr}:00`).getTime()
    } catch (e) { return 0 }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const start = parseDateTime(filters.value.startDate)
    const end = parseDateTime(filters.value.endDate)

    const payload = {
        fullNameTh: filters.value.search || '',
        startDate: start.date, startTime: start.time,
        endDate: end.date, endTime: end.time
    }

    const response = await searchApprovals(payload)
    
    if (response.data) {
        // ปรับปรุงการ Map ข้อมูลให้ตรงกับ API 
        const rawData = response.data.map(item => {
            let datePart = ''
            let timePart = ''
            
            // จัดการวันที่รูปแบบ "13-03-2026 01:10"
            const sourceDate = item.requestedAt || item.createAt
            if(sourceDate) {
                const parts = sourceDate.split(' ')
                if(parts.length === 2) {
                    // เปลี่ยนจาก "-" เป็น "/" เพื่อให้แสดงผลสม่ำเสมอ "13/03/2026"
                    datePart = parts[0].replace(/-/g, '/') 
                    timePart = parts[1]
                } else {
                    datePart = sourceDate
                }
            }

            return {
                id: item.requestId, 
                userId: item.userId, 
                date: datePart, 
                time: timePart,
                name: item.customerFullName || 'ไม่ระบุชื่อ',
                sender: item.callcenterBy || item.createdBy || 'Call Center',
                status: item.status, 
                reason: item.branchReason || item.rejectReason || '',  
                callcenterReason: item.callcenterReason || '-', 
                cardLastDigits: item.cardLastDigits || ''
            }
        })

        rawData.sort((a, b) => getTimestamp(b.date, b.time) - getTimestamp(a.date, a.time))
        approvalData.value = rawData
    } else {
        approvalData.value = []
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    showToast('error', 'ไม่สามารถดึงข้อมูลได้')
  } finally {
    isLoading.value = false
  }
}

const filteredData = computed(() => {
   let data = approvalData.value
   if (currentTab.value !== 'ALL') {
      if (currentTab.value === 'CANCELED') {
          data = data.filter(item => ['CANCEL', 'CANCELED', 'CANCELLED'].includes(item.status))
      } else {
          data = data.filter(item => item.status === currentTab.value)
      }
   }
   return data
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredData.value.slice(start, start + itemsPerPage)
})

const openDetailsModal = async (item) => {
    selectedRequestDetails.value = { 
        ...item, 
        oldAddress: 'กำลังดึงข้อมูลจากระบบ...', 
        newAddress: 'กำลังดึงข้อมูลจากระบบ...',
        reasonToChange: item.callcenterReason || 'กำลังดึงข้อมูล...'
    }
    showDetailsModal.value = true
    isLoadingDetails.value = true 

    try {
        if (item.userId) {
            const historyRes = await getBranchAddressHistory(item.userId)
            
            let targetHistory = null
            if (Array.isArray(historyRes.data)) {
                targetHistory = historyRes.data.find(req => req.requestId === item.id) || historyRes.data[0]
            } else if (historyRes.data) {
                targetHistory = historyRes.data
            }

            if (targetHistory) {
                selectedRequestDetails.value.newAddress = `${targetHistory.address || ''} ต.${targetHistory.subdistrict || ''} อ.${targetHistory.district || ''} จ.${targetHistory.province || ''} ${targetHistory.zipcode || ''}`.trim() || 'ไม่พบข้อมูลที่อยู่ใหม่'
                selectedRequestDetails.value.reasonToChange = targetHistory.callcenterReason || item.callcenterReason || '-'
                
                if (targetHistory.cardId) {
                    try {
                        const trackRes = await getBranchCardTracking(targetHistory.cardId)
                        const oldData = trackRes.data
                        if (oldData) {
                            selectedRequestDetails.value.oldAddress = `${oldData.address || ''} ต.${oldData.district || ''} อ.${oldData.amphoe || ''} จ.${oldData.province || ''} ${oldData.zipcode || ''}`.trim() || 'ไม่พบข้อมูลที่อยู่เดิม'
                        } else {
                            selectedRequestDetails.value.oldAddress = 'ไม่พบข้อมูลที่อยู่เดิมในระบบ (CoreCard ไม่ส่งข้อมูลกลับมา)'
                        }
                    } catch (e) {
                        selectedRequestDetails.value.oldAddress = 'ไม่สามารถดึงข้อมูลที่อยู่เดิมได้ (Error CoreCard)'
                    }
                } else {
                    selectedRequestDetails.value.oldAddress = 'ไม่สามารถดึงข้อมูลที่อยู่เดิมได้ (ไม่พบรหัสอ้างอิงบัตร)'
                }
            } else {
                selectedRequestDetails.value.newAddress = 'ไม่พบรายละเอียดที่อยู่สำหรับคำร้องนี้'
                selectedRequestDetails.value.oldAddress = '-'
            }
        } else {
             selectedRequestDetails.value.newAddress = 'ไม่สามารถดึงข้อมูลได้ (ไม่พบรหัสลูกค้า)'
             selectedRequestDetails.value.oldAddress = '-'
        }
    } catch (error) {
        console.error("ดึงข้อมูลที่อยู่ไม่สำเร็จ:", error)
        selectedRequestDetails.value.newAddress = 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย'
        selectedRequestDetails.value.oldAddress = 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย'
    } finally {
        isLoadingDetails.value = false 
    }
}

const handleApprove = (id) => {
    confirmAction(id, 'APPROVE', '')
}

const handleReject = (payload) => {
    confirmAction(payload.id, 'REJECT', payload.reason)
}

const confirmAction = async (id, action, reason) => {
  isProcessing.value = id
  try {
    await reviewRequest(id, action, reason)
    
    const index = approvalData.value.findIndex(item => item.id === id)
    if (index !== -1) {
       approvalData.value[index].status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
       if(action === 'REJECT') approvalData.value[index].reason = reason
    }

    showToast(action === 'APPROVE' ? 'approve' : 'reject')
    showDetailsModal.value = false 

  } catch (error) {
    console.error(error)
    showToast('error', error.response?.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    isProcessing.value = null
  }
}

const showToast = (type, customMessage = '') => {
   let msg = customMessage || (type === 'approve' ? 'อนุมัติคำขอเรียบร้อยแล้ว' : 'ปฏิเสธคำขอเรียบร้อยแล้ว')
   toast.value = { show: true, type: type === 'approve' || type === 'success' ? 'success' : 'error', message: msg }
   setTimeout(() => { toast.value.show = false }, 3000)
}
</script>