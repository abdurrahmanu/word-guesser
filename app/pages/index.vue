<template>
  <main class="h-dvh p-4 flex flex-col bg-slate-900 text-white text-center">
    <div>
      <LandingPageDictionary v-if="currentPage === 'dictionary'" />
      <LandingPageWordGuesser v-if="currentPage === 'word_guesser'" />
      <LandingPageTictactoe v-if="currentPage === 'tictactoe'" />
      <LandingPageGeography v-if="currentPage === 'geography'" />
      <LandingPageQuiz v-if="currentPage === 'quiz'" />
      <LandingPageRandomWords v-if="currentPage === 'random_words'" />
      <LandingPageScrambledWords v-if="currentPage === 'scrambled_words'" />

    </div>
    
    <div class="flex-1 flex flex-col justify-end items-center">
      <div class="flex max-w-screen w-full px-2 gap-3 justify-center">
        <button @click="prev" :class="[currentPage === pages[0] ? 'ring-white/20 text-white/20' : 'ring-white hover:bg-white hover:text-indigo-600']" class="w-fit ring rounded-md text-white text-4xl font-bold px-4 py-1 -ml-2 ">←</button>
        <button @click="goTo" :class="[buttonColor]" class="inline-block flex-1 max-w-110 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase">{{normalizedButtonText}}</button>
        <button @click="next" :class="[currentPage === pages[pages.length - 1] ? 'ring-white/20 text-white/20' : 'ring-white hover:bg-white hover:text-indigo-600']" class="w-fit ring rounded-md text-white font-bold px-4 pb-4 relative py-1 rotate-180 text-4xl">←</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const store = useGameStore()
const {currentPage} = storeToRefs(store)

const pages: Choices[] = ['word_guesser', 'dictionary', 'random_words', 'scrambled_words', 'tictactoe', 'geography', 'quiz', 'boxed']

const buttonColor = computed(() => {
  return currentPage.value === 'word_guesser' ? 'bg-violet-600 hover:bg-violet-500' : currentPage.value === 'dictionary' ? 'bg-sky-700 hover:bg-sky-900' : currentPage.value === 'scrambled_words' ? 'bg-green-700 hover:bg-green-900' : 'bg-teal-700 hover:bg-teal-900'
})

const next = () => {  
  let index = pages.indexOf(currentPage.value)  
  if (index === -1 || index === pages.length - 1) return    
  currentPage.value = pages[index + 1] as Choices
}

const prev = () => {
  let index = pages.indexOf(currentPage.value)
  if (index === -1 || index === 0) return
  currentPage.value = pages[index - 1] as Choices
}

const goTo = () => {
  let route = '/' + currentPage.value
  navigateTo(route, {replace: true})
}

const normalizedButtonText = computed(() => {
  return currentPage.value.replace('_', ' ')
})
</script>