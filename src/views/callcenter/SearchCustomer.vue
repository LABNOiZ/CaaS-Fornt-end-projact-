<template>
  <div class="h-[calc(100vh-140px)] flex flex-col font-sans overflow-hidden">

    <div class="flex-none mb-3 flex items-center gap-2">
        <div class="bg-indigo-100 p-1.5 rounded-lg">
            <MagnifyingGlassIcon class="w-5 h-5 text-indigo-600" />
        </div>
        <h2 class="text-lg font-extrabold text-gray-800 tracking-tight leading-none">ค้นหาข้อมูลลูกค้า</h2>
    </div>

    <div class="flex-none bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
        <div class="flex flex-col md:flex-row gap-4 items-end">
            
            <div class="flex-1 w-full">
                <label class="block text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                <input 
                    v-model="searchForm.name"
                    @input="handleNameInput"
                    @keyup.enter="handleSearch"
                    type="text" 
                    placeholder="กรอกชื่อนามสกุลเป็นภาษาไทย"
                    class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition h-[38px] bg-gray-50 focus:bg-white"
                    :class="{'border-red-300 focus:ring-red-200': isError && !searchForm.name && !searchForm.idCard}"
                />
            </div>

            <div class="flex-1 w-full">
                <label class="block text-gray-500 text-[10px] font-bold mb-1 uppercase tracking-wider">เลขบัตรประชาชน</label>
                <input 
                    v-model="searchForm.idCard"
                    @input="handleIdCardInput"
                    @keyup.enter="handleSearch"
                    type="text" 
                    placeholder="1-xxxx-xxxxx-xx-x"
                    maxlength="17"
                    class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition h-[38px] bg-gray-50 focus:bg-white font-mono"
                    :class="{'border-red-300 focus:ring-red-200': isError && !searchForm.name && !searchForm.idCard}"
                />
            </div>

            <div class="flex items-center gap-2"> 
                 <button 
                    v-if="hasSearched || searchForm.name || searchForm.idCard" 
                    @click="clearSearch" 
                    class="px-4 py-1.5 rounded-lg font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition text-xs h-[38px]"
                >
                    ล้างค่า
                </button>

                <button 
                    @click="handleSearch"
                    :disabled="isLoading"
                    class="
                        relative overflow-hidden z-10 transition-all duration-300
                        bg-indigo-600 text-white px-6 py-1.5 rounded-lg font-bold shadow-md 
                        flex items-center gap-2 h-[38px] text-xs min-w-[110px] justify-center
                        disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
                        hover:enabled:bg-gradient-to-br 
                        hover:enabled:from-[#00a2ff] hover:enabled:to-[#00aeffa2]
                        hover:enabled:shadow-[0_0_15px_#00a2ff80]
                        hover:enabled:-translate-y-[1px]
                        active:enabled:scale-95
                    "
                >
                    <ArrowPathIcon v-if="isLoading" class="animate-spin h-4 w-4" />
                    <MagnifyingGlassIcon v-else class="h-4 w-4" />
                    <span>{{ isLoading ? 'กำลังค้นหา...' : 'ค้นหา' }}</span>
                </button>
            </div>
        </div>
        
        <div v-if="isError" class="mt-2 text-red-500 text-[10px] font-bold flex items-center gap-1 animate-pulse">
            <ExclamationCircleIcon class="w-3 h-3" />
            กรุณาระบุข้อมูลอย่างน้อย 1 ช่อง
        </div>
    </div>

    <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-0 relative">
        
        <div class="flex-none px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-bold text-xs text-gray-700 uppercase tracking-wide">
                ผลลัพธ์การค้นหา
            </h3>
            <div class="flex items-center gap-2" v-if="hasSearched">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" v-if="searchResults.length > 0"></span>
                <span class="text-[10px] text-gray-500">
                    พบ <span class="font-bold text-indigo-600">{{ searchResults.length }}</span> รายการ
                </span>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative">
            <table class="w-full text-left border-collapse">
                <thead class="bg-white text-gray-500 font-semibold uppercase tracking-wider text-[10px] sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th class="px-4 py-3 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">ชื่อ-นามสกุล</th>
                        <th class="px-4 py-3 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">อีเมล</th>
                        <th class="px-4 py-3 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">เบอร์โทร</th>
                        <th class="px-4 py-3 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">เลขบัตรประชาชน</th>
                        <th class="px-4 py-3 text-center bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">ดำเนินการ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    
                    <tr v-for="customer in paginatedResults" :key="customer.userId" class="hover:bg-indigo-50/40 transition group">
                        <td class="px-4 py-3 text-xs font-bold text-gray-800">{{ customer.fullNameTh }}</td>
                        <td class="px-4 py-3 text-xs text-gray-600">{{ customer.email }}</td>
                        <td class="px-4 py-3 text-xs text-gray-500 font-mono">{{ customer.mobileNumber }}</td>
                        <td class="px-4 py-3 text-xs text-gray-500 font-mono">{{ customer.citizenId }}</td>
                        <td class="px-4 py-3 text-center">
                            <router-link 
                                :to="{ name: 'CustomerDetail', params: { id: customer.userId } }" 
                                class="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition border border-indigo-100 hover:border-indigo-300 hover:shadow-sm"
                            >
                                รายละเอียด <ChevronRightIcon class="w-3 h-3" />
                            </router-link>
                        </td>
                    </tr>
                    
                    <tr v-if="hasSearched && searchResults.length === 0 && !isLoading">
                        <td colspan="5" class="h-40 text-center">
                            <div class="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                <div class="bg-gray-50 p-3 rounded-full">
                                    <MagnifyingGlassIcon class="w-6 h-6 text-gray-300" />
                                </div>
                                <span class="text-xs">ไม่พบข้อมูลลูกค้าที่ตรงกับเงื่อนไข</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!hasSearched">
                        <td colspan="5" class="h-40 text-center">
                            <div class="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                                <UsersIcon class="w-8 h-8 text-gray-200" />
                                <span class="text-xs">กรอกข้อมูลด้านบนเพื่อค้นหาลูกค้า</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="isLoading" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 backdrop-blur-[1px]">
                <ArrowPathIcon class="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                <span class="font-bold text-gray-600 text-xs tracking-wide">กำลังค้นหาข้อมูล...</span>
            </div>
        </div>

        <div v-if="hasSearched && searchResults.length > 0" class="flex-none px-3 py-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center z-20">
            <div class="text-[10px] text-gray-500">
                หน้า <span class="font-bold text-gray-800">{{ currentPage }}</span> / {{ totalPages }} (ทั้งหมด {{ searchResults.length }})
            </div>
            <div class="flex gap-1.5">
                <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 h-[26px] shadow-sm"
                    :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-white hover:text-indigo-600 hover:border-indigo-300'"
                >
                    <ChevronLeftIcon class="w-3 h-3" /> ก่อนหน้า
                </button>
                
                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 h-[26px] shadow-sm"
                    :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-white hover:text-indigo-600 hover:border-indigo-300'"
                >
                    ถัดไป <ChevronRightIcon class="w-3 h-3" />
                </button>
            </div>
        </div>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { MagnifyingGlassIcon, ChevronRightIcon, ArrowPathIcon, ExclamationCircleIcon, UsersIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { searchCustomer } from '@/services/callCenterService' 

// State
const isLoading = ref(false)
const hasSearched = ref(false)
const isError = ref(false)

const searchForm = reactive({
    name: '',
    idCard: ''
})

const searchResults = ref([])

//  Pagination State
const currentPage = ref(1)
const itemsPerPage = 5 

onMounted(() => {
    const savedData = sessionStorage.getItem('search_customer_state')
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData)
            searchForm.name = parsed.name || ''
            searchForm.idCard = parsed.idCard || ''
            searchResults.value = parsed.results || []
            hasSearched.value = true
        } catch (e) {
            sessionStorage.removeItem('search_customer_state')
        }
    }
})

//  Computed
const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return searchResults.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(searchResults.value.length / itemsPerPage)
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const handleNameInput = (e) => {
    let val = e.target.value
    if(val.startsWith(' ')) val = val.trimStart()
    val = val.replace(/\s{2,}/g, ' ')
    searchForm.name = val
    //  แก้ไข: ไม่ล้างค่า idCard แล้ว เพื่อให้กรอกคู่กันได้
    isError.value = false
}

const handleIdCardInput = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 13) val = val.slice(0, 13)
    let formatted = ''
    if (val.length > 0) formatted += val.slice(0, 1)
    if (val.length > 1) formatted += '-' + val.slice(1, 5)
    if (val.length > 5) formatted += '-' + val.slice(5, 10)
    if (val.length > 10) formatted += '-' + val.slice(10, 12)
    if (val.length > 12) formatted += '-' + val.slice(12, 13)
    
    searchForm.idCard = formatted
    //  แก้ไข: ไม่ล้างค่า name แล้ว
    isError.value = false
}

const handleSearch = async () => {
    // เช็คว่าต้องมีอย่างน้อย 1 ช่องที่ไม่ว่าง
    if (!searchForm.name.trim() && !searchForm.idCard.trim()) {
        isError.value = true
        return
    }

    isError.value = false
    isLoading.value = true
    hasSearched.value = false
    searchResults.value = [] 
    currentPage.value = 1 

    try {
        //  แก้ไข: สร้าง Payload ที่ส่งไปทั้งคู่ (ถ้ามีค่า)
        const payload = {
            queryCitizenId: searchForm.idCard ? searchForm.idCard.trim().replace(/-/g, '') : '',
            queryFullNameTh: searchForm.name ? searchForm.name.trim() : ''
        }

        console.log("Searching with payload:", payload) 

        const response = await searchCustomer(payload)
        
        searchResults.value = response.data || []
        
        hasSearched.value = true
        saveState()

    } catch (error) {
        console.error("Search API Error:", error)
        searchResults.value = []
        hasSearched.value = true 
    } finally {
        isLoading.value = false
    }
}

const saveState = () => {
    const dataToSave = {
        name: searchForm.name,
        idCard: searchForm.idCard,
        results: searchResults.value
    }
    sessionStorage.setItem('search_customer_state', JSON.stringify(dataToSave))
}

const clearSearch = () => {
    searchForm.name = ''
    searchForm.idCard = ''
    searchResults.value = []
    hasSearched.value = false
    sessionStorage.removeItem('search_customer_state')
}
</script>

<style scoped>
/* Scrollbar */
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