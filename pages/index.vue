<script setup lang="ts">
import ShuffleText from "~/components/Shuffle-text.vue";


</script>

<template>
  <div class="h-full w-full flex items-center justify-center">
    <Particles />

    <div class="w-[80rem] h-[36rem]  flex ">
      <div class="w-full h-full  flex justify-center flex-col ">
        <ShuffleText text="SYCO" />
        <h2 class="text-green-400 text-xl">Join Syco, Bangladesh's largest gaming community on Discord! <br> Syco is your ultimate hub for gaming, tournaments, and making new friends</h2>
      </div>
      <div class="w-full h-full p-2 flex items-center justify-center">
        <div class="bg-[#36393f] w-[26rem] h-full rounded-2xl flex items-center flex-col pt-20">
          <!-- Server Icon -->
          <div class="w-[10rem] h-[10rem] bg-black rounded-full flex items-center justify-center">
            <img src="https://cdn.discordapp.com/attachments/1328843479303979058/1345457708161302579/SYCO_eSports.png?ex=67c49ea3&is=67c34d23&hm=b457d181f2b8b80622a128ab581127f694da207a47661ac590ba583e3a87b91d&">
          </div>

          <!-- Server Name -->
          <h2 class="text-white text-2xl font-semibold mt-6">SYCO</h2>

          <!-- Invite Description -->
          <p class="text-gray-400 text-sm mt-2 text-center px-8">
            You've been invited to join a server. Click the button below to join!
          </p>

          <!-- Join Button -->
          <a
              href="https://discord.com/invite/sycovai"
              class="w-[20rem] h-[3rem] bg-[#7289da] text-white rounded-xl mt-10 flex items-center justify-center hover:bg-[#677bc4] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
          >
            Join Server
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style >

</style>