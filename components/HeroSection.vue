<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import ShuffleText from '~/components/Shuffle-text.vue';

// Interface for position tracking
interface Position {
  top: number;
  left: number;
}

// Initial position tracking
const titleContainer = ref<HTMLElement | null>(null);
const initialPosition = ref<Position>({ top: 0, left: 0 });
const viewportWidth = ref(0);
const viewportHeight = ref(0);

// Animation values
const scrollProgress = ref(0);
const maxScroll = 350; // Controls how sensitive the animation is to scrolling

// Target position
const targetTop = 10;
const targetLeft = 20;
const targetScale = 0.4;

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
    transition: 'all 0.18s cubic-bezier(0.25, 0.1, 0.25, 1.0)'
  };
});

// Handle scroll event with debouncing
let scrollTimeout: number | null = null;
const handleScroll = () => {
  if (typeof window !== 'undefined') {
    // Clear the timeout if it exists
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set a new timeout
    scrollTimeout = window.setTimeout(() => {
      const scrollPosition = window.scrollY;
      scrollProgress.value = Math.min(scrollPosition / maxScroll, 1);

      // If we're back at the top, recapture initial position
      if (scrollProgress.value <= 0) {
        captureInitialPosition();
      }
    }, 5);
  }
};

// Set up everything on mount
onMounted(() => {
  // Set up event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
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
</script>

<template>
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
        <div class="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-slate-900 rounded-full flex items-center justify-center">
          <img src="/assets/SYCO_eSports.png" alt="SYCO Logo" class="w-full h-full rounded-full">
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
</template>
