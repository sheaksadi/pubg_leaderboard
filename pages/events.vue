<script setup lang="ts">
import LeaderBoard from "~/components/LeaderBoard.vue";
import axios from "axios";
definePageMeta({
  layout: 'home'
})
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