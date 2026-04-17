<template>
  <div class="flex flex-col items-center max-w-md mx-auto">
    <div class="w-full mb-4 text-lg font-bold">
      <p class="text-center text-3xl py-5">Score: {{ score }}</p>
      <p class="text-7xl text-center" :class="{'text-red-500': timeLeft <= 3}">{{ timeLeft }}s</p>
    </div>

    <div class="w-full h-64 bg-gray-100 border border-slate-200 flex items-center justify-center mb-6 rounded overflow-hidden">
      <img v-if="currentCountry" 
           :src="`/flags/4X3/${currentCountry.code.toLowerCase()}.svg`" 
           :class="['w-full h-full object-cover', blurClass]">
    </div>
    
    <div v-if="!revealed" class="w-full flex flex-col sm:flex-row gap-3">
      <input 
        v-model="guess" 
        @keyup.enter="checkGuess" 
        type="text" 
        placeholder="Name this country..." 
        autofocus
        class="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-colors">
      <button 
        @click="checkGuess" 
        :disabled="!guess.trim()"
        class="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
        Guess
      </button>
    </div>

    <div v-else class="w-full text-center">
      <h3 class="text-2xl font-bold mb-2" :class="guessWasCorrect ? 'text-green-600' : 'text-red-600'">
        {{ guessWasCorrect ? 'Correct!' : 'Time up!' }}
      </h3>
      <p class="text-5xl mb-6 py-4">{{ currentCountry?.name }}</p>
      <button @click="startRound" class="px-40 py-3 hover:bg-blue-600 bg-white text-blue-600 blue-500 ring hover:text-white rounded-lg">Next Flag</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps(['countries', 'settings'])

const currentCountry = ref<any>(null)
const guess = ref('')
const timeLeft = ref(0)
const revealed = ref(false)
const guessWasCorrect = ref(false)
const score = ref(0)
let timer: any = null

const blurClass = computed(() => {
  if (props.settings.blurLevel === 1) return 'blur-sm'
  if (props.settings.blurLevel === 2) return 'blur-md'
  return ''
})

const startRound = () => {
  const randIdx = Math.floor(Math.random() * props.countries.length)
  currentCountry.value = props.countries[randIdx]
  guess.value = ''
  revealed.value = false
  guessWasCorrect.value = false
  timeLeft.value = props.settings.countdownTime
  
  clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      revealed.value = true
    }
  }, 1000)
}

const checkGuess = () => {
  if (guess.value.trim().toLowerCase() === currentCountry.value.name.toLowerCase()) {
    clearInterval(timer)
    guessWasCorrect.value = true
    revealed.value = true
    score.value++
  }
}

onMounted(() => startRound())
onUnmounted(() => clearInterval(timer))
</script>