<template>
  <div class="flex gap-6 font-sans h-full w-full overflow-hidden">
    
    <SettingsSidebar basePath="/branch" />

    <div class="flex-1 pt-2">
      <TwoFactorCard />
    </div>

  </div>
</template>

<script setup>
import SettingsSidebar from '@/components/SettingsSidebar.vue'
import TwoFactorCard from '@/components/settings/TwoFactorCard.vue' 
</script>