<template>
  <div class="min-h-screen bg-[#0f1523] flex flex-col items-center font-sans text-white">
    <!-- Setup Screen -->
    <div v-if="gameState === 'setup'" class="flex-1 flex flex-col items-center justify-center w-full px-4">
      <div class="bg-[#1a2332] p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
        <h1 class="text-2xl font-bold mb-8 text-center tracking-wider text-slate-200">CALL SELECTOR</h1>
        
        <div class="mb-6">
          <label class="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
            Number of Calls (Winners)
          </label>
          <input
            v-model.number="numWinners"
            type="number"
            min="1"
            class="w-full px-4 py-3 bg-[#0f1523] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div class="mb-8">
          <label class="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
            Total Number of Students
          </label>
          <input
            v-model.number="numTotal"
            type="number"
            :min="numWinners"
            class="w-full px-4 py-3 bg-[#0f1523] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <button
          @click="startGame"
          class="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-4 px-4 rounded-xl text-lg tracking-widest transition duration-200"
        >
          START
        </button>
      </div>
    </div>

    <!-- Playing Screen -->
    <div v-else class="w-full max-w-3xl flex flex-col min-h-screen">
      <!-- Top Navigation -->
      <div class="flex justify-between items-center p-4 pt-6 mb-12">
        <button
          @click="goBack"
          class="flex items-center gap-2 bg-[#1a2332] hover:bg-[#232f43] border border-slate-700 text-slate-300 text-xs sm:text-sm font-bold py-2 px-4 rounded-lg tracking-widest transition duration-200"
        >
          <span>←</span> LEAVE
        </button>
        
        <button
          @click="reshuffle"
          class="flex items-center gap-2 bg-[#1a2332] hover:bg-[#232f43] border border-slate-700 text-slate-300 text-xs sm:text-sm font-bold py-2 px-4 rounded-lg tracking-widest transition duration-200"
        >
          RESTART <span>↻</span>
        </button>
      </div>

      <!-- Game Grid -->
      <div class="flex-1 flex justify-center px-4">
        <div class="grid grid-cols-3 sm:grid-cols-4 gap-6 sm:gap-8 place-items-center auto-rows-max">
          <div
            v-for="(card, index) in cards"
            :key="card.id"
            @click="handleCardClick(index)"
            :class="[
              'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center cursor-pointer transform transition-all duration-300 select-none',
              card.isFlipped
                ? card.isWinner
                  ? 'bg-green-900/40 border-[3px] border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                  : 'bg-red-900/40 border-[3px] border-red-500 opacity-60'
                : 'bg-[#141d2b] border-[3px] border-[#0d7488] shadow-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(13,116,136,0.4)]'
            ]"
          >
            <!-- Unopened State -->
            <template v-if="!card.isFlipped">
              <span class="text-4xl sm:text-5xl text-white font-bold pb-1 shadow-black drop-shadow-md">?</span>
            </template>
            
            <!-- Winner State -->
            <template v-else-if="card.isWinner">
              <div class="flex flex-col items-center animate-bounce">
                <span class="text-3xl sm:text-4xl mb-1">📞</span>
              </div>
            </template>
            
            <!-- Empty State -->
            <template v-else>
              <div class="flex flex-col items-center">
                <span class="text-3xl sm:text-4xl opacity-50">❌</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const {
  playForfeitSound,
  playAlarm,
  playKillTurnSound,
  playRevealSound,
  playTransferTurnSound,
  playWinSound,
  vibrateOnIndexPress
} = useSounds()

interface Card {
  id: number
  isWinner: boolean
  isFlipped: boolean
}

const numWinners = ref(3)
const numTotal = ref(12)
const gameState = ref<'setup' | 'playing'>('setup')
const cards = ref<Card[]>([])

const startGame = () => {
  if (numWinners.value > numTotal.value) {
    alert("Number of callers cannot be greater than the total number of boxes.")
    return
  }
  
  generateAndShuffleCards()
  gameState.value = 'playing'
}

const generateAndShuffleCards = () => {
  let initialCards = Array(numTotal.value).fill(false)
  for (let i = 0; i < numWinners.value; i++) {
    initialCards[i] = true
  }

  // Fisher-Yates Shuffle
  for (let i = initialCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]]
  }

  cards.value = initialCards.map((isWinner, index) => ({
    id: index,
    isWinner,
    isFlipped: false
  }))
}

const handleCardClick = (index: number) => {
  const card = cards.value[index]
  
  if (card.isFlipped) return

  vibrateOnIndexPress?.()
  card.isFlipped = true

  if (card.isWinner) {
    playWinSound?.()
  } else {
    playForfeitSound?.()
  }
}

const reshuffle = () => {
  generateAndShuffleCards()
}

const goBack = () => {
  gameState.value = 'setup'
  cards.value = []
}
</script>
