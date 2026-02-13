<template>
  <div class="flex flex-col h-screen bg-[#F3F4F6] font-sans overflow-hidden">
    
    <Navbar title="Call Center Portal"  />

    <div class="flex flex-1 overflow-hidden relative">
      
      <CallCenterSidebar />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 focus:outline-none">
        <div class="py-8 px-8">
           <router-view />
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import CallCenterSidebar from '@/components/CallCenter/CallCenterSidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>