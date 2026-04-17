<template>
  <main class="h-screen flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
    
    <header class="flex items-center justify-between py-4 px-6 bg-slate-900 border-b border-slate-800 shadow-sm z-20 shrink-0">
      <button @click="$router.push('/')" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors rounded-xl px-4 py-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 class="text-lg font-extrabold uppercase tracking-widest text-teal-400 absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <span class="text-2xl">🎲</span> Random Words
      </h1>
      <div class="w-20"></div> </header>

    <div class="flex-1 w-full flex flex-col items-center justify-center p-6 relative">
      
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div class="w-120 h-120 bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div class="max-w-4xl w-full flex-1 flex flex-col items-center justify-center z-10 pb-10">
        
        <div class="w-full bg-slate-800/80 p-8 md:p-16 rounded-3xl shadow-2xl border border-slate-700 backdrop-blur-md min-h-87.5 md:min-h-112.5 flex flex-col items-center justify-center mb-12 relative">
          
          <Transition name="fade-slide" mode="out-in">
            <div :key="currentWord" class="w-full text-center flex flex-col items-center">
              
              <span class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 block">
                Word of the moment
              </span>
              
              <p class="text-5xl text-teal-400 font-blac bg-clip-text font-black tracking-tight drop-shadow-sm mb-8 wrap-break-words w-full">
                {{ currentWord || 'Ready?' }}
              </p>
              
              <div v-if="currentDefinition" class="relative mt-2">
                <p class="text-lg md:text-2xl font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10 px-6">
                  {{ currentDefinition }}
                </p>
              </div>
              
            </div>
          </Transition>

        </div>

        <button @click="generateRandomWord" class="group relative px-10 py-5 md:px-14 md:py-6 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-full shadow-lg shadow-teal-600/30 transition-all transform hover:-translate-y-1 hover:scale-105 text-xl md:text-2xl uppercase tracking-widest flex items-center gap-4 shrink-0 border border-teal-400/50">
          <span class="relative z-10">Generate Random</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 md:h-8 md:w-8 relative z-10 group-active:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Assuming allDefinitions is imported or available in your context

const wordsArray = Object.keys(allDefinitions)

const currentWord = ref('')
const currentDefinition = ref('')

const generateRandomWord = () => {
  // Prevent generating the exact same word twice in a row
  let newWord = currentWord.value
  while (newWord === currentWord.value && wordsArray.length > 1) {
    const randomIndex = Math.floor(Math.random() * wordsArray.length)
    newWord = wordsArray[randomIndex] as string
  }
  
  currentWord.value = newWord
  currentDefinition.value = allDefinitions[newWord as keyof object]
}

// Load an initial word when the page mounts
onMounted(() => {
  generateRandomWord()
})
</script>

<style scoped>
/* Vue Transition Classes for smooth fade out/in */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* Custom animation for the button hover effect */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>