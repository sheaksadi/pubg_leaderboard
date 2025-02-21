<script setup lang="ts">
import LeaderBoard from "~/components/LeaderBoard.vue";
import axios from "axios";

let players = ref([]);

onMounted(async () => {
  const { data } = await axios.get("http://localhost:3100/scrims");
  players.value = data;
})

let columns = {
  rank: "Rank",
  name: "Player",
  kills: "Kills",
  assists: "Assists",
  damage: "Damage",
  points: "Points"
}

</script>
<template>
  <div class="p-0 h-full flex flex-col">
    <!-- Inner Navbar (Fixed) -->
    <div class="w-full h-14 bg-black/90 flex items-center justify-between px-6 border-b border-gray-700">
      <div class="flex space-x-8">
        <a href="#" class="text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">FPP</a>
        <a href="#" class="text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">TPP</a>
        <a href="#" class="text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">Ranked</a>
      </div>
      <div class="flex space-x-8">
        <a href="#" class="text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">Squad</a>
        <a href="#" class="text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">Duo</a>
        <a href="#" class="text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105 transition-all duration-300 font-bold text-lg uppercase py-2 px-4">Solo</a>
      </div>
    </div>

    <LeaderBoard title="Scrim Leaderboard" :players="players" :columns="columns" />

  </div>
</template>


<style >
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}
</style>