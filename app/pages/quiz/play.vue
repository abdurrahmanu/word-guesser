<template>
  <main class="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
    <header class="flex justify-between items-center py-4 px-6 bg-slate-900 border-b border-slate-800 shadow-sm shrink-0">
      
      <div class="flex gap-6 items-center">
        <div :class="['flex flex-col', settings.mode === 'versus' && currentPlayer === 1 ? 'text-amber-400' : 'text-slate-400']">
          <span class="text-xs font-bold uppercase tracking-widest">{{ settings.playerOne || 'Player 1' }}</span>
          <span class="text-xl text-center font-black">{{ scores.player1.toLocaleString() }}</span>
        </div>

        
        <div v-if="settings.mode === 'versus'" class="w-px h-8 bg-slate-700"></div>
        
        <div v-if="settings.mode === 'versus'" :class="['flex flex-col', currentPlayer === 2 ? 'text-amber-400' : 'text-slate-400']">
            <span class="text-xs font-bold uppercase tracking-widest">{{ settings.playerTwo || 'Player 2' }}</span>
            <span class="text-xl font-black text-center">{{ scores.player2.toLocaleString() }}</span>
        </div>
    </div>

    <div class="flex gap-4">
      <button @click="$router.push('/quiz')" class="px-4 py-1  rounded-md bg-slate-700 h-fit text-slate-300 hover:bg-red-500 hover:text-white transition-colors">
        BACK
      </button>
      <button @click="restart" class="px-4 py-1  rounded-md bg-slate-700 h-fit text-slate-300 hover:bg-red-500 hover:text-white transition-colors">
        RESTART
      </button>
    </div>

      <div class="text-slate-500 font-bold bg-slate-800 px-4 py-2 rounded-lg">
        Q: {{ currentQuestionIndex + 1 }} / {{ settings.questionCount }}
      </div>
    </header>

    <div class="flex-1 w-full max-w-3xl mx-auto flex flex-col justify-center p-6 relative">
      
      <div v-if="gameState === 'playing' && currentQuestion">
        
        <div class="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
          <div class="h-full bg-amber-500 transition-all duration-1000 linear" :style="{ width: `${(timeLeft / settings.countdownTime) * 100}%` }"></div>
        </div>

        <div class="bg-slate-800/80 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-700 text-center relative mb-8">
          <h2 class="text-3xl md:text-5xl font-bold leading-tight mt-6 mb-2 text-slate-100">
            <span v-html="formatQuestion(currentQuestion.question)"></span>
          </h2>
        </div>

    <div class="w-full flex flex-col sm:flex-row gap-3">
      <input 
        v-model="guess" 
        @keyup.enter="submitAnswer" 
        type="text" 
        placeholder="Input Answer..." 
        autofocus
        class="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-colors">
      <button 
        @click="submitAnswer" 
        :disabled="!guess.trim()"
        class="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
        Guess
      </button>
    </div>
      </div>

      <div v-else-if="gameState === 'feedback'" class="bg-slate-800 p-10 rounded-3xl border border-slate-700 text-center shadow-2xl">
        <h3 class="text-5xl font-black mb-4" :class="lastGuessCorrect ? 'text-emerald-400' : 'text-rose-400'">
          {{ lastGuessCorrect ? 'CORRECT!' : 'INCORRECT' }}
        </h3>
        <p class="text-xl text-slate-300 mb-8">
          The answer was <strong class="text-white">{{ currentQuestion?.answer.toUpperCase() }}</strong>.
        </p>
        
        <button @click="nextTurn" class="px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-lg uppercase tracking-widest w-full">
          {{ currentQuestionIndex + 1 >= settings.questionCount ? 'View Final Scores' : 'Next Question ➔' }}
        </button>
      </div>

      <div v-else-if="gameState === 'gameover'" class="text-center">
        <div class="text-6xl mb-6">🏆</div>
        <h2 class="text-4xl font-black mb-10 uppercase tracking-widest text-amber-400">Game Over</h2>
        
        <div class="grid gap-4 mb-10" :class="settings.mode === 'versus' ? 'grid-cols-2' : 'grid-cols-1'">
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{{ settings.playerOne || 'Player 1' }}</p>
            <p class="text-4xl font-black text-white">{{ scores.player1.toLocaleString() }}</p>
          </div>
          
          <div v-if="settings.mode === 'versus'" class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{{ settings.playerTwo || 'Player 2' }}</p>
            <p class="text-4xl font-black text-white">{{ scores.player2.toLocaleString() }}</p>
          </div>
        </div>

        <button @click="restart" class="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-lg uppercase tracking-widest">
          Play Again
        </button>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Quiz {
    question: string,
    answer: string
}

const data = await useFetch('/quiz.json')
const quizData: Quiz[] | any = data.data.value

const settings = ref({
  questionCount: 5,
  countdownTime: 15,
  mode: 'versus', 
  playerOne: 'Player One',
  playerTwo: 'Player Two'
})

const currentQuestionIndex = ref(0)
const currentQuestion = ref(quizData[0])
const gameState = ref<'playing' | 'feedback' | 'gameover'>('playing')

const guess = ref('')
const lastGuessCorrect = ref(false)

const currentPlayer = ref(1) // 1 or 2
const scores = ref({ player1: 0, player2: 0 })

const timeLeft = ref(settings.value.countdownTime)
let timer: any = null

// --- LOGIC ---
const formatQuestion = (text: string) => {
  // Makes the "____" blank look slightly different/underlined visually
  return text.replace(/____/g, '<span class="border-b-4 border-amber-500/50 px-6 inline-block mx-1"></span>')
}

const startTimer = () => {
  clearInterval(timer)
  timeLeft.value = settings.value.countdownTime
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleTimeUp()
    }
  }, 1000)
}

const submitAnswer = () => {
  if (!guess.value.trim() || gameState.value !== 'playing') return
  clearInterval(timer)
  
  const isCorrect = guess.value.trim().toLowerCase() === currentQuestion.value?.answer.toLowerCase()
  lastGuessCorrect.value = isCorrect

  if (isCorrect) {
    if (currentPlayer.value === 1) scores.value.player1 += 1
    else scores.value.player2 += 1
  }

  gameState.value = 'feedback'
}

const handleTimeUp = () => {
  clearInterval(timer)
  lastGuessCorrect.value = false
  gameState.value = 'feedback'
}

const nextTurn = () => {
  currentQuestionIndex.value++
  
  if (currentQuestionIndex.value >= settings.value.questionCount || currentQuestionIndex.value >= quizData.length) {
    gameState.value = 'gameover'
    return
  }

  // Swap turn if versus mode
  if (settings.value.mode === 'versus') {
    currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
  }

  currentQuestion.value = quizData[currentQuestionIndex.value]
  guess.value = ''
  gameState.value = 'playing'
  startTimer()
}

const shuffleQuestions = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Update your restart function
const restart = () => {
  // 1. Shuffle the questions so the next game is fresh!
  shuffleQuestions(quizData)

  // 2. Reset the tracking variables
  currentQuestionIndex.value = 0
  currentQuestion.value = quizData[0]
  currentPlayer.value = 1
  scores.value = { player1: 0, player2: 0 }

  // 3. Reset the UI state
  guess.value = ''
  lastGuessCorrect.value = false
  gameState.value = 'playing'

  // 4. Start the timer for the new first question
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>