<template>
  <div class="flex gap-6 font-sans">
    <SettingsSidebar basePath="/branch" />

    <div class="flex-1">
      <h2 class="text-2xl font-bold mb-6">Settings</h2>
      
      <UserProfileCard />
      
    </div>
  </div>
</template>

<script setup>
import SettingsSidebar from '@/components/SettingsSidebar.vue'
import UserProfileCard from '@/components/settings/UserProfileCard.vue' 
</script>