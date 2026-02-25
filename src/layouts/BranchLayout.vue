<template>
  <div class="min-h-screen w-full bg-[#F3F4F6] font-sans text-gray-800">

    <div class="fixed top-0 left-0 right-0 z-50">
      <Navbar title="Branch Manager" />
    </div>

    <aside class="fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-gray-100 z-40 hidden lg:block">
      <BranchSidebar />
    </aside>

    <main class="pt-16 lg:pl-72 min-h-screen w-full transition-all duration-300">
      <div class="p-8">
        <router-view />
      </div>
    </main>

  </div>
</template>

<script setup>
import BranchSidebar from '@/components/branch/branchSideber.vue'
import Navbar from '@/components/Navbar.vue'
</script>