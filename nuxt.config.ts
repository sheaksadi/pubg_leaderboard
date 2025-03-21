import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ssr: false,
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [// ...
  '@pinia/nuxt', 'nuxt-particles', 'nuxt-echarts', '@nuxt/icon'
  ],

  particles: {
    mode: 'full', // 'full' | 'slim' | 'basic' | 'custom'
    lazy: true
  }
})