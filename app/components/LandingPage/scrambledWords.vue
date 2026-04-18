<template>
  <div class="flex flex-col items-center justify-center text-slate-100 space-y-5">
    
    <div class="text-center flex items-center gap-4">
      <h1 class="text-xl font-extrabold tracking-tight"><span class="text-pink-500">Scrambled</span></h1>
    </div>

    <div class="bg-slate-800/80 p-2 border border-slate-700 shadow-xl w-full max-w-2xl mb-10 text-center space-y-3">
      <h2 class="font-bold text-lg text-white">Unscramble Words</h2>
      <p class="text-slate-300leading-relaxed">
        We've taken words, thrown them in a blender, and spit them out. Your job is to unscramble the letters and type the correct spelling before the clock hits zero.
      </p>

      <div class="grid grid-cols-2 gap-2 text-left">
        <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <span class="text-3xl mb-2 text-slate-400">🤔</span>
          <span class="font-bold text-pink-300">AMSCLERB</span>
          <span class="text-xs text-slate-400 mt-2 text-center">Wait, is it scream!? Oh! SCRAMBLE</span>
        </div>
        <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <span class="text-3xl mb-2 text-slate-400">⏱️</span>
          <span class="font-bold text-pink-300">Beat the Clock</span>
          <span class="text-xs text-center text-slate-400 mt-2">Extra time for longer words.</span>
        </div>
      </div>
    </div>
  </div>
</template>