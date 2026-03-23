<template>    
    <div class="fixed top-20 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="alert.show" class="pointer-events-auto min-w-[350px]">
          <div :class="['p-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md', alert.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800' : 'bg-red-50/90 border-red-200 text-red-800']">
             <span v-if="alert.type === 'success'" class="bg-green-500 text-white p-1 rounded-full shadow-sm"><CheckIcon class="h-4 w-4" /></span>
             <span v-else class="bg-red-500 text-white p-1 rounded-full shadow-sm"><XMarkIcon class="h-4 w-4" /></span>
             <span class="font-bold text-sm tracking-wide">{{ alert.message }}</span>
          </div>
        </div>
      </transition>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 items-start pb-10">
      
      <div class="w-full lg:w-1/4 flex flex-col gap-6">
        <div class="flex items-center gap-3 h-[50px]"> 
          <button @click="goBack" class="bg-white border border-gray-200 text-gray-700 p-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm flex-shrink-0">
            <ArrowLeftIcon class="w-4 h-4" />
          </button>
          <div class="flex flex-wrap items-center gap-2 text-gray-500">
            <h1 class="text-sm font-bold text-gray-400 cursor-pointer hover:text-blue-600 transition" @click="goBack">ค้นหา</h1>
            <span class="text-sm text-gray-300">/</span>
            <span class="text-blue-600 font-bold text-lg tracking-tight">รายละเอียด</span>
          </div>
        </div>

        <div v-if="customer" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <h2 class="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">👤</span>
            ข้อมูลส่วนตัว
          </h2>
          <div class="space-y-4">
            <div><p class="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">ชื่อ-นามสกุล ไทย</p><p class="text-sm font-bold text-gray-800 leading-tight">{{ customer.fullNameTh }}</p></div>
            <div><p class="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">ชื่อ-นามสกุล อังกฤษ</p><p class="text-sm font-bold text-gray-800 leading-tight uppercase">{{ customer.fullNameEn }}</p></div>
            <div><p class="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">อีเมล</p><p class="text-sm font-bold text-gray-800 break-words leading-tight">{{ customer.email }}</p></div>
            <div><p class="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">เบอร์โทรศัพท์</p><p class="text-sm font-bold text-gray-800">{{ customer.mobileNumber }}</p></div>
            <div><p class="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">เลขบัตรประชาชน</p><p class="text-sm font-bold text-gray-800">{{ customer.citizenId }}</p></div>
          </div>
        </div>
        
        <div v-else class="p-10 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
          <div class="loading loading-spinner loading-md mb-2 text-blue-500"></div>
          <p class="text-sm font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>

      <div class="w-full lg:w-3/4 flex flex-col gap-6">
        
        <div class="flex bg-white p-1.5 rounded-xl shadow-sm w-fit border border-gray-100 items-center">
          <button @click="changeTab('virtual')" :class="activeTab === 'virtual' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'" class="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200">Virtual Card</button>
          <button @click="changeTab('physical')" :class="activeTab === 'physical' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'" class="px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200">Physical Card</button>
        </div>

        <div v-if="customer">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start min-h-[580px] content-start">
            
            <div v-for="card in paginatedCards" :key="card.cardId" 
                 class="bg-white rounded-3xl shadow-sm border transition-all duration-300 hover:shadow-md flex flex-col transform hover:-translate-y-1" 
                 :class="showAddressRequestBox(card.cardId) ? 'border-blue-400 ring-2 ring-blue-400/20' : 'border-gray-200'">
              
              <div class="relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden rounded-t-3xl aspect-[1.586/1] bg-gradient-to-br from-slate-700 to-slate-900 shadow-inner">
                  <div v-if="card.cardImage || card.card_image" 
                       class="absolute inset-0 z-0 bg-cover bg-center " 
                       :style="{ backgroundImage: `url(data:image/png;base64,${card.cardImage || card.card_image})` }" >
                  </div>
                  <div class="relative z-10 flex justify-end items-start">
                     <span class="text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm backdrop-blur-md border border-white/20"
                           :class="getCardStatusBadge(card).bg + ' ' + getCardStatusBadge(card).text">
                        {{ getCardStatusBadge(card).label }}
                        <span class="w-1.5 h-1.5 rounded-full shadow-sm animate-pulse" :class="getCardStatusBadge(card).dot"></span>
                     </span>
                  </div>

                  <div class="relative z-10 mt-auto pt-4">
                    <div class="flex justify-between items-end mb-1">
                      <p class="text-white/90 text-[10px] font-medium drop-shadow-sm">เลขบัตร</p>
                      <button @click="toggleCardNumber(card)" 
                              class="text-white/70 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center min-w-[28px] min-h-[28px]"
                              title="แสดง/ซ่อนเลขบัตร"
                              :disabled="isLoadingSensitive[card.cardId]">
                        <span v-if="isLoadingSensitive[card.cardId]" class="loading loading-spinner loading-xs text-white"></span>
                        <template v-else>
                            <EyeIcon v-if="!revealedCards[card.cardId]" class="w-4 h-4" />
                            <EyeSlashIcon v-else class="w-4 h-4" />
                        </template>
                      </button>
                    </div>
                    <p class="text-xl sm:text-2xl font-extrabold text-white tracking-[0.15em] sm:tracking-[0.2em] font-mono drop-shadow-md transition-all duration-300">
                     {{ formatCardNumber(revealedCards[card.cardId] ? card.fullCardNumber : (card.cardNumber || card.card_number || card.cardNo), revealedCards[card.cardId]) }}
                    </p>
                  </div>
                  
                  <div class="relative z-10 mt-4 flex justify-between items-end">
                     <div>
                        <p class="text-white/90 text-[9px] mb-0.5 font-medium drop-shadow-sm">ชื่อบนบัตร</p>
                        <p class="text-white font-bold text-sm uppercase tracking-widest drop-shadow-md">{{ card.holderName }}</p>
                     </div>
                     <div class="flex gap-4 pr-2">
                        <div v-if="revealedCards[card.cardId] && card.cvv" class="text-right">
                           <p class="text-white/90 text-[9px] mb-0.5 font-medium drop-shadow-sm">CVV</p>
                           <p class="text-white font-bold text-sm tracking-widest drop-shadow-md font-mono">{{ card.cvv }}</p>
                        </div>
                        <div class="text-right">
                           <p class="text-white/90 text-[9px] mb-0.5 font-medium drop-shadow-sm">EXP</p>
                           <p class="text-white font-bold text-sm tracking-widest drop-shadow-md font-mono">
                               {{ formatDate(revealedCards[card.cardId] ? card.fullExpiry : card.expiry) }}
                           </p>
                        </div>
                     </div>
                  </div>
              </div>

              <div class="p-5 bg-gray-50/80 flex flex-col gap-4 rounded-b-3xl border-t border-gray-100">
                
                <div v-if="!isCardVirtual(card) && card.status === 'inactive'" class="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                    <div class="bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <TruckIcon class="w-4 h-4 text-blue-600"/>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">สถานะการจัดส่งบัตร</span>
                        <span class="text-xs font-extrabold" :class="getDeliveryStatusColor(card.cardId)">
                            {{ getDeliveryStatusText(card.cardId) }}
                        </span>
                    </div>
                </div>

                <div v-if="card.status === 'active' && !isCardVirtual(card)" class="flex justify-end items-center mt-auto">
                    <button @click="openSuspendModal(card)" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all duration-200">
                        <NoSymbolIcon class="w-4 h-4" /> อายัดบัตรชั่วคราว
                    </button>
                </div>

                <div v-if="card.status === 'inactive' && !isCardVirtual(card)" class="mt-auto">
                    
                    <div v-if="showAddressRequestBox(card.cardId)" 
                         class="bg-white rounded-xl p-4 border shadow-sm mb-4 relative overflow-hidden"
                         :class="getRequestStatusData(card.cardId).borderClass">
                        
                        <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getRequestStatusData(card.cardId).bgClass"></div>

                        <div class="flex justify-between items-start mb-2 pl-4">
                            <span class="font-bold text-xs flex items-center gap-1.5" :class="getRequestStatusData(card.cardId).colorClass">
                                <span class="relative flex h-2 w-2">
                                  <span v-if="getRequestStatusData(card.cardId).isPing" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="getRequestStatusData(card.cardId).bgClass"></span>
                                  <span class="relative inline-flex rounded-full h-2 w-2" :class="getRequestStatusData(card.cardId).bgClass"></span>
                                </span>
                                {{ getRequestStatusData(card.cardId).text }}
                            </span>
                            
                            <button v-if="changeRequestMap[card.cardId]?.status === 'PENDING'"
                                    @click="openCancelModal(changeRequestMap[card.cardId].requestId, card.cardId)"
                                    class="text-[10px] text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 px-2 py-1 rounded-md font-bold transition-colors flex items-center gap-1 shadow-sm">
                                <NoSymbolIcon class="w-3 h-3" /> ยกเลิกคำร้อง
                            </button>
                        </div>

                        <div v-if="changeRequestMap[card.cardId]?.status === 'REJECTED'" class="text-[11px] text-red-700 bg-red-50/50 p-2 rounded-lg border border-red-100 ml-4 mb-2 flex flex-col gap-0.5">
                            <span class="font-bold uppercase tracking-wider">เหตุผลที่ไม่อนุมัติ:</span>
                            <span>{{ getRequestStatusData(card.cardId).reason }}</span>
                        </div>

                        <div class="text-xs text-gray-700 break-words pl-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                             <span class="font-bold text-gray-800 block mb-0.5">ที่อยู่จัดส่งใหม่:</span> {{ getPendingAddress(card.cardId) }}
                        </div>
                        <div class="text-[10px] text-gray-400 mt-2 pl-4 flex items-center gap-1 font-medium">
                            <span>ส่งโดย: {{ changeRequestMap[card.cardId].requester || 'Call Center' }}</span>
                            <span class="mx-1">•</span>
                            <span>{{ formatFullDate(changeRequestMap[card.cardId].requestDate) }}</span>
                        </div>
                    </div>

                    <button v-if="!isShippingOrSuccess(card.cardId) && changeRequestMap[card.cardId]?.status !== 'PENDING'"
                            @click="openAddressModal(card)" 
                            class="w-full bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-bold py-3 rounded-xl transition-all duration-200 text-xs flex justify-center items-center gap-2 group">
                        <TruckIcon class="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        {{ 
                           changeRequestMap[card.cardId]?.status === 'REJECTED' ? 'แก้ไขข้อมูล / ส่งเรื่องใหม่' : 
                           changeRequestMap[card.cardId]?.status === 'APPROVED' ? 'แจ้งเปลี่ยนที่อยู่อีกครั้ง' : 
                           'แจ้งเปลี่ยนที่อยู่จัดส่งบัตรใหม่' 
                        }}
                    </button>
                </div>

                <div v-if="['locked', 'frozen'].includes(card.status)" class="text-center mt-auto">
                    <span class="text-red-600 font-bold text-xs bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center justify-center gap-2">
                        <NoSymbolIcon class="w-4 h-4" /> บัตรถูกระงับการใช้งาน
                    </span>
                </div>

              </div>
            </div>
          </div>
          
          <div v-if="paginatedCards.length === 0" class="text-center py-16 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-200 mt-6">
              <span class="text-4xl block mb-3 opacity-50">💳</span>
              <span class="font-bold text-gray-500">ไม่พบข้อมูลบัตรในประเภทนี้</span>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200">
             <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center gap-1.5 text-sm font-bold transition-all px-3 py-1.5 rounded-lg" :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"><ArrowLeftIcon class="w-4 h-4" /> Prev</button>
             <div class="flex gap-1.5">
                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm" :class="currentPage === page ? 'bg-blue-600 text-white shadow-blue-200 ring-2 ring-blue-600 ring-offset-1' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'">{{ page }}</button>
             </div>
             <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center gap-1.5 text-sm font-bold transition-all px-3 py-1.5 rounded-lg" :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'">Next <ArrowRightIcon class="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>

    <SuspendCardModal :isOpen="isSuspendModalOpen" :isLoading="isSubmitting" @close="closeSuspendModal" @confirm="handleSuspendConfirm" />
    <AddressChangeModal :isOpen="isAddressModalOpen" :isLoading="isSubmitting" :currentAddress="currentCardAddress" :cardLabel="selectedAddressCard ? `Mastercard ${formatCardNumber(selectedAddressCard.cardNumber || selectedAddressCard.card_number, false)}` : ''" @close="closeAddressModal" @submit="handleAddressSubmit" />
    <CancelRequestModal :isOpen="isCancelModalOpen" :isLoading="isSubmitting" @close="closeCancelModal" @confirm="confirmCancelRequest" />

</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
    ArrowLeftIcon, ArrowRightIcon, NoSymbolIcon, TruckIcon, 
    EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon 
} from '@heroicons/vue/24/outline' 

import { 
    getCustomerById, lockCard, getCardTracking, requestAddressChange, 
    getAddressChangeHistory, getCardSensitive, cancelAddressChange 
} from '@/services/callCenterService'

import SuspendCardModal from '@/components/CallCenter/SuspendCardModal.vue'
import AddressChangeModal from '@/components/CallCenter/AddressChangeModal.vue'
import CancelRequestModal from '@/components/CallCenter/CancelRequestModal.vue'

const route = useRoute(); const router = useRouter();
const customer = ref(null); const activeTab = ref('virtual');
const currentPage = ref(1); const itemsPerPage = 2; 
const trackingMap = ref({}); const changeRequestMap = ref({});
const isSubmitting = ref(false);
const alert = reactive({ show: false, type: 'success', message: '' })

const revealedCards = ref({}); const isLoadingSensitive = ref({});

const toggleCardNumber = async (card) => {
    const cid = card.cardId
    if (revealedCards.value[cid]) { revealedCards.value[cid] = false; return }
    try {
        isLoadingSensitive.value[cid] = true
        const res = await getCardSensitive(cid)
        card.fullCardNumber = res.data.cardNumber
        card.fullExpiry = res.data.expiry
        revealedCards.value[cid] = true
    } catch (error) {
        showAlert('error', 'ไม่สามารถดึงข้อมูลบัตรเต็มได้')
    } finally { isLoadingSensitive.value[cid] = false }
}

const isSuspendModalOpen = ref(false); const isAddressModalOpen = ref(false);
const selectedCard = ref(null); const selectedAddressCard = ref(null);
const isCancelModalOpen = ref(false);
const activeCancelRequestId = ref(null); const activeCancelCardId = ref(null);

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
  } catch (error) { showAlert('error', 'ไม่สามารถดึงข้อมูลลูกค้าได้') }
})

const fetchAdditionalCardInfo = async (userId, cards) => {
    try {
        const historyRes = await getAddressChangeHistory(userId)
        let history = historyRes.data || []
        
        // เรียงลำดับจาก "ใหม่ไปเก่า" เพื่อให้ Loop ด้านล่างเลือกตัวล่าสุดเสมอ
        history.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

        // ล้างข้อมูลเก่าก่อน
        changeRequestMap.value = {}; 

        history.forEach(req => {
            // ถ้าบัตรใบนี้ยังไม่มีข้อมูลใน Map (แปลว่ารายการแรกที่เจอคืออันล่าสุด) ให้เก็บค่าไว้
            if(!changeRequestMap.value[req.cardId]) {
                if(['PENDING', 'APPROVED', 'REJECTED'].includes(req.status)) {
                    changeRequestMap.value[req.cardId] = {
                        ...req,
                        newAddressFull: `${req.address || ''} ต.${req.subdistrict || ''} อ.${req.district || ''} จ.${req.province || ''} ${req.zipcode || ''}`.trim(),
                        requester: req.createdBy || 'Call Center',
                        requestDate: req.createAt || new Date().toISOString() 
                    }
                }
            }
        });
    } catch (err) { console.error("History Error", err) }

    const physicalCards = cards.filter(c => !isCardVirtual(c))
    for(const card of physicalCards) {
        try {
            const trackRes = await getCardTracking(card.cardId)
            trackingMap.value[card.cardId] = trackRes.data
        } catch (err) {}
    }
}

const getRequestStatusData = (cardId) => {
    const req = changeRequestMap.value[cardId];
    if (!req) return {};
    switch (req.status) {
        case 'APPROVED':
            return {
                text: 'ผู้จัดการสาขาอนุมัติแล้ว',
                colorClass: 'text-green-600', bgClass: 'bg-green-500', borderClass: 'border-green-200 bg-green-50/30',
                isPing: false
            };
        case 'REJECTED':
            return {
                text: 'ผู้จัดการสาขาไม่อนุมัติ',
                colorClass: 'text-red-600', bgClass: 'bg-red-500', borderClass: 'border-red-200 ring-1 ring-red-100 bg-red-50/30',
                isPing: false,
                reason: req.branchReason || req.rejectReason || 'กรุณาตรวจสอบข้อมูลหรือติดต่อสาขา'
            };
        case 'PENDING':
        default:
            return {
                text: 'รอผู้จัดการสาขาอนุมัติ...',
                colorClass: 'text-orange-600', bgClass: 'bg-orange-500', borderClass: 'border-gray-200',
                isPing: true
            };
    }
}

const getCardStatusBadge = (card) => {
    const status = card.status?.toLowerCase() || ''
    if (status === 'active') return { label: 'เปิดใช้งานบัตรแล้ว', bg: 'bg-green-500/20 border-green-400/30', text: 'text-green-300', dot: 'bg-green-400' }
    if (status === 'inactive') return { label: 'ยังไม่เปิดใช้งานบัตร', bg: 'bg-white/20 border-white/30', text: 'text-white', dot: 'bg-gray-200' }
    if (status === 'locked') return { label: 'Call Center อายัดบัตร', bg: 'bg-red-500/20 border-red-400/30', text: 'text-red-300', dot: 'bg-red-500' }
    if (status === 'frozen') return { label: 'Mobile ปิดใช้งาน', bg: 'bg-orange-500/20 border-orange-400/30', text: 'text-orange-300', dot: 'bg-orange-400' }
    return { label: status, bg: 'bg-white/20 border-white/30', text: 'text-white', dot: 'bg-gray-200' }
}

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

const showAddressRequestBox = (cardId) => { return !!changeRequestMap.value[cardId] }
const isShippingOrSuccess = (cardId) => {
    const tracking = trackingMap.value[cardId]
    const status = tracking?.delivery_status?.toLowerCase() || ''
    return ['in_transite', 'in_transit', 'success', 'delivered'].includes(status)
}

const getPendingAddress = (cardId) => { return changeRequestMap.value[cardId]?.newAddressFull || '-' }

const formatDate = (dateString) => {
  if (!dateString || dateString.includes('*')) return '**/**' 
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString; 
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`
}

const formatFullDate = (dateString) => {
  if (!dateString) return '-'
  const parsedDate = new Date(dateString.replace(' ', 'T')); 
  if (isNaN(parsedDate.getTime())) return dateString;
  return `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}`
}

const formatCardNumber = (cardNumber, isRevealed = false) => {
  if (!cardNumber) return ''
  if (!isRevealed && cardNumber.includes('*')) return cardNumber
  const cleanNumber = cardNumber.replace(/[\s*]/g, '')
  return isRevealed ? cleanNumber.replace(/(.{4})/g, '$1 ').trim() : `•••• •••• •••• ${cleanNumber.slice(-4)}`
}

const isCardVirtual = (card) => String(card.isVirtual).toLowerCase() === 'true' || card.isVirtual === true || card.isVirtual === 1;
const goBack = () => router.go(-1);
const changeTab = (tabName) => { activeTab.value = tabName; currentPage.value = 1 };
const allCardsInTab = computed(() => {
  if (!customer.value || !customer.value.cards) return []
  return customer.value.cards.filter(card => activeTab.value === 'virtual' ? isCardVirtual(card) : !isCardVirtual(card))
})
const paginatedCards = computed(() => allCardsInTab.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage))
const totalPages = computed(() => Math.ceil(allCardsInTab.value.length / itemsPerPage))
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goToPage = (page) => { currentPage.value = page }

const openSuspendModal = (card) => { selectedCard.value = card; isSuspendModalOpen.value = true }
const closeSuspendModal = () => { isSuspendModalOpen.value = false; selectedCard.value = null }
const handleSuspendConfirm = async (reason) => {
    if (!selectedCard.value) return
    isSubmitting.value = true
    try {
        await lockCard(selectedCard.value.cardId, reason)
        const card = customer.value.cards.find(c => c.cardId === selectedCard.value.cardId)
        if (card) card.status = 'locked'
        showAlert('success', 'อายัดบัตรเรียบร้อยแล้ว'); closeSuspendModal()
    } catch (error) { showAlert('error', 'เกิดข้อผิดพลาด') } finally { isSubmitting.value = false }
}

const openAddressModal = (card) => { selectedAddressCard.value = card; isAddressModalOpen.value = true }
const closeAddressModal = () => { isAddressModalOpen.value = false; selectedAddressCard.value = null }

const currentCardAddress = computed(() => {
    if (!selectedAddressCard.value) return '';
    const trackInfo = trackingMap.value[selectedAddressCard.value.cardId];
    const c = customer.value;
    const data = trackInfo || c;
    return [ data.address || data.addressNo, data.subdistrict || data.district || data.subDistrict, data.district || data.amphoe, data.province, data.zipcode].filter(Boolean).join(' ');
})

// เมื่อส่งที่อยู่ใหม่สำเร็จ ให้ล้างค่าเก่าทิ้ง และโหลดใหม่ทันที
const handleAddressSubmit = async (formData) => {
    if(!selectedAddressCard.value) return
    isSubmitting.value = true
    const cardId = selectedAddressCard.value.cardId;

    try {
        const payload = { userId: customer.value.userId, cardId: cardId, ...formData }
        await requestAddressChange(payload) 
        
        // 1. ล้างสถานะเก่าออกทันทีจากหน้าจอ (Force Clear)
        delete changeRequestMap.value[cardId];

        // 2. โหลดข้อมูลประวัติล่าสุดจาก API เพื่ออัปเดต UI เป็น PENDING
        await fetchAdditionalCardInfo(customer.value.userId, customer.value.cards)
        
        showAlert('success', 'ส่งเรื่องขอแก้ไขที่อยู่ใหม่เรียบร้อยแล้ว'); 
        isAddressModalOpen.value = false;
        selectedAddressCard.value = null;
    } catch (error) { 
        showAlert('error', 'ส่งคำร้องไม่สำเร็จ'); 
    } finally { 
        isSubmitting.value = false; 
    }
}

const openCancelModal = (requestId, cardId) => {
    if (!requestId) return showAlert('error', 'ไม่พบรหัสคำร้อง');
    activeCancelRequestId.value = requestId; activeCancelCardId.value = cardId; isCancelModalOpen.value = true
}
const closeCancelModal = () => { isCancelModalOpen.value = false; activeCancelRequestId.value = null }
const confirmCancelRequest = async (reason) => {
    if (!activeCancelRequestId.value) return;
    isSubmitting.value = true
    try {
        await cancelAddressChange(activeCancelRequestId.value, reason);
        delete changeRequestMap.value[activeCancelCardId.value];
        showAlert('success', 'ยกเลิกคำร้องเรียบร้อยแล้ว'); closeCancelModal()
    } catch (error) { showAlert('error', 'ยกเลิกไม่สำเร็จ') } finally { isSubmitting.value = false }
}
</script>