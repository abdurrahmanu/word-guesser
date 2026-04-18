<template>
  <main class="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
    
<header class="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl z-20 relative shrink-0 flex flex-col">
      
      <div class="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-slate-800/50">
        <button @click="$router.push('/quiz')" class="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <span :class="[gameState === 'playing' ? 'text-amber-500' : 'text-slate-500 blur-sm']" class="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all">
          {{ gameState === 'playing' ? 'In Progress' : 'Paused' }}
        </span>

        <button @click="restart" class="flex items-center gap-2 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50 hover:border-rose-500/30">
          Restart
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2 shrink-0 px-2 sm:px-6 pt-4">
          <div class="flex gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <div class="flex items-center justify-between gap-3 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
              <span class="text-slate-500">Question</span>
              <span class="text-amber-400">{{ currentQuestionIndex + 1 }}</span>
            </div>
            <div class="flex items-center justify-between gap-3 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
              <span class="text-slate-500">Total</span>
              <span class="text-slate-200">{{ settings.questionCount }}</span>
            </div>
          </div>
      </div>

      <div class="flex items-stretch justify-center max-w-5xl mx-auto w-full px-4 sm:px-8 py-6 gap-4">
        
        <div 
          class="flex-1 flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300"
          :class="(!settings.mode || settings.mode !== 'versus' || currentPlayer === 1) ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 transform scale-105' : 'bg-slate-800/30 border-transparent opacity-60 scale-95'"
        >
          <span class="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1" :class="(!settings.mode || settings.mode !== 'versus' || currentPlayer === 1) ? 'text-amber-400' : 'text-slate-500'">
            {{ settings.playerOne || 'Player 1' }}
          </span>
          <span class="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter" :class="(!settings.mode || settings.mode !== 'versus' || currentPlayer === 1) ? 'text-white' : 'text-slate-400'">
            {{ scores.player1.toLocaleString() }}
          </span>
        </div>

        <div 
          v-if="settings.mode === 'versus'"
          class="flex-1 flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300"
          :class="currentPlayer === 2 ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 transform scale-105' : 'bg-slate-800/30 border-transparent opacity-60 scale-95'"
        >
          <span class="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1" :class="currentPlayer === 2 ? 'text-amber-400' : 'text-slate-500'">
            {{ settings.playerTwo || 'Player 2' }}
          </span>
          <span class="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter" :class="currentPlayer === 2 ? 'text-white' : 'text-slate-400'">
            {{ scores.player2.toLocaleString() }}
          </span>
        </div>

      </div>
    </header>

    <div class="flex-1 w-full max-w-3xl mx-auto flex flex-col justify-center p-6 relative">
      
      <div v-if="gameState === 'playing' && currentQuestion">
        
        <div class="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
          <div class="h-full bg-amber-500 transition-all duration-1000 linear" :style="{ width: `${(timeLeft / settings.countdownTime) * 100}%` }"></div>
        </div>

        <div class="bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-700 text-center relative mb-8">
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
            class="flex-1 p-4 bg-slate-900 border-2 border-slate-700 text-white rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-lg transition-all"
          >
          <button 
            @click="submitAnswer" 
            :disabled="!guess.trim()"
            class="px-8 py-4 bg-amber-500 text-slate-900 rounded-xl font-black text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Guess
          </button>
        </div>
      </div>

      <div v-else-if="gameState === 'feedback'" class="bg-slate-800 p-10 rounded-3xl border border-slate-700 text-center shadow-xl">
        <h3 class="text-5xl font-black mb-4" :class="lastGuessCorrect ? 'text-emerald-400' : 'text-rose-400'">
          {{ lastGuessCorrect ? 'CORRECT!' : 'INCORRECT' }}
        </h3>
        <p class="text-xl text-slate-300 mb-8">
          The answer was <strong class="text-white">{{ currentQuestion?.answer.toUpperCase() }}</strong>.
        </p>
        
        <button @click="nextTurn" class="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-xl text-lg uppercase tracking-widest w-full transition-colors">
          {{ currentQuestionIndex + 1 >= settings.questionCount ? 'View Final Scores' : 'Next Question ➔' }}
        </button>
      </div>

      <div v-else-if="gameState === 'gameover'" class="text-center">
        <div class="text-6xl mb-6">🏆</div>
        <h2 class="text-4xl font-black mb-10 uppercase tracking-widest text-amber-500">Game Over</h2>
        
        <div class="grid gap-4 mb-10" :class="settings.mode === 'versus' ? 'grid-cols-2' : 'grid-cols-1'">
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{{ settings.playerOne || 'Player 1' }}</p>
            <p class="text-4xl font-black text-white">{{ scores.player1.toLocaleString() }}</p>
          </div>
          
          <div v-if="settings.mode === 'versus'" class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{{ settings.playerTwo || 'Player 2' }}</p>
            <p class="text-4xl font-black text-white">{{ scores.player2.toLocaleString() }}</p>
          </div>
        </div>

        <button @click="restart" class="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-xl text-lg uppercase tracking-widest transition-colors shadow-md">
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
  // Kept the amber accent for the blank underline
  return text.replace(/____/g, '<span class="border-b-4 border-amber-500 px-6 inline-block mx-1"></span>')
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

const restart = () => {
  shuffleQuestions(quizData)

  currentQuestionIndex.value = 0
  currentQuestion.value = quizData[0]
  currentPlayer.value = 1
  scores.value = { player1: 0, player2: 0 }

  guess.value = ''
  lastGuessCorrect.value = false
  gameState.value = 'playing'

  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>