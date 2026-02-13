<template>
  <div class="flex gap-6 font-sans h-full w-full overflow-hidden">
    
    <SettingsSidebar basePath="/admin" />

    <div class="flex-1 pt-2">
      <ChangePasswordCard />
    </div>

  </div>
</template>

<script setup>
import SettingsSidebar from '@/components/SettingsSidebar.vue'
import ChangePasswordCard from '@/components/settings/ChangePasswordCard.vue' 
</script>