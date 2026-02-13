<template>
  <div v-if="message" class="text-red-500  text-center mb-4 ">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String // รับค่า "message" มาจากหน้าหลัก
})
</script>