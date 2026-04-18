<template>
  <header class="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl z-20 relative shrink-0 flex flex-col font-sans select-none">
    
    <div class="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-slate-800/50">
      <button @click="goBack" class="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Leave
      </button>

      <button @click="openModal = true" v-if="gameStarted" class="flex items-center gap-2 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50 hover:border-rose-500/30">
        Restart
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div v-if="!gameStarted" class="flex flex-col items-center justify-center pb-3 gap-6 max-w-xl mx-auto w-full px-4">
      <div class="text-center w-full">
        <p class="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Choose Your Weapon</p>
        <div class="flex justify-center gap-6">
          <button @click="setGame('x')" class="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/10 text-5xl font-black text-cyan-400 shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center">
            X
          </button>
          <button @click="setGame('o')" class="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-600 hover:border-pink-400 hover:bg-pink-500/10 text-5xl font-black text-pink-400 shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center">
            O
          </button>
        </div>
      </div>
    </div>

    <div v-if="gameStarted" class="flex items-stretch justify-between max-w-3xl mx-auto w-full px-4 sm:px-8 py-5 gap-2 sm:gap-6">   
      <div class="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl border-2 transition-all duration-300"
           :class="pTurn === p1Symbol ? 
           (p1Symbol === 'x' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-105' : 'bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/20 scale-105') : 'bg-slate-800/30 border-transparent opacity-60 scale-95'">
           <span class="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Player 1</span>
        <span class="text-4xl font-mono font-black mb-1" :class="p1Symbol === 'x' ? 'text-cyan-400' : 'text-pink-400'">{{ p1Symbol }}</span>
        <span class="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter text-white font-mono">{{ p1Wins }}</span>
      </div>
      
      <div class="flex flex-col justify-center items-center shrink-0 px-2 sm:px-4">
        <span class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Draws</span>
        <span class="text-2xl sm:text-3xl font-black text-slate-300 font-mono">{{ ties }}</span>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl border-2 transition-all duration-300"
           :class="pTurn === p2Symbol ? (p2Symbol === 'x' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-105' : 'bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/20 scale-105') : 'bg-slate-800/30 border-transparent opacity-60 scale-95'">
           <span class="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Player 2</span>
        <span class="text-4xl font-mono font-black mb-1" :class="p2Symbol === 'x' ? 'text-cyan-400' : 'text-pink-400'">{{ p2Symbol }}</span>
        <span class="text-3xl sm:text-5xl font-black tabular-nums tracking-tighter text-white font-mono">{{ p2Wins }}</span>
      </div>
    </div>
  </header>

  
    <Teleport to="body">
      <div v-if="openModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
        <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" @click="openModal = false"></div>
              
        <div class="relative w-full max-w-sm bg-slate-800 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col p-8 text-center animate-fade-in-up">
          <div class="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <span class="text-3xl">⚠️</span>
          </div>
          <h2 class="text-2xl font-black mb-2 text-white uppercase tracking-widest">Reset Match?</h2>
          <p class="text-slate-400 text-sm mb-8">This will wipe all scores and progress. Are you sure?</p>

          <div class="flex gap-4">
            <button @click="openModal = false" class="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-sm">
              Cancel
            </button>
            <button @click="resetGame" class="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-transform active:scale-95 uppercase tracking-widest text-sm">
              Yes, Reset
            </button>
          </div>
        </div>
      </div>
    </Teleport>

</template>

<script setup lang="ts">
const $router = useRouter()
const tictactoe = useTictactoe()
const {playerOne, playerTwo, playerOneWins, playerTwoWins, drawTies, turn, openModal, settings} = storeToRefs(tictactoe)
const {setSymbol, reset, restart} = tictactoe

const tictactoe2 = useTictactoe2()
const {playerTurn, playGame, player1, player2, gameScores} = storeToRefs(tictactoe2)
const {clearAll} = tictactoe2

const setGame = (symbol: PlayerSymbol | Player) => {
  if (settings.value.gridMode === 'single') {
    setSymbol(symbol as PlayerSymbol)
  } else {
    playerTurn.value = symbol.toLowerCase() as Player
    player1.value = playerTurn.value
    player1.value === 'x' ? player2.value = 'o' : player2.value = 'x'
    playGame.value = true
  }

  gameStarted.value = true
}

const gameStarted = ref(false)

const p1Symbol = computed(() => {
  if (settings.value.gridMode === 'single') {
    return playerOne.value
  } else {
    return player1.value
  }
})

const p2Symbol = computed(() => {
  if (settings.value.gridMode === 'single') {
    return playerTwo.value
  } else {
    return player2.value
  }
})

const p1Wins = computed(() => {
    if (settings.value.gridMode === 'single') {
    return playerOneWins.value
  } else {
    return gameScores.value[player1.value]
  }
})

const p2Wins = computed(() => {
  if (settings.value.gridMode === 'single') {
    return playerTwoWins.value
  } else {
    return gameScores.value[player2.value]
  }
})

const ties = computed(() => {
  if (settings.value.gridMode === 'single') {
    return drawTies.value
  } else {
    return gameScores.value.tie
  }
})

const pTurn = computed(() => {
  if (settings.value.gridMode === 'single') {
    return turn.value
  } else {
    return playerTurn.value
  }
})

const goBack = () => {
  if (settings.value.gridMode === 'single') {
    reset()
  } else {
    clearAll()
  }  $router.push('/tictactoe')
}

const resetGame = () => {
  if (settings.value.gridMode === 'single') {
    restart()
  } else {
    clearAll()
  }
}
</script>