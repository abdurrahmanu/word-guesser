<template>
  <div class="flex flex-col items-center justify-center text-slate-100 p-6 py-0 space-y-5">
    
    <div class="text-center flex items-center gap-4">
      <div class="inline-flex items-center justify-center w-7 h-7 bg-amber-500/10 rounded-full mb-6 text-5xl shadow-lg shadow-amber-500/20">🏆</div>
      <h1 class="text-2xl font-extrabold mb-4 tracking-tight">The <span class="text-amber-400">QUIZ</span></h1>
    </div>

    <div class="w-full max-w-2xl bg-slate-800/80 border border-slate-700 shadow-xl overflow-hidden mb-10">
      <div class="bg-amber-500/10 p-6 border-b border-slate-700 flex justify-center gap-8">
        <div class="text-center">
          <span class="block text-3xl font-black text-amber-400">?</span>
          <span class="text-xs text-slate-400 uppercase tracking-widest font-bold">Questions</span>
        </div>
        <div class="w-px bg-slate-700"></div>
        <div class="text-center">
          <span class="block text-3xl font-black text-amber-400">4</span>
          <span class="text-xs text-slate-400 uppercase tracking-widest font-bold">Options</span>
        </div>
        <div class="w-px bg-slate-700"></div>
        <div class="text-center">
          <span class="block text-3xl font-black text-amber-400">1</span>
          <span class="text-xs text-slate-400 uppercase tracking-widest font-bold">Winner</span>
        </div>
      </div>
      
      <div class="p-8 text-center">
        <p class="text-slate-300 leading-relaxed mb-6">
          Face a randomized quiz testing your knowledge on Math, Science, Geography, History, Technology and general knowledge. Distractor options are dynamically generated to trick you. Take your time, think it through, and aim for a perfect score.
        </p>
      </div>
    </div>
  </div>
</template>