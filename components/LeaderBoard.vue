<script setup lang="ts">
let props = defineProps({
  players: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  columns: {
    type: Object,
    required: true
  }
})
</script>


<template>
  <h1 class="text-2xl font-bold text-yellow-400 px-6 py-6 bg-gray-900">{{ title }}</h1>

  <!-- Scoreboard Container -->
  <div class="bg-black/90 flex-1 flex flex-col overflow-hidden">
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="overflow-y-auto flex-1" style="max-height: 99%;">
        <!-- Table with sticky header -->
        <table class="min-w-full border-collapse">
          <thead class="bg-gray-800 sticky top-0 z-10">
          <tr>
            <th v-for="(label, key) in columns" :key="key" class="px-6 py-3 text-center text-sm font-bold text-yellow-400 uppercase tracking-wider">
              {{ label }}
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
          <tr v-for="(player, index) in players" :key="player.id" class="hover:bg-gray-700/30 transition duration-200">
            <td v-for="(label, key) in columns" :key="key" class="px-6 py-4 text-center text-sm text-gray-300">
              {{ key === 'rank' ? index + 1 : player[key] }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>



<style scoped>

</style>