<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { useDataStore } from "~/stores/dataStore";
import Navbar from '~/components/Navbar.vue';
import HeroSection from '~/components/HeroSection.vue';
import Button from "~/components/Button.vue";
import Particles from "~/components/Particles.vue";

const authStore = useAuthStore();
const { getSession } = authStore;

const store = useDataStore();


onMounted(() => {
  // Fetch session on component mount
  getSession();
  store.init()

});
</script>

<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="fixed bottom-0 right-0 gap-2  flex pr-2 bg-slate-800 rounded-md items-center">
      <div class="w-3 h-3 rounded-full bg-green-400 ml-2"></div><span class="text-gray-300">in vc</span><span
        class="text-green-400 ">{{ store.onlineCount }}</span>
    </div>
    <div class="h-screen w-full flex flex-col lg:flex-row items-center justify-center p-4 relative">
      <Particles />
      <HeroSection />
    </div>

    <div class="h-screen">
      <Button label="Verify" />
    </div>

    <Footer />
  </div>
</template>
