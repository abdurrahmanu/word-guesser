<template>
  <main class="max-h-screen h-screen p-4 flex flex-col bg-slate-900 text-white text-center">
    <h1 class="text-4xl font-extrabold mb-4 tracking-tight">Words<span class="text-indigo-400">Guesser</span></h1>

    <div class="flex flex-col items-center py-6 space-y-3">
      <div class="text-slate-300 max-w-110 leading-relaxed space-y-2">
        <h1 class="text-2xl font-bold">How to play</h1>
        <p class="text-justify text-sm">Four players will split into two teams. For team A, one player clicks an index that holds a hidden word. The second player must then describe that word to the first player. The first player should correctly guess the word with the explanation before the timer runs out! The team has the option of forfeiting their turn. There is a transfer of turn after timeout.</p>
      </div>

    <div class="bg-slate-800 p-5 rounded-2xl mt-1 w-full max-w-120 shadow-xl mb-8 border border-slate-700 ">
      <h2 class="font-bold text-lg mb-5">PLAYER ROLES</h2>

      <ul class="text-sm text-slate-300 space-y-5 mb-4">
        <div>
          <p class="text-indigo-400 font-bold">REVEALER</p> 
          <p>Picks an index. Says the word.</p>
        </div>
        <div>
          <p class="text-indigo-400 font-bold">EXPLAINER</p> 
          <p>Opens the word and then explains it to the Chooser.</p>
        </div>
      </ul>
    </div>
  </div>

  <div class="flex-1 flex flex-col justify-end items-center">
    <div class="flex max-w-screen w-full px-2 gap-3 justify-center">
      <button @click="prev" :class="[currentPage === pages[0] ? 'ring-white/20 text-white/20' : 'ring-white hover:bg-white hover:text-indigo-600']" class="w-fit ring rounded-md text-white text-4xl font-bold px-4 py-1 -ml-2 ">←</button>

      <button @click="goTo" :class="[buttonColor]" class="inline-block flex-1 max-w-110 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase">
        {{currentPage}}
      </button>

      <button @click="next" :class="[currentPage === pages[pages.length - 1] ? 'ring-white/20 text-white/20' : 'ring-white hover:bg-white hover:text-indigo-600']" class="w-fit ring rounded-md text-white font-bold px-4 pb-4 relative py-1 rotate-180 text-4xl">←</button>
    </div>
  </div>
</main>
</template>

<script setup lang="ts"> 
type Choices = 'game' | 'dictionary' | 'random_words'

const currentPage = ref<Choices>('game')
const pages: Choices[] = ['game', 'dictionary', 'random_words']

const buttonColor = computed(() => {
  return currentPage.value === 'game' ? 'bg-indigo-600 hover:bg-indigo-500' : currentPage.value === 'dictionary' ? 'bg-sky-700 hover:bg-sky-900' : 'bg-teal-700 hover:bg-teal-900'
})

const next = () => {  
  let index = pages.indexOf(currentPage.value)  
  if (index === -1 || index === pages.length - 1) return    
  currentPage.value = pages[index + 1] as Choices
  console.log(currentPage.value);
  
}

const prev = () => {
  let index = pages.indexOf(currentPage.value)
  if (index === -1 || index === 0) return
  currentPage.value = pages[index - 1] as Choices
}

const goTo = () => {
  let route = currentPage.value === 'game' ? '/setup' : '/' + currentPage.value
  navigateTo(route, {replace: true})
}
</script>