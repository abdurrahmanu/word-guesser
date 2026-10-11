<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
    <h1 class="text-3xl font-bold mb-8 text-blue-700">Phone Call Selector</h1>

    <!-- Setup Screen -->
    <div v-if="gameState === 'setup'" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">
          Number of students to call (Winners)
        </label>
        <input
          v-model.number="numWinners"
          type="number"
          min="1"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 font-semibold mb-2">
          Total number of boxes (Total Students)
        </label>
        <input
          v-model.number="numTotal"
          type="number"
          :min="numWinners"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        @click="startGame"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-200"
      >
        START
      </button>
    </div>

    <!-- Playing Screen -->
    <div v-else class="w-full max-w-4xl flex flex-col items-center">
      <div class="flex gap-4 mb-8">
        <button
          @click="goBack"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
        >
          Back
        </button>
        <button
          @click="reshuffle"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
        >
          Reshuffle Boxes
        </button>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          @click="handleCardClick(index)"
          :class="[
            'w-24 h-32 sm:w-28 sm:h-36 flex items-center justify-center rounded-xl cursor-pointer transform transition-all duration-300 shadow-lg',
            card.isFlipped
              ? card.isWinner
                ? 'bg-green-100'
                : 'bg-red-100'
              : 'bg-blue-500 hover:bg-blue-400 scale-100 hover:scale-105'
          ]"
        >
          <template v-if="!card.isFlipped">
            <span class="text-4xl text-white font-bold opacity-50">?</span>
          </template>
          
          <template v-else-if="card.isWinner">
            <div class="flex flex-col items-center animate-bounce">
              <span class="text-4xl mb-2">📞</span>
              <span class="text-green-700 font-bold text-sm">CALL!</span>
            </div>
          </template>
          
          <template v-else>
            <div class="flex flex-col items-center">
              <span class="text-4xl mb-2 opacity-80">❌</span>
              <span class="text-red-700 font-bold text-sm">Empty</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Assuming useSounds is auto-imported by Nuxt 3 from your composables directory
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
const numTotal = ref(10)
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

  // Fisher-Yates Shuffle for true randomization
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
  
  if (card.isFlipped) return // Prevent clicking already flipped cards

  // Trigger haptic feedback when a box is pressed
  vibrateOnIndexPress?.()

  card.isFlipped = true

  // Play corresponding sound from your composable
  if (card.isWinner) {
    playWinSound?.()
  } else {
    // Used playForfeitSound for empty boxes. You can swap this with playRevealSound if preferred.
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
