<template>
  <main class="min-h-screen bg-slate-900 flex flex-col font-sans select-none">
    
    <header class="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl z-20 relative shrink-0 flex flex-col">
      
      <div class="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-slate-800/50">
        <button @click="$router.push('/scrambled_words')" class="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Leave
        </button>

        <span class="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:block"
              :class="gameType === 'solo' ? 'text-green-500' : 'text-amber-400'">
          {{ gameType === 'solo' ? 'Solo Run' : 'Match' }}
        </span>

        <button @click="restartGame" class="flex items-center gap-2 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50 hover:border-rose-500/30">
          Restart
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div v-if="gameType === 'solo'" class="flex items-center justify-center max-w-4xl mx-auto w-full px-4 sm:px-8 py-4 gap-6 sm:gap-12">
        <div class="flex-1 flex justify-end">
          <div class="flex flex-col items-center sm:items-end bg-slate-800/30 px-4 py-3 rounded-2xl border border-slate-700/30">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Answered</span>
            <span class="text-2xl sm:text-3xl font-black text-emerald-400">{{ answeredCount }}</span>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center p-4 rounded-3xl border-2 bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/20 shrink-0 min-w-35">
          <span class="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 text-pink-400">Score</span>
          <span class="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter text-white drop-shadow-md">{{ soloScore }}</span>
        </div>

        <div class="flex-1 flex justify-start">
          <div class="flex flex-col items-center sm:items-start bg-slate-800/30 px-4 py-3 rounded-2xl border border-slate-700/30">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Missed</span>
            <span class="text-2xl sm:text-3xl font-black text-rose-400">{{ missedCount }}</span>
          </div>
        </div>
      </div>

      <div v-else class="flex items-stretch justify-between max-w-5xl mx-auto w-full px-4 sm:px-8 py-5 gap-4">
        
        <div class="flex-1 flex flex-col items-center justify-center p-4 rounded-3xl border-2 bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 text-cyan-400">
            {{ playerOne || 'Player 1' }}
          </span>
          <span class="text-4xl sm:text-6xl font-black tabular-nums tracking-tighter text-white">
            {{ versusScores.player1 }}
          </span>
        </div>
        
        <div class="flex flex-col justify-center items-center shrink-0 px-2 sm:px-4">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Timer</span>
          <span class="text-xl sm:text-2xl font-black text-slate-300">{{ countdownTimer }}s</span>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center p-4 rounded-3xl border-2 bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/10">
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 text-pink-400">
            {{ playerTwo || 'Player 2' }}
          </span>
          <span class="text-4xl sm:text-6xl font-black tabular-nums tracking-tighter text-white">
            {{ versusScores.player2 }}
          </span>
        </div>

      </div>
    </header>

    <div class="flex-1 p-6 flex flex-col pt-10 sm:pt-14 overflow-y-auto relative z-10">
      <div class="w-full max-w-2xl mx-auto flex flex-col items-center space-y-8">
        
        <div v-show="gameState === 'playing'" class="text-center">
          <span class="text-6xl font-black tabular-nums transition-colors duration-300" :class="timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-200'">
            {{ timeLeft }}s
          </span>
        </div>

        <div v-show="gameState === 'result'">
          <h2 class="text-2xl font-black mb-2 uppercase tracking-widest"
              :class="{
                'text-emerald-500': roundWinner === 'solo',
                'text-cyan-400': roundWinner === 'p1',
                'text-pink-400': roundWinner === 'p2',
                'text-rose-500': roundWinner === 'skip' || roundWinner === 'time'
              }">
            <template v-if="roundWinner === 'solo'">Correct!</template>
            <template v-else-if="roundWinner === 'p1'">{{ playerOne || 'Player 1' }} Wins!</template>
            <template v-else-if="roundWinner === 'p2'">{{ playerTwo || 'Player 2' }} Wins!</template>
            <template v-else-if="roundWinner === 'skip'">Skipped!</template>
            <template v-else>Time's Up!</template>
          </h2>
        </div>

        <div class="w-full p-10 bg-pink-500/10 rounded-3xl text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-slate-500/5 pointer-events-none"></div>
          <p v-if="gameState === 'playing'" class="text-slate-400 font-bold tracking-[0.2em] text-xs uppercase mb-4 relative z-10">Unscramble This</p>
          <h2 class="text-3xl sm:text-4xl py-5 font-black text-white tracking-[0.15em] uppercase drop-shadow-md relative z-10">
            {{ scrambledWord }}
          </h2>
        </div>

        <div v-if="gameState === 'result'">
          <h2 class="text-3xl text-center font-black pt-3 text-green-500 tracking-[0.15em] uppercase drop-shadow-md">
            {{ currentWord }}
          </h2>
        </div>

        <div v-if="gameState === 'playing'" class="w-full max-w-lg space-y-4">
          <input 
            ref="wordInput"
            v-model="userInput" 
            @keyup.enter="gameType === 'solo' ? checkAnswer('solo') : null"
            :disabled="gameState !== 'playing'"
            type="text" 
            placeholder="Type answer here..." 
            class="w-full bg-slate-900/80 border-2 border-slate-600 rounded-2xl px-6 py-5 text-2xl text-center text-white font-black outline-none focus:border-pink-500 focus:bg-slate-800 transition-all shadow-inner uppercase placeholder:text-slate-500 placeholder:text-base placeholder:normal-case placeholder:font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            autocomplete="off">
            
            <button 
              v-if="gameType === 'solo'"
              @click="checkAnswer('solo')"
              :disabled="gameState !== 'playing'"
              class="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold text-lg py-5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50 tracking-widest uppercase">
              Answer
            </button>

            <div v-if="gameType === 'versus'" class="flex gap-4">
              <button 
                @click="checkAnswer('p1')"
                :disabled="gameState !== 'playing'"
                class="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm sm:text-base py-5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-cyan-900/30 disabled:opacity-50 tracking-widest uppercase flex flex-col items-center gap-1 border border-cyan-400/20">
                <span>{{ playerOne || 'Player 1' }}</span>
                <span class="text-[10px] text-cyan-200">Lock In</span>
              </button>
              <button 
                @click="checkAnswer('p2')"
                :disabled="gameState !== 'playing'"
                class="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm sm:text-base py-5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-pink-900/30 disabled:opacity-50 tracking-widest uppercase flex flex-col items-center gap-1 border border-pink-400/20">
                <span>{{ playerTwo || 'Player 2' }}</span>
                <span class="text-[10px] text-pink-200">Lock In</span>
              </button>
            </div>

            <button 
              @click="checkAnswer('skip')"
              :disabled="gameState !== 'playing'"
              class="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-sm py-4 rounded-2xl active:scale-95 transition-all border border-slate-700 disabled:opacity-50 tracking-widest uppercase">
              Skip Word
            </button>
          </div>

        <div v-if="gameState === 'result'" class="w-full">
          <button 
            @click="nextWord"
            class="w-full bg-slate-100 hover:bg-white text-slate-900 font-black text-lg py-4 rounded-2xl active:scale-95 transition-all shadow-lg uppercase tracking-widest">
            NEXT WORD ➔
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const scrambled = useScrambled()
const {countdownTimer, difficulty, gameType, modes, playerOne, playerTwo, selectedMode } = storeToRefs(scrambled)

type GameState = 'playing' | 'result'
const gameState = ref<GameState>('playing')

const currentWord = ref('')
const scrambledWord = ref('')
const userInput = ref('')
const timeLeft = ref(countdownTimer.value)
const wordInput = ref<HTMLInputElement | null>(null)

// Stats
const soloScore = ref(0)
const answeredCount = ref(0)
const missedCount = ref(0)
const versusScores = ref({ player1: 0, player2: 0 })

// Tracks who won the specific round for the modal
const roundWinner = ref<'solo' | 'p1' | 'p2' | 'skip' | 'time' | null>(null)

let gameTimer: ReturnType<typeof setInterval> | null = null

// --- COMPUTED ---
const activeArray = computed(() => {
  switch (selectedMode.value) {
    case 'animals': return animalsArray;
    case 'countries': return countriesArray;
    case 'cities': return citiesArray;
    case 'all': return combinedArray;
    default: return combinedArray;
  }
})

// --- FUNCTIONS ---
const scrambleText = (text: string) => {
  const words = text.split(' ')
  const scrambledWords = words.map(word => {
    let chars = word.split('')
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j] as string, chars[i] as string]
    }
    return chars.join('')
  })
  return scrambledWords.join(' ')
}

const generateWord = () => {
  let newWord = currentWord.value
  while (newWord === currentWord.value && activeArray.value.length > 1) {
    const randomIndex = Math.floor(Math.random() * activeArray.value.length)
    newWord = activeArray.value[randomIndex] as string
  }
  
  currentWord.value = newWord
  scrambledWord.value = scrambleText(newWord)
  userInput.value = ''
  roundWinner.value = null
  timeLeft.value = countdownTimer.value
  gameState.value = 'playing'
  startTimer()
  
  nextTick(() => {
    if (wordInput.value) wordInput.value.focus()
  })
}

const startTimer = () => {
  if (gameTimer) clearInterval(gameTimer)
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleRoundEnd('time')
    }
  }, 1000)
}

// Check answer determines WHO pressed the button
const checkAnswer = (submitter: 'solo' | 'p1' | 'p2' | 'skip') => {
  if (gameState.value !== 'playing') return

  if (submitter === 'skip') {
    handleRoundEnd('skip')
    return
  }

  const normalizedInput = userInput.value.toLowerCase().replace(/\s/g, '')
  const normalizedAnswer = currentWord.value.toLowerCase().replace(/\s/g, '')

  if (normalizedInput === normalizedAnswer) {
    // Correct Answer Logic
    if (submitter === 'solo') soloScore.value += 10
    if (submitter === 'p1') versusScores.value.player1 += 10
    if (submitter === 'p2') versusScores.value.player2 += 10
    
    answeredCount.value++
    handleRoundEnd(submitter)
  } else {
    // Incorrect Answer Logic
    // Briefly clear the input so they have to try again, or penalize.
    // For now, we just clear the input to force them to re-type.
    userInput.value = ''
    // Optionally flash the input red here
  }
}

const handleRoundEnd = (result: 'solo' | 'p1' | 'p2' | 'skip' | 'time') => {
  if (gameTimer) clearInterval(gameTimer)
  roundWinner.value = result
  
  if (result === 'skip' || result === 'time') {
    missedCount.value++
  }
  
  gameState.value = 'result'
}

const nextWord = () => {
  generateWord()
}

const restartGame = () => {
  soloScore.value = 0
  versusScores.value = { player1: 0, player2: 0 }
  answeredCount.value = 0
  missedCount.value = 0
  generateWord()
}

onMounted(() => generateWord())
onUnmounted(() => { if (gameTimer) clearInterval(gameTimer) })
</script>