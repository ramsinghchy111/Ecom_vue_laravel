<template>
  <!-- make container horizontal and full viewport height -->
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-[200px] bg-blue-600 mt-16 text-white p-4">
        <Sidebar />
    </aside>

    <!-- Content column grows to fill remaining space -->
    <div class="flex-1 flex flex-col">
      <header class="h-16 shadow bg-white flex items-center px-4">
        <Header />
      </header>

      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
</script>

