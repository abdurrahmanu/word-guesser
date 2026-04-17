<template>
  <main class="flex max-h-screen text-sm flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex items-center justify-between py-4 px-6 bg-slate-900 border-b border-slate-800 shadow-sm z-10">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="text-lg font-extrabold uppercase tracking-widest text-violet-400 absolute left-1/2 transform -translate-x-1/2">
        Game Setup
      </h1>
      <div class="w-20"></div> </header>

    <div class="overflow-auto flex-1 py-6 custom-scrollbar">
      <div class="flex-1 space-y-4 max-w-2xl w-[95%] mx-auto">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <label class="block font-bold text-slate-200 mb-2">Words per Session</label>
            <input type="number" v-model="settings.wordCount" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white transition-all" min="4" max="100">
          </div>

          <div class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
            <label class="block font-bold text-slate-200 mb-2">Timer (Seconds)</label>
            <input type="number" v-model="settings.timerSeconds" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white transition-all" min="10" max="120">
          </div>
        </div>

        <div class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <div class="flex items-center justify-between mb-3">
            <div>
              <label class="block font-bold text-slate-200">First To Reach</label>
              <span class="text-xs text-slate-400">First person/team to reach the selected score wins</span>
            </div>
            <input type="checkbox" v-model="toggleFirstToReach" class="w-6 h-6 accent-violet-500 cursor-pointer rounded">
          </div>
          <div v-if="toggleFirstToReach" class="mt-3 animate-fade-in-down">
            <input type="number" v-model="firstToReach" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white transition-all" min="1" max="120">
          </div> 
        </div>

        <div class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-200 mb-2">Team One Name</label>
              <input type="text" v-model="teamOne" placeholder="Team A" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder:text-slate-600 transition-all">
            </div>
            <div>
              <label class="block font-bold text-slate-200 mb-2">Team Two Name</label>
              <input type="text" v-model="teamTwo" placeholder="Team B" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder:text-slate-600 transition-all">
            </div>
          </div>
        </div>

        <div class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-2">
            Add Custom Words <span class="font-normal text-xs text-slate-400 ml-1">(Separate with commas)</span>
          </label>
          <div class="flex">
            <input placeholder="e.g. passport, visa, airport..." type="text" v-model="newWords" class="flex-1 w-full bg-slate-900/50 border border-slate-700 rounded-l-xl p-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder:text-slate-600 transition-all">
            <button @click="addWords" class="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-r-xl text-white font-bold transition-colors">
              Add
            </button>
          </div>
          <p v-if="addWordsError" class="text-rose-400 text-xs pt-2 font-medium animate-pulse">Error: Add only real words. No symbols/numbers. Use commas.</p>
          <p v-if="addWordsSuccessful" class="text-emerald-400 text-xs pt-2 font-medium">New words successfully added!</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors">
            <div>
              <span class="block font-bold text-slate-200">Transfer Turn</span>
              <span class="text-xs text-slate-400">Give the other team a chance</span>
            </div>
            <input type="checkbox" v-model="settings.allowTransfer" class="w-6 h-6 accent-violet-500 rounded">
          </label> 

          <label class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors">
            <div>
              <span class="block font-bold text-slate-200">Show Definitions</span>
              <span class="text-xs text-slate-400">Hint definitions at half-time</span>
            </div>
            <input type="checkbox" v-model="useDefinition" class="w-6 h-6 accent-violet-500 rounded">
          </label> 

          <label class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors md:col-span-2">
            <div>
              <span class="block font-bold text-slate-200">Use Sound Effects</span>
              <span class="text-xs text-slate-400">Enable ticking and buzzer sounds</span>
            </div>
            <input type="checkbox" v-model="useSound" class="w-6 h-6 accent-violet-500 rounded">
          </label>
        </div>
      
        <div class="bg-slate-800/80 p-5 rounded-3xl shadow-lg border border-slate-700 backdrop-blur-sm">
          <label class="block font-bold text-slate-200 mb-3">Select Vocabulary Difficulty</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-medium">
            <button @click="difficulty = 'all'" :class="[difficulty === 'all' ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">All Words</button>
            <button @click="difficulty = 'easy'" :class="[difficulty === 'easy' ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">Easy</button>
            <button @click="difficulty = 'medium'" :class="[difficulty === 'medium' ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">Medium</button>
            <button @click="difficulty = 'hard'" :class="[difficulty === 'hard' ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500']" class="uppercase border px-3 py-3 rounded-xl text-xs font-bold transition-all">Hard</button>
          </div>
        </div>

      </div>
    </div>

    <div class="px-6 w-full mx-auto py-6 bg-slate-900 border-t border-slate-800 z-10 text-center">
      <button @click="startGame" class="w-full max-w-md mx-auto bg-violet-600 text-white font-extrabold py-4 hover:bg-violet-500 rounded-2xl shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-1 text-xl uppercase tracking-wider flex justify-center items-center gap-2">
        Start Game
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>

  </main>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Make sure to import your store correctly here depending on your project setup
// import { useGameStore } from '@/stores/game' 

const router = useRouter()
const store = useGameStore()
const {teamOne, teamTwo, newWords, useDefinition, toggleFirstToReach, firstToReach, difficulty, settings, addWordsError, addWordsSuccessful, useSound} = storeToRefs(store)
const {addWords} = store

function startGame() {
  store.initGame(settings.value)
  router.push('/word_guesser/play')
}

watch(toggleFirstToReach, newVal => {
  if (!newVal) {
    firstToReach.value = null
  } else {
    firstToReach.value = 10
  }
})
</script>

<style scoped>
/* Optional: Adds a custom sleek scrollbar for webkit browsers */
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
</style>