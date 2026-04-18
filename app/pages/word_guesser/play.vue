<template>
  <main class="min-h-screen bg-slate-900 flex flex-col font-sans select-none">
  <header class="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl z-20 relative shrink-0 flex flex-col">
    
    <div class="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-slate-800/50">
      <button @click="$router.push('/word_guesser')" class="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Leave
      </button>

      <span :class="[(usedIndexes.length || killedIndexes.length) ? 'text-green-500' : 'text-slate-500 blur-sm']" class="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">in Progress</span>

      <button @click="restart" class="flex items-center gap-2 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50 hover:border-rose-500/30">
        Restart
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div class="flex justify-center items-center gap-2 shrink-0 px-2 sm:px-6">
        <div class="flex gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          <div class="flex items-center justify-between gap-3 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
            <span class="text-slate-500">Total</span>
            <span class="text-slate-200">{{ store.settings.wordCount }}</span>
          </div>
          <div class="flex items-center justify-between gap-3 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
            <span class="text-slate-500">Solved</span>
            <span class="text-emerald-400">{{ store.usedIndexes.length }}</span>
          </div>
          <div class="flex items-center justify-between gap-3 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
            <span class="text-slate-500">Skipped</span>
            <span class="text-amber-400">{{ store.killedIndexes.length }}</span>
          </div>
        </div>
    </div>

    <div class="flex items-stretch justify-between max-w-5xl mx-auto w-full px-4 sm:px-8 py-6 gap-4">
      <div 
        class="flex-1 flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300"
        :class="store.currentTeamTurn === 1 ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10 transform scale-105' : 'bg-slate-800/30 border-transparent opacity-60 scale-95'"
      >
        <span class="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1" :class="store.currentTeamTurn === 1 ? 'text-violet-400' : 'text-slate-500'">
          {{ teamOne }}
        </span>
        <span class="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter" :class="store.currentTeamTurn === 1 ? 'text-white' : 'text-slate-400'">
          {{ store.team1Score }}
        </span>
      </div>

      <div 
        class="flex-1 flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300"
        :class="store.currentTeamTurn === 2 ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10 transform scale-105' : 'bg-slate-800/30 border-transparent opacity-60 scale-95'"
      >
        <span class="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1" :class="store.currentTeamTurn === 2 ? 'text-violet-400' : 'text-slate-500'">
          {{ teamTwo }}
        </span>
        <span class="text-5xl sm:text-7xl font-black tabular-nums tracking-tighter" :class="store.currentTeamTurn === 2 ? 'text-white' : 'text-slate-400'">
          {{ store.team2Score }}
        </span>
      </div>

    </div>
  </header>

    <div class="flex-1 p-6 pl-1 overflow-y-auto">
      <div class="grid grid-cols-4 gap-10">
        <button 
          v-for="(word, index) in store.gameWords" 
          :key="index"
          @click="openModal(index, word)"
          :disabled="store.usedIndexes.includes(index) || store.killedIndexes.includes(index)"
          class="aspect-square relative animate-pulse shadow-lg  shadow-black rounded-full flex items-center  font-medium justify-center text-5xl transition-all"
          :style="scatterCircles[index]"
          :class="[ store.usedIndexes.includes(index) 
            ? 'bg-slate-800 text-slate-200 ring-2 ring-cyan-900 opacity-50 cursor-not-allowed' 
            : store.killedIndexes.includes(index) ? 'cursor-not-allowed ring-2 ring-red-900/40 text-red-400/70' : 'ring-2 ring-cyan-500/50 bg-animated-gradient shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white hover:bg-cyan-800 active:scale-95']">
          <span v-if="!store.usedIndexes.includes(index) && !store.killedIndexes.includes(index)">?</span>
          <div v-if="store.usedIndexes.includes(index) || store.killedIndexes.includes(index)" class="text-[18px] -rotate-45">
            <p v-if="store.usedIndexes.includes(index)" class="text-green-400 text-xl">{{ store.indexWinner[index] === 1 ? '1' : '2' }}</p>
          </div>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="activeWord" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click.stop></div>
              
        <div class="relative w-full max-w-sm h-full space-y-5">
          <div class="mx-auto w-fit">
            <button v-if="!isWordRevealed" @click="closeModalWithoutSwitchingTurn" class="font-mono text-lg font-black text-blue-400 px-10 py-2 text-center ring ring-blue-600 hover:text-white hover:blue-red-800 rounded-full">CHANGE SELECTION</button>
          </div>

          <div class="relative w-full max-w-sm h-[90%] bg-white rounded-3xl shadow-2xl flex flex-col p-6 overflow-hidden">
            <div class="text-center space-y-1">
                <span class="text-6xl font-black tabular-nums" :class="timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'">
                {{ timeLeft }}s
              </span>
            </div>

            <p class="text-center py-10 text-xl font-black uppercase">{{ store.currentTeamTurn === 1 ? 'Team One' : 'Team Two'}}</p>

            <p v-if="isTransferMode" class="text-center w-fit top-10 relative mx-auto text-sm font-bold bg-amber-500 rounded-full px-10 py-1 -rotate-10 animate-pulse">BONUS</p>

            <div class="flex-1 flex flex-col items-center justify-center">
              <h2 
                class="text-6xl sm:text-5xl font-black text-center text-slate-900 tracking-tight transition-all duration-300"
                :class="[isWordRevealed && 'blur-none', (!isWordRevealed || timeUp) && 'blur-xl select-none']">
                {{ activeWord.text }}
                <div v-if="!isTransferMode && (useDefinition && timeLeft <= Math.round(settings.timerSeconds) / 2) ">
                  <button @click="showDefinition = !showDefinition" class="px-5 py-1 text-base font-semibold rounded-md text-white bg-green-500">{{ !showDefinition ? 'Definition' : 'Close' }}</button>
                  <p class="text-base font-semibold py-2 font-sans" v-if="showDefinition">{{ allDefinitions[activeWord.text] }}</p>
                </div>
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
                @click="forfeitTurn"
                class="w-full bg-red-500 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-emerald-500/40">
                FORFEIT TURN
              </button>
              </div>
              
              <template v-if="timeUp">
                <div class="text-center text-red-500 font-bold mb-4 uppercase tracking-widest animate-bounce">Time's Up!</div>
                <button 
                  v-if="isTransferMode" 
                  @click="startTransferTurn"
                  class="w-full bg-orange-500 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-orange-500/40">
                  TRANSFER TURN TO TEAM {{ store.currentTeamTurn === 1 ? 2 : 1 }}
                </button>

                <button 
                  v-if="isTransferMode" 
                  @click="killWordAndTurn"
                  class="w-full bg-red-500 text-white font-bold text-xl py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-orange-500/40">
                  KILL TURN & WORD
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
            <button @click="$router.push('/word-guesser')" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl active:scale-95 shadow-lg">
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
const {teamOne, teamTwo, settings, usedIndexes, killedIndexes, useDefinition, useSound, allDefinitions} = storeToRefs(store)
const {initGame} = store
const clickedIndex = ref(null)
const showDefinition = ref(false)
const winAudio = new Audio('/win.mp3')
const revealAudio = new Audio('/reveal.wav')
revealAudio.volume = 0.5

onMounted(() => store.loadState())

const activeWord = ref(null) // { index, text }
const isWordRevealed = ref(false)
const timeLeft = ref(0)
const timeUp = ref(false)
const isTransferMode = ref(false)
let timerInterval = null

const scatterCircles = computed(() => {
  let indexes = usedIndexes.value || killedIndexes.value

  let object = {}

  for (let index = 0; index < settings.value.wordCount - 1; index++) {
    object[index] = {
          rotate: `${index + 1 * (Math.random() * 100)}deg`, 
          top: `${(Math.random() * 30)}px`, 
          left: `${(Math.random() * 10)}px`, 
      }
  }

  console.log('how');
  
  return object
})

const playAlarm = () => {
  if (!useSound.value) return
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

const playWinSound = () => {
    if (!useSound.value) return
      try {
        winAudio.currentTime = 0; 
        winAudio.play();
      } catch(e) { 
        console.error("Failed to play audio", e); 
      }
};

const playRevealSound = () => {
    if (!useSound.value) return
      try {
        revealAudio.currentTime = 0; 
        revealAudio.play();
      } catch(e) { 
        console.error("Failed to play audio", e); 
      }
};

const playForfeitSound = () => {
    if (!useSound.value) return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // 'sawtooth' gives a harsh, buzzy sound perfect for a penalty or loss
    osc.type = 'sawtooth'; 

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // --- Pitch Envelope (The Deflate) ---
    // Start at a medium pitch and slide down very low over 1.5 seconds
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 1.5);

    // --- Volume Envelope (The Fade) ---
    // Start at 30% volume and fade out smoothly
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 1.5);

    osc.start(now);
    osc.stop(now + 1.5);
  } catch(e) { 
    console.error("Audio API failed", e); 
  }
};

const playTransferTurnSound = () => {
    if (!useSound.value) return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // A 'sine' wave is very smooth and clean—perfect for subtle UI sounds
    osc.type = 'sine'; 

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(440, now);           // Note A4
    osc.frequency.setValueAtTime(587.33, now + 0.05); // Note D5 (jumps up after 50ms)

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02); // Quick ramp up to avoid clicks
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15); // Fast fade out

    osc.start(now);
    osc.stop(now + 0.15);
  } catch(e) { 
    console.error("Audio API failed", e); 
  }
};

const playKillTurnSound = () => {
  if (!useSound.value) return
  try {
const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square'; 

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // --- Pitch (The Motor Speed) ---
    // Dropped to 15Hz. This is sub-audio, meaning you will hear
    // individual, rapid clicks rather than a smooth tone.
    osc.frequency.setValueAtTime(15, now); 

    // --- Volume Envelope (The Buzz) ---
    // Bumped the volume slightly to 0.5 to ensure the heavy clicks punch through
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02); 
    gainNode.gain.setValueAtTime(0.5, now + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); 

    osc.start(now);
    osc.stop(now + 0.3);
  } catch(e) { 
    console.error("Audio API failed", e); 
  }
};

const vibrateOnIndexPress = () => {
  if (!useSound.value) return
    try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Changed to 'square' for a mechanical, phone-motor feel
    osc.type = 'square'; 

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // --- Pitch (The Motor Speed) ---
    // A steady 75Hz creates a tight, convincing physical vibration sound.
    // No sliding pitch this time!
    osc.frequency.setValueAtTime(75, now); 

    // --- Volume Envelope (The Buzz) ---
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02); // Fast ramp up
    gainNode.gain.setValueAtTime(0.3, now + 0.25);          // Hold steady
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); // Sharp cutoff

    osc.start(now);
    osc.stop(now + 0.3);
  } catch(e) { 
    console.error("Audio API failed", e); 
  }
};

const openModal = (index, text) => {
  vibrateOnIndexPress()
  clickedIndex.value = index
  activeWord.value = { index, text }
  isWordRevealed.value = false
  timeLeft.value = store.settings.timerSeconds
  timeUp.value = false
  isTransferMode.value = false
}

const revealAndStartTimer = () => {
  isWordRevealed.value = true
  playRevealSound()
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
  let scoringTeam = store.currentTeamTurn

  playWinSound()

  if (isTransferMode.value) store.transferredCount++
  
  store.recordCorrectAnswer(scoringTeam, clickedIndex.value)
  store.markWordUsed(activeWord.value.index)
  closeModalAndSwitchTurn()
  clickedIndex.value = null
}

const killWordAndTurn = () => {
  clearInterval(timerInterval)
  playKillTurnSound()
  store.markWordUsed(activeWord.value.index, true)
  closeModalAndSwitchTurn()
}

const startTransferTurn = () => {
  isTransferMode.value = true
  playTransferTurnSound()
  timeUp.value = false
  timeLeft.value = store.settings.timerSeconds / 2 // Optionally give them half time, or full time
  revealAndStartTimer()
  store.switchTurn()
}

const forfeitTurn = () => {
  clearInterval(timerInterval)
  playForfeitSound()
  timeUp.value = true
  timeLeft.value = 0
  if (store.settings.allowTransfer) isTransferMode.value = true
}

const closeModalAndSwitchTurn = () => {
  activeWord.value = null
  if (!isTransferMode.value) store.switchTurn()
  isTransferMode.value = false 
}

const restart = () => initGame(settings.value)
const closeModalWithoutSwitchingTurn = () => activeWord.value = null

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>