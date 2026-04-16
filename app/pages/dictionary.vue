<template>
    <div class="space-y-3 flex flex-col max-h-screen h-screen">
        <div class="flex items-center py-4 px-5 bg-teal-800">
          <button @click="$router.push('/')" class="ring rounded-md text-white font-bold px-2 py-1 -ml-2 hover:bg-white hover:text-indigo-600">← Back</button>
          <h1 class="text-base relative -left-6 font-extrabold mx-auto uppercase text-white">MINI DICTIONARY</h1>
        </div>

        <div class="px-5 py-3 overflow-auto flex-1 flex flex-col space-y-3">
            <div class=" w-full max-w-200 ring rounded-md p-4">
                <label for="word" class="font-bold">Search Word</label>
                <input type="text" id="word" v-model="searchWord" class="outline-none ring ring-blue-400 appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-500" min="10" max="120">
            </div>
            <div class="max-w-150 flex-1 overflow-auto py-3">
                <div v-for="(definition, word, index) in searchedWords" :key="index" class="rounded-md py-3 px-3 hover:bg-slate-200">
                    <p class="text-lg font-bold uppercase">{{ word }}</p>
                    <p class="font-mono">{{ definition }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"> 
const searchWord = ref('')

const searchedWords = computed(() => {
    let words = Object.keys(allDefinitions).filter(word => {
        return word.includes(searchWord.value)
    }).sort()
    
    return Object.assign({}, ...words.map(word => {
        return {[word] : allDefinitions[word as keyof object]} 
    }))
})
</script>