<template>
  <main class="flex max-h-screen text-sm flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex items-center justify-between py-4 px-6 bg-slate-900 border-b border-slate-800 shadow-sm z-10 shrink-0">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="text-lg font-extrabold uppercase tracking-widest text-amber-400 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        Quiz Setup
      </h1>
      <div class="w-20"></div> </header>
          
    <div class="overflow-auto flex-1 py-6 custom-scrollbar">
      <div class="flex-1 space-y-6 max-w-2xl w-[95%] mx-auto">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <label class="block font-bold text-slate-200 mb-3 text-base">Questions per Play</label>
            <input 
              type="number" 
              v-model="settings.questionCount" 
              class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-lg transition-all" 
              min="5" 
              max="50"
            >
          </div>

          <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <label class="block font-bold text-slate-200 mb-3 text-base">Countdown (Seconds)</label>
            <input 
              type="number" 
              v-model="settings.countdownTime" 
              class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-lg transition-all" 
              min="5" 
              max="60"
            >
          </div>
        </div>

        <div class="bg-slate-800/80 p-3 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm space-y-6">
            <label class="block font-bold text-slate-200 text-base">Game Mode</label>
            <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="type in ['solo', 'versus']" 
                  :key="type"
                  @click="settings.mode = type"
                  class="uppercase py-4 rounded-xl font-bold transition-all duration-200 text-xs tracking-wider border flex items-center justify-center gap-2"
                  :class="settings.mode === type ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'"
                >
                  <span v-if="type === 'solo'">👤 Solo Play</span>
                  <span v-else>👥 Two Player</span>
                </button>
            </div>

            <div v-if="settings.mode === 'versus'" class="space-y-4 pt-2 animate-fade-in-down border-t border-slate-700/50">
                <div>
                  <label class="block font-bold text-slate-200 mb-2 mt-4">Player One Name</label>
                  <input type="text" v-model="settings.playerOne" placeholder="e.g. Player One" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-slate-600 transition-all">
                </div>
                
                <div>
                  <label class="block font-bold text-slate-200 mb-2">Player Two Name</label>
                  <input type="text" v-model="settings.playerTwo" placeholder="e.g. Player Two" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-slate-600 transition-all">
                </div>
            </div>
        </div>
      </div>
      
    </div>
    
    <div class="px-6 w-full mx-auto py-6 bg-slate-900 border-t border-slate-800 z-10 text-center shrink-0">
      <button 
        @click="startGame" 
        class="w-full max-w-md mx-auto bg-amber-600 text-white font-extrabold py-4 hover:bg-amber-500 rounded-2xl shadow-lg shadow-amber-600/30 transition-all transform hover:-translate-y-1 text-xl uppercase tracking-widest flex justify-center items-center gap-3">
        Start Quiz
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

const settings = ref({
  questionCount: 10,
  countdownTime: 15,
  mode: 'solo', // 'solo' or 'versus'
  playerOne: '',
  playerTwo: ''
})

const startGame = () => {  
  router.push('/quiz/play')
}
</script>

<style scoped>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down { animation: fadeInDown 0.3s ease-out forwards; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #f59e0b; }
</style>