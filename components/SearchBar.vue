<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDataStore } from "~/stores/dataStore";
import type {Member, DiscordUser} from "~/types";

const store = useDataStore();

// Sample data for players and members
const players = ref<DiscordUser[]>([]);
const members = ref<Member[]>([]);
players.value = store.discordUsers;
members.value = store.members;

const searchQuery = ref('');
const isFocused = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);

// Define roles that can be toggled
const toggleableRoles = ['[SYCO] Clan', 'SycoActive'];

// Role toggles
const roleFilters = ref<Record<string, boolean>>({
  '[SYCO] Clan': true,
  'SycoActive': false,
});

// Combine players and members data
const combinedData = computed(() => {
  return players.value.map(player => {
    console.log(members)
    const member = members.value.find(member => member.discordId === player.id);
    return {
      ...player,
      playerName: member?.playerName || null,
      nickname:  player.name,
      memberId: member?.memberId || null,
    };
  });
});

// Filter combined data based on search query and role filters
const filteredPlayers = computed(() => {
  return combinedData.value.filter(player => {
    // If no roles are toggled, show all players
    const noFiltersActive = Object.values(roleFilters.value).every(val => !val);

    // Filter by roles if any role is toggled
    const hasSelectedRole = noFiltersActive || player.roles.some(role => toggleableRoles.includes(role.name) && roleFilters.value[role.name]);

    // Filter by search query (name, username, playerName, or nickname)
    const query = searchQuery.value.toLowerCase();
    const matchesSearchQuery =
        player.name.toLowerCase().includes(query) ||
        player.username.toLowerCase().includes(query) ||
        (player.playerName?.toLowerCase().includes(query)) ||
        player.nickname.toLowerCase().includes(query);

    return hasSelectedRole && matchesSearchQuery;
  });
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isFocused.value = false;
  }
};


// Select a player from the dropdown
const selectPlayer = async (player: DiscordUser & { playerName: string | null; nickname: string; memberId: string }) => {
  console.log('Selected:', player);
  searchQuery.value = player.nickname;
  isFocused.value = false;

  await navigateTo("/members/" + player.username);
};

// Toggle role filter
const toggleRoleFilter = (roleName: string) => {
  roleFilters.value[roleName] = !roleFilters.value[roleName];
};
watch(
    () => store.discordUsers,
    (newDiscordUsers) => {
      players.value = newDiscordUsers;
      members.value = store.members;
    },
    { deep: true }
);

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);


});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative w-64" ref="dropdownRef">
    <div class="relative">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search players..."
          class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          @focus="isFocused = true"
      />
      <div class="absolute right-3 top-2.5 text-gray-400">
        <Icon name="mdi:search" />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div
        v-if="isFocused"
        class="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50"
    >
      <!-- Role Toggles -->
      <div class="p-2 border-b border-gray-700">
        <div class="flex flex-wrap gap-2">
          <button
              v-for="roleName in toggleableRoles"
              :key="roleName"
              @click="toggleRoleFilter(roleName)"
              :class="{
                'bg-gray-700': roleFilters[roleName],
                'bg-gray-500': !roleFilters[roleName],
              }"
              class="px-2 py-1 rounded text-xs focus:outline-none"
              :style="{
                backgroundColor: roleFilters[roleName] ? `#${players.find(p => p.roles.some(r => r.name === roleName))?.roles.find(r => r.name === roleName)?.color || '333'}` : '#555',
                color: players.find(p => p.roles.some(r => r.name === roleName))?.roles.find(r => r.name === roleName)?.color === '000000' ? '#fff' : '#000'
              }"
          >
            {{ roleName }}
          </button>
        </div>
      </div>

      <!-- Player List -->
      <div v-if="filteredPlayers.length === 0" class="p-3 text-gray-400 text-center">
        No results found
      </div>

      <div v-else class="max-h-64 overflow-y-auto">
        <div
            v-for="player in filteredPlayers"
            :key="player.id"
            class="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
            @click="selectPlayer(player)"
        >
          {{ player.name }}
          <span v-if="player.playerName && player.playerName !== player.name">
            ({{ player.playerName }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
