<template>
  <div class="flex flex-col items-center justify-center text-slate-100 space-y-5 font-sans">
    
    <div class="text-center flex items-center gap-2 animate-fade-in-down">
      <span class="text-xl">🎲</span>
      <h1 class="text-lg font-extrabold tracking-tight">Random<span class="text-violet-400">Words</span></h1>
    </div>

    <div class="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-10">
      

      <div class="flex-1 bg-slate-800/80 p-4 border border-slate-700 shadow-xl backdrop-blur-sm text-left">
        <ul class="space-y-4">
          <li class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-4 hover:border-violet-500/30 transition-colors">
            <div>
              <p class="text-violet-400 font-extrabold tracking-wide mb-1 text-sm uppercase">Endless Vocabulary</p> 
              <p class="text-xs text-slate-400 leading-relaxed">Draw from a massive database of everyday objects, actions, and challenging concepts.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>