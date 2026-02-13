<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans relative">
    
    <transition name="slide-fade">
      <div v-if="alert.show" class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] min-w-[350px]">
        
        <div v-if="alert.type === 'success'" role="alert" class="alert alert-success bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl shadow-lg flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current text-green-600" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-bold text-sm">{{ alert.message }}</span>
        </div>

        <div v-else role="alert" class="alert alert-error bg-red-100 border border-red-200 text-red-800 p-4 rounded-xl shadow-lg flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current text-red-600" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-bold text-sm">{{ alert.message }}</span>
        </div>

      </div>
    </transition>

    <div class="flex flex-col lg:flex-row gap-6 items-start">
      
      <div class="w-full lg:w-1/4 flex flex-col gap-6">
        <div class="flex items-center gap-2 h-[50px]"> 
          <button @click="goBack" class="bg-white border border-gray-300 text-gray-700 p-2 rounded-full hover:bg-gray-100 transition shadow-sm flex-shrink-0">
            <ArrowLeftIcon class="w-4 h-4" />
          </button>
          <div class="flex flex-wrap items-center gap-1 text-gray-500">
            <h1 class="text-lg font-bold text-gray-400 cursor-pointer hover:text-blue-500" @click="goBack">ค้นหา</h1>
            <span class="text-lg text-gray-300">/</span>
            <span class="text-blue-600 font-bold text-lg">รายละเอียด</span>
          </div>
        </div>

        <div v-if="customer" class="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div class="absolute left-0 top-6 bottom-6 w-1.5 bg-blue-500 rounded-r-lg"></div>
          <h2 class="text-xl font-bold text-blue-500 mb-4 pl-3">ข้อมูลส่วนตัว</h2>
          
          <div class="space-y-3 pl-3">
            <div><p class="text-gray-400 text-xs">ชื่อ-นามสกุล ไทย</p><p class="text-lg font-bold text-gray-800 leading-tight">{{ customer.fullNameTh }}</p></div>
            <div><p class="text-gray-400 text-xs">ชื่อ-นามสกุล อังกฤษ</p><p class="text-lg font-bold text-gray-800 leading-tight">{{ customer.fullNameEn }}</p></div>
            <div><p class="text-gray-400 text-xs">อีเมล</p><p class="text-base font-bold text-gray-800 break-words leading-tight">{{ customer.email }}</p></div>
            <div><p class="text-gray-400 text-xs">เบอร์โทรศัพท์</p><p class="text-base font-bold text-gray-800">{{ customer.mobileNumber }}</p></div>
            <div><p class="text-gray-400 text-xs">เลขบัตรประชาชน</p><p class="text-base font-bold text-gray-800">{{ customer.citizenId }}</p></div>
          </div>
        </div>
        
        <div v-else class="p-10 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
          กำลังโหลด...
        </div>
      </div>

      <div class="w-full lg:w-3/4 flex flex-col gap-6">
        
        <div class="flex bg-white p-1 rounded-xl shadow-sm w-fit border h-[50px] items-center">
          <button @click="changeTab('virtual')" :class="activeTab === 'virtual' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'" class="px-6 py-2 rounded-lg font-bold transition-all duration-200 h-full flex items-center">Virtual Card</button>
          <button @click="changeTab('physical')" :class="activeTab === 'physical' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'" class="px-6 py-2 rounded-lg font-bold transition-all duration-200 h-full flex items-center">Physical Card</button>
        </div>

        <div v-if="customer">
          <div class="space-y-3 min-h-[580px]">
            <div v-for="card in paginatedCards" :key="card.cardID" 
                 class="bg-gray-200 rounded-xl p-4 relative shadow-sm border border-gray-300 transition hover:shadow-md animate-fade-in" 
                 :class="{'border-blue-500 ring-1 ring-blue-500 bg-blue-50': isCardPending(card.cardId)}"
            >
              
              <div class="absolute top-3 right-3 flex items-center gap-2">
                 <span v-if="card.status === 'active'" class="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Active</span>
                 <span v-else-if="card.status === 'inactive'" class="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Inactive (Pending)</span>
                 <span v-else class="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">{{ card.status }}</span>
                 
                 <span v-if="card.status === 'active'" class="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                 <span v-else-if="card.status === 'inactive'" class="w-2.5 h-2.5 bg-orange-400 rounded-full"></span>
                 <span v-else class="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
              </div>

              <div class="mb-2">
                <p class="text-gray-500 text-[10px] mb-0.5">เลขบัตร</p>
                <p class="text-xl font-bold text-gray-800 tracking-wider font-mono">
                 {{ formatCardNumber(card.cardNumber) }}
                </p>
              </div>
              
              <div class="mb-2">
                <p class="text-gray-500 text-[10px]">EXP : <span class="text-gray-800 font-bold text-sm">{{ formatDate(card.expiry) }}</span></p>
              </div>

              <div class="flex justify-between items-end mb-3">
                 <div>
                    <p class="text-gray-500 text-[10px]">ชื่อบนบัตร</p>
                    <p class="text-gray-800 font-bold text-sm">{{ card.holderName }}</p>
                 </div>
              </div>

              <div class="pt-3 border-t border-gray-300/60">
                
                <div v-if="card.status === 'active' && !isCardVirtual(card)" class="flex justify-between items-center">
                    <div class="text-xs text-gray-600">
                        <span v-if="trackingMap[card.cardId]" class="flex items-center gap-2">
                            <TruckIcon class="w-4 h-4 text-blue-500"/> 
                            สถานะจัดส่ง: <span class="font-bold text-blue-600">{{ trackingMap[card.cardId].delivery_status }}</span>
                        </span>
                    </div>
                    <button @click="openSuspendModal(card)" class="bg-purple-600 hover:bg-purple-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow flex items-center gap-1 transition">
                        <NoSymbolIcon class="w-3 h-3" /> อายัดบัตร
                    </button>
                </div>

                <div v-if="card.status === 'inactive' && !isCardVirtual(card)">
                    
                    <div v-if="isCardPending(card.cardId)" class="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm mb-2">
                        <div class="flex justify-between items-start mb-1">
                            <span class="text-orange-500 font-bold text-xs">รอผู้จัดการสาขาอนุมัติ</span>
                            <span class="text-[10px] text-gray-400">ส่งเรื่องล่าสุด</span>
                        </div>
                        <div class="text-xs text-gray-600 break-words">
                             <span class="font-semibold">ที่อยู่ใหม่:</span> {{ getPendingAddress(card.cardId) }}
                        </div>
                        <div class="text-[10px] text-gray-400 mt-1">
                            ส่งโดย {{ changeRequestMap[card.cardId].requester || 'Admin' }} เมื่อ: {{ formatDate(changeRequestMap[card.cardId].requestDate) }}
                        </div>
                    </div>

                    <button @click="openAddressModal(card)" class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 rounded-lg shadow-sm transition text-xs flex justify-center items-center">
                        {{ isCardPending(card.cardId) ? 'แก้ไข/ส่งเรื่องเปลี่ยนที่อยู่ใหม่' : 'แจ้งเปลี่ยนที่อยู่จัดส่งบัตร' }}
                    </button>

                </div>

                <div v-if="['locked', 'frozen'].includes(card.status)" class="text-center">
                    <span class="text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded-lg border border-red-100 inline-block w-full">
                       ⛔ บัตรถูกระงับการใช้งาน
                    </span>
                </div>

              </div>
            </div>
            
            <div v-if="paginatedCards.length === 0" class="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              ไม่พบข้อมูลบัตรในประเภทนี้
            </div>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-4 pt-2 border-t border-gray-200">
             <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center gap-1 text-sm font-bold transition" :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'">
               <ArrowLeftIcon class="w-4 h-4" /> Previous
             </button>
             <div class="flex gap-2">
               <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition shadow-sm" :class="currentPage === page ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-gray-600 border hover:bg-gray-50'">{{ page }}</button>
             </div>
             <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center gap-1 text-sm font-bold transition" :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'">
               Next <ArrowRightIcon class="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        <div class="bg-gray-800 text-white p-4 text-center">
          <h3 class="text-xl font-bold">ยืนยันทำรายการ</h3>
        </div>
        <div class="p-6">
          <h4 class="text-red-600 font-bold text-lg mb-4 text-center">ระงับ Physical Card ชั่วคราว</h4>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">เหตุผล <span class="text-red-500">*</span></label>
            <select v-model="suspendReason" class="w-full border-2 border-gray-300 rounded-lg p-2.5 font-bold text-gray-700">
                <option value="" disabled>-- เลือกเหตุผล --</option>
                <option value="ลูกค้าทำบัตรหาย">ลูกค้าทำบัตรหาย</option> <option value="สงสัยทุจริต">สงสัยทุจริต</option>
                <option value="Other">อื่นๆ</option>
            </select>
          </div>
          <div v-if="suspendReason === 'Other'" class="mb-6 animate-fade-in-down">
             <label class="block text-gray-700 font-bold mb-2">ระบุเหตุผลเพิ่มเติม</label>
             <input v-model="otherReason" type="text" class="w-full border border-gray-300 rounded-lg p-2" placeholder="ระบุสาเหตุ...">
          </div>
          <div class="flex gap-4 mt-8">
            <button @click="closeModal" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow">ยกเลิก</button>
            <button @click="confirmSuspend" :disabled="!isFormValid || isSubmitting" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow disabled:opacity-50">
                {{ isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAddressModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-fade-in-down">
            <div class="p-5 border-b border-gray-200">
                <h3 class="text-xl font-bold text-gray-800">แก้ไขที่อยู่จัดส่งบัตร</h3>
                <p class="text-sm text-gray-500 font-mono mt-1">บัตร : Mastercard • {{ formatCardNumber(selectedAddressCard?.cardNumber) }}</p>
            </div>
            
            <div class="p-6 max-h-[70vh] overflow-y-auto">
                <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <p class="text-xs font-bold text-gray-500 mb-1">ที่อยู่เดิม จาก Mobile</p>
                    <p class="text-sm font-bold text-gray-800">{{ currentCardAddress }}</p>
                </div>

                <h4 class="text-sm font-bold text-gray-700 mb-3">ระบุที่อยู่ใหม่</h4>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1">ที่อยู่ <span class="text-red-500">*</span></label>
                        <input v-model="newAddressForm.address" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="บ้านเลขที่, หมู่, ถนน">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">แขวง/ตำบล <span class="text-red-500">*</span></label>
                            <input v-model="newAddressForm.subdistrict" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">เขต/อำเภอ <span class="text-red-500">*</span></label>
                            <input v-model="newAddressForm.district" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">จังหวัด <span class="text-red-500">*</span></label>
                            <input v-model="newAddressForm.province" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">รหัสไปรษณีย์ <span class="text-red-500">*</span></label>
                            <input v-model="newAddressForm.zipcode" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button @click="closeAddressModal" class="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 shadow-sm transition">ยกเลิก</button>
                <button @click="submitAddressChange" :disabled="!isAddressFormValid || isSubmitting" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition disabled:opacity-50 flex items-center gap-2">
                    {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งเรื่องให้ผู้จัดการอนุมัติ' }}
                </button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, ArrowRightIcon, NoSymbolIcon, TruckIcon } from '@heroicons/vue/24/outline' 
import { getCustomerById, lockCard, getCardTracking, requestAddressChange, getAddressChangeHistory } from '@/services/callCenterService'

const route = useRoute()
const router = useRouter()
const customer = ref(null)
const activeTab = ref('virtual')
const currentPage = ref(1)
const itemsPerPage = 3 

// State: Alerts
const alert = reactive({
  show: false,
  type: 'success', // 'success' or 'error'
  message: ''
})

// Function to Show Alert
const showAlert = (type, message) => {
  alert.type = type
  alert.message = message
  alert.show = true
  // Auto hide after 3 seconds
  setTimeout(() => {
    alert.show = false
  }, 3000)
}

// Modal State: Suspend
const isModalOpen = ref(false)
const selectedCard = ref(null)
const suspendReason = ref('')
const otherReason = ref('')

// Modal State: Address Change
const isAddressModalOpen = ref(false)
const selectedAddressCard = ref(null)
const newAddressForm = reactive({
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    zipcode: ''
})

const isSubmitting = ref(false)

// Data Maps
const trackingMap = ref({}) 
const changeRequestMap = ref({}) 

onMounted(async () => {
  const userId = route.params.id
  try {
    const response = await getCustomerById(userId)
    customer.value = response.data
    
    if(customer.value && customer.value.cards) {
        await fetchAdditionalCardInfo(userId, customer.value.cards)
    }

  } catch (error) {
    console.error("Fetch Error:", error)
    showAlert('error', 'ไม่สามารถดึงข้อมูลลูกค้าได้')
    setTimeout(() => router.go(-1), 1500)
  }
})

const currentCardAddress = computed(() => {
    if (!selectedAddressCard.value) return '';
    
    const trackInfo = trackingMap.value[selectedAddressCard.value.cardId];
    if (trackInfo) {
        const parts = [
            trackInfo.address,
            trackInfo.district, 
            trackInfo.amphoe,   
            trackInfo.province,
            trackInfo.zipcode
        ].filter(Boolean);
        if (parts.length > 0) return parts.join(' ');
    }

    if (customer.value) {
        const c = customer.value;
        const parts = [
            c.address || c.addressNo,
            c.subDistrict || c.district,
            c.district || c.amphoe,
            c.province,
            c.zipcode
        ].filter(Boolean);
        if (parts.length > 0) return [...new Set(parts)].join(' ');
    }

    return 'ไม่พบข้อมูลที่อยู่';
})

const fetchAdditionalCardInfo = async (userId, cards) => {
    try {
        const historyRes = await getAddressChangeHistory(userId)
        const history = historyRes.data || []
        
        history.forEach(req => {
            if(req.status === 'PENDING') {
                changeRequestMap.value[req.cardId] = req
            }
        })
    } catch (err) {
        console.error("Failed to load address history", err)
    }

    const physicalCards = cards.filter(c => !isCardVirtual(c))
    for(const card of physicalCards) {
        try {
            const trackRes = await getCardTracking(card.cardId)
            trackingMap.value[card.cardId] = trackRes.data
        } catch (err) {
            console.error(`Failed to load tracking for ${card.cardId}`, err)
        }
    }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  if (dateString.includes('/')) return dateString;

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString; 
  
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${month}/${year}`
}

const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return ''
  const cleanNumber = cardNumber.replace(/\s/g, '')
  return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const isCardVirtual = (card) => {
    return String(card.isVirtual).toLowerCase() === 'true' || card.isVirtual === true || card.isVirtual === 1;
}

const goBack = () => { router.go(-1) }
const changeTab = (tabName) => { activeTab.value = tabName; currentPage.value = 1 }

const allCardsInTab = computed(() => {
  if (!customer.value || !customer.value.cards) return []
  return customer.value.cards.filter(card => {
    const isVirtual = isCardVirtual(card);
    return activeTab.value === 'virtual' ? isVirtual : !isVirtual
  })
})

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allCardsInTab.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(allCardsInTab.value.length / itemsPerPage))
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goToPage = (page) => { currentPage.value = page }

// --- Suspend Modal Logic ---
const openSuspendModal = (card) => { 
  selectedCard.value = card
  suspendReason.value = ''
  otherReason.value = ''
  isModalOpen.value = true 
}

const closeModal = () => { isModalOpen.value = false; selectedCard.value = null }
const isFormValid = computed(() => suspendReason.value && (suspendReason.value !== 'Other' || otherReason.value.trim()))

const confirmSuspend = async () => {
  if (!selectedCard.value) return
  isSubmitting.value = true
  
  const finalReason = suspendReason.value === 'Other' ? otherReason.value : suspendReason.value
  
  try {
    await lockCard(selectedCard.value.cardId, finalReason)
    const card = customer.value.cards.find(c => c.cardId === selectedCard.value.cardId)
    if (card) card.status = 'locked' 
    
    //  เรียกใช้ Alert สำเร็จ
    showAlert('success', 'อายัดบัตรเรียบร้อยแล้ว')
    closeModal()
  } catch (error) {
    console.error(error)
    // ❌ เรียกใช้ Alert ผิดพลาด
    showAlert('error', 'เกิดข้อผิดพลาดในการอายัดบัตร')
  } finally {
    isSubmitting.value = false
  }
}

// --- Address Change Logic ---

const isCardPending = (cardId) => {
    return !!changeRequestMap.value[cardId]
}

const getPendingAddress = (cardId) => {
    return changeRequestMap.value[cardId]?.newAddressFull || '-'
}

const openAddressModal = (card) => {
    selectedAddressCard.value = card
    newAddressForm.address = ''
    newAddressForm.subdistrict = ''
    newAddressForm.district = ''
    newAddressForm.province = ''
    newAddressForm.zipcode = ''
    isAddressModalOpen.value = true
}

const closeAddressModal = () => {
    isAddressModalOpen.value = false
    selectedAddressCard.value = null
    // ✅ แจ้งเตือนเมื่อยกเลิก (ตามที่ขอ)
    showAlert('error', 'ยกเลิกการทำรายการ')
}

const isAddressFormValid = computed(() => {
    return newAddressForm.address && newAddressForm.subdistrict && 
           newAddressForm.district && newAddressForm.province && newAddressForm.zipcode
})

const submitAddressChange = async () => {
    if(!selectedAddressCard.value) return
    isSubmitting.value = true

    try {
        const payload = {
            userId: customer.value.userId, 
            cardId: selectedAddressCard.value.cardId,
            ...newAddressForm
        }

        await requestAddressChange(payload)
        
        // ✅ ปรับ Format ที่อยู่: เพิ่ม ต. อ. จ.
        const fullAddress = `${newAddressForm.address} ต.${newAddressForm.subdistrict} 
        อ.${newAddressForm.district} จ.${newAddressForm.province} ${newAddressForm.zipcode}`
        
        changeRequestMap.value[selectedAddressCard.value.cardId] = {
            cardId: selectedAddressCard.value.cardId,
            status: 'PENDING',
            newAddressFull: fullAddress,
            requester: 'Call Center (You)',
            requestDate: new Date().toISOString()
        }

        //  เรียกใช้ Alert สำเร็จ
        showAlert('success', 'ส่งคำร้องเรียบร้อยแล้ว รอผู้จัดการอนุมัติ')
        
        // ปิด Modal โดยไม่เรียกฟังก์ชัน closeAddressModal เพื่อไม่ให้ Alert Error ซ้อน
        isAddressModalOpen.value = false
        selectedAddressCard.value = null

    } catch (error) {
        console.error("Address Request Error:", error)
        // ❌ เรียกใช้ Alert ผิดพลาด
        showAlert('error', 'ส่งคำร้องไม่สำเร็จ')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translate(-50%, -20px); opacity: 0; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>