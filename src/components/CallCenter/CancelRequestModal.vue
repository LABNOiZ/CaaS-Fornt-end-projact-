<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 transform transition-all border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 mt-1">
              <div class="bg-red-100 p-1.5 rounded-full">
                  <NoSymbolIcon class="w-5 h-5 text-red-600" />
              </div>
              ยืนยันยกเลิกคำร้อง
          </h3>
          
          <p class="text-xs text-gray-500 mb-4 ml-1">การยกเลิกจะทำให้สาขาไม่ต้องตรวจสอบรายการนี้ โปรดระบุเหตุผล</p>
          
          <div class="space-y-2.5 mb-4">
              <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                     :class="selectedReason === 'ลูกค้าแจ้งข้อมูลที่อยู่ผิด' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio" v-model="selectedReason" value="ลูกค้าแจ้งข้อมูลที่อยู่ผิด" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                  <span class="text-sm font-medium text-gray-700">ลูกค้าแจ้งข้อมูลที่อยู่ผิด</span>
              </label>

              <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                     :class="selectedReason === 'ลูกค้าเปลี่ยนใจไม่ต้องการแก้ไขแล้ว' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio" v-model="selectedReason" value="ลูกค้าเปลี่ยนใจไม่ต้องการแก้ไขแล้ว" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                  <span class="text-sm font-medium text-gray-700">ลูกค้าเปลี่ยนใจไม่ต้องการแก้ไขแล้ว</span>
              </label>

              <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                     :class="selectedReason === 'สร้างรายการซ้ำ / ข้อมูลซ้ำซ้อน' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio" v-model="selectedReason" value="สร้างรายการซ้ำ / ข้อมูลซ้ำซ้อน" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                  <span class="text-sm font-medium text-gray-700">สร้างรายการซ้ำ / ข้อมูลซ้ำซ้อน</span>
              </label>

              <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                     :class="selectedReason === 'other' ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio" v-model="selectedReason" value="other" class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500">
                  <span class="text-sm font-medium text-gray-700">อื่นๆ (โปรดระบุ)</span>
              </label>
          </div>
          
          <div v-if="selectedReason === 'other'" class="bg-gray-50 p-1 rounded-xl mb-5 border border-gray-200 shadow-inner animate-fade-in-up">
              <textarea 
                  v-model="otherReasonText" 
                  rows="2" 
                  class="w-full bg-transparent border-none p-3 text-sm outline-none focus:ring-0 placeholder-gray-400 resize-none" 
                  placeholder="กรุณาระบุเหตุผลการยกเลิก..."
              ></textarea>
          </div>
          
          <div class="flex gap-3 mt-5">
              <button @click="closeModal" class="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                  ปิดหน้าต่าง
              </button>
              <button @click="confirmModal" 
                      :disabled="isConfirmDisabled" 
                      class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center shadow-lg shadow-red-500/20 active:scale-95">
                  <span v-if="!isLoading">ยืนยันยกเลิก</span>
                  <span v-else class="loading loading-spinner loading-sm"></span>
              </button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { NoSymbolIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
      type: Boolean,
      default: false
  },
  isLoading: {
      type: Boolean,
      default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

// State สำหรับเก็บค่าตัวเลือกและกล่องข้อความ
const selectedReason = ref('')
const otherReasonText = ref('')

// เช็คว่าปุ่มยืนยันควรจะถูก Disabled หรือไม่
const isConfirmDisabled = computed(() => {
    if (props.isLoading) return true;
    if (!selectedReason.value) return true; // ยังไม่เลือกอะไรเลย
    if (selectedReason.value === 'other' && !otherReasonText.value.trim()) return true; // เลือกอื่นๆ แต่ไม่ยอมพิมพ์เหตุผล
    return false;
})

// รีเซ็ตค่าทุกครั้งที่เปิด Modal ขึ้นมาใหม่
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
      selectedReason.value = ''
      otherReasonText.value = ''
  }
})

const closeModal = () => {
  emit('close')
}

const confirmModal = () => {
  if (isConfirmDisabled.value) return
  
  // จัดการข้อมูลที่จะส่งกลับไป (ถ้าเลือกอื่นๆ ให้ส่งข้อความที่พิมพ์, ถ้าเลือกตัวเลือก ให้ส่งตัวเลือกนั้นเลย)
  const finalReason = selectedReason.value === 'other' ? otherReasonText.value.trim() : selectedReason.value
  
  emit('confirm', finalReason)
}
</script>

<style scoped>
/* แอนิเมชันให้กล่องโผล่ขึ้นมาแบบนุ่มนวล */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>