<template>
  <div class="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
    <ul class="space-y-2">
      
      <li>
        <router-link 
          :to="`${basePath}/settings/profile`" 
          active-class="bg-blue-100 text-blue-600 font-bold"
          class="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Profile
        </router-link>
      </li>

      <li>
        <router-link 
          :to="`${basePath}/settings/password`" 
          active-class="bg-blue-100 text-blue-600 font-bold"
          class="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Password
        </router-link>
      </li>

      <li>
        <router-link 
          :to="`${basePath}/settings/2fa`" 
          active-class="bg-blue-100 text-blue-600 font-bold"
          class="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          2FA
        </router-link>
      </li>

    </ul>
  </div>
</template>

<script setup>
// รับค่า basePath มาจากหน้าแม่
const props = defineProps({
  basePath: {
    type: String,
    required: true, // บังคับว่าต้องส่งมานะ ไม่งั้น Error
  }
})
</script>