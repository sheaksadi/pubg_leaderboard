<script setup lang="ts">
import LeaderBoard from "~/components/LeaderBoard.vue";
import axios from "axios";

let gameData = ref([]);
let selectedTab = ref("fpp");
let ranked = ref(false);
let mode = ref("squad");
let sortKey = ref("kills");
let sortDirection = ref("desc");

// Watch ranked changes and reset mode to squad if ranked is true
watch(ranked, (newValue) => {
  if (newValue === true) {
    mode.value = "squad";
  }
  fetchData();
});

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  const endpoint = ranked.value ? "http://localhost:3100/seasonalRanked" : "http://localhost:3100/seasonal";
  const { data } = await axios.get(endpoint);
  console.log(data);
  gameData.value = data;
}

let players = computed(() => {
  const modeTabKey = mode.value + "_" + selectedTab.value;
  const playerList = gameData.value[modeTabKey] || [];

  // Return a sorted copy of the player list
  return [...playerList].sort((a, b) => {
    // Special case for username: sort alphabetically
    if (sortKey.value === 'username') {
      return sortDirection.value === 'asc'
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
    }

    // For all other numeric fields
    const aValue = a[sortKey.value] || 0;
    const bValue = b[sortKey.value] || 0;
    return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue;
  });
});

let columns = {
  rank: "Rank",
  username: "Player",
  kills: "Kills",
  assists: "Assists",
  damageDealt: "Damage",
  revives: "Revives"
};

const handleSort = (key) => {
  // Don't allow sorting by rank since it's sequential
  if (key === 'rank') return;

  // If clicking the same header, toggle direction
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // If clicking a new header, set as sort key and reset to default direction
    sortKey.value = key;
    // Default to descending for all stats (highest first)
    sortDirection.value = 'desc';
  }
};

</script>
<template>
  <div class="p-0 h-full flex flex-col">
    <!-- Inner Navbar (Fixed) -->
    <div class="w-full h-14 bg-black/90 flex items-center justify-between px-6 border-b border-gray-700">
      <div class="flex space-x-8">
        <a @click="selectedTab = 'fpp'"
           :class="[
             'transition-all duration-300 font-bold text-lg uppercase py-2 px-4',
             selectedTab === 'fpp'
               ? 'text-yellow-400 bg-gray-700/50 scale-105'
               : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105'
           ]">FPP</a>
        <a @click="selectedTab = 'tpp'"
           :class="[
             'transition-all duration-300 font-bold text-lg uppercase py-2 px-4',
             selectedTab === 'tpp'
               ? 'text-yellow-400 bg-gray-700/50 scale-105'
               : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105'
           ]">TPP</a>
        <a @click="ranked = !ranked"
           :class="[
             'transition-all duration-300 font-bold text-lg uppercase py-2 px-4',
             ranked
               ? 'text-yellow-400 bg-gray-700/50 scale-105'
               : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105'
           ]">Ranked</a>
      </div>
      <div class="flex space-x-8" v-if="!ranked">
        <a @click="mode = 'squad'"
           :class="[
             'transition-all duration-300 font-bold text-lg uppercase py-2 px-4',
             mode === 'squad'
               ? 'text-yellow-400 bg-gray-700/50 scale-105'
               : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105'
           ]">Squad</a>
        <a @click="mode = 'duo'"
           :class="[
             'transition-all duration-300 font-bold text-lg uppercase py-2 px-4',
             mode === 'duo'
               ? 'text-yellow-400 bg-gray-700/50 scale-105'
               : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105'
           ]">Duo</a>
        <a @click="mode = 'solo'"
           :class="[
             'transition-all duration-300 font-bold text-lg uppercase py-2 px-4',
             mode === 'solo'
               ? 'text-yellow-400 bg-gray-700/50 scale-105'
               : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105'
           ]">Solo</a>
      </div>
      <div class="flex space-x-8" v-else>
        <span class="text-yellow-400 bg-gray-700/50 scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">Squad</span>
      </div>
    </div>

    <!-- Fixed Table Header -->
    <div class="w-full bg-gray-800 sticky top-0 z-10 border-b border-gray-700">
      <table class="w-full table-auto">
        <thead>
        <tr class="text-gray-200 uppercase text-sm">
          <th class="px-6 py-3 text-left font-bold">{{ columns.rank }}</th>
          <th v-for="(label, key) in Object.fromEntries(
                  Object.entries(columns).filter(([k]) => k !== 'rank')
                )"
              :key="key"
              @click="handleSort(key)"
              class="px-6 py-3 text-left font-bold cursor-pointer hover:bg-gray-700 transition-colors duration-200">
            <div class="flex items-center space-x-1">
              <span>{{ label }}</span>
              <span v-if="sortKey === key" class="text-yellow-400">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
            </div>
          </th>
        </tr>
        </thead>
      </table>
    </div>

    <!-- Scrollable Table Body -->
    <div class="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-black">
      <table class="w-full table-auto">
        <tbody class="divide-y divide-gray-700">
        <tr v-for="(player, index) in players" :key="index"
            class="hover:bg-gray-800/50 transition-colors duration-200">
          <td class="px-6 py-4 text-gray-300 w-20">{{ index + 1 }}</td>
          <td class="px-6 py-4">
            <span class="font-semibold text-yellow-400">{{ player.username }}</span>
          </td>
          <td class="px-6 py-4 text-gray-300">{{ player.kills }}</td>
          <td class="px-6 py-4 text-gray-300">{{ player.assists }}</td>
          <td class="px-6 py-4 text-gray-300">{{ player.damageDealt }}</td>
          <td class="px-6 py-4 text-gray-300">{{ player.revives }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>