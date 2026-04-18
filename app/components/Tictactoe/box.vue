<template>
  <div 
    :id="index.toString()"
    @click="playerOne && !winIndexes.length && !openModal ? play($event) : null"
    :class="[
      'cursor-pointer rounded-2xl font-mono flex items-center justify-center text-6xl sm:text-7xl md:text-8xl font-black transition-all duration-300 shadow-inner select-none',
      winIndex 
        ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 scale-105' 
        : 'bg-slate-900 border border-slate-700 hover:bg-slate-800'
    ]"
    :style="{ color: !winIndex ? getTextColor($el?.innerText) : '' }"
  ></div>
</template>

<script setup>
const tictactoe = useTictactoe()
const {winIndexes, playerOne, openModal} = storeToRefs(tictactoe)
const {play} = tictactoe

const props = defineProps({
  index: Number,
  winIndex: Boolean,
})

const getTextColor = (text) => {
  if (text === 'X') return '#22d3ee' // cyan-400
  if (text === 'O') return '#f472b6' // pink-400
  return '#f8fafc' // slate-50
}
</script>