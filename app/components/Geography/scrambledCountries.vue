<template>
  <div class="flex flex-col items-center max-w-lg mx-auto w-full">
    <div class="w-full mb-4 text-lg font-bold">
      <p class="text-center text-3xl py-5">Score: {{ score }}</p>
      <p class="text-7xl text-center" :class="{'text-red-500': timeLeft <= 3}">{{ timeLeft }}s</p>
    </div>

    <div class="w-full bg-indigo-50 border-2 border-indigo-200 flex flex-col items-center justify-center mb-6 rounded-xl shadow-inner p-8 text-center min-h-[200px]">
      <span class="text-slate-500 font-bold mb-4 uppercase tracking-widest text-xs">Unscramble the {{ isCapital ? 'Capital' : 'Country' }}</span>
      <h2 v-if="scrambledWord" class="text-4xl sm:text-5xl font-extrabold text-indigo-600 tracking-[0.2em] uppercase break-all">
        {{ scrambledWord }}
      </h2>
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

    <div v-else class="w-full text-center bg-slate-50 p-6 rounded-xl">
      <h3 class="text-3xl font-extrabold mb-3" :class="guessWasCorrect ? 'text-green-600' : 'text-red-600'">
        {{ guessWasCorrect ? 'Spot On!' : 'Time Up!' }}
      </h3>
      <p class="text-2xl py-3 text-slate-700 mb-6">The correct spelling is <strong class="text-slate-900">{{ currentWord }}</strong></p>
      <button @click="startRound" class="px-40 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md">Next Word</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps(['countries', 'settings'])
const currentWord = ref('')
const scrambledWord = ref('')
const isCapital = ref(false)
const guess = ref('')
const timeLeft = ref(0)
const score = ref(0)
const revealed = ref(false)
const guessWasCorrect = ref(false)
let timer: any = null

const scramble = (str: string) => {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as string, arr[i] as string]
  }
  return arr.join('')
}

const startRound = () => {
  if (!props.countries.length) return
  const country = props.countries[Math.floor(Math.random() * props.countries.length)]
  
  isCapital.value = Math.random() > 0.5 && !!country.capital
  currentWord.value = isCapital.value ? country.capital : country.name
  
  // Ensure the scramble isn't identical to the original word
  let scrambled = scramble(currentWord.value)
  while (scrambled === currentWord.value && currentWord.value.length > 1) {
    scrambled = scramble(currentWord.value)
  }
  scrambledWord.value = scrambled

  guess.value = ''
  revealed.value = false
  guessWasCorrect.value = false
  timeLeft.value = props.settings.countdownTime + 5 // Extra 5 seconds for scrambling

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
  if (guess.value.trim().toLowerCase() === currentWord.value.toLowerCase()) {
    clearInterval(timer)
    guessWasCorrect.value = true
    revealed.value = true
    score.value++
  } else {
    guess.value = '' // Clear on wrong guess
  }
}

onMounted(() => startRound())
onUnmounted(() => clearInterval(timer))
</script>