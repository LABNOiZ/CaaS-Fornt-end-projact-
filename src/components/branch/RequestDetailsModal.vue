<template>
  <div v-if="isOpen" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all border border-gray-100 flex flex-col max-h-[95vh]">
        
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative z-10 flex items-center gap-3">
                <div class="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <DocumentTextIcon class="w-6 h-6 text-white"/>
                </div>
                <div>
                    <h3 class="text-lg font-bold leading-none">รายละเอียดคำร้องขอเปลี่ยนที่อยู่</h3>
                    <p class="text-blue-100 text-xs mt-1">ตรวจสอบข้อมูลและประวัติการทำรายการ</p>
                </div>
            </div>
            <button @click="$emit('close')" class="relative z-10 bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <XMarkIcon class="w-5 h-5 text-white" />
            </button>
        </div>

        <div class="p-6 overflow-y-auto space-y-5 bg-gray-50/30">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                      <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><UserIcon class="w-3 h-3"/> ชื่อลูกค้า (บัตรที่ทำรายการ)</p>
                      <div class="flex items-center gap-2 mt-0.5">
                          <p class="text-sm font-extrabold text-gray-800">{{ details?.name }}</p>
                          <span v-if="details?.cardLastDigits" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-mono font-bold shadow-sm">
                              <CreditCardIcon class="w-3 h-3" />
                              •••• {{ details.cardLastDigits }}
                          </span>
                      </div>
                  </div>
                  
                  <div class="flex justify-between items-end border-t border-gray-100 pt-3">
                      <div>
                          <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><UserCircleIcon class="w-3 h-3"/> ผู้ส่งเรื่อง (Call Center)</p>
                          <p class="text-xs font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded">{{ details?.sender }}</p>
                      </div>
                      <div class="text-right">
                          <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 flex items-center justify-end gap-1"><ClockIcon class="w-3 h-3"/> เวลาส่งเรื่อง</p>
                          <p class="text-xs font-bold text-gray-800">{{ details?.date }} <span class="text-gray-500">{{ details?.time }}</span></p>
                      </div>
                  </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <ChatBubbleBottomCenterTextIcon class="w-20 h-20 text-yellow-500/10 absolute -right-2 -bottom-2" />
                    <p class="text-[10px] text-yellow-700 uppercase font-bold tracking-widest mb-1.5 relative z-10">เหตุผลที่ยกเลิก (Call Center)</p>
                    <div v-if="isLoading" class="animate-pulse h-4 bg-yellow-200/50 rounded w-full mt-1"></div>
                    <p v-else class="text-sm text-yellow-900 font-bold relative z-10 leading-relaxed">{{ details?.reasonToChange }}</p>
                </div>
            </div>

            <div class="space-y-3 pt-2">
                <h4 class="text-sm font-extrabold text-gray-700 border-l-4 border-blue-500 pl-2">ข้อมูลที่อยู่</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                            <div class="bg-gray-200 p-1.5 rounded-lg"><MapPinIcon class="w-4 h-4 text-gray-600" /></div>
                            <h5 class="text-xs font-bold text-gray-600 tracking-wide">ที่อยู่จัดส่งเดิม (CoreCard)</h5>
                        </div>
                        <div v-if="isLoading" class="space-y-2 animate-pulse">
                            <div class="h-3 bg-gray-200 rounded w-full"></div>
                            <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <p v-else class="text-sm text-gray-600 font-medium leading-relaxed">
                            {{ details?.oldAddress }}
                        </p>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 relative shadow-inner">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200/60">
                            <div class="bg-blue-100 p-1.5 rounded-lg"><MapPinIcon class="w-4 h-4 text-blue-600" /></div>
                            <h5 class="text-xs font-bold text-blue-800 tracking-wide">ที่อยู่จัดส่งใหม่ (ที่ขอแก้ไข)</h5>
                        </div>
                        <div v-if="isLoading" class="space-y-2 animate-pulse">
                            <div class="h-3 bg-blue-200 rounded w-full"></div>
                            <div class="h-3 bg-blue-200 rounded w-3/4"></div>
                        </div>
                        <p v-else :class="['CANCEL', 'CANCELED', 'CANCELLED'].includes(details?.status) ? 'line-through text-gray-400' : 'text-blue-900 font-bold'" class="text-sm leading-relaxed">
                            {{ details?.newAddress }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm mt-2">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-gray-500 uppercase">สถานะปัจจุบัน:</span>
                    <span v-if="details?.status === 'APPROVED'" class="text-green-700 bg-green-100 text-xs font-bold px-3 py-1 rounded-md shadow-sm">✓ อนุมัติเรียบร้อย</span>
                    <span v-else-if="details?.status === 'REJECTED'" class="text-red-700 bg-red-100 text-xs font-bold px-3 py-1 rounded-md shadow-sm">✕ ไม่อนุมัติ</span>
                    <span v-else-if="['CANCEL', 'CANCELED', 'CANCELLED'].includes(details?.status)" class="text-gray-700 bg-gray-200 text-xs font-bold px-3 py-1 rounded-md shadow-sm">⊘ รายการถูกยกเลิก</span>
                    <span v-else class="text-blue-700 bg-blue-100 text-xs font-bold px-3 py-1 rounded-md shadow-sm">⏳ รอพิจารณาอนุมัติ</span>
                </div>
                
                <div v-if="details?.status === 'REJECTED' && details?.reason" class="text-right flex-1 ml-4">
                    <p class="text-[10px] text-red-500 uppercase font-bold">เหตุผลที่ปฏิเสธ:</p>
                    <p class="text-xs text-red-700 font-medium truncate">{{ details.reason }}</p>
                </div>
            </div>

        </div>

        <div class="p-5 border-t border-gray-100 bg-white flex justify-end gap-3 items-center">
            <button @click="$emit('close')" class="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors">
              ปิดหน้าต่าง
            </button>
            
            <template v-if="details?.status === 'PENDING' && !isLoading">
              <button @click="openConfirmModal('reject')" class="px-5 py-2.5 rounded-xl text-red-600 font-bold bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm text-sm transition-all flex items-center gap-2 hover:scale-105">
                  <XCircleIcon class="w-5 h-5" /> ไม่อนุมัติ
              </button>
              <button @click="openConfirmModal('approve')" class="px-6 py-2.5 rounded-xl text-white font-bold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 text-sm transition-all flex items-center gap-2 hover:scale-105">
                  <CheckCircleIcon class="w-5 h-5" /> อนุมัติข้อมูลนี้
              </button>
            </template>
        </div>
      </div>
  </div>

  <div v-if="isOpen && confirmType" class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1.5" :class="confirmType === 'approve' ? 'bg-green-500' : 'bg-red-500'"></div>
          
          <template v-if="confirmType === 'approve'">
              <div class="text-center py-4">
                  <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 shadow-inner border-4 bg-green-50 border-green-100 text-green-500">
                     <CheckIcon class="h-8 w-8" stroke-width="3" />
                  </div>
                  <h3 class="text-2xl font-extrabold text-gray-900 mb-2">ยืนยันการอนุมัติ?</h3>
                  <p class="text-sm text-gray-500 mb-6 px-4">คุณตรวจสอบข้อมูลครบถ้วนแล้วใช่หรือไม่ การกระทำนี้จะถูกบันทึกในระบบ</p>
              </div>
          </template>
          
          <template v-else>
              <h3 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 mt-1">
                  <div class="p-1.5 rounded-full bg-red-100 text-red-600">
                      <XMarkIcon class="w-5 h-5" stroke-width="3" />
                  </div>
                  ยืนยันการปฏิเสธคำร้อง
              </h3>
              
              <p class="text-xs text-gray-500 mb-5 ml-1">
                 คุณตรวจสอบข้อมูลแล้วพบว่าไม่ถูกต้อง การปฏิเสธจะทำให้คำร้องถูกส่งกลับไป
              </p>

              <div class="mb-6 text-left">
                 <label class="block text-xs font-bold text-gray-700 mb-2 pl-1">โปรดระบุเหตุผลที่ไม่อนุมัติ <span class="text-red-500">*</span></label>
                 
                 <div class="space-y-2 mb-3">
                      <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                             :class="selectedRejectReason === 'ข้อมูลที่อยู่ไม่ถูกต้อง / ไม่ชัดเจน' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                          <input type="radio" v-model="selectedRejectReason" value="ข้อมูลที่อยู่ไม่ถูกต้อง / ไม่ชัดเจน" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                          <span class="text-sm font-medium text-gray-700">ข้อมูลที่อยู่ไม่ถูกต้อง / ไม่ชัดเจน</span>
                      </label>

                      <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                             :class="selectedRejectReason === 'ไม่พบข้อมูลลูกค้าในระบบ CoreCard' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                          <input type="radio" v-model="selectedRejectReason" value="ไม่พบข้อมูลลูกค้าในระบบ CoreCard" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                          <span class="text-sm font-medium text-gray-700">ไม่พบข้อมูลลูกค้าในระบบ CoreCard</span>
                      </label>

                      <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                             :class="selectedRejectReason === 'other' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                          <input type="radio" v-model="selectedRejectReason" value="other" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                          <span class="text-sm font-medium text-gray-700">อื่นๆ (โปรดระบุ)</span>
                      </label>
                 </div>

                 <div v-if="selectedRejectReason === 'other'" class="bg-gray-50 p-1 rounded-xl border border-gray-200 shadow-inner animate-fade-in-up">
                     <textarea 
                       v-model="rejectReasonInput"
                       class="w-full bg-transparent border-none p-3 text-sm outline-none focus:ring-0 placeholder-gray-400 resize-none"
                       rows="2"
                       placeholder="เช่น เอกสารแนบไม่ครบถ้วน, ติดต่อลูกค้าไม่ได้..."
                     ></textarea>
                 </div>
              </div>
          </template>

          <div class="flex gap-3">
             <button @click="closeConfirmModal" class="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                ยกเลิก
             </button>
             <button 
                @click="submitConfirm"
                class="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all flex justify-center items-center active:scale-95 shadow-md"
                :class="confirmType === 'approve' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'"
                :disabled="isProcessing || isConfirmDisabled"
             >
                <span v-if="!isProcessing">ยืนยัน{{ confirmType === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ' }}</span>
                <span v-else class="loading loading-spinner loading-sm"></span>
             </button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
    DocumentTextIcon, MapPinIcon, UserIcon, ClockIcon, UserCircleIcon, 
    ChatBubbleBottomCenterTextIcon, XMarkIcon, XCircleIcon, CheckCircleIcon,
    CreditCardIcon, CheckIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    isProcessing: { // 🌟 รับสถานะกำลังโหลดตอนกดยืนยันมาจากหน้าหลัก
        type: Boolean,
        default: false
    },
    details: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['close', 'approve', 'reject'])

// State สำหรับหน้าต่างยืนยัน (Confirm Modal)
const confirmType = ref(null) // null, 'approve', 'reject'
const selectedRejectReason = ref('')
const rejectReasonInput = ref('')

// เช็คว่าปุ่มยืนยันพร้อมให้กดหรือยัง
const isConfirmDisabled = computed(() => {
    if (confirmType.value === 'approve') return false;
    if (!selectedRejectReason.value) return true;
    if (selectedRejectReason.value === 'other' && !rejectReasonInput.value.trim()) return true;
    return false;
})

const openConfirmModal = (type) => {
    confirmType.value = type
    selectedRejectReason.value = ''
    rejectReasonInput.value = ''
}

const closeConfirmModal = () => {
    confirmType.value = null
}

const submitConfirm = () => {
    if (isConfirmDisabled.value) return;

    if (confirmType.value === 'approve') {
        emit('approve', props.details.id)
    } else {
        const finalReason = selectedRejectReason.value === 'other' ? rejectReasonInput.value.trim() : selectedRejectReason.value
        emit('reject', { id: props.details.id, reason: finalReason })
    }
}

// ถ้าหน้าต่างถูกสั่งให้ปิด (เช่น กดปิดจากหน้าหลัก) ให้ล้างค่าหน้าต่างยืนยันด้วย
watch(() => props.isOpen, (newVal) => {
    if (!newVal) closeConfirmModal()
})

</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>