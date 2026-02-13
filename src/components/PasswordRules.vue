<template>
  <div class="text-xs space-y-1.5 mt-2 transition-all duration-200 font-medium">
    
    <div class="flex items-center gap-2" :class="validation.minLength ? 'text-green-600' : 'text-black'">
      <component :is="validation.minLength ? CheckCircleIcon : XCircleIcon" class="w-4 h-4 shrink-0" />
      <span>ตั้งรหัสอย่างน้อย 8 ตัว</span>
    </div>

    <div class="flex items-center gap-2" :class="validation.hasUpper ? 'text-green-600' : 'text-black'">
      <component :is="validation.hasUpper ? CheckCircleIcon : XCircleIcon" class="w-4 h-4 shrink-0" />
      <span>มี A-Z อย่างน้อย 1 ตัว (ตัวพิมพ์ใหญ่)</span>
    </div>

    <div class="flex items-center gap-2" :class="validation.hasLower ? 'text-green-600' : 'text-black'">
      <component :is="validation.hasLower ? CheckCircleIcon : XCircleIcon" class="w-4 h-4 shrink-0" />
      <span>มี a-z อย่างน้อย 1 ตัว (ตัวพิมพ์เล็ก)</span>
    </div>

    <div class="flex items-center gap-2" :class="validation.hasNumber ? 'text-green-600' : 'text-black'">
      <component :is="validation.hasNumber ? CheckCircleIcon : XCircleIcon" class="w-4 h-4 shrink-0" />
      <span>มี 0-9 อย่างน้อย 1 ตัว (ตัวเลข)</span>
    </div>

    <div class="flex items-center gap-2" :class="validation.hasSpecial ? 'text-green-600' : 'text-black'">
      <component :is="validation.hasSpecial ? CheckCircleIcon : XCircleIcon" class="w-4 h-4 shrink-0" />
      <span>มีสัญลักษณ์พิเศษอย่างน้อย 1 ตัว (!@#$%)</span>
    </div>

  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  password: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['check-valid'])

const validation = computed(() => {
  const p = props.password
  return {
    minLength: p.length >= 8,
    hasUpper: /[A-Z]/.test(p),
    hasLower: /[a-z]/.test(p),
    hasNumber: /[0-9]/.test(p),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(p)
  }
})

const isAllValid = computed(() => {
  return (
    validation.value.minLength &&
    validation.value.hasUpper &&
    validation.value.hasLower &&
    validation.value.hasNumber &&
    validation.value.hasSpecial
  )
})

watch(isAllValid, (newValue) => {
  emit('check-valid', newValue)
}, { immediate: true }) 
</script>