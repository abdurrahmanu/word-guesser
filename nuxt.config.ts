// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: 'Word Guesser',
      short_name: 'Word-G',
      description: 'Offline multiplayer word guesser',
      display: 'standalone',
      start_url: '/',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
      ]
    },
    workbox: {
      // This tells Workbox to cache all your bundled code and images
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      // Important for SPAs: ensures page refreshes work offline
      navigateFallback: '/', 
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true
    },
    devOptions: {
      enabled: false // Keep this false so caching doesn't ruin your dev experience
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: false
})