<template>
  <div class="flex flex-col items-center max-w-lg mx-auto w-full">
    <div class="w-full mb-4 text-lg font-bold">
      <p class="text-center text-3xl py-5">Score: {{ score }}</p>
      <p class="text-7xl text-center" :class="{'text-red-500': timeLeft <= 3}">{{ timeLeft }}s</p>
    </div>

    <div class="w-full h-56 bg-purple-50 border-2 border-purple-200 flex flex-col items-center justify-center mb-6 rounded-xl shadow-inner p-6 text-center">
      <div v-if="!currentCountry" class="text-gray-400 animate-pulse">
        Loading question...
      </div>
      <div v-else class="flex flex-col items-center">
        <span class="text-gray-500 font-semibold mb-2 uppercase tracking-wider text-sm">
          {{ questionType === 'guessCapital' ? 'Name the Capital' : 'Name the Country' }}
        </span>
        
        <h2 v-if="questionType === 'guessCapital'" class="text-3xl font-extrabold text-gray-800">
          What is the capital of <br> <span class="text-purple-700">{{ currentCountry.name }}</span>?
        </h2>
        
        <h2 v-else class="text-3xl font-extrabold text-gray-800">
          <span class="text-purple-700">{{ currentCountry.capital }}</span> <br> is the capital of which country?
        </h2>
      </div>
    </div>

    <div v-if="!revealed" class="w-full flex flex-col sm:flex-row gap-3">
      <input 
        v-model="guess" 
        @keyup.enter="checkGuess" 
        type="text" 
        :placeholder="questionType === 'guessCapital' ? 'Type capital name...' : 'Type country name...'" 
        autofocus
        class="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg transition-colors"
      >
      <button 
        @click="checkGuess" 
        :disabled="!guess.trim()"
        class="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        Guess
      </button>
    </div>

    <div v-else class="w-full text-center bg-gray-50 p-6">
      <h3 class="text-3xl font-extrabold mb-3" 
          :class="guessWasCorrect ? 'text-green-600' : 'text-red-600'">
        {{ guessWasCorrect ? '🎉 Correct!' : '⏰ Time up!' }}
      </h3>
      
      <p class="text-2xl text-gray-700 py-6">
        <span v-if="questionType === 'guessCapital'">
          The capital of {{ currentCountry?.name }} is <strong class="text-gray-900 border-b-2 border-purple-400">{{ currentCountry?.capital }}</strong>
        </span>
        <span v-else>
          {{ currentCountry?.capital }} is the capital of <strong class="text-gray-900 border-b-2 border-purple-400">{{ currentCountry?.name }}</strong>
        </span>
      </p>
      
      <button 
        @click="startRound" 
        class="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-md w-full sm:w-auto"
      >
        Next Question 🏛️
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
}

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
type QuestionType = 'guessCapital' | 'guessCountry'
const questionType = ref<QuestionType>('guessCapital')

const guess = ref('')
const timeLeft = ref(0)
const revealed = ref(false)
const guessWasCorrect = ref(false)
const score = ref(0)

let timerInterval: ReturnType<typeof setInterval> | null = null

const startRound = () => {
  if (!props.countries || props.countries.length === 0) return

  // 1. Pick a random country (make sure it actually has a capital to avoid weird blank questions)
  let validCountries = props.countries.filter(c => c.capital && c.capital.trim() !== '')
  if (validCountries.length === 0) validCountries = props.countries // fallback

  const randomIndex = Math.floor(Math.random() * validCountries.length)
  currentCountry.value = validCountries[randomIndex] as Country
  
  // 2. Randomly decide if we ask for the Capital or the Country
  questionType.value = Math.random() > 0.5 ? 'guessCapital' : 'guessCountry'
  
  // 3. Reset UI state
  guess.value = ''
  revealed.value = false
  guessWasCorrect.value = false
  timeLeft.value = props.settings.countdownTime
  
  // 4. Start timer
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
  
  // Determine what the correct answer should be based on the question type
  const correctAnswer = questionType.value === 'guessCapital' 
    ? currentCountry.value.capital.trim().toLowerCase()
    : currentCountry.value.name.trim().toLowerCase()

  if (normalizedGuess === correctAnswer) {
    clearTimer()
    guessWasCorrect.value = true
    revealed.value = true
    score.value++
  } else {
    // Clear input on wrong guess to let them try again quickly
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

onMounted(() => {
  startRound()
})

onUnmounted(() => {
  clearTimer()
})
</script>