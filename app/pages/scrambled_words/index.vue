<template>
  <main class="flex max-h-screen text-sm flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex items-center justify-between py-3 px-3 bg-slate-900 border-b border-slate-800 shadow-sm z-10 shrink-0">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="text-lg font-extrabold uppercase tracking-widest text-pink-400 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">Setup</h1>
    </header>
          
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
              :class="selectedMode === mode.value ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-3 text-base">Countdown Timer (Seconds)</label>
          <input 
            type="number" 
            v-model="countdownTimer" 
            class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white text-lg transition-all" 
            min="5" 
            max="120"
          >
        </div>

        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm space-y-6">
            <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="type in ['solo', 'versus']" 
                  :key="type"
                  @click="gameType = type as any"
                  class="uppercase py-4 rounded-xl font-bold transition-all duration-200 text-xs tracking-wider border flex items-center justify-center gap-2"
                  :class="gameType === type ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'"
                >
                  <span v-if="type === 'solo'">Solo</span>
                  <span v-else>Versus</span>
                </button>
            </div>

            <div v-if="gameType === 'versus'" class="space-y-4 pt-2 animate-fade-in-down border-t border-slate-700/50">
                <div>
                  <label class="block font-bold text-slate-200 mb-2 mt-4">Player One Name</label>
                  <input type="text" v-model="playerOne" placeholder="e.g. Player" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder:text-slate-600 transition-all">
                </div>
                
                <div>
                  <label class="block font-bold text-slate-200 mb-2">Player Two Name</label>
                  <input type="text" v-model="playerTwo" placeholder="e.g. Player" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder:text-slate-600 transition-all">
                </div>
            </div>
        </div>

        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-3">Select word Difficulty</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-medium">
            <button @click="difficulty = 'all'" :class="[difficulty === 'all' ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">All Words</button>
            <button @click="difficulty = 'easy'" :class="[difficulty === 'easy' ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">Easy</button>
            <button @click="difficulty = 'medium'" :class="[difficulty === 'medium' ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">Medium</button>
            <button @click="difficulty = 'hard'" :class="[difficulty === 'hard' ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">Hard</button>
          </div>
        </div>
      </div>

      
    </div>
    
    <div class="px-6 w-full mx-auto py-6 bg-slate-900 border-t border-slate-800 z-10 text-center shrink-0">
      <button 
        @click="startGame" 
        class="w-full max-w-md mx-auto bg-pink-600 text-white font-bold py-3 hover:bg-pink-500 rounded-2xl shadow-lg shadow-pink-600/30 transition-all transform hover:-translate-y-1 text-lg uppercase tracking-widest flex justify-center items-center gap-3">
        Start Game
        <SvgArrow />
      </button>
    </div>

  </main>
</template>

<script setup lang="ts">
const router = useRouter()
const scrambled = useScrambled()
const {selectedMode, countdownTimer, difficulty, gameType, modes, playerOne, playerTwo} = storeToRefs(scrambled)

const startGame = () => {  
  router.push('/scrambled_words/play')
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
  background-color: #6366f1; /*-pink-500 */
}
</style>