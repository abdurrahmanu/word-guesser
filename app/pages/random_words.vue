<template>
  <main class="h-screen flex flex-col pb-40">
    <div class="flex items-center py-4 px-5 bg-teal-800 shrink-0">
      <button @click="$router.push('/')" class="ring rounded-md text-white font-bold px-2 py-1 -ml-2 hover:bg-white hover:text-indigo-600">← Back</button>
      <h1 class="text-base relative -left-6 font-extrabold mx-auto uppercase text-white">RANDOM WORDS</h1>
    </div>

    <div class="max-w-3xl w-[90%] mx-auto flex-1 flex flex-col items-center">
      
      <div class="w-full flex-1 flex items-center justify-center">
        <Transition name="fade" mode="out-in">
          <div 
            :key="currentWord" 
            class="w-full text-center space-y-10">
            <p class="text-7xl font-bold">{{ currentWord }}</p>
            <p class="text-lg md:text-2xl py-3 font-medium max-w-2xl mx-auto">{{ currentDefinition }}</p>
          </div>
        </Transition>
      </div>

      <button @click="generateRandomWord" class="text-xl ring rounded-full px-10 py-2 font-bold shrink-0">GENERATE RANDOM</button>
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