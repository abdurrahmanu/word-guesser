<template>
  <main class="h-dvh p-4 flex flex-col bg-slate-900 text-white text-center">
    <div class="max-w-200 w-full flex-1 overflow-auto mx-auto">
      <LandingPageDictionary v-if="currentPage === 'dictionary'" />
      <LandingPageWordGuesser v-if="currentPage === 'word_guesser'" />
      <LandingPageTictactoe v-if="currentPage === 'tictactoe'" />
      <LandingPageGeography v-if="currentPage === 'geography'" />
      <LandingPageQuiz v-if="currentPage === 'quiz'" />
      <LandingPageRandomWords v-if="currentPage === 'random_words'" />
      <LandingPageScrambledWords v-if="currentPage === 'scrambled_words'" />
    </div>
    
    <div>
      <div class="flex max-w-screen w-full px-2 gap-3 justify-center">
        <button @click="prev" :class="[currentPage === pages[0] ? 'ring-white/20 text-white/20' : 'ring-white hover:bg-white hover:text-indigo-600']" class="w-fit ring rounded-md text-white text-4xl font-bold px-4 py-1 -ml-2 ">←</button>
        <button @click="goTo" :class="[buttonColor]" class="inline-block flex-1 max-w-110 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 uppercase">{{normalizedButtonText}}</button>
        <button @click="next" :class="[currentPage === pages[pages.length - 1] ? 'ring-white/20 text-white/20' : 'ring-white hover:bg-white hover:text-indigo-600']" class="w-fit ring rounded-md text-white font-bold px-4 pb-4 relative py-1 rotate-180 text-2xl">←</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const store = useGameStore()
const {currentPage} = storeToRefs(store)

const pages: Choices[] = ['word_guesser', 'dictionary', 'random_words', 'scrambled_words', 'tictactoe', 'geography', 'quiz', 'boxed']

const buttonColor = computed(() => {
  return currentPage.value === 'word_guesser' ? 'bg-teal-600 hover:bg-teal-500' :
   currentPage.value === 'dictionary' ? 'bg-sky-700 hover:bg-sky-900' :
    currentPage.value === 'scrambled_words' ? 'bg-pink-600 hover:bg-pink-800' :
    currentPage.value === 'random_words' ? 'bg-violet-500 hover:bg-violet-700' :
    currentPage.value === 'tictactoe' ? 'bg-orange-600 hover:bg-orange-800' : 
    currentPage.value === 'geography' ? 'bg-blue-600 hover:bg-blue-800' :
    currentPage.value === 'quiz' ? 'bg-amber-500 bg-amber-800' :
     'bg-teal-700 hover:bg-teal-900'
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Caveat:wght@400..700&family=Exo:ital,wght@0,100..900;1,100..900&family=Itim&family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Pacifico&family=Reddit+Mono:wght@200..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Shadows+Into+Light&display=swap');

.caveat {
  font-family: "Caveat", cursive;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

.exo {
  font-family: 'Exo', monospace;
}

.redit-font {
  font-family: 'Reddit Mono', sans-serif
}

.pacifico {
  font-family: 'Pacifico', cursive;
  font-weight: 400;
  font-style: normal;
}
</style>