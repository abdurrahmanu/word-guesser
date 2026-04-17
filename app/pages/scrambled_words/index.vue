<template>
  <main class="flex max-h-screen text-sm flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex items-center justify-between py-4 px-6 bg-slate-900 border-b border-slate-800 shadow-sm z-10 shrink-0">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="text-lg font-extrabold uppercase tracking-widest text-indigo-400 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <span class="text-2xl">🔠</span> Game Setup
      </h1>
      <div class="w-20"></div> </header>
          
    <div class="overflow-auto flex-1 py-6 custom-scrollbar">
      <div class="flex-1 space-y-5 max-w-2xl w-[95%] mx-auto">
        
        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-4 text-base">Select Category</label>
          <div class="grid grid-cols-2 gap-3">
            <button 
              v-for="mode in modes" 
              :key="mode.value"
              @click="selectedMode = mode.value"
              class="uppercase py-4 rounded-xl font-bold transition-all duration-200 text-xs tracking-wider border"
              :class="selectedMode === mode.value ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-3 text-base">Countdown Timer (Seconds)</label>
          <input 
            type="number" 
            v-model="selectedTime" 
            class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-lg transition-all" 
            min="5" 
            max="120"
          >
        </div>

        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm space-y-6">
            
            <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="type in ['singlePlayer', 'multiPlayer']" 
                  :key="type"
                  @click="selectedType = type as any"
                  class="uppercase py-4 rounded-xl font-bold transition-all duration-200 text-xs tracking-wider border flex items-center justify-center gap-2"
                  :class="selectedType === type ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'"
                >
                  <span v-if="type === 'singlePlayer'">👤 Solo</span>
                  <span v-else>👥 Versus</span>
                </button>
            </div>

            <div v-if="selectedType === 'multiPlayer'" class="space-y-4 pt-2 animate-fade-in-down border-t border-slate-700/50">
                <div>
                  <label class="block font-bold text-slate-200 mb-2 mt-4">Player One Name</label>
                  <input type="text" v-model="playerOne" placeholder="e.g. Alice" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 transition-all">
                </div>
                
                <div>
                  <label class="block font-bold text-slate-200 mb-2">Player Two Name</label>
                  <input type="text" v-model="playerTwo" placeholder="e.g. Bob" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 transition-all">
                </div>
            </div>
        </div>
      </div>
      
    </div>
    
    <div class="px-6 w-full mx-auto py-6 bg-slate-900 border-t border-slate-800 z-10 text-center shrink-0">
      <button 
        @click="startGame" 
        class="w-full max-w-md mx-auto bg-indigo-600 text-white font-extrabold py-4 hover:bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1 text-xl uppercase tracking-widest flex justify-center items-center gap-3">
        Start Game
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gameType = ref<'singlePlayer' | 'multiPlayer'>('singlePlayer')
const selectedType = ref<'singlePlayer' | 'multiPlayer'>('singlePlayer')
const selectedMode = ref('animals')
const selectedTime = ref(15)
const playerOne = ref('')
const playerTwo = ref('')

const modes = [
  { label: 'Animals', value: 'animals' },
  { label: 'Countries', value: 'countries' },
  { label: 'World Cities', value: 'cities' },
  { label: 'All Dictionary', value: 'all' }
]

const startGame = () => {  
  // You might want to save your refs to a Pinia store here before routing
  router.push('/scrambled_words/play')
}
</script>

<style scoped>
/* Smooth slide down animation for multiplayer inputs */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out forwards;
}

/* Custom sleek scrollbar */
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
  background-color: #6366f1; /* indigo-500 */
}
</style>