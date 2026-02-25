<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans relative">
    
    <transition name="slide-fade">
      <div v-if="alert.show" class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] min-w-[350px]">
        <div :class="['alert p-4 rounded-xl shadow-lg flex items-center gap-3 border', alert.type === 'success' ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800']">
           <span v-if="alert.type === 'success'" class="bg-green-200 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg></span>
           <span v-else class="bg-red-200 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></span>
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
          <div class="loading loading-spinner loading-md mb-2"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>

      <div class="w-full lg:w-3/4 flex flex-col gap-6">
        
        <div class="flex bg-white p-1 rounded-xl shadow-sm w-fit border h-[50px] items-center">
          <button @click="changeTab('virtual')" :class="activeTab === 'virtual' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'" class="px-6 py-2 rounded-lg font-bold transition-all duration-200 h-full flex items-center">Virtual Card</button>
          <button @click="changeTab('physical')" :class="activeTab === 'physical' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'" class="px-6 py-2 rounded-lg font-bold transition-all duration-200 h-full flex items-center">Physical Card</button>
        </div>

        <div v-if="customer">
          <div class="space-y-4 min-h-[580px]">
            
            <div v-for="card in paginatedCards" :key="card.cardId" 
                 class="bg-white rounded-2xl relative shadow-sm border transition hover:shadow-md animate-fade-in flex flex-col overflow-hidden" 
                 :class="showAddressRequestBox(card.cardId) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'">
              
              <div class="relative p-6 min-h-[180px] flex flex-col justify-end"
                   :class="!(card.cardImage || card.card_image) ? 'bg-gradient-to-tr from-slate-700 to-gray-900' : 'bg-gray-800'">
                  
                  <div v-if="card.cardImage || card.card_image" 
                       class="absolute inset-0 z-0 bg-cover bg-center"
                       :style="{ backgroundImage: `url(${card.cardImage || card.card_image})` }">
                  </div>
                  <div v-if="card.cardImage || card.card_image" class="absolute inset-0 z-0 bg-black/25"></div>

                  <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
                     <span class="text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-2 transition-all duration-300 shadow-sm backdrop-blur-md"
                           :class="getCardStatusBadge(card).bg + ' ' + getCardStatusBadge(card).text">
                        {{ getCardStatusBadge(card).label }}
                        <span class="w-2.5 h-2.5 rounded-full shadow-sm" :class="getCardStatusBadge(card).dot"></span>
                     </span>
                  </div>

                  <div class="relative z-10 mt-6">
                    <p class="text-white/80 text-[10px] mb-0.5 drop-shadow-md">เลขบัตร</p>
                    <p class="text-2xl font-bold text-white tracking-widest font-mono drop-shadow-lg">
                     {{ formatCardNumber(card.cardNumber) }}
                    </p>
                  </div>
                  
                  <div class="relative z-10 mt-3 flex justify-between items-end">
                     <div>
                        <p class="text-white/80 text-[10px] drop-shadow-md">ชื่อบนบัตร</p>
                        <p class="text-white font-bold text-base uppercase drop-shadow-lg tracking-wide">{{ card.holderName }}</p>
                     </div>
                     <div class="text-right">
                        <p class="text-white/80 text-[10px] drop-shadow-md">EXP</p>
                        <p class="text-white font-bold text-sm drop-shadow-lg tracking-wider">{{ formatDate(card.expiry) }}</p>
                     </div>
                  </div>
              </div>

              <div class="p-4 bg-gray-50 flex flex-col gap-3">
                
                <div v-if="!isCardVirtual(card) && card.status === 'inactive'" class="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <div class="bg-blue-100 p-1.5 rounded-lg">
                        <TruckIcon class="w-4 h-4 text-blue-600"/>
                    </div>
                    <span class="text-xs text-gray-500 font-medium">สถานะขนส่ง:</span>
                    <span class="text-xs font-bold" :class="getDeliveryStatusColor(card.cardId)">
                        {{ getDeliveryStatusText(card.cardId) }}
                    </span>
                </div>

                <div v-if="card.status === 'active' && !isCardVirtual(card)" class="flex justify-end items-center">
                    <button @click="openSuspendModal(card)" class="bg-purple-600 hover:bg-purple-700 text-white text-[10px] px-4 py-2 rounded-lg font-bold shadow flex items-center gap-1.5 transition">
                        <NoSymbolIcon class="w-3.5 h-3.5" /> อายัดบัตร
                    </button>
                </div>

                <div v-if="card.status === 'inactive' && !isCardVirtual(card)">
                    
                    <div v-if="showAddressRequestBox(card.cardId)" 
                         class="bg-white rounded-xl p-3 border border-gray-200 shadow-sm mb-3 relative overflow-hidden">
                        
                        <div class="absolute left-0 top-0 bottom-0 w-1.5" 
                             :class="isRequestApproved(card.cardId) ? 'bg-green-500' : 'bg-orange-500'">
                        </div>

                        <div class="flex justify-between items-start mb-1.5 pl-3">
                            <span class="font-bold text-xs" 
                                  :class="isRequestApproved(card.cardId) ? 'text-green-600' : 'text-orange-500'">
                                {{ isRequestApproved(card.cardId) ? 'ผู้จัดการสาขาอนุมัติแล้ว' : 'รอผู้จัดการสาขาอนุมัติ' }}
                            </span>
                            <span class="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">ส่งเรื่องล่าสุด</span>
                        </div>
                        <div class="text-xs text-gray-700 break-words pl-3">
                             <span class="font-semibold text-gray-500">ที่อยู่ใหม่:</span> {{ getPendingAddress(card.cardId) }}
                        </div>
                        <div class="text-[10px] text-gray-400 mt-2 pl-3 flex items-center gap-1">
                            <span>ส่งโดย {{ changeRequestMap[card.cardId].requester || 'Call Center' }}</span>
                            <span>•</span>
                            <span>เมื่อ: {{ formatDate(changeRequestMap[card.cardId].requestDate) }}</span>
                        </div>
                    </div>

                    <button v-if="!isShippingOrSuccess(card.cardId)"
                            @click="openAddressModal(card)" 
                            class="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl shadow-sm transition text-xs flex justify-center items-center">
                        {{ showAddressRequestBox(card.cardId) ? 'แก้ไข/ส่งเรื่องเปลี่ยนที่อยู่ใหม่' : 'แจ้งเปลี่ยนที่อยู่จัดส่งบัตร' }}
                    </button>
                </div>

                <div v-if="['locked', 'frozen'].includes(card.status)" class="text-center mt-1">
                    <span class="text-red-500 font-bold text-xs bg-red-50 px-3 py-2.5 rounded-xl border border-red-100 block w-full">
                       ⛔ บัตรถูกระงับการใช้งาน
                    </span>
                </div>

              </div>
            </div>
            
            <div v-if="paginatedCards.length === 0" class="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
              ไม่พบข้อมูลบัตรในประเภทนี้
            </div>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-200">
             <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center gap-1 text-sm font-bold transition" :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'"><ArrowLeftIcon class="w-4 h-4" /> Previous</button>
             <div class="flex gap-2"><button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition shadow-sm" :class="currentPage === page ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-gray-600 border hover:bg-gray-50'">{{ page }}</button></div>
             <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center gap-1 text-sm font-bold transition" :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'">Next <ArrowRightIcon class="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>

    <SuspendCardModal :isOpen="isSuspendModalOpen" :isLoading="isSubmitting" @close="closeSuspendModal" @confirm="handleSuspendConfirm" />
    <AddressChangeModal :isOpen="isAddressModalOpen" :isLoading="isSubmitting" :currentAddress="currentCardAddress" :cardLabel="selectedAddressCard ? `Mastercard • ${formatCardNumber(selectedAddressCard.cardNumber)}` : ''" @close="closeAddressModal" @submit="handleAddressSubmit" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, ArrowRightIcon, NoSymbolIcon, TruckIcon } from '@heroicons/vue/24/outline' 
import { getCustomerById, lockCard, getCardTracking, requestAddressChange, getAddressChangeHistory } from '@/services/callCenterService'
import SuspendCardModal from '@/components/CallCenter/SuspendCardModal.vue'
import AddressChangeModal from '@/components/CallCenter/AddressChangeModal.vue'

const route = useRoute(); const router = useRouter();
const customer = ref(null); const activeTab = ref('virtual');
const currentPage = ref(1); const itemsPerPage = 3;
const trackingMap = ref({}); const changeRequestMap = ref({});
const isSubmitting = ref(false);
const alert = reactive({ show: false, type: 'success', message: '' })

// Modal States
const isSuspendModalOpen = ref(false)
const isAddressModalOpen = ref(false)
const selectedCard = ref(null) 
const selectedAddressCard = ref(null)

const showAlert = (type, message) => {
  alert.type = type; alert.message = message; alert.show = true;
  setTimeout(() => { alert.show = false }, 3000)
}

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
  }
})

const fetchAdditionalCardInfo = async (userId, cards) => {
    try {
        const historyRes = await getAddressChangeHistory(userId)
        const history = historyRes.data || []
        history.forEach(req => {
            if(['PENDING', 'APPROVED'].includes(req.status)) {
                changeRequestMap.value[req.cardId] = req
            }
        })
    } catch (err) { console.error("Failed to load address history", err) }

    const physicalCards = cards.filter(c => !isCardVirtual(c))
    for(const card of physicalCards) {
        try {
            const trackRes = await getCardTracking(card.cardId)
            trackingMap.value[card.cardId] = trackRes.data
        } catch (err) { /* Silent fail */ }
    }
}

// --- Badge Logic ---
const getCardStatusBadge = (card) => {
    const status = card.status?.toLowerCase() || ''
    
    if (status === 'active') {
        return { label: 'เปิดใช้งานบัตรแล้ว', bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' }
    }
    if (status === 'inactive') {
        return { label: 'ยังไม่เปิดใช้งานบัตร', bg: 'bg-white/20', text: 'text-white', dot: 'bg-gray-300' }
    }
    if (status === 'locked') {
        return { label: 'Call Center อายัดบัตร', bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-500' }
    }
    if (status === 'frozen') {
        return { label: 'Mobile ปิดใช้งาน', bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' }
    }
    return { label: status, bg: 'bg-white/20', text: 'text-white', dot: 'bg-gray-300' }
}

// --- Delivery Status Logic ---
const getDeliveryStatusText = (cardId) => {
    const tracking = trackingMap.value[cardId]
    const status = tracking?.delivery_status?.toLowerCase() || 'pending' 
    if (['in_transite', 'in_transit'].includes(status)) return 'กำลังจัดส่ง'
    if (['success', 'delivered'].includes(status)) return 'จัดส่งสำเร็จ'
    return 'กำลังเตรียมการ์ด' 
}

const getDeliveryStatusColor = (cardId) => {
    const text = getDeliveryStatusText(cardId)
    if (text === 'กำลังจัดส่ง') return 'text-blue-600'
    if (text === 'จัดส่งสำเร็จ') return 'text-green-600'
    return 'text-orange-500' 
}

// --- Logic กล่องสถานะและปุ่ม ---
const showAddressRequestBox = (cardId) => {
    return !!changeRequestMap.value[cardId]
}

const isShippingOrSuccess = (cardId) => {
    const tracking = trackingMap.value[cardId]
    const status = tracking?.delivery_status?.toLowerCase() || ''
    return ['in_transite', 'in_transit', 'success', 'delivered'].includes(status)
}

const isRequestApproved = (cardId) => {
    return changeRequestMap.value[cardId]?.status === 'APPROVED'
}

const getPendingAddress = (cardId) => { return changeRequestMap.value[cardId]?.newAddressFull || '-' }

// --- Standard Logic ---
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

// --- Action Logic ---
const openSuspendModal = (card) => { selectedCard.value = card; isSuspendModalOpen.value = true }
const closeSuspendModal = () => { isSuspendModalOpen.value = false; selectedCard.value = null }
const handleSuspendConfirm = async (reason) => {
    if (!selectedCard.value) return
    isSubmitting.value = true
    try {
        await lockCard(selectedCard.value.cardId, reason)
        const card = customer.value.cards.find(c => c.cardId === selectedCard.value.cardId)
        if (card) card.status = 'locked'
        showAlert('success', 'อายัดบัตรเรียบร้อยแล้ว')
        closeSuspendModal()
    } catch (error) { showAlert('error', 'เกิดข้อผิดพลาดในการอายัดบัตร') } finally { isSubmitting.value = false }
}

const openAddressModal = (card) => { selectedAddressCard.value = card; isAddressModalOpen.value = true }
const closeAddressModal = () => { isAddressModalOpen.value = false; selectedAddressCard.value = null; showAlert('error', 'ยกเลิกการทำรายการ') }

const currentCardAddress = computed(() => {
    if (!selectedAddressCard.value) return '';

    const trackInfo = trackingMap.value[selectedAddressCard.value.cardId];
    if (trackInfo) {
        return [
            trackInfo.address,
            trackInfo.district ? `ต.${trackInfo.district}` : '',
            trackInfo.amphoe ? `อ.${trackInfo.amphoe}` : '',
            trackInfo.province ? `จ.${trackInfo.province}` : '',
            trackInfo.zipcode
        ].filter(Boolean).join(' ');
    }

    if (customer.value) {
        const c = customer.value;
        return [
            c.address || c.addressNo,
            c.subDistrict ? `ต.${c.subDistrict}` : '',
            c.district ? `อ.${c.district}` : '',
            c.province ? `จ.${c.province}` : '',
            c.zipcode
        ].filter(Boolean).join(' ');
    }
    return 'ไม่พบข้อมูลที่อยู่';
})

const handleAddressSubmit = async (formData) => {
    if(!selectedAddressCard.value) return
    isSubmitting.value = true
    try {
        const payload = { userId: customer.value.userId, cardId: selectedAddressCard.value.cardId, ...formData }
        await requestAddressChange(payload)
        
        const fullAddress = `${formData.address} ต.${formData.subdistrict} อ.${formData.district} จ.${formData.province} ${formData.zipcode}`
        
        changeRequestMap.value[selectedAddressCard.value.cardId] = {
            cardId: selectedAddressCard.value.cardId,
            status: 'PENDING',
            newAddressFull: fullAddress,
            requester: 'Call Center (You)',
            requestDate: new Date().toISOString()
        }
        showAlert('success', 'ส่งคำร้องเรียบร้อยแล้ว รอผู้จัดการอนุมัติ')
        isAddressModalOpen.value = false
        selectedAddressCard.value = null
    } catch (error) { showAlert('error', 'ส่งคำร้องไม่สำเร็จ') } finally { isSubmitting.value = false }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translate(-50%, -20px); opacity: 0; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>