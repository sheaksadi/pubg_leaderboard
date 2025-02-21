<script setup lang="ts">

</script>

<template>
  <div class="bg-slate-950 text-white h-screen flex flex-col">
    <!-- Navbar -->
    <div class="w-full h-16 bg-black/90 flex items-center justify-between px-6 border-b border-gray-700">
      <!-- Title -->
      <h1 class="text-2xl font-bold text-yellow-400 font-mono tracking-wider">SYCO</h1>
      <!-- Navigation Links -->
      <div class="flex space-x-6">
        <a href="#" class="text-gray-300 hover:text-yellow-400 transition duration-300">Leaderboard</a>
        <a href="#" class="text-gray-300 hover:text-yellow-400 transition duration-300">Seasonal</a>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto flex-1 overflow-auto">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>