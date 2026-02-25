<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
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
              <option value="ลูกค้าทำบัตรหาย">ลูกค้าทำบัตรหาย</option> 
              <option value="สงสัยทุจริต">สงสัยทุจริต</option>
              <option value="Other">อื่นๆ</option>
          </select>
        </div>

        <div v-if="suspendReason === 'Other'" class="mb-6 animate-fade-in-down">
            <label class="block text-gray-700 font-bold mb-2">ระบุเหตุผลเพิ่มเติม</label>
            <input v-model="otherReason" type="text" class="w-full border border-gray-300 rounded-lg p-2" placeholder="ระบุสาเหตุ...">
        </div>

        <div class="flex gap-4 mt-8">
          <button @click="handleClose" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow">ยกเลิก</button>
          <button @click="handleConfirm" :disabled="!isFormValid || isLoading" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow disabled:opacity-50">
              {{ isLoading ? 'กำลังบันทึก...' : 'ยืนยัน' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean
})

const emit = defineEmits(['close', 'confirm'])

const suspendReason = ref('')
const otherReason = ref('')

// Reset ค่าเมื่อเปิด Modal ใหม่
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    suspendReason.value = ''
    otherReason.value = ''
  }
})

const isFormValid = computed(() => {
  return suspendReason.value && (suspendReason.value !== 'Other' || otherReason.value.trim())
})

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  const finalReason = suspendReason.value === 'Other' ? otherReason.value : suspendReason.value
  emit('confirm', finalReason)
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>