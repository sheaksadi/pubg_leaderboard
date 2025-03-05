import tailwindcss from "@tailwindcss/vite";

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

  modules: [
    // ...
    '@pinia/nuxt',
    'nuxt-particles',
  ],
  particles: {
    mode: 'full', // 'full' | 'slim' | 'basic' | 'custom'
    lazy: true
  }
})