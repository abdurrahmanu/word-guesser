<template>
  <main class="flex flex-col min-h-screen p-6 pl-0 pt-0 bg-slate-100">
    <div class="flex items-center mb-8 py-5 px-5 bg-indigo-600">
      <button @click="$router.push('/')" class="text-white font-bold p-2 -ml-2">← Back</button>
      <h1 class="text-xl font-extrabold mx-auto uppercase text-white">Game Setup</h1>
    </div>

    <div class="flex-1 space-y-6 max-w-md w-full mx-auto">
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
      
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <label class="block font-bold text-slate-700">Transfer Turn</label>
          <span class="text-xs text-slate-400">Give the other team a chance if time runs out</span>
        </div>
        <input type="checkbox" v-model="settings.allowTransfer" class="w-6 h-6 accent-indigo-600">
      </div>
    </div>

    <button @click="startGame" class="mt-8 w-full max-w-md mx-auto bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
      Start Game
    </button>
  </main>
</template>

<script setup>
const router = useRouter()
const store = useGameStore()
const {teamOne, teamTwo} = storeToRefs(store)

const settings = reactive({
  wordCount: 16,
  timerSeconds: 35,
  allowTransfer: true
})

function startGame() {
  store.initGame(settings)
  router.push('/game')
}
</script>