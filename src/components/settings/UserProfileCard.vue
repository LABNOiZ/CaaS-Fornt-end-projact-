<template>
  <div class="bg-white p-8 rounded-lg shadow-sm flex gap-8">
    <div class="flex flex-col items-center">
      <div class="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div class="flex-1 space-y-4">
      <div class="space-y-1 text-gray-700">
        <p><span class="font-bold">Email :</span> {{ profile.email }}</p>
        <p><span class="font-bold">Role :</span> {{ profile.roleName }}</p>
        <p><span class="font-bold">Branch number :</span> {{ profile.branchCode || '-' }}</p>
      </div>
      <hr class="border-gray-200 my-4" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="font-bold text-sm block mb-1">ชื่อ-นามสกุล (ภาษาไทย)</label>
          <input type="text" :value="profile.fullNameTh" disabled class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 cursor-not-allowed">
        </div>
        <div>
          <label class="font-bold text-sm block mb-1">ชื่อ-นามสกุล (ภาษาอังกฤษ)</label>
          <input type="text" :value="profile.fullNameEng" disabled class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 cursor-not-allowed">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/userService' 

const profile = ref({
  email: '-', roleName: '-', branchCode: '-', fullNameTh: '-', fullNameEng: '-'
})

onMounted(async () => {
  try {
    const res = await userService.getProfile()
    const data = res.data
    profile.value = {
      email: data.email || '-',
      roleName: data.roleName || '-',
      branchCode: data.branchCode,
      fullNameTh: data.fullNameTh || '-',
      fullNameEng: data.fullNameEng || '-'
    }
  } catch (error) {
    console.error("Load Profile Error:", error)
  }
})
</script>