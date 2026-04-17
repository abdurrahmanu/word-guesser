<template>
  <main class="font-sans flex flex-col h-dvh bg-slate-900 text-slate-100 overflow-hidden">
    
    <div class="shrink-0 z-20">
      
      <header class="flex items-center justify-between py-4 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm relative">
        <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold text-sm border border-slate-700/50 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="hidden sm:inline">Back</span>
        </button>
        
        <h1 class="text-base sm:text-lg font-black uppercase tracking-widest text-blue-400 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <span class="text-xl">🌍</span> GEOGRAPHY
        </h1>
        
        <div class="w-10 sm:w-20"></div> </header>
      
      <div class="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center overflow-x-auto py-3 gap-2 sm:gap-3 hide-scrollbar">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            @click="activeTab = tab.id" 
            class="whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all border flex-shrink-0"
            :class="activeTab === tab.id 
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30' 
              : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-600'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-auto bg-slate-900 relative custom-scrollbar">
      
      <div v-if="pending" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4 animate-pulse">
        <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-semibold tracking-widest uppercase">Loading World Data...</span>
      </div>

      <div v-else-if="filteredCountries.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-rose-400 gap-3">
        <span class="text-5xl mb-2">🗺️</span>
        <h2 class="text-xl font-bold">No Countries Found</h2>
        <p class="text-slate-500 text-sm">Please check your continent filters in Settings.</p>
        <button @click="activeTab = 'settings'" class="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
          Go to Settings
        </button>
      </div>

      <div v-else class="min-h-full w-full">
        <Transition name="fade" mode="out-in">
          <component 
            :is="activeComponent" 
            :countries="filteredCountries" 
            :settings="settings"
            @update:settings="updateSettings"
            :key="activeTab" 
          />
        </Transition>
      </div>
      
    </div>
  </main>
</template>

<script setup lang="ts">
import CountryViewer from '../../components/Geography/countryViewer.vue'
import FlagGame from '../../components/Geography/flagGame.vue'
import MapGame from '../../components/Geography/mapGame.vue'
import CapitalGame from '../../components/Geography/capitalGame.vue'
import SettingsPanel from '../../components/Geography/settingsPanel.vue'
import ScrambledCountries from '~/components/Geography/scrambledCountries.vue'

interface Country {
    capital: string
    code: string
    continent: string
    flag_1x1: string
    flag_4x3: string
    iso: boolean
    name: string
}

// Fetch data once at the top level
const { data: countriesData, pending } = await useFetch('/countries.json')
const allCountries = computed<Country[]>(() => countriesData.value as Country[] || [])

// Global Settings (Requirement 5)
const settings = ref({
  continents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
  countdownTime: 10,
  blurLevel: 0 // 0 = none, 1 = slight blur, 2 = heavy blur
})

// Filter data based on settings
const filteredCountries = computed(() => {
  return allCountries.value.filter(c => settings.value.continents.includes(c.continent))
})

// Tab Management
const tabs = [
  { id: 'viewer', label: 'Country Info', component: CountryViewer },
  { id: 'flag', label: 'Flag Game', component: FlagGame },
  { id: 'map', label: 'Map Game', component: MapGame },
  { id: 'capital', label: 'Capital Game', component: CapitalGame },
  {id: 'scramble', label: 'Scramble Countries', component: ScrambledCountries},
  { id: 'settings', label: '⚙️', component: SettingsPanel },
]

const activeTab = ref('viewer')

const activeComponent = computed(() => {
  return tabs.find(t => t.id === activeTab.value)?.component || CountryViewer
})

const updateSettings = (newSettings: any) => {
  settings.value = { ...settings.value, ...newSettings }
}
</script>

<style scoped>
/* Smooth fade for component switching */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* Hides the horizontal scrollbar for the tab menu but allows swiping/scrolling */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Custom sleek scrollbar for the main content area */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155; /* slate-700 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569; /* slate-600 */
}
</style>