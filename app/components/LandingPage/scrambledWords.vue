<template>
  <div class="flex flex-col items-center justify-center text-slate-100 p-6 py-0 space-y-5">
    
    <div class="text-center flex items-center gap-4">
      <div class="inline-flex items-center justify-center w-6 h-6 bg-indigo-500/10 rounded-full mb-6 text-4xl shadow-lg shadow-indigo-500/20">🔠</div>
      <h1 class="text-3xl font-extrabold mb-4 tracking-tight"><span class="text-indigo-400">Scramble</span></h1>
    </div>

    <div class="bg-slate-800/80 p-4 border border-slate-700 shadow-xl w-full max-w-2xl mb-10 text-center">
      <h2 class="font-bold text-2xl text-white mb-4">Unscramble Words</h2>
      <p class="text-slate-300 mb-8 leading-relaxed">
        We've taken words, thrown them in a blender, and spit them out. Your job is to unscramble the letters and type the correct spelling before the clock hits zero.
      </p>

      <div class="grid grid-cols-2 gap-4 text-left">
        <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <span class="text-3xl mb-2 text-slate-400">🤔</span>
          <span class="font-bold text-indigo-400">AMSCLERB</span>
          <span class="text-xs text-slate-500 mt-2 text-center">Wait, is it scream!? Sorry SCRAMBLE</span>
        </div>
        <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <span class="text-3xl mb-2 text-slate-400">⏱️</span>
          <span class="font-bold text-indigo-400">Beat the Clock</span>
          <span class="text-xs text-slate-500 mt-2">Extra time for longer words.</span>
        </div>
      </div>
    </div>
  </div>
</template>