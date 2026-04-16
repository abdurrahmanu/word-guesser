<template>
  <main class="relative h-screen max-h-screen bg-[#0a0514] flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
    
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
      <h1 class="text-2xl font-extrabold text-white tracking-tight">Words<span class="text-fuchsia-500">Scramble</span></h1>
      <button v-if="gameState !== 'settings'" @click="endGame" class="text-slate-400 hover:text-rose-400 transition-colors font-bold tracking-widest text-sm uppercase">
        Quit Game
      </button>
      <button v-else @click="$router.push('/setup')" class="text-slate-400 hover:text-white transition-colors font-bold tracking-widest text-sm uppercase">
        Back
      </button>
    </div>

    <div class="relative z-10 w-full max-w-3xl flex flex-col items-center">
      
      <Transition name="fade" mode="out-in">
        <div v-if="gameState === 'settings'" class="w-full bg-[#0f0822]/80 backdrop-blur-xl border border-fuchsia-500/30 p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_rgba(217,70,239,0.15)] w-[90%] max-w-2xl mx-auto space-y-10">
          
          <div class="text-center space-y-2">
            <h2 class="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 uppercase tracking-widest">Game Setup</h2>
            <p class="text-slate-400">Unscramble the words before time runs out!</p>
          </div>

          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-xs text-fuchsia-300/70 font-bold tracking-widest uppercase">Select Category</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="mode in modes" 
                  :key="mode.value"
                  @click="selectedMode = mode.value"
                  class="py-3 px-4 rounded-xl border transition-all duration-300 font-bold tracking-wide"
                  :class="selectedMode === mode.value ? 'bg-fuchsia-600/20 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'bg-black/40 border-slate-700 text-slate-400 hover:border-slate-500'"
                >
                  {{ mode.label }}
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-xs text-fuchsia-300/70 font-bold tracking-widest uppercase">Time per word</label>
              <div class="flex gap-3">
                <button 
                  v-for="time in timeOptions" 
                  :key="time"
                  @click="selectedTime = time"
                  class="flex-1 py-2 rounded-xl border transition-all duration-300 font-bold"
                  :class="selectedTime === time ? 'bg-cyan-600/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-black/40 border-slate-700 text-slate-400 hover:border-slate-500'"
                >
                  {{ time }}s
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="startGame" 
            class="w-full py-4 bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black text-xl tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] transition-all duration-300 active:scale-[0.98]"
          >
            Start Game
          </button>
        </div>

        <div v-else-if="gameState === 'playing'" class="w-full flex flex-col items-center space-y-8">
          
          <div class="w-full flex justify-between items-center px-4 max-w-xl text-lg font-bold">
            <div class="text-cyan-400 bg-cyan-900/30 px-4 py-2 rounded-lg border border-cyan-500/30">
              Score: {{ score }}
            </div>
            <div 
              class="px-4 py-2 rounded-lg border transition-colors duration-300"
              :class="timeLeft <= 5 ? 'text-rose-400 bg-rose-900/30 border-rose-500/50 animate-pulse' : 'text-fuchsia-400 bg-fuchsia-900/30 border-fuchsia-500/30'"
            >
              Time: {{ timeLeft }}s
            </div>
          </div>

          <div class="w-[90%] max-w-2xl bg-[#0f0822]/80 backdrop-blur-xl border border-indigo-500/30 p-10 md:p-16 rounded-3xl shadow-[0_8px_32px_rgba(79,70,229,0.15)] text-center">
            <p class="text-indigo-400/80 font-bold tracking-[0.2em] text-sm uppercase mb-6">Unscramble This</p>
            <h2 class="text-5xl md:text-7xl font-black text-white tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {{ scrambledWord }}
            </h2>
          </div>

          <div class="w-[90%] max-w-xl relative">
            <input 
              ref="wordInput"
              v-model="userInput" 
              @keyup.enter="checkAnswer"
              type="text" 
              placeholder="Type your answer and press Enter..." 
              class="w-full bg-black/60 border-2 border-indigo-500/50 rounded-2xl px-6 py-5 text-2xl text-center text-white font-bold outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all shadow-inner uppercase placeholder:text-slate-600 placeholder:text-base placeholder:normal-case placeholder:font-normal"
              autocomplete="off"
            >
          </div>
        </div>

        <div v-else-if="gameState === 'transition'" class="w-full flex flex-col items-center space-y-8">
          <div class="w-[90%] max-w-2xl bg-[#0f0822]/90 backdrop-blur-xl border p-12 rounded-3xl shadow-2xl text-center transition-colors duration-300"
               :class="wasCorrect ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-rose-500/50 shadow-[0_0_30px_rgba(225,29,72,0.2)]'">
            
            <h2 class="text-4xl md:text-5xl font-black mb-2 uppercase tracking-widest"
                :class="wasCorrect ? 'text-emerald-400' : 'text-rose-500'">
              {{ wasCorrect ? 'Correct!' : "Time's Up!" }}
            </h2>
            
            <p class="text-slate-400 mt-6 text-lg">The word was:</p>
            <p class="text-4xl font-bold text-white uppercase tracking-widest my-2">{{ currentWord }}</p>
            
            <div class="mt-12 flex flex-col items-center">
              <div class="text-sm text-slate-500 uppercase tracking-widest mb-4">Next word in</div>
              <div class="text-5xl font-black text-fuchsia-500 animate-pulse">{{ transitionTimeLeft }}</div>
            </div>

            <button @click="skipTransition" class="mt-8 px-6 py-2 border border-slate-600 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors uppercase text-sm font-bold tracking-widest">
              Skip Wait
            </button>
          </div>
        </div>
      </Transition>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'

// --- DATA ARRAYS ---
// Add the rest of your 300 items to these arrays!
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

// Mocking your dictionary import
const allDefinitions: Record<string, string> = {
  "action": "The fact or process of doing something.",
  "advice": "Guidance or recommendations offered.",
  "afraid": "Feeling fear or anxiety.",
  "beautiful": "Pleasing the senses or mind aesthetically.",
  "courage": "The ability to do something that frightens one."
}
const dictionaryArray = Object.keys(allDefinitions)

// --- GAME STATE ---
type GameState = 'settings' | 'playing' | 'transition'
const gameState = ref<GameState>('settings')

const modes = [
  { label: 'Animals', value: 'animals' },
  { label: 'Countries', value: 'countries' },
  { label: 'World Cities', value: 'cities' },
  { label: 'All Dictionary', value: 'all' }
]

const timeOptions = [10, 15, 30]

const selectedMode = ref('animals')
const selectedTime = ref(15)

// --- PLAYING STATE ---
const currentWord = ref('')
const scrambledWord = ref('')
const userInput = ref('')
const score = ref(0)
const timeLeft = ref(15)
const wordInput = ref<HTMLInputElement | null>(null)

// --- TRANSITION STATE ---
const wasCorrect = ref(false)
const transitionTimeLeft = ref(3)

// --- TIMERS ---
let gameTimer: ReturnType<typeof setInterval> | null = null
let transitionTimer: ReturnType<typeof setInterval> | null = null

// --- COMPUTED ARRAYS ---
const activeArray = computed(() => {
  switch (selectedMode.value) {
    case 'animals': return animalsArray;
    case 'countries': return countriesArray;
    case 'cities': return citiesArray;
    case 'all': return dictionaryArray;
    default: return animalsArray;
  }
})

// --- FUNCTIONS ---
const scrambleText = (text: string) => {
  // We keep spaces intact to make cities like "New York" guessable, but scramble the letters.
  const words = text.split(' ')
  const scrambledWords = words.map(word => {
    let chars = word.split('')
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]]
    }
    return chars.join('')
  })
  return scrambledWords.join(' ')
}

const getNewWord = () => {
  let newWord = currentWord.value
  while (newWord === currentWord.value && activeArray.value.length > 1) {
    const randomIndex = Math.floor(Math.random() * activeArray.value.length)
    newWord = activeArray.value[randomIndex]
  }
  
  currentWord.value = newWord
  scrambledWord.value = scrambleText(newWord)
  userInput.value = ''
  timeLeft.value = selectedTime.value
}

const startGame = () => {
  score.value = 0
  getNewWord()
  gameState.value = 'playing'
  startMainTimer()
  
  // Auto focus input
  nextTick(() => {
    if (wordInput.value) wordInput.value.focus()
  })
}

const startMainTimer = () => {
  if (gameTimer) clearInterval(gameTimer)
  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      handleRoundEnd(false)
    }
  }, 1000)
}

const checkAnswer = () => {
  // Normalize both strings: remove spaces and make lowercase for comparison
  const normalizedInput = userInput.value.toLowerCase().replace(/\s/g, '')
  const normalizedAnswer = currentWord.value.toLowerCase().replace(/\s/g, '')

  if (normalizedInput === normalizedAnswer) {
    score.value += 10 // Give 10 points for a correct answer!
    handleRoundEnd(true)
  }
}

const handleRoundEnd = (correct: boolean) => {
  if (gameTimer) clearInterval(gameTimer)
  wasCorrect.value = correct
  gameState.value = 'transition'
  transitionTimeLeft.value = 3
  
  transitionTimer = setInterval(() => {
    transitionTimeLeft.value--
    if (transitionTimeLeft.value <= 0) {
      skipTransition()
    }
  }, 1000)
}

const skipTransition = () => {
  if (transitionTimer) clearInterval(transitionTimer)
  getNewWord()
  gameState.value = 'playing'
  startMainTimer()

  nextTick(() => {
    if (wordInput.value) wordInput.value.focus()
  })
}

const endGame = () => {
  if (gameTimer) clearInterval(gameTimer)
  if (transitionTimer) clearInterval(transitionTimer)
  gameState.value = 'settings'
}

// Clean up timers if component is destroyed
onUnmounted(() => {
  if (gameTimer) clearInterval(gameTimer)
  if (transitionTimer) clearInterval(transitionTimer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>