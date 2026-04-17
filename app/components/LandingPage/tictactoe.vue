<template>
  <div class="flex flex-col items-center justify-center text-slate-100 p-6 py-0">
    
    <div class="text-center flex items-center gap-4">
      <div class="inline-flex items-center justify-center w-8 h-8 bg-rose-500/10 rounded-full mb-6 text-2xl shadow-lg shadow-rose-500/20">⚔️</div>
      <h1 class="text-2xl font-extrabold mb-4 tracking-tight"><span class="text-rose-500">TicTacToe</span></h1>
    </div>

    <div class="bg-slate-800/80 p-4 border border-slate-700 shadow-xl w-full max-w-3xl mb-10 flex flex-col md:flex-row gap-8 items-center">
      
      <div class="flex-1 text-center md:text-left">
        <h2 class="font-bold text-2xl text-white mb-4">Earn Your Squares</h2>
      </div>

      <div class="shrink-0 grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-700">
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-blue-500 font-bold text-2xl">X</div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-rose-500 font-bold text-2xl">O</div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center"></div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-rose-500 font-bold text-2xl">O</div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-blue-500 font-bold text-2xl animate-pulse">?</div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center"></div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-blue-500 font-bold text-2xl">X</div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center"></div>
        <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center"></div>
      </div>

    </div>
  </div>
</template>