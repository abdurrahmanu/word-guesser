<template>
  <div class="max-w-md mx-auto text-xs">
    <h2 class="text-xl font-bold py-2 uppercase">Settings</h2>

    <div class="space-y-5">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-300">
        <label class="block font-bold text-slate-700 mb-2">Countdown Time (Secs)</label>
        <input type="number" @change="save" v-model.number="localSettings.countdownTime" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" min="10" max="120">
      </div>
      
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label class="block font-bold text-slate-700 mb-2">Flag Difficulty (Blur)</label>
        <select v-model.number="localSettings.blurLevel" class="w-full ring ring-slate-300 p-2 rounded" @change="save">
          <option class="" :value="0">Clear (Normal)</option>
          <option class="" :value="1">Slightly Blurred</option>
          <option class="" :value="2">Heavily Blurred</option>
        </select>
      </div>

    <div class="mb-6">
      <label class="block font-semibold mb-2 uppercase">Continents</label>
      <div class="flex gap-5 flex-wrap">
        <div v-for="continent in availableContinents" :key="continent" class="ring  text-xs ring-slate-300 rounded-md  pl-2 pr-5 py-1 hover:bg-slate-200 flex items-center mb-2">
          <input type="checkbox" :value="continent" v-model="localSettings.continents" 
          class="mr-3 w-5 h-5 cursor-pointer" @change="save">
          <label>{{ continent }}</label>
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