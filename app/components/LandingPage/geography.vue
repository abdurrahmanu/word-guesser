<template>
  <div class="flex flex-col items-center bg-slate-900 text-slate-100 font-sans">
    
    <div class="text-center animate-fade-in-down">
        <div class="flex items-center gap-6 justify-center">
            <div class="inline-flex items-center justify-center w-5 h-5 bg-blue-500/10 rounded-full mb-6 text-5xl shadow-lg shadow-blue-500/20">
                🌍
            </div>
            <h1 class="text-3xl font-extrabold mb-4 tracking-tight">Geo<span class="text-blue-500">Explorer</span></h1>
        </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6 w-full max-w-5xl py-10">
      <div class="flex-1 bg-slate-800/80 backdrop-blur-sm p-4 shadow-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
          <span class="text-3xl bg-slate-700 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">📚</span>
          <h2 class="font-bold text-2xl text-white">The Study Room</h2>
        </div>
        <div class="text-left text-sm text-slate-300 space-y-4">
            <div>
              <p class="font-bold text-slate-200">Country Encyclopedia</p>
              <p class="text-xs mt-1">Detailed views of every nation, their capitals, and continents.</p>
            </div>
            <div>
              <p class="font-bold text-slate-200">Interactive Atlas</p>
              <p class="text-xs mt-1">Traverse countries sequentially or jump to random locations.</p>
            </div>
        </div>
      </div>

      <div class="flex-1 bg-slate-800/80 backdrop-blur-sm p-4 shadow-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 group">
        <div class="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
          <span class="text-3xl bg-slate-700 p-3 rounded-xl group-hover:bg-emerald-500/20 transition-colors">🎮</span>
          <h2 class="font-bold text-2xl text-white">The Arena</h2>
        </div>
        <div class="text-sm space-y-2">
          <li class="flex items-center gap-3 bg-slate-800/50 rounded-lg">
            <span class="text-emerald-400 text-lg">▶</span>
            <p><strong class="text-slate-200">Flag Guesser:</strong> Identify flags under time pressure.</p>
          </li>
          <li class="flex items-center gap-3 bg-slate-800/50 rounded-lg">
            <span class="text-emerald-400 text-lg">▶</span>
            <p><strong class="text-slate-200">Map Silhouette:</strong> Recognize vector map outlines.</p>
          </li>
          <li class="flex items-center gap-3 bg-slate-800/50 rounded-lg">
            <span class="text-emerald-400 text-lg">▶</span>
            <p><strong class="text-slate-200">Capital Quiz:</strong> Two-way country and capital matching.</p>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['startApp'])

const enterApp = () => {
  // You can emit an event here to tell your main App.vue to switch from the Landing Page to Geography.vue
  emit('startApp')
}
</script>