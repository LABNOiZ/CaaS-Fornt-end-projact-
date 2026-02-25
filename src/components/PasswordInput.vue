<template>
  <div class="relative w-full">
    <input
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-400"
    />
    
    <button
      type="button"
      @click="showPassword = !showPassword"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
      tabindex="-1"
    >
      <EyeSlashIcon v-if="showPassword" class="h-4 w-4" />
      <EyeIcon v-else class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: String
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>