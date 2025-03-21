<template>
  <div class="gradient-background"></div>
  <NuxtParticles
      id="tsparticles"
      :options="options"
      @load="onLoad"
  >
  </NuxtParticles>
  <!-- Other content goes here -->
<!--  <div class="content">-->
<!--    <h1>Your Content Here</h1>-->
<!--    <p>This content sits on top of the gradient background and particles.</p>-->
<!--  </div>-->
</template>

<script setup lang="ts">
import type { Container } from 'tsparticles-engine'

const options = {
  fullScreen: {
    enable: false,
    zIndex: -1
  },
  background: {
    color: {
      value: 'transparent' // Set background to transparent
    }
  },
  particles: {
    color: {
      value: '#e2e8f0' // Light gray for particles
    },
    links: {
      color: '#94a3b8', // Slightly darker gray for links
      enable: true,
      distance: 150,
      opacity: 0.5,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      outModes: {
        default: 'bounce'
      }
    },
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800
      }
    },
    opacity: {
      value: { min: 0.3, max: 0.7 },
      animation: {
        enable: true,
        speed: 1,
        sync: false
      }
    },
    size: {
      value: { min: 1, max: 3 },
      animation: {
        enable: true,
        speed: 2,
        sync: false
      }
    },
    shape: {
      type: 'circle'
    }
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'grab'
      },
      onClick: {
        enable: false,
        mode: 'push'
      }
    },
    modes: {
      grab: {
        distance: 200,
        links: {
          opacity: 1
        }
      },
      push: {
        quantity: 4
      }
    }
  }
}

const onLoad = (container: Container) => {
  // container.pause()
  // setTimeout(() => container.play(), 2000)
}
</script>

<style scoped>
.gradient-background {
  position: fixed; /* Fixed positioning to cover the entire viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f1c01, #1b2c02, #283403); /* slate800 to slate600 gradient */
  z-index: -2; /* Place it behind everything */
}

#tsparticles {
  position: fixed; /* Fixed positioning to cover the entire viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Place it above the gradient but below other content */
}

.content {
  position: relative; /* Ensure content sits above the background and particles */
  z-index: 1; /* Place it above the particles and gradient */
  padding: 20px;
  color: white; /* Text color for better contrast */
}
</style>