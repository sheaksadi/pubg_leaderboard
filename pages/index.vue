<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore';
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import Contributions from "~/components/Contributions.vue";

const authStore = useAuthStore();

// Access state and actions
const { session, status } = storeToRefs(authStore);
const { signIn, signOut, getSession } = authStore;

// Initial position tracking
const titleContainer = ref(null);
const initialPosition = ref({ top: 0, left: 0 });
const viewportWidth = ref(0);
const viewportHeight = ref(0);

// Animation values
const scrollProgress = ref(0);
const maxScroll = 350; // Increased this value to make animation slower (less sensitive to scroll)

// Target position (adjusted to be higher and smaller)
const targetTop = 10; // Moved even higher
const targetLeft = 20;
const targetScale = 0.4; // Made even smaller

// Update viewport dimensions
const updateViewportDimensions = () => {
  if (typeof window !== 'undefined') {
    viewportWidth.value = window.innerWidth;
    viewportHeight.value = window.innerHeight;
  }
};

// Capture initial position
const captureInitialPosition = () => {
  nextTick(() => {
    if (titleContainer.value) {
      const rect = titleContainer.value.getBoundingClientRect();
      initialPosition.value = {
        top: rect.top,
        left: rect.left
      };
    }
  });
};

// Computed styles for smooth animation with easing function
const titleStyles = computed(() => {
  // If at the top, keep the element in its normal flow
  if (scrollProgress.value <= 0) {
    return {
      position: 'relative',
      transform: 'none'
    };
  }

  // Apply easing function to make animation smoother
  // Using easeOutQuad function: progress * (2 - progress)
  const easedProgress = scrollProgress.value * (2 - scrollProgress.value);

  // If fully scrolled past threshold, fix it to the target position
  if (scrollProgress.value >= 1) {
    return {
      position: 'fixed',
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
      transform: `scale(${targetScale})`,
      transformOrigin: 'top left',
      zIndex: 50
    };
  }

  // In between - calculate position based on viewport-relative coordinates
  // Convert the initial position to be relative to viewport
  const viewportRelativeTop = initialPosition.value.top;
  const viewportRelativeLeft = initialPosition.value.left;

  // Interpolate between initial and target positions with eased progress
  const currentTop = viewportRelativeTop * (1 - easedProgress) + targetTop * easedProgress;
  const currentLeft = viewportRelativeLeft * (1 - easedProgress) + targetLeft * easedProgress;
  const currentScale = 1 - (easedProgress * (1 - targetScale));

  return {
    position: 'fixed',
    top: `${currentTop}px`,
    left: `${currentLeft}px`,
    transform: `scale(${currentScale})`,
    transformOrigin: 'top left',
    zIndex: 50,
    transition: 'all 0.18s cubic-bezier(0.25, 0.1, 0.25, 1.0)' // Slightly slower transition
  };
});

// Handle scroll event with debouncing for smoother performance
let scrollTimeout;
const handleScroll = () => {
  if (typeof window !== 'undefined') {
    // Clear the timeout if it exists
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set a new timeout
    scrollTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY;
      scrollProgress.value = Math.min(scrollPosition / maxScroll, 1);

      // If we're back at the top, recapture initial position
      if (scrollProgress.value <= 0) {
        captureInitialPosition();
      }
    }, 5); // Very short timeout for responsive but smooth updates
  }
};

// Set up everything on mount
onMounted(() => {
  // Fetch session
  getSession();

  // Set up event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true }); // passive for better performance
    window.addEventListener('resize', () => {
      updateViewportDimensions();
      captureInitialPosition();
    });

    // Initialize viewport dimensions and position
    updateViewportDimensions();

    // Small delay to ensure DOM is fully rendered
    setTimeout(captureInitialPosition, 100);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateViewportDimensions);
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  }
});




const contributionsData = ref([
  { date: '2024-02-15', contributions: 5 },
  { date: '2024-02-16', contributions: 8 },
  { date: '2024-02-18', contributions: 2 },
  { date: '2024-02-19', contributions: 6 },
  { date: '2024-02-20', contributions: 4 },
])

</script>

<template>
  <div class="">
    <div v-if="session" class="fixed z-50 top-10 right-10  flex  flex-row-reverse gap-2 items-center justify-reverse">
      <div class="relative group">
        <img :src="session.avatar" :alt="session.username" class="w-12 h-12 rounded-full bg-green-500 ring-1 ring-green-400 cursor-pointer" />

        <!-- Dropdown Menu -->
        <div class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="navigateToProfile">Profile</button>
          <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="signOut">Logout</button>
        </div>
      </div>
      <a class="text-lg text-white">Players</a>
      <a class="text-lg text-white">LeaderBoard</a>
    </div>
    <div v-else class="fixed z-50 top-10 right-10  flex  flex-row-reverse gap-2 items-center justify-reverse">
      <button
          @click="signIn"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 cursor-pointer"
      >
        Login
      </button>
      <a class="text-lg text-white">Players</a>
      <a class="text-lg text-white">LeaderBoard</a>
    </div>

    <div class="h-screen w-full flex flex-col lg:flex-row items-center justify-center p-4 relative">
      <Particles />


      <div class="w-full max-w-[80rem] h-auto lg:h-[36rem] flex flex-col lg:flex-row">
        <!-- Left Section -->
        <div class="w-full lg:w-1/2 h-full flex justify-center flex-col items-center lg:items-start text-center lg:text-left">
          <!-- Title container with fixed height to prevent layout jumps -->
          <div class="relative" style="min-height: 60px;">
            <!-- The title that will animate -->
            <div ref="titleContainer" :style="titleStyles">
              <ShuffleText text="SYCO" />
            </div>

            <!-- Invisible placeholder when title is fixed -->
            <div v-if="scrollProgress > 0" class="opacity-0">
              <ShuffleText text="SYCO" />
            </div>
          </div>

          <h2 class="text-gray-300 text-md sm:text-xl md:text-xl w-[80%] mt-4 lg:mt-0">
            Join Syco, Bangladesh's largest gaming community on Discord! <br>
            Syco is your ultimate hub for gaming, tournaments, and making new friends.
          </h2>
        </div>

        <!-- Right Section -->
        <div class="w-full lg:w-1/2 h-full p-2 flex items-center justify-center mt-8 lg:mt-0">
          <div class="bg-[#36393f] w-full max-w-[26rem] h-auto lg:h-full rounded-2xl flex items-center flex-col pt-10 lg:pt-20">
            <!-- Server Icon -->
            <div class="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-black rounded-full flex items-center justify-center">
              <img src="https://cdn.discordapp.com/attachments/1328843479303979058/1345457708161302579/SYCO_eSports.png?ex=67c49ea3&is=67c34d23&hm=b457d181f2b8b80622a128ab581127f694da207a47661ac590ba583e3a87b91d&" alt="SYCO Logo" class="w-full h-full rounded-full">
            </div>

            <!-- Server Name -->
            <h2 class="text-white text-2xl sm:text-3xl font-semibold mt-6">SYCO</h2>

            <!-- Invite Description -->
            <p class="text-gray-400 text-sm sm:text-base mt-2 text-center px-4 lg:px-8">
              You've been invited to join a server. Click the button below to join!
            </p>

            <!-- Join Button -->
            <a
                href="https://discord.com/invite/sycovai"
                class="w-full max-w-[20rem] h-12 sm:h-14 bg-[#7289da] text-white rounded-xl mt-10 flex items-center justify-center hover:bg-[#677bc4] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
            >
              Join Server
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="h-screen">
      <Contributions :contribution-data="contributionsData "></Contributions>
    </div>
  </div>
</template>