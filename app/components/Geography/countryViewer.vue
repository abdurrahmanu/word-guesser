<template>
  <main class="bg-slate-900 text-slate-100 font-sans">
    <div class="flex-1 w-full max-w-7xl mx-auto p-2">
      
      <Transition name="fade-slide" mode="out-in">
        <div v-if="!selectedCountry" key="grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          <div 
            v-for="country in countries" 
            :key="country.code" 
            @click="selectedCountry = country"
            class="group cursor-pointer flex flex-col items-center p-5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-linear-to-b from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div class="w-24 h-16 sm:w-28 sm:h-20 mb-4 rounded-md overflow-hidden border border-slate-600 shadow-md group-hover:shadow-lg transition-shadow relative z-10">
              <img :src="`/flags/4X3/${country.code.toLowerCase()}.svg`" class="w-full h-full object-cover" alt="Flag">
            </div>
            
            <span class="text-center font-bold uppercase text-[10px] sm:text-xs text-slate-400 group-hover:text-blue-300 transition-colors tracking-widest relative z-10">
              {{ country.name }}
            </span>
          </div>
        </div>

        <div v-else key="detail" class="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          <div class="w-full flex justify-start mb-2">
            <button @click="selectedCountry = null" class="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Return to Grid
            </button>
          </div>
          
          <div class="w-full bg-slate-800/80 backdrop-blur-xl p-4 rounded-lg shadow-2xl border border-slate-700 relative overflow-hidden flex flex-col items-center text-center">
            
            <div class="absolute top-0 w-full h-64 bg-blue-500/5 blur-[80px] pointer-events-none"></div>

            <img 
              :src="`/flags/4X3/${selectedCountry.code.toLowerCase()}.svg`" 
              class="w-48 sm:w-64 rounded-xl shadow-2xl shadow-black/60 border-2 border-slate-600 mb-4 relative"
              alt="National Flag"
            >
            
            <h2 class="text-xl font-bold mb-4 text-white tracking-tight drop-shadow-md relative">
              {{ selectedCountry.name }}
            </h2>
            
            <div class="flex flex-wrap h-24 items-center justify-center gap-3 sm:gap-6 mb-8 relative">
               <span class="px-5 py-1 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-300 text-sm font-bold tracking-wider flex items-center gap-2 shadow-inner">
                 <span class="text-lg">🏛️</span> {{ selectedCountry.capital || 'N/A' }}
               </span>
               <span class="px-5 h-fit py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-bold tracking-widest uppercase shadow-inner">
                 {{ selectedCountry.continent }}
               </span>
            </div>

<div class="flex flex-col items-center w-full max-w-4xl mx-auto py-2 overflow-hidden">
  
  <div class="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 px-4 md:px-8 hide-scrollbar scroll-smooth items-stretch">
    
    <div class="flex-none w-72 bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-600 snap-center flex flex-col items-center justify-center">
      <div class="w-40 h-40 sm:w-48 sm:h-48 bg-white/90 rounded-full flex items-center justify-center p-3 border border-slate-700/50 shadow-inner relative z-10 transition-transform duration-700 hover:scale-105">
        <img 
          :src="`maps/all/${selectedCountry.code.toLowerCase()}/vector.svg`" 
          class="w-full h-full object-contain opacity-60 filter drop-shadow-xl" 
          alt="Map outline"
        >
      </div>
      <div class="mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Country Map</div>
    </div>
    
    <div class="flex-none w-72 bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-600 snap-center flex flex-col justify-center">
      <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Language</div>
      <p class="text-xl font-bold text-white mb-2">{{ selectedCountry.main_language_hello }}</p>
      <p class="text-slate-300 text-sm">
        <span class="font-semibold text-slate-400">Official:</span> 
        {{ Object.values(selectedCountry.languages || {}).join(', ') }}
      </p>
    </div>

    <div class="flex-none w-72 bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-600 snap-center flex flex-col justify-center">
      <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Quick Stats</div>
      <ul class="space-y-3 text-slate-200 text-sm">
        <li class="flex justify-between border-b border-slate-700 pb-1">
          <span class="text-slate-400">Capital</span> 
          <span class="font-medium text-white">{{ selectedCountry.capital }}</span>
        </li>
        <li class="flex justify-between border-b border-slate-700 pb-1">
          <span class="text-slate-400">Population</span> 
          <span class="font-medium text-white">{{ selectedCountry.most_recent_population.toLocaleString() }}</span>
        </li>
        <li class="flex justify-between border-b border-slate-700 pb-1">
          <span class="text-slate-400">Status</span> 
          <span class="font-medium text-white">{{ selectedCountry.development_status }}</span>
        </li>
      </ul>
    </div>

      <div class="flex-none w-72 bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-600 snap-center flex flex-col justify-center">
        <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Geography</div>
        <ul class="space-y-3 text-slate-200 text-sm">
          <li class="flex justify-between border-b border-slate-700 pb-1">
            <span class="text-slate-400">Region</span> 
            <span class="font-medium text-white">{{ selectedCountry.main_location }}</span>
          </li>
          <li class="flex justify-between border-b border-slate-700 pb-1">
            <span class="text-slate-400">Gov. Type</span> 
            <span class="font-medium text-white">{{ selectedCountry.government_type || 'N/A' }}</span>
          </li>
          <li class="flex flex-col border-b border-slate-700 pb-1">
            <span class="text-slate-400 mb-1">Top Cities</span> 
            <span class="font-medium text-white truncate">{{ selectedCountry.three_main_cities.join(', ') }}</span>
          </li>
        </ul>
      </div>

      <div class="flex-none w-72 bg-slate-800 rounded-2xl p-3 shadow-lg border border-slate-600 snap-center flex flex-col justify-center">
        <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Did you know?</div>
        <p class="text-slate-200 text-sm italic mb-3">"{{ selectedCountry.facts }}"</p>
        
        <div class="mt-auto space-y-1 text-xs text-slate-300">
          <div v-if="selectedCountry.main_landmarks" class="bg-slate-700/50 p-2 rounded">
            <span class="text-slate-400 block mb-1">Landmarks:</span> {{ selectedCountry.main_landmarks }}
          </div>
          <div v-if="selectedCountry.main_mountains_or_rivers" class="bg-slate-700/50 p-2 rounded">
            <span class="text-slate-400 block mb-1">Features:</span> {{ selectedCountry.main_mountains_or_rivers }}
          </div>
        </div>
      </div>

    </div>
  </div>           

            <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md relative">
              <div class="flex gap-3">
                <button @click="prevCountry" class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  <SvgArrow class="rotate-180" />Previous
                </button>
                
                <button @click="nextCountry" class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  Next<SvgArrow />
                </button>
              </div>
              
              <button @click="randomCountry" class="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 font-black rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                <span class="text-lg leading-none text-purple-400">🎲</span> Random
              </button>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </main>
</template>

<style scoped>
/* Smooth slide and fade transition between the Grid and Detail views */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps(['countries'])
const selectedCountry = ref<any>(null)

const currentIndex = computed(() => {
  if (!selectedCountry.value) return -1
  return props.countries.findIndex((c: any) => c.code === selectedCountry.value.code)
})

const nextCountry = () => {
  if (currentIndex.value === -1) return
  const nextIdx = (currentIndex.value + 1) % props.countries.length
  selectedCountry.value = props.countries[nextIdx]
}

const prevCountry = () => {
  if (currentIndex.value === -1) return
  const prevIndex = (currentIndex.value - 1) % props.countries.length
  selectedCountry.value = props.countries[prevIndex]
}

const randomCountry = () => {
  const randIdx = Math.floor(Math.random() * props.countries.length)
  selectedCountry.value = props.countries[randIdx]
}
</script>