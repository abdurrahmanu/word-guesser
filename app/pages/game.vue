<template>
  <main class="min-h-screen bg-slate-900 flex flex-col font-sans select-none">
    <header class="bg-slate-800 p-4 shadow-md rounded-b-3xl z-10 relative">
      <div class="flex justify-between items-center mb-4">
        <div class="flex flex-col items-center p-3 rounded-xl min-w-20" :class="[store.currentTeamTurn === 1 ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300' : 'bg-slate-700 text-slate-400']">
          <span class="font-bold uppercase tracking-wider">{{ teamOne }}</span>
          <span class="text-3xl font-black">{{ store.team1Score }}</span>
        </div>
        
        <button @click="$router.push('/')" class="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-500 hover:text-white transition-colors">
          ✕
        </button>

        <div class="flex flex-col items-center p-3 rounded-xl min-w-20" :class="store.currentTeamTurn === 2 ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-300' : 'bg-slate-700 text-slate-400'">
          <span class="font-bold uppercase tracking-wider">{{ teamTwo }}</span>
          <span class="text-3xl font-black">{{ store.team2Score }}</span>
        </div>
      </div>

      <div class="flex justify-center gap-4 text-sm text-slate-300 font-medium">
        <div class="bg-slate-900 px-3 py-1 rounded-full">Total: {{ store.settings.wordCount }}</div>
        <div class="bg-slate-900 px-3 py-1 rounded-full">Used: {{ store.usedIndexes.length }}</div>
        <div v-if="store.settings.allowTransfer" class="bg-slate-900 px-3 py-1 rounded-full">Transferred: {{ store.transferredCount }}</div>
      </div>
    </header>

    <div class="flex-1 p-6 overflow-y-auto">
      <p class="text-center uppercase font-bold mb-6 text-slate-400">
        Select an index
      </p>
      <div class="grid grid-cols-4 gap-3">
        <button 
          v-for="(word, index) in store.gameWords" 
          :key="index"
          @click="openModal(index, word)"
          :disabled="store.usedIndexes.includes(index)"
          class="aspect-square rounded-2xl flex items-center justify-center text-5xl font-black transition-all shadow-sm"
          :class="store.usedIndexes.includes(index) 
            ? 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed' 
            : 'ring-2 ring-cyan-500/50 bg-animated-gradient shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white hover:bg-cyan-800 active:scale-95 shadow-indigo-500/30'"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="activeWord" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click.stop></div>
        
        
        <div class="relative w-full max-w-sm h-[85%] bg-white rounded-3xl shadow-2xl flex flex-col p-6 pt-4 overflow-hidden">
          <div class="mx-auto w-fit">
            <button v-if="!isWordRevealed" @click="closeModalWithoutSwitchingTurn" class="font-mono text-3xl font-bold text-red-700 h-10 w-10 text-center ring ring-red-600 hover:text-white hover:bg-red-800 rounded-full">X</button>
          </div>
          
          <div class="text-center space-y-1">
              <span class="text-6xl font-black tabular-nums" :class="timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'">
              {{ timeLeft }}s
            </span>
          </div>


          <div class="flex-1 flex flex-col items-center justify-center">
            <h2 
              class="text-4xl sm:text-5xl font-black text-center text-slate-900 tracking-tight transition-all duration-300"
              :class="isWordRevealed ? 'blur-none' : 'blur-xl select-none'"
            >
              {{ activeWord.text }}
            </h2>
            <p v-if="!isWordRevealed" class="text-slate-400 text-sm mt-4 font-bold text-center">Explainer, click below when ready</p>
          </div>

          <div class="mt-auto space-y-4">
            <button 
              v-if="!isWordRevealed && !timeUp" 
              @click="revealAndStartTimer"
              class="w-full bg-indigo-600 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform"
            >
              SHOW WORD
            </button>

            <div class="space-y-3" v-if="isWordRevealed && !timeUp">

              <button 
              @click="markAnswered"
              class="w-full bg-emerald-500 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-emerald-500/40"
              >
              ANSWERED!
            </button>

              <button 
              @click="startTransferTurn"
              class="w-full bg-red-500 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-emerald-500/40">
              FORFEIT TURN
            </button>
            
            </div>
            

            <template v-if="timeUp">
              <div class="text-center text-red-500 font-bold mb-4 uppercase tracking-widest animate-bounce">Time's Up!</div>
              
              <button 
                v-if="isTransferMode" 
                @click="startTransferTurn"
                class="w-full bg-orange-500 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-orange-500/40"
              >
                TRANSFER TURN TO TEAM {{ store.currentTeamTurn === 1 ? 2 : 1 }}
              </button>

              <button 
                v-else
                @click="closeModalAndSwitchTurn"
                class="w-full bg-slate-800 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform"
              >
                BACK TO BOARD
              </button>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="store.isGameOver || store.earlyWinner" class="fixed inset-0 z-60 flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md">
        <div class="bg-white p-8 rounded-3xl shadow-2xl text-center w-full max-w-sm relative">
          
          <button v-if="store.earlyWinner && !store.isGameOver" @click="store.continueAfterEarlyWin = true" class="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full text-slate-500 font-bold hover:bg-slate-200">✕</button>

          <div class="text-6xl mb-4">🏆</div>
          <h2 class="text-3xl font-black text-slate-800 mb-2">
            Team {{ store.team1Score > store.team2Score ? '1' : (store.team2Score > store.team1Score ? '2' : 'Tie') }} Wins!
          </h2>
          <p v-if="store.earlyWinner" class="text-slate-500 font-medium mb-6">Mathematically impossible for the other team to catch up.</p>
          <p v-else class="text-slate-500 font-medium mb-6">All words have been used up!</p>
          
          <div class="flex justify-center gap-6 mb-8 text-2xl font-black">
            <span class="text-blue-600">{{ store.team1Score }}</span>
            <span class="text-slate-300">-</span>
            <span class="text-red-600">{{ store.team2Score }}</span>
          </div>

          <div class="space-y-3">
            <button v-if="store.earlyWinner" @click="store.continueAfterEarlyWin = true" class="w-full bg-slate-200 text-slate-800 font-bold py-4 rounded-xl active:scale-95">
              Continue Playing
            </button>
            <button @click="$router.push('/setup')" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl active:scale-95 shadow-lg">
              Restart Game
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
const store = useGameStore()
const {teamOne, teamTwo} = storeToRefs(store)

onMounted(() => {
  store.loadState()
})

// Modal & Game State
const activeWord = ref(null) // { index, text }
const isWordRevealed = ref(false)
const timeLeft = ref(0)
const timeUp = ref(false)
const isTransferMode = ref(false) // True when timer ends and transfer is allowed
let timerInterval = null

// Audio Alarm via Web API
const playAlarm = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5)
    osc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch(e) { console.error("Audio API failed", e) }
}

const openModal = (index, text) => {
  activeWord.value = { index, text }
  isWordRevealed.value = false
  timeLeft.value = store.settings.timerSeconds
  timeUp.value = false
  isTransferMode.value = false
}

const revealAndStartTimer = () => {
  isWordRevealed.value = true
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval)
      handleTimeout()
    }
  }, 1000)
}

const handleTimeout = () => {
  timeUp.value = true
  playAlarm()
  if (store.settings.allowTransfer) {
    isTransferMode.value = true
  }
}

const markAnswered = () => {
  clearInterval(timerInterval)
  
  // Award point to the team who guessed it. 
  // If we are in transfer mode, the opposing team gets it.
  let scoringTeam = store.currentTeamTurn
  if (isTransferMode.value) {
    scoringTeam = store.currentTeamTurn === 1 ? 2 : 1
    store.transferredCount++
  }

  store.recordCorrectAnswer(scoringTeam)
  store.markWordUsed(activeWord.value.index)
  closeModalAndSwitchTurn()
}

const startTransferTurn = () => {
  isTransferMode.value = true
  timeUp.value = false
  timeLeft.value = store.settings.timerSeconds / 2 // Optionally give them half time, or full time
  revealAndStartTimer()
}

const closeModalAndSwitchTurn = () => {
  activeWord.value = null
  store.switchTurn()
  // Disable transfer mode for next word
  isTransferMode.value = false 
}

const closeModalWithoutSwitchingTurn = () => {
  activeWord.value = null
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>