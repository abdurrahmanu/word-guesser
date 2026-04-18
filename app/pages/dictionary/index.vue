<template>
  <main class="flex flex-col max-h-screen h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex items-center justify-between py-4 px-3 bg-slate-900 border-b border-slate-800 shadow-sm z-10 shrink-0">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-3 py-1 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="text-lg font-extrabold tracking-tight text-sky-700">Mini <span class="text-slate-400">Dictionary</span></h1>
      <div class="w-20"></div> </header>

    <div class="px-4 py-3 overflow-auto flex-1 flex flex-col items-center custom-scrollbar">
      <div class="w-full max-w-3xl flex flex-col h-full space-y-6">
        
        <div class="bg-slate-800/80 p-3 rounded-lg shadow-lg border border-slate-700 backdrop-blur-sm shrink-0">
          <label for="word" class="block font-bold text-slate-200 mb-3 text-base">Search Vocabulary</label>
          <div class="relative">
            <SvgSearch />
            <input 
              type="text" 
              id="word" 
              v-model="searchWord" 
              placeholder="Type a word..."
              class="w-full pl-12 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-2xl outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white placeholder:text-slate-500 text-lg transition-all shadow-inner">
          </div>
        </div>

        <div class="flex-1 overflow-auto custom-scrollbar pr-2 pb-6">
          <div class="space-y-4">
            
            <div 
              v-for="(definition, word, index) in searchedWords" 
              :key="index" 
              class="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/50 rounded-lg p-3 transition-all duration-200 group"
            >
              <div class="flex items-baseline justify-between mb-2 border-b border-slate-700/50 pb-2">
                <h2 class="text-sm font-extrabold tracking-wide text-sky-700 uppercase group-hover:text-teal-300 transition-colors">
                  {{ word }}
                </h2>
              </div>
              <p class="text-slate-300 leading-relaxed text-sm">
                {{ definition }}
              </p>
            </div>

            <div v-if="Object.keys(searchedWords).length === 0" class="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/30">
              <span class="text-4xl block mb-3 opacity-50">🧐</span>
              <h3 class="text-xl font-bold text-slate-500">No definitions found</h3>
              <p class="text-slate-600 mt-1">Try adjusting your search term.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts"> 
import { ref, computed } from 'vue'
// Make sure allDefinitions is imported here, e.g.:
// import { allDefinitions } from '@/utils/dictionaryData'

const searchWord = ref('')

const searchedWords = computed(() => {
  // Guard clause in case the input is empty and you don't want to render 10,000 words at once
  // (Optional: remove the if-statement if you DO want the full list to show initially)
  if (!searchWord.value.trim()) return allDefinitions 

  const searchTerm = searchWord.value.toLowerCase().trim()

  let words = Object.keys(allDefinitions).filter(word => {
    return word.toLowerCase().includes(searchTerm)
  }).sort()
    
  return Object.assign({}, ...words.map(word => {
    return {[word] : allDefinitions[word as keyof typeof allDefinitions]} 
  }))
})
</script>

<style scoped>
/* Sleek custom scrollbar */
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
  background-color: #14b8a6; /* teal-500 */
}
</style>