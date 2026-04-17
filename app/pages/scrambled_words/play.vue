<template>
  <main class="min-h-screen bg-slate-900 flex flex-col font-sans select-none">
    
    <header class="bg-slate-800 p-4 pb-3 shadow-md z-10 relative">
      <div class="flex justify-between items-center mb-4 max-w-5xl mx-auto w-full">
        <div class="flex flex-col items-center rounded-xl min-w-20 text-cyan-400">
          <span class="font-bold uppercase tracking-wider text-xs">Score</span>
          <div class="w-full text-center text-5xl font-black rounded-b-xl">{{ score }}</div>
        </div>
        
        <div class="flex gap-4">
          <button @click="$router.push('/word_guesser')" class="px-5 py-2 rounded-md bg-slate-700 h-fit text-slate-300 font-bold text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors">
            BACK
          </button>
          <button @click="restartGame" class="px-5 py-2 rounded-md bg-slate-700 h-fit text-slate-300 font-bold text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors">
            RESTART
          </button>
        </div>
      </div>

      <div class="flex justify-center py-1 gap-4 text-sm text-slate-300 font-medium">
        <div class="bg-slate-900 px-5 py-1.5 rounded-md border border-slate-700/50">Answered: <span class="text-emerald-400 font-bold">{{ answeredCount }}</span></div>
        <div class="bg-slate-900 px-5 py-1.5 rounded-md border border-slate-700/50">Missed: <span class="text-rose-400 font-bold">{{ missedCount }}</span></div>
      </div>
    </header>

    <div class="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto">
      
      <div class="w-full max-w-2xl flex flex-col items-center space-y-8">
        
        <div class="text-center">
          <span class="text-6xl font-black tabular-nums transition-colors duration-300" :class="timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-200'">
            {{ timeLeft }}s
          </span>
        </div>

        <div class="w-full bg-slate-800 border-2 border-slate-700 p-8 md:p-12 rounded-3xl shadow-xl text-center">
          <p class="text-slate-400 font-bold tracking-[0.2em] text-xs uppercase mb-4">Unscramble This</p>
          <h2 class="text-3xl md:text-4xl font-black text-white tracking-[0.15em] uppercase drop-shadow-md">
            {{ scrambledWord }}
          </h2>
        </div>

        <div class="w-full max-w-lg">
          <input 
            ref="wordInput"
            v-model="userInput" 
            @keyup.enter="checkAnswer"
            :disabled="gameState !== 'playing'"
            type="text" 
            placeholder="Type answer & press Enter..." 
            class="w-full bg-slate-800 border-2 border-slate-600 rounded-2xl px-6 py-4 text-xl text-center text-white font-bold outline-none focus:border-cyan-500 focus:bg-slate-800/80 transition-all shadow-inner uppercase placeholder:text-slate-500 placeholder:text-sm placeholder:normal-case placeholder:font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            autocomplete="off"
          >
        </div>

      </div>
    </div>

    <Teleport to="body">
      <div v-if="gameState === 'result'" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" @click.stop></div>
              
        <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col p-8 text-center border-4"
             :class="wasCorrect ? 'border-emerald-500' : 'border-rose-500'">
          
          <div class="text-6xl mb-4">{{ wasCorrect ? '✅' : '⏳' }}</div>
          
          <h2 class="text-3xl font-black mb-2 uppercase tracking-widest"
              :class="wasCorrect ? 'text-emerald-500' : 'text-rose-500'">
            {{ wasCorrect ? 'Correct!' : "Time's Up!" }}
          </h2>
          
          <p class="text-slate-500 mt-4 font-medium">The word was:</p>
          <p class="text-2xl font-black text-slate-800 uppercase tracking-widest my-2">{{ currentWord }}</p>

          <button 
            @click="nextWord"
            class="mt-8 w-full bg-indigo-600 text-white font-bold text-lg py-5 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-indigo-500/30">
            NEXT WORD
          </button>
        </div>
      </div>
    </Teleport>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// --- DATA ARRAYS ---
const animalsArray = [
  'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Kangaroo', 'Panda', 'Gorilla', 'Cheetah', 'Rhinoceros',
  'Hippopotamus', 'Crocodile', 'Alligator', 'Penguin', 'Ostrich', 'Dolphin', 'Whale', 'Shark', 'Octopus', 'Eagle',
  'Hawk', 'Falcon', 'Owl', 'Parrot', 'Peacock', 'Flamingo', 'Chimpanzee', 'Orangutan', 'Baboon', 'Lemur',
  'Koala', 'Sloth', 'Armadillo', 'Porcupine', 'Hedgehog', 'Squirrel', 'Raccoon', 'Fox', 'Wolf', 'Bear',
  'Deer', 'Moose', 'Elk', 'Buffalo', 'Bison', 'Camel', 'Llama', 'Alpaca', 'Goat', 'Sheep'
]

const countriesArray = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile',
  'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Denmark', 'Djibouti',
  'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia'
]

const citiesArray = [
  'Tokyo', 'Delhi', 'Shanghai', 'Sao Paulo', 'Mexico City', 'Cairo', 'Mumbai', 'Beijing', 'Dhaka', 'Osaka',
  'New York', 'Karachi', 'Buenos Aires', 'Chongqing', 'Istanbul', 'Kolkata', 'Manila', 'Lagos', 'Rio de Janeiro', 'Tianjin',
  'Kinshasa', 'Guangzhou', 'Los Angeles', 'Moscow', 'Shenzhen', 'Lahore', 'Bangalore', 'Paris', 'Bogota', 'Jakarta',
  'Chennai', 'Lima', 'Bangkok', 'Seoul', 'Nagoya', 'Hyderabad', 'London', 'Tehran', 'Chicago', 'Chengdu',
  'Nanjing', 'Wuhan', 'Ho Chi Minh City', 'Luanda', 'Ahmedabad', 'Kuala Lumpur', 'Hong Kong', 'Dongguan', 'Foshan', 'Hangzhou'
]

// Assuming this is passed from your store or dictionary file
const allWords = ['action', 'advice', 'afraid', 'beautiful', 'courage', 'determination'] 

// Combine them all for the "All Words" mode
const combinedArray = [...animalsArray, ...countriesArray, ...citiesArray, ...allWords]

// --- SETTINGS (Normally from Pinia Store) ---
const selectedMode = ref('all') // 'animals', 'countries', 'cities', 'all'
const startingTime = ref(15)

// --- GAME STATE ---
type GameState = 'playing' | 'result'
const gameState = ref<GameState>('playing')

const currentWord = ref('')
const scrambledWord = ref('')
const userInput = ref('')
const timeLeft = ref(startingTime.value)
const wordInput = ref<HTMLInputElement | null>(null)

// Stats
const score = ref(0)
const answeredCount = ref(0)
const missedCount = ref(0)
const wasCorrect = ref(false)

let gameTimer: ReturnType<typeof setInterval> | null = null

// --- COMPUTED ---
const activeArray = computed(() => {
  switch (selectedMode.value) {
    case 'animals': return animalsArray;
    case 'countries': return countriesArray;
    case 'cities': return citiesArray;
    case 'all': return combinedArray;
    default: return combinedArray;
  }
})

// --- FUNCTIONS ---
const scrambleText = (text: string) => {
  const words = text.split(' ')
  const scrambledWords = words.map(word => {
    let chars = word.split('')
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j] as string, chars[i] as string]
    }
    return chars.join('')
  })
  return scrambledWords.join(' ')
}

const generateWord = () => {
  let newWord = currentWord.value
  while (newWord === currentWord.value && activeArray.value.length > 1) {
    const randomIndex = Math.floor(Math.random() * activeArray.value.length)
    newWord = activeArray.value[randomIndex] as string
  }
  
  currentWord.value = newWord
  scrambledWord.value = scrambleText(newWord)
  userInput.value = ''
  timeLeft.value = startingTime.value
  gameState.value = 'playing'
  startTimer()
  
  nextTick(() => {
    if (wordInput.value) wordInput.value.focus()
  })
}

const startTimer = () => {
  if (gameTimer) clearInterval(gameTimer)
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleRoundEnd(false)
    }
  }, 1000)
}

const checkAnswer = () => {
  if (gameState.value !== 'playing') return

  const normalizedInput = userInput.value.toLowerCase().replace(/\s/g, '')
  const normalizedAnswer = currentWord.value.toLowerCase().replace(/\s/g, '')

  if (normalizedInput === normalizedAnswer) {
    score.value += 10
    answeredCount.value++
    handleRoundEnd(true)
  }
}

const handleRoundEnd = (correct: boolean) => {
  if (gameTimer) clearInterval(gameTimer)
  wasCorrect.value = correct
  if (!correct) missedCount.value++
  gameState.value = 'result'
}

const nextWord = () => {
  generateWord()
}

const restartGame = () => {
  score.value = 0
  answeredCount.value = 0
  missedCount.value = 0
  generateWord()
}

onMounted(() => {
  generateWord()
})

onUnmounted(() => {
  if (gameTimer) clearInterval(gameTimer)
})
</script>