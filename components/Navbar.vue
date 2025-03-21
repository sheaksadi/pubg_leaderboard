<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import SearchBar from '~/components/SearchBar.vue';

const authStore = useAuthStore();
const { session } = storeToRefs(authStore);
const { signIn, signOut } = authStore;

const navigateToProfile = () => {
  // Add your profile navigation logic here
  console.log('Navigate to profile');
};

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'LeaderBoard', href: '/leaderboard' },
  { label: 'Players', href: '/players' }
];
</script>

<template>
  <nav class="fixed z-50 top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
    <!-- Logo/Brand -->
<!--
    <div class="flex items-center">
      <span class="text-green-500 text-xl font-bold">SYCO</span>
    </div>

-->
    <!-- Navigation Links -->
    <div class="flex items-center gap-6">
    </div>

    <!-- Search Bar and Auth -->
    <div class="flex items-center gap-4">

      <a
          v-for="item in navItems"
          :key="item.label"
          :href="item.href"
          class="text-white hover:text-green-400 transition-colors"
      >
        {{ item.label }}
      </a>

      <SearchBar />

      <div v-if="session" class="flex items-center">
        <div class="relative group">
          <img
              :src="session.avatar"
              :alt="session.username"
              class="w-10 h-10 rounded-full bg-green-500 ring-1 ring-green-400 cursor-pointer"
          />

          <!-- Dropdown Menu -->
          <div class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
            <button
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="navigateToProfile"
            >
              Profile
            </button>
            <button
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="signOut"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <button
          v-else
          @click="signIn"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
      >
        Login
      </button>
    </div>
  </nav>
</template>
