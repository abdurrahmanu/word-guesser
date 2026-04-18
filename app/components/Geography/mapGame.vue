<template>
  <div class="flex flex-col items-center max-w-lg mx-auto w-full">
    <div class="w-full mb-4 text-lg font-bold">
      <p class="text-center text-3xl py-5">Score: {{ score }}</p>
      <p class="text-7xl text-center" :class="{'text-red-500': timeLeft <= 3}">{{ timeLeft }}s</p>
    </div>

    <div class="w-full h-72 flex items-center justify-center mb-6 rounded-xl relative overflow-hidden shadow-inner">
      <div v-if="!currentCountry" class="text-gray-400 animate-pulse">
        Loading map...
      </div>
      <img v-else 
           :src="`maps/all/${currentCountry.code.toLowerCase()}/vector.svg`" 
           alt="Country Map Outline"
           class="w-3/4 h-3/4 object-contain filter transition-all duration-300">
           
      <div v-if="settings.blurLevel > 0 && !revealed" 
           class="absolute inset-0 backdrop-blur-[2px] bg-white/10 pointer-events-none">
      </div>
    </div>

    <div v-if="!revealed" class="w-full flex flex-col sm:flex-row gap-3 px-5">
      <input 
        v-model="guess" 
        @keyup.enter="checkGuess" 
        type="text" 
        placeholder="Name this country..." 
        autofocus
        class="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-colors"
      >
      <button 
        @click="checkGuess" 
        :disabled="!guess.trim()"
        class="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        Guess
      </button>
    </div>

    <div v-else class="w-full text-center rounded-xl shadow-sm px-5">
      <h3 class="text-3xl font-extrabold mb-3" 
          :class="guessWasCorrect ? 'text-green-600' : 'text-red-600'">
        {{ guessWasCorrect ? '🎉 Correct!' : '⏰ Time up!' }}
      </h3>
      
      <p class="text-xl font-bold py-5 text-gray-900">{{ currentCountry?.name }}</p>
      
      <button 
        @click="startRound" 
        class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md w-full sm:w-auto">
        Next Map
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Country {
  capital: string
  code: string
  continent: string
  flag_1x1: string
  flag_4x3: string
  iso: boolean
  name: string
  languages: Record<string, string>
  main_language_hello: string
  facts: string
  government_type: string
  main_location: string
  most_recent_population: number
  development_status: string
  main_mountains_or_rivers: string
  main_landmarks: string
  three_main_cities: string[]
}

// Props passed down from Geography.vue
const props = defineProps<{
  countries: Country[],
  settings: {
    countdownTime: number,
    blurLevel: number,
    continents: string[]
  }
}>()

// Component State
const currentCountry = ref<Country | null>(null)
const guess = ref('')
const timeLeft = ref(0)
const revealed = ref(false)
const guessWasCorrect = ref(false)
const score = ref(0)

// Timer reference
let timerInterval: ReturnType<typeof setInterval> | null = null

// Game Logic
const startRound = () => {
  // Guard against empty country list
  if (!props.countries || props.countries.length === 0) return

  // Pick a random country
  const randomIndex = Math.floor(Math.random() * props.countries.length)
  currentCountry.value = props.countries[randomIndex] as Country
  
  // Reset UI state
  guess.value = ''
  revealed.value = false
  guessWasCorrect.value = false
  timeLeft.value = props.settings.countdownTime
  
  // Start the countdown
  clearTimer()
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleTimeout()
    }
  }, 1000)
}

const checkGuess = () => {
  if (!currentCountry.value || revealed.value) return

  const normalizedGuess = guess.value.trim().toLowerCase()
  const normalizedAnswer = currentCountry.value.name.trim().toLowerCase()

  if (normalizedGuess === normalizedAnswer) {
    clearTimer()
    guessWasCorrect.value = true
    revealed.value = true
    score.value++
  } else {
    // Optional: You could add a "shake" animation or clear the input here for wrong guesses
    // before the time runs out, rather than immediately ending the round.
    guess.value = '' 
  }
}

const handleTimeout = () => {
  clearTimer()
  guessWasCorrect.value = false
  revealed.value = true
}

const clearTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Lifecycle Hooks
onMounted(() => {
  startRound()
})

onUnmounted(() => {
  // Crucial to prevent memory leaks if the user switches tabs while a timer is running
  clearTimer()
})
</script>