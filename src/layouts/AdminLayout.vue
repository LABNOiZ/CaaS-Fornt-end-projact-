<template>
  <div class="min-h-screen w-full bg-[#F3F4F6] font-sans text-gray-800">
    
    <div class="fixed top-0 left-0 right-0 h-16 z-50">
      <Navbar title="Admin Portal" />
    </div>

    <aside class="fixed left-0 top-16 bottom-0 w-64 z-40 hidden lg:block">
      <AdminSidebar />
    </aside>

    <main class="pt-16 lg:pl-64 min-h-screen w-full transition-all duration-300">
      <div class="h-full w-full p-6 lg:p-8">
        <router-view />
      </div>
    </main>

  </div>
</template>

<script setup>
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>