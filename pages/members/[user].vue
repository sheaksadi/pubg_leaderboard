<script setup lang="ts">
import Contributions from "~/components/Contributions.vue";

import { useDataStore } from "~/stores/dataStore";
import type { Member, DiscordUser } from "~/types";
const route = useRoute()
let userName = <string>route.params.user;
console.log(route.params.user)

const store = useDataStore();

let users: DiscordUser[] = store.discordUsers;
let user = <DiscordUser>users.find(user => user.username === userName)
let avtar4096 = user.avtar.replace("?size=512", "?size=4096")

let members: Member[] = store.members;
let member = <Member>members.find(mem => mem.discordId === user.id);

console.log(member)
// Contributions data
const durationData = ref([
    { date: '2023-10-01', duration: 120 },
    { date: '2023-10-02', duration: 45 },
    { date: '2023-10-03', duration: 0 },
    { date: '2023-10-04', duration: 90 },
    { date: '2023-10-05', duration: 200 },
    { date: '2023-10-06', duration: 60 },
    { date: '2023-10-07', duration: 300 },
]);

</script>

<template>
    <div class="h-screen w-full bg-slate-800 container mx-auto">
        <div class="w-40 h-40 ">
            <img :src="avtar4096" alt="">

        </div>
        <Contributions :duration-data="durationData" />
    </div>
</template>

<style scoped></style>
