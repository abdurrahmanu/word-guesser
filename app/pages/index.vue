<template>
  <main class="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 text-white text-center">
    <h1 class="text-4xl font-extrabold mb-4 tracking-tight">Word<span class="text-indigo-400">Sync</span></h1>
    <p class="text-slate-300 max-w-110 leading-relaxed">
      Welcome! Four players should split into two teams. For team A, one player picks a hidden word. Your teammate must then describe that word to you. You should correctly guess the word before the timer runs out!
    </p>
    <p class="text-red-300 mb-5 py-1">
      You cannot use the actual word in the explanation, and also not its direct opposite. eg. opposite of national
    </p>
        
    <div class="bg-slate-800 p-5 rounded-2xl w-full max-w-120 shadow-xl mb-8 border border-slate-700">
      <h2 class="font-bold text-lg mb-2">ROLES</h2>
      <ul class="text-left text-sm text-slate-300 space-y-2 mb-4">
        <li>👉 <strong class="text-indigo-400">Chooser:</strong> Picks an easy index. Answers the word.</li>
        <li>👉 <strong class="text-indigo-400">Explainer:</strong> Clicks to reveal the word. Explains it to the Chooser.</li>
      </ul>
    </div>

    <button @click="$router.push('/setup')" class="w-full max-w-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
      Next
    </button>
  </main>
</template>