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
        <div v-if="toast.show" class="fixed top-20 right-5 z-[60] min-w-[300px] shadow-lg rounded-lg overflow-hidden pointer-events-auto">
           <div v-if="toast.type === 'success'" class="alert flex p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <CheckCircleIcon class="h-6 w-6 shrink-0 mr-3" />
              <div>
                <h3 class="font-bold">สำเร็จ!</h3>
                <div class="text-sm">{{ toast.message }}</div>
              </div>
           </div>
           <div v-if="toast.type === 'error'" class="alert flex p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <XCircleIcon class="h-6 w-6 shrink-0 mr-3" />
              <div>
                <h3 class="font-bold">ผิดพลาด!</h3>
                <div class="text-sm">{{ toast.message }}</div>
              </div>
           </div>
        </div>
      </transition>

      <div class="mb-4 space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <div class="flex gap-3 items-end">
            <div class="flex-1 max-w-md">
               <label class="block text-xs font-bold text-gray-600 mb-1">ค้นหาชื่อ-นามสกุลลูกค้า</label>
               <div class="relative">
                 <input type="text" v-model="filters.search" @keyup.enter="fetchData" placeholder="ระบุชื่อลูกค้า..." 
                 class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-9 p-2">
                 <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
               </div>
            </div>
            
            <button @click="fetchData" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition text-sm h-[38px] flex items-center">
                ค้นหา
            </button>

            <button @click="resetFilters" class="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-2 px-3 rounded-lg border border-gray-200 shadow-sm transition h-[38px] flex items-center" title="ล้างค่าการค้นหา">
                <ArrowPathIcon class="w-4 h-4" />
            </button>
         </div>

         <div class="flex flex-wrap items-center gap-3">
            <div class="w-full md:w-auto">
               <label class="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Start Date</label>
               <input type="datetime-local" v-model="filters.startDate" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full md:w-56 p-2 cursor-pointer">
            </div>
            <span class="text-gray-300 mt-5 hidden md:block">-</span>
            <div class="w-full md:w-auto">
               <label class="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">End Date</label>
               <input type="datetime-local" v-model="filters.endDate" class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg block w-full md:w-56 p-2 cursor-pointer">
            </div>
         </div>
      </div>

      <div class="flex items-center justify-between mb-3 px-1">
         <div class="tabs tabs-boxed bg-transparent p-0 gap-2">
            <a @click="changeTab('ALL')" :class="{'!bg-gray-800 !text-white': currentTab === 'ALL'}" class="tab tab-sm rounded-lg border border-gray-200 bg-white text-gray-600 cursor-pointer transition-colors">ทั้งหมด</a>
            <a @click="changeTab('PENDING')" :class="{'!bg-blue-600 !text-white': currentTab === 'PENDING'}" class="tab tab-sm rounded-lg border border-blue-100 bg-blue-50 text-blue-600 cursor-pointer transition-colors">รออนุมัติ</a>
            <a @click="changeTab('APPROVED')" :class="{'!bg-green-600 !text-white': currentTab === 'APPROVED'}" class="tab tab-sm rounded-lg border border-green-100 bg-green-50 text-green-600 cursor-pointer transition-colors">อนุมัติ</a>
            <a @click="changeTab('REJECTED')" :class="{'!bg-red-600 !text-white': currentTab === 'REJECTED'}" class="tab tab-sm rounded-lg border border-red-100 bg-red-50 text-red-600 cursor-pointer transition-colors">ไม่อนุมัติ</a>
         </div>
         <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
            Sort: Newest First
         </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm relative flex flex-col">
        
        <div v-if="isLoading" class="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-[1px]">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="text-gray-500 mt-2 text-xs font-medium">กำลังโหลด...</p>
        </div>

        <div class="overflow-x-auto min-h-[300px]">
            <table class="table table-sm w-full">
            <thead class="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                <th class="py-3 pl-4">สถานะ</th>
                <th>Start Date</th>
                <th>เวลา</th>
                <th>ชื่อ-สกุล ลูกค้า</th>
                <th>ผู้ส่งเรื่อง</th>
                <th>เหตุผล</th>
                <th class="text-right pr-6">Action</th>
                </tr>
            </thead>
            
            <tbody class="text-sm divide-y divide-gray-100">
                <tr v-if="!isLoading && paginatedData.length === 0">
                    <td colspan="7" class="h-48 text-center text-gray-400">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <InboxIcon class="w-8 h-8 text-gray-300" />
                        <span class="text-xs">ไม่พบข้อมูล</span>
                    </div>
                    </td>
                </tr>

                <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-blue-50/50 transition-colors">
                <td class="pl-4 py-3">
                    <span v-if="item.status === 'APPROVED'" class="bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center w-fit gap-1">
                        <CheckCircleIcon class="w-3 h-3" /> อนุมัติ
                    </span>
                    <span v-else-if="item.status === 'REJECTED'" class="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center w-fit gap-1">
                        <XCircleIcon class="w-3 h-3" /> ไม่อนุมัติ
                    </span>
                    <span v-else class="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center w-fit gap-1">
                        รออนุมัติ
                    </span>
                </td>

                <td class="font-medium text-gray-600">{{ item.date }}</td>
                <td class="text-gray-400 font-mono text-xs">{{ item.time }}</td>
                <td class="font-bold text-gray-800">{{ item.name }}</td>
                <td class="text-gray-500 text-xs">{{ item.sender }}</td>
                <td class="text-gray-400 text-xs italic truncate max-w-[150px]" :title="item.reason">
                    {{ item.reason || '-' }}
                </td>
                
                <td class="text-right pr-4">
                    <div v-if="item.status === 'PENDING'" class="flex justify-end gap-2">
                        <button 
                            @click="openConfirmModal(item.id, 'reject')"
                            class="bg-red-500 hover:bg-red-600 text-white text-[10px] px-3 py-1.5 rounded font-bold transition shadow-sm flex items-center gap-1"
                        >
                            <XCircleIcon class="w-3 h-3" /> ไม่อนุมัติ
                        </button>
                        <button 
                            @click="openConfirmModal(item.id, 'approve')"
                            class="bg-green-500 hover:bg-green-600 text-white text-[10px] px-3 py-1.5 rounded font-bold transition shadow-sm flex items-center gap-1"
                        >
                            <CheckCircleIcon class="w-3 h-3" /> อนุมัติ
                        </button>
                    </div>
                    <div v-else class="text-gray-300 text-[10px]">
                        -
                    </div>
                </td>
                </tr>
            </tbody>
            </table>
        </div>

        <div v-if="filteredData.length > 0" class="p-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <span class="text-xs text-gray-500 font-medium ml-2">
                แสดง {{ paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} 
                - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} 
                จาก {{ filteredData.length }}
            </span>

            <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                <button 
                    class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50" 
                    :disabled="currentPage === 1" 
                    @click="currentPage--"
                >«</button>
                <span class="text-xs font-bold text-gray-700 px-2">
                    {{ currentPage }} / {{ totalPages }}
                </span>
                <button 
                    class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50" 
                    :disabled="currentPage === totalPages" 
                    @click="currentPage++"
                >»</button>
            </div>
        </div>

      </div>

      <div v-if="showModal" class="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
         <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 border border-gray-100">
            <div class="text-center">
               <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-4 shadow-sm" :class="modalData.type === 'approve' ? 'bg-green-50' : 'bg-red-50'">
                  <CheckCircleIcon v-if="modalData.type === 'approve'" class="h-8 w-8 text-green-500" />
                  <XCircleIcon v-else class="h-8 w-8 text-red-500" />
               </div>
               <h3 class="text-lg leading-6 font-bold text-gray-900">
                  ยืนยันการ{{ modalData.type === 'approve' ? 'อนุมัติ' : 'ไม่อนุมัติ' }}
               </h3>
               <p class="text-xs text-gray-500 mt-2">
                  คุณต้องการดำเนินการรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
               </p>

               <div v-if="modalData.type === 'reject'" class="mt-4 text-left bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <label class="block text-xs font-bold text-gray-700 mb-1">เหตุผลที่ไม่อนุมัติ <span class="text-red-500">*</span></label>
                  <textarea 
                    v-model="rejectReasonInput"
                    class="w-full bg-white border border-gray-300 rounded-md p-2 text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    rows="2"
                    placeholder="เช่น เอกสารไม่ครบถ้วน..."
                  ></textarea>
               </div>

            </div>
            <div class="mt-6 flex gap-3">
               <button 
                  @click="showModal = false"
                  class="flex-1 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs transition"
               >
                  ยกเลิก
               </button>
               <button 
                  @click="confirmAction"
                  class="flex-1 py-2 rounded-lg text-white font-bold shadow-md text-xs transition flex justify-center items-center"
                  :class="modalData.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
                  :disabled="isProcessing !== null"
               >
                  <span v-if="isProcessing === null">ยืนยัน</span>
                  <span v-else class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
               </button>
            </div>
         </div>
      </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' 
import { ArrowPathIcon, MagnifyingGlassIcon, InboxIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { searchApprovals, reviewRequest } from '@/services/branchService'

// State
const approvalData = ref([])
const isLoading = ref(false)
const isProcessing = ref(null) 
const currentTab = ref('ALL') 
const showModal = ref(false)
const modalData = ref({ id: null, type: '' }) 
const rejectReasonInput = ref('')
const toast = ref({ show: false, type: 'success', message: '' })

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 5

const filters = ref({
   search: '',
   startDate: '',
   endDate: ''
})

const SESSION_KEY = 'branch_approval_state'

// Lifecycle
onMounted(() => {
  const savedState = sessionStorage.getItem(SESSION_KEY)
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      filters.value = parsed.filters
      currentTab.value = parsed.currentTab
    } catch (e) {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }
  fetchData() 
})

watch([filters, currentTab], () => {
  const stateToSave = {
    filters: filters.value,
    currentTab: currentTab.value
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave))
  currentPage.value = 1
}, { deep: true }) 

// Methods
const resetFilters = () => {
    filters.value = { search: '', startDate: '', endDate: '' }
    currentTab.value = 'ALL'
    sessionStorage.removeItem(SESSION_KEY)
    fetchData() 
}

const changeTab = (tab) => {
    currentTab.value = tab
}

const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: '', time: '' }
    const [date, time] = dateTimeStr.split('T')
    return { date, time }
}

const getTimestamp = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 0
    try {
        const [day, month, year] = dateStr.split('-') 
        return new Date(`${year}-${month}-${day}T${timeStr}:00`).getTime()
    } catch (e) {
        return 0
    }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const start = parseDateTime(filters.value.startDate)
    const end = parseDateTime(filters.value.endDate)

    const payload = {
        fullNameTh: filters.value.search || '',
        startDate: start.date,
        startTime: start.time,
        endDate: end.date,
        endTime: end.time
    }

    const response = await searchApprovals(payload)
    
    if (response.data) {
        const rawData = response.data.map(item => ({
            id: item.requestId,
            date: item.requestDate,
            time: item.requestTime,
            name: item.customerFullName,
            sender: item.requestedBy,
            status: item.status, 
            reason: '' 
        }))

        // Sort Newest First
        rawData.sort((a, b) => {
            return getTimestamp(b.date, b.time) - getTimestamp(a.date, a.time)
        })

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

// Computed
const filteredData = computed(() => {
   let data = approvalData.value
   if (currentTab.value !== 'ALL') {
      data = data.filter(item => item.status === currentTab.value)
   }
   return data
})

const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage)
})

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredData.value.slice(start, end)
})

// Modal Actions
const openConfirmModal = (id, type) => {
   modalData.value = { id, type }
   rejectReasonInput.value = '' 
   showModal.value = true
}

const confirmAction = async () => {
  const { id, type } = modalData.value
  isProcessing.value = id
  
  try {
    const action = type === 'approve' ? 'APPROVE' : 'REJECT'
    const reason = type === 'reject' ? rejectReasonInput.value : ''

    await reviewRequest(id, action, reason)
    
    const index = approvalData.value.findIndex(item => item.id === id)
    if (index !== -1) {
       approvalData.value[index].status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
       if(type === 'reject') approvalData.value[index].reason = reason
    }

    showToast(type)

  } catch (error) {
    console.error(error)
    showToast('error', error.response?.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    isProcessing.value = null
    showModal.value = false 
  }
}

const showToast = (type, customMessage = '') => {
   let msg = ''
   if (customMessage) {
       msg = customMessage
   } else {
       msg = type === 'approve' ? 'อนุมัติคำขอเรียบร้อยแล้ว 🎉' : 'ปฏิเสธคำขอเรียบร้อยแล้ว 🚫'
   }

   toast.value = {
      show: true,
      type: type === 'approve' || type === 'success' ? 'success' : 'error',
      message: msg
   }
   
   setTimeout(() => {
      toast.value.show = false
   }, 3000)
}
</script>