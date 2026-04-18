<template>
  <div class="max-w-md mx-auto text-xs px-6">
    <h2 class="text-lg font-bold py-2 uppercase">Settings</h2>

    <div class="space-y-5">
      <div class="bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-600">
        <label class="block font-bold mb-2">Countdown Time (Secs)</label>
        <input type="number" @change="save" v-model.number="localSettings.countdownTime" class="w-full bg-slate-70 border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500" min="10" max="120">
      </div>
      
      <div class="bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-600">
        <label class="block outline-none border-none font-bold mb-2">Flag Difficulty (Blur)</label>
        <select v-model.number="localSettings.blurLevel" class="relative w-full outline-none ring ring-slate-700 p-2" @change="save">
          <option class="bg-slate-700" :value="0">Clear (Normal)</option>
          <option class="bg-slate-700" :value="1">Slightly Blurred</option>
          <option class="bg-slate-700" :value="2">Heavily Blurred</option>
        </select>
      </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2 uppercase">Continents</label>
      <div class="flex gap-2 flex-wrap">
        <div v-for="continent in availableContinents" :key="continent" class="ring  text-xs ring-slate-700 rounded-md pl-2 pr-5 py-1 hover:bg-slate-700 flex items-center mb-2">
          <input type="checkbox" :value="continent" v-model="localSettings.continents" 
          class="mr-3 w-5 h-5 cursor-pointer" @change="save">
          <label class="text-base uppercase">{{ continent }}</label>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps(['settings'])
const emit = defineEmits(['update:settings'])

const availableContinents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

// Local copy of settings to modify
const localSettings = ref({ ...props.settings })

const save = () => {
  // Prevent unchecking all continents
  if (localSettings.value.continents.length === 0) {
    localSettings.value.continents = ['Europe'] // fallback
  }
  emit('update:settings', localSettings.value)
}

watch(() => props.settings, (newVal) => {
  localSettings.value = { ...newVal }
}, { deep: true })
</script>