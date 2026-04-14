<template>
  <main class="max-h-screen h-screen p-6 flex flex-col bg-slate-900 text-white text-center">
    <h1 class="text-4xl font-extrabold mb-4 tracking-tight">Words<span class="text-indigo-400">Guesser</span></h1>

    <div class="flex flex-col items-center py-10 space-y-3">
      <div class="text-slate-300 max-w-110 leading-relaxed space-y-2">
        <h1 class="text-2xl font-bold">How to play</h1>
        <p class="text-justify text-sm">Four players will split into two teams. For team A, one player clicks an index that holds a hidden word. The second player must then describe that word to the first player. The first player should correctly guess the word with the explanation before the timer runs out! The team has the option of forfeiting their turn. There is a transfer of turn after timeout.</p>
      </div>
      <div class="text-left text-sm my-3 mb-5 max-w-110 text-red-300 p-3 ring-red-400 ring rounded-md space-y-2">
        <p class="h-7 w-7 mx-auto flex justify-center items-center rounded-full text-xl font-black font-mono ring-2 ring-red-900 text-center">!</p>
        <p>The <span class="font-bold text-green-600">EXPLAINER</span> cannot use the actual word in the explanation. eg. when the word is national you should not use international in your explanation. Your turn gets skipped with such mistake!</p>
        <p>The <span class="font-bold text-green-600">REVEALER</span> does not look directly at the revealer while he is listening to the explanation</p>
        <!-- <p>2. On forfeit the other team gets to play twice in a row</p> -->
      </div>
        
    <div class="bg-slate-800 p-5 rounded-2xl mt-3 w-full max-w-120 shadow-xl mb-8 border border-slate-700 ">
      <h2 class="font-bold text-lg mb-5">PLAYER ROLES</h2>

      <ul class="text-sm text-slate-300 space-y-5 mb-4">
        <div>
          <p class="text-indigo-400 font-bold">REVEALER</p> 
          <p>Picks an index. Says the word.</p>
        </div>
        <div>
          <p class="text-indigo-400 font-bold">EXPLAINER</p> 
          <p>Opens the word and then explains it to the Chooser.</p>
        </div>
      </ul>
    </div>
  </div>

  <div class="flex-1 flex flex-col justify-end items-center">
    <button @click="$router.push('/setup')" class="w-full max-w-110 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
      Next
    </button>
  </div>
</main>

</template>