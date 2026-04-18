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
            <button @click="restart(false)" class="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-sm">
              Cancel
            </button>
            <button @click="restart(true)" class="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-transform active:scale-95 uppercase tracking-widest text-sm">
              Yes, Reset
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
const tictactoe = useTictactoe()
const {start, playerOneWins, winIndexes, openModal, boxesID, playerTwoWins, drawTies, squares} = storeToRefs(tictactoe)
const {reset, restart, undoMove} = tictactoe
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