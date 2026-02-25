<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-fade-in-down">
          <div class="p-5 border-b border-gray-200">
              <h3 class="text-xl font-bold text-gray-800">แก้ไขที่อยู่จัดส่งบัตร</h3>
              <p class="text-sm text-gray-500 font-mono mt-1">บัตร : {{ cardLabel }}</p>
          </div>
          
          <div class="p-6 max-h-[70vh] overflow-y-auto">
              <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <p class="text-xs font-bold text-gray-500 mb-1">ที่อยู่เดิม จาก Mobile</p>
                  <p class="text-sm font-bold text-gray-800">{{ currentAddress }}</p>
              </div>

              <h4 class="text-sm font-bold text-gray-700 mb-3">ระบุที่อยู่ใหม่</h4>
              
              <div class="space-y-4">
                  <div>
                      <label class="block text-xs font-bold text-gray-600 mb-1">ที่อยู่ <span class="text-red-500">*</span></label>
                      <input v-model="form.address" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="บ้านเลขที่, หมู่, ถนน">
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-600 mb-1">แขวง/ตำบล <span class="text-red-500">*</span></label>
                          <input v-model="form.subdistrict" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      </div>
                      <div>
                          <label class="block text-xs font-bold text-gray-600 mb-1">เขต/อำเภอ <span class="text-red-500">*</span></label>
                          <input v-model="form.district" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-600 mb-1">จังหวัด <span class="text-red-500">*</span></label>
                          <input v-model="form.province" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      </div>
                      <div>
                          <label class="block text-xs font-bold text-gray-600 mb-1">รหัสไปรษณีย์ <span class="text-red-500">*</span></label>
                          <input v-model="form.zipcode" type="text" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                      </div>
                  </div>
              </div>
          </div>

          <div class="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button @click="handleClose" class="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 shadow-sm transition">ยกเลิก</button>
              <button @click="handleSubmit" :disabled="!isFormValid || isLoading" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition disabled:opacity-50 flex items-center gap-2">
                  {{ isLoading ? 'กำลังส่ง...' : 'ส่งเรื่องให้ผู้จัดการอนุมัติ' }}
              </button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  isLoading: Boolean,
  currentAddress: String,
  cardLabel: String
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  address: '', subdistrict: '', district: '', province: '', zipcode: ''
})

// Reset form เมื่อเปิด Modal
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    Object.keys(form).forEach(key => form[key] = '')
  }
})

const isFormValid = computed(() => {
  return form.address && form.subdistrict && form.district && form.province && form.zipcode
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>