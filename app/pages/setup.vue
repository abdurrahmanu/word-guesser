<template>
  <main class="flex flex-col min-h-screen p-6 bg-slate-100">
    <div class="flex items-center mb-8">
      <button @click="$router.push('/')" class="text-slate-500 font-bold p-2 -ml-2">← Back</button>
      <h1 class="text-2xl font-extrabold mx-auto text-slate-800">GAME SETUP</h1>
      <div class="w-12"></div> </div>

    <div class="flex-1 space-y-6 max-w-md w-full mx-auto">
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Words per Session</label>
        <input type="number" v-model="settings.wordCount" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="4" max="100">
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Timer (Seconds)</label>
        <input type="number" v-model="settings.timerSeconds" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="10" max="120">
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
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