<template>
  <main class="flex max-h-screen text-sm flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex items-center justify-between py-3 px-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10 shrink-0">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="font-extrabold uppercase tracking-widest text-orange-400 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">Setup</h1>
      <div class="w-20"></div> </header>
          
    <div class="overflow-auto flex-1 py-4 custom-scrollbar">
      <div class="flex-1 space-y-6 max-w-2xl w-[95%] mx-auto">
        
        <div class="bg-slate-800/80 p-6 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-4 text-base">Select Board Type</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <button 
              @click="settings.gridMode = 'single'"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300"
              :class="settings.gridMode === 'single' ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20 transform scale-105' : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 scale-100'"
            >
              <div class="grid grid-cols-3 gap-1 mb-3 opacity-80" :class="settings.gridMode === 'single' ? 'text-orange-400' : 'text-slate-500'">
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm bg-current"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
                <div class="w-4 h-4 border-2 border-current rounded-sm"></div>
              </div>
              <span class="font-bold uppercase tracking-widest text-sm" :class="settings.gridMode === 'single' ? 'text-white' : ''">Classic 3x3</span>
              <span class="text-xs mt-1" :class="settings.gridMode === 'single' ? 'text-orange-200' : 'text-slate-500'">Single Grid</span>
            </button>

            <button 
              @click="settings.gridMode = 'multiple'"
              class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300"
              :class="settings.gridMode === 'multiple' ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20 transform scale-105' : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 scale-100'"
            >
              <div class="grid grid-cols-9 mb-3 opacity-80" :class="settings.gridMode === 'multiple' ? 'text-orange-400' : 'text-slate-500'">
                <div v-for="(index) in 81" :key="index" class="h-2 w-2 ring"></div>
              </div>
              <span class="font-bold uppercase tracking-widest text-sm" :class="settings.gridMode === 'multiple' ? 'text-white' : ''">Ultimate Grid</span>
              <span class="text-xs mt-1" :class="settings.gridMode === 'multiple' ? 'text-orange-200' : 'text-slate-500'">Multiple Boards</span>
            </button>

          </div>
        </div>

        <div v-if="settings.gridMode === 'multiple'" class="flex w-full gap-4">
          <div class="w-full bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <label class="block font-bold text-slate-200 mb-2">Number of Cols</label>
            <input type="number" v-model="numberOfCols" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white transition-all" min="4" max="100">
          </div>

          <div class="w-full bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <label class="block font-bold text-slate-200 mb-2">Number of Rows</label>
            <input type="number" v-model="numberOfRows" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white transition-all" min="10" max="120">
          </div>
        </div>

        <div class="bg-slate-800/80 p-6 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <label class="block font-bold text-slate-200 text-base">First To Reach</label>
              <span class="text-xs text-slate-400">First player to reach the selected score wins the match</span>
            </div>
            <button 
              @click="toggleFirstToReach = !toggleFirstToReach" 
              class="w-14 h-8 rounded-full transition-colors duration-300 relative flex items-center px-1"
              :class="toggleFirstToReach ? 'bg-orange-500' : 'bg-slate-700'"
            >
              <div 
                class="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300"
                :class="toggleFirstToReach ? 'translate-x-6' : 'translate-x-0'"
              ></div>
            </button>
          </div>

          <div v-if="toggleFirstToReach" class="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in-down">
            <label class="block font-bold text-slate-400 mb-2 text-xs uppercase tracking-widest">Target Wins</label>
            <input 
              type="number" 
              v-model="settings.targetScore" 
              class="w-full bg-slate-900/50 border-2 border-slate-700 rounded-xl p-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white text-xl font-bold transition-all text-center" 
              min="1" 
              max="50"
            >
          </div> 
        </div>

        <div class="rounded-xl bg-slate-800/80 p-4 space-y-2">
            <p class="font-bold text-slate-200">Select Game Mode</p>
            <div class="grid grid-cols-2 gap-3">
                <button 
                v-for="type in ['human', 'AI']" 
                :key="type"
                @click="gameType = type as any"
                class="uppercase py-4 rounded-xl font-bold transition-all duration-200 text-xs tracking-wider border flex items-center justify-center gap-2"
                :class="gameType === type ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'">
                <span v-if="type === 'human'">Human</span>
                <span v-else>AI</span>
            </button>
        </div>
    </div>

      </div>
    </div>
    
    <div class="px-6 w-full mx-auto py-6 bg-slate-900 border-t border-slate-800 z-10 text-center shrink-0">
      <button 
        @click="startGame" 
        class="w-full max-w-md mx-auto text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 uppercase tracking-widest flex justify-center items-center gap-3"
        :class="settings.gridMode === 'multiple' ? 'bg-orange-600 hover:bg-orange-500 shadow-pink-600/30' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'"
      >
        Enter Game
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>

  </main>
</template>

<script setup lang="ts">
const router = useRouter()

const tictactoe = useTictactoe()
const {gameType, toggleFirstToReach, settings} = storeToRefs(tictactoe)

const tictactoe2 = useTictactoe2()
const {numberOfCols, numberOfRows} = storeToRefs(tictactoe2)

watch(toggleFirstToReach, (newVal) => {
  if (newVal && settings.value.targetScore < 1) {
    settings.value.targetScore = 3 // Default fallback
  }
})

const startGame = () => {  
  // Here you would inject these settings into your Pinia store
  // const store = useGameStore()
  // store.setGridMode(settings.value.gridMode)
  // store.setTargetScore(toggleFirstToReach.value ? settings.value.targetScore : null)

  router.push('/tictactoe/play')
}
</script>

<style scoped>
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
  background-color: #06b6d4; /* orange-500 */
}
</style>