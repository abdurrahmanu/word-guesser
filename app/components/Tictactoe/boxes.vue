<template>
  <div class="flex-1 flex flex-col py-20 items-center justify-center p-4 sm:p-8 relative z-10 font-sans w-full h-full">
  
    <div class="relative z-10 bg-slate-800/60 backdrop-blur-xl p-4 sm:p-6 rounded-[2.5rem] border border-orange-400/30 shadow-2xl mb-8">
      <div ref="squares" class="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 w-70 h-70 sm:w-80 sm:h-80 md:w-105 md:h-105 mx-auto">
        <TictactoeBox
          v-for="index in 9"
          :key="index"
          :hasInnerText="boxesID.includes(index.toString())"
          :winIndex="winIndexes.length > 0 && winIndexes.includes(index)"
          :index="index" 
        />
      </div>
    </div>
    
    <div v-if="start || playerOneWins || playerTwoWins || drawTies" class="relative z-10 flex gap-4 w-full max-w-sm mx-auto">
      <button 
        @click="undoMove()" 
        class="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm uppercase tracking-widest rounded-2xl border border-slate-700 transition-colors shadow-lg active:scale-95"
      >
        Undo
      </button>
      <button 
        @click="reset()" 
        class="flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-600/20 transition-transform active:scale-95"
      >
        Finish Round
      </button>
    </div>

  </div>
</template>

<script setup>
const tictactoe = useTictactoe()
const {start, playerOneWins, winIndexes, boxesID, playerTwoWins, drawTies, squares} = storeToRefs(tictactoe)
const {reset, undoMove} = tictactoe
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>