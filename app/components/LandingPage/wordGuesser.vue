<template>
  <div class="flex flex-col items-center justify-center text-slate-100 p-6 pt-0">
  
    <div class="text-center animate-fade-in-down flex items-center gap-4 pb-2">
      <div class="inline-flex items-center justify-center w-10 h-10 bg-teal-500/10 rounded-full mb-6 text-5xl shadow-lg shadow-teal-500/20">🗣️</div>
      <h1 class="text-2xl font-extrabold mb-4 tracking-tight">Words<span class="text-teal-400">Guesser</span></h1>
    </div>

    <div class="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-10">
      <div class="flex-1 bg-slate-800/80 p-4 border border-slate-700 shadow-xl">
        <h2 class="font-bold text-2xl text-white mb-4 flex items-center gap-3">
          <span class="bg-slate-700 p-2 rounded-lg text-xl">📖</span> How to Play
        </h2>
        <p class="text-sm text-slate-300 leading-relaxed text-justify mb-4">
          Split into teams. One player (the Explainer) looks at the hidden geography word. They must describe that word to their teammate (the Guesser) without actually saying it! The Guesser must correctly guess the word before the timer runs out. 
        </p>
        <p class="text-sm text-slate-300 leading-relaxed text-justify">
          Stuck? You can forfeit your turn and pass. There is a transfer of turn after the timeout!
        </p>
      </div>

      <div class="flex-1 text-left bg-slate-800/80 p-4 border border-slate-700 shadow-xl">
        <h2 class="font-bold text-2xl text-white mb-6 flex items-center gap-3">
          <span class="bg-slate-700 p-2 rounded-lg text-xl">🎭</span> Player Roles
        </h2>
        <ul class="space-y-6">
          <li class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <p class="text-teal-400 font-extrabold tracking-wide mb-1">THE EXPLAINER</p> 
            <p class="text-sm text-slate-300">Sees the word on screen. Uses hints, facts, and clues to guide the Guesser.</p>
          </li>
          <li class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <p class="text-teal-400 font-extrabold tracking-wide mb-1">THE GUESSER</p> 
            <p class="text-sm text-slate-300">Cannot see the screen. Must listen closely and shout out the correct country or capital.</p>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>