<template>
  <div class="flex flex-col h-screen bg-[#F3F4F6] font-sans overflow-hidden text-gray-800">
    
    <div class="flex-none z-50">
        <Navbar title="Call Center Portal" />
    </div>

    <div class="flex flex-1 overflow-hidden relative">
      
      <aside class="w-72 flex-none hidden lg:block bg-white border-r border-gray-100">
        <CallCenterSidebar />
      </aside>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F4F6] focus:outline-none">
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