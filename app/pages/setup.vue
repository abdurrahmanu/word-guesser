<template>
  <main class="flex flex-col max-h-screen h-screen p-6 px-0 pt-0 bg-slate-100">
    <div class="flex items-center mb-8 py-4 px-5 bg-indigo-600">
      <button @click="$router.push('/')" class="ring rounded-md text-white font-bold px-2 py-1 -ml-2 hover:bg-white hover:text-indigo-600">← Back</button>
      <h1 class="text-xl font-extrabold mx-auto uppercase text-white">Game Setup</h1>
    </div>

    <div class="flex-1 px-4 space-y-4 max-w-md w-full mx-auto">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Words per Session</label>
        <input type="number" v-model="settings.wordCount" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="4" max="100">
      </div>

      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Timer (Seconds)</label>
        <input type="number" v-model="settings.timerSeconds" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="10" max="120">
      </div>

      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Team One Name</label>
        <input type="text" v-model="teamOne" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="10" max="120">

        <label class="block pt-3 font-bold text-slate-700 mb-2">Timer Two Name</label>
        <input type="text" v-model="teamTwo" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="10" max="120">
      </div>

      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Add New Words: <span class="font-medium text-sm">Separate words with Commas</span></label>
        <div class="flex">
          <input placeholder="international, estate, film, hostel" type="text" v-model="newWords" class="flex-1 w-full bg-slate-50 border border-slate-200 rounded-l-xl p-3 outline-none focus:border-indigo-500 placeholder:text-slate-400" min="10" max="120">
          <button @click="addWords" class="bg-indigo-600 px-5 hover:bg-indigo-800 py-1 rounded-r-md text-white font-bold">Add</button>
        </div>
        <p v-if="addWordsError" class="text-red-500 text-xs pt-1">Error: Add only real words. No symbols and no numbers. Use only commas</p>
        <p v-if="addWordsSuccessful" class="text-green-500 text-xs pt-1">New words successfully added!</p>
      </div>
      
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <label class="block font-bold text-slate-700">Transfer Turn</label>
          <span class="text-xs text-slate-400">Give the other team a chance if time runs out</span>
        </div>
        <input type="checkbox" v-model="settings.allowTransfer" class="w-6 h-6 accent-indigo-600">
      </div>
    </div>

    <button @click="startGame" class="mt-8 w-full max-w-md mx-auto bg-indigo-600 text-white font-bold py-4 hover:ring-2 hover:ring-indig rounded-xl shadow-lg active:scale-95 hover:bg-white transition-colors duration-100 hover:text-indigo-600">
      Start Game
    </button>
  </main>
</template>

<script setup>
const router = useRouter()
const store = useGameStore()
const {teamOne, teamTwo, newWords, settings, addWordsError, addWordsSuccessful} = storeToRefs(store)
const {addWords} = store


function startGame() {
  store.initGame(settings.value)
  router.push('/game')
}
</script>