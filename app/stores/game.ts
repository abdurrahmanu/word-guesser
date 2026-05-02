// stores/game.ts
import { defineStore } from 'pinia'

export type Choices = 'word_guesser' | 'dictionary' | 'random_words' | 'scrambled_words' | 'boxed' | 'tictactoe' | 'geography' | 'quiz'

const words = {
  all: [...new Set([...easy, ...hard, ...medium,, ...geography, ...scientific, ...animals, ...countries, ...food, ...mediumHard])],
  easy: easy,
  hard: hard,
  medium: medium,
  'medium hard': mediumHard,
  animals: animals,
  countries: countries,
  food: food,
  scientific: scientific,
  geography: geography,
}

export const useGameStore = defineStore('game', () => {
  const vocabularyTypes = ref<string[]>(['all', 'easy', 'medium', 'medium hard', 'hard', 'food', 'scientific', 'countries', 'animals', 'geography'])
  const currentPage = ref<Choices>('word_guesser')
  const team1Score = ref(0)
  const team2Score = ref(0)
  const teamOne = ref('Team One')
  const teamTwo = ref('Team Two')
  const currentTeamTurn = ref<1 | 2>(1) // 1 or 2
  const indexWinner = reactive<Record<string | number, any>>({})
  const settings = ref({
    wordCount: 16,
    timerSeconds: 35,
    allowTransfer: true
  })
  const useDefinition = ref(false)
  const firstToReach = ref<null | number>(null)
  const toggleFirstToReach = ref(false)
  const useSound = ref(false)
  const newWords = ref('')
  const newWordsArray = ref<string[]>([])
  const gameWords = ref<string[]>([])
  const usedIndexes = ref<number[]>([])
  const killedIndexes = ref<number[]>([])
  const isGameOver = ref(false)
  const continueAfterEarlyWin = ref(false)
  const shuffledArray = ref<string[]>()
  const addWordsError = ref(false)
  const addWordsSuccessful = ref(false)
  const forfeitingTeam = ref< 1 | 2 | null>(null)
  const difficulty = ref<'easy' | 'all' | 'hard' | 'medium' | 'geography' | 'food' | 'medium hard' | 'scientific' | 'countries' | 'animals'>('easy')

  function shuffleArray(array: string[], addedWords ?: string[]) {
    const shuffled = [...array, ...(addedWords || [])];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i] as any, shuffled[j] as any] = [shuffled[j], shuffled[i]];
    }
        
    return shuffled;
  }

  const wordsRemaining = computed(() => settings.value.wordCount - (usedIndexes.value.length + killedIndexes.value.length))
  
  const activeTeamScore = computed(() => 
    currentTeamTurn.value === 1 ? team1Score.value : team2Score.value
  )
  
  const earlyWinner = computed(() => {
    if (isGameOver.value || continueAfterEarlyWin.value) return null;
    const remainingPoints = wordsRemaining.value;
    if (team1Score.value > team2Score.value + remainingPoints) return 1;
    if (team2Score.value > team1Score.value + remainingPoints) return 2;
    return null;
  })

  function initGame(newSettings: { wordCount: 16, timerSeconds: 35, allowTransfer: true }) {
    clearState(true)
    const wordsToUse = words[difficulty.value]
    shuffledArray.value = shuffleArray([...new Set([...wordsToUse])] as string[])

    let newWordsLength = [...new Set(newWordsArray.value)].length
    let remaining = newSettings.wordCount - newWordsLength

    const shuffledNewWords = [...([...new Set(newWordsArray.value)])].sort(() => 0.5 - Math.random());
    const shuffledArrayWords = [...shuffledArray.value].sort(() => 0.5 - Math.random());

    if (remaining > -1 && remaining < newSettings.wordCount) {      
      gameWords.value = [...new Set([...shuffledNewWords, ...shuffledArrayWords.slice(0, remaining)].sort(() => 0.5 - Math.random()))]
    } else {       
      gameWords.value = [...new Set([...shuffledNewWords, ...shuffledArrayWords].slice(0, newSettings.wordCount))]
    }

    newWordsArray.value = []
    saveState();
  }

  function clearState(init ?: boolean) {
    team1Score.value = 0;
    team2Score.value = 0;
    currentTeamTurn.value = 1;
    usedIndexes.value = [];
    killedIndexes.value = [];
    isGameOver.value = false;
    continueAfterEarlyWin.value = false;
    newWords.value = ''
    shuffledArray.value = []
    
    if (!init) saveState();
  }

  function recordCorrectAnswer(team: number, index: number) {
    let sIndex = `${index}`
    indexWinner[sIndex] = currentTeamTurn.value

    if (team === 1) team1Score.value++;
    else team2Score.value++;
  }

  function disableUsedWord(index: number, killed ?: boolean) {
    if (!killed && !usedIndexes.value.includes(index)) {
      usedIndexes.value.push(index);
    }

    if (killed && !killedIndexes.value.includes(index)) {
      killedIndexes.value.push(index)
    }

    checkGameOver();
    saveState();
  }

  function switchTurn() {
    currentTeamTurn.value = currentTeamTurn.value === 1 ? 2 : 1;
    saveState();
  }

  function checkGameOver() {
    if (toggleFirstToReach.value) {
      if (team1Score.value === firstToReach.value || team2Score.value === firstToReach.value) {
        if (currentTeamTurn.value === 2) {
          isGameOver.value = true
        }
      } else if ((usedIndexes.value.length + killedIndexes.value.length) >= settings.value.wordCount) {
        isGameOver.value = true;
      }
    } else {
      if ((usedIndexes.value.length + killedIndexes.value.length) >= settings.value.wordCount) {
        isGameOver.value = true;
      }
    }
  }

  function addWords() {
    if (!newWords.value.length) return    
    
    const symbolsAndNumbers = "1234567890-=!@#$%^&*()_+|{}:?></.';[]`"
    let newArr = newWords.value.trim().split(',')
    let hasMatch = newArr.some((str) => {
      symbolsAndNumbers.split('').some(el => str.includes(el))
    })

    if (!hasMatch && newWords.value.length) {      
      newWordsArray.value = newWords.value.trim().split(',')
      newWords.value = ''
      addWordsSuccessful.value = true
      setTimeout(() => {
        addWordsSuccessful.value = false
      }, 2000);      
      return
    }

    addWordsError.value = true
    setTimeout(() => {
      addWordsError.value = false
    }, 2000);
  }

  // LocalStorage Synchronization
  function saveState() {
    if (import.meta.client) {
      // Manually map state for saving since we aren't using the Options API `this.$state`
      const stateToSave = {
        team1Score: team1Score.value,
        team2Score: team2Score.value,
        currentTeamTurn: currentTeamTurn.value,
        settings: settings.value,
        gameWords: gameWords.value,
        usedIndexes: usedIndexes.value,
        isGameOver: isGameOver.value,
        continueAfterEarlyWin: continueAfterEarlyWin.value,
        killedIndexes: killedIndexes.value,
        useSound: useSound.value,
        difficulty: difficulty.value,
        toggleFirstToReach: toggleFirstToReach.value,
        firstToReach: firstToReach.value,
        useDefinition: useDefinition.value
      }      
      localStorage.setItem('gameState', JSON.stringify(stateToSave));
    }
  }
  
  function loadState() {
    if (import.meta.client) {
      const saved = localStorage.getItem('gameState');
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Apply saved values to refs
        team1Score.value = parsedState.team1Score ?? team1Score.value;
        team2Score.value = parsedState.team2Score ?? team2Score.value;
        currentTeamTurn.value = parsedState.currentTeamTurn ?? currentTeamTurn.value;
        settings.value = parsedState.settings ?? settings.value;
        gameWords.value = parsedState.gameWords ?? gameWords.value;
        usedIndexes.value = parsedState.usedIndexes ?? usedIndexes.value;
        killedIndexes.value = parsedState.killedIndexes ?? killedIndexes.value
        isGameOver.value = parsedState.isGameOver ?? isGameOver.value;
        useSound.value = parsedState.useSound ?? useSound.value
        toggleFirstToReach.value = parsedState.toggleFirstToReach ?? toggleFirstToReach.value
        firstToReach.value = parsedState.firstToReach ?? firstToReach.value
        difficulty.value = parsedState.difficulty ?? difficulty.value
        useDefinition.value = parsedState.showDefinition ?? useDefinition.value
        continueAfterEarlyWin.value = parsedState.continueAfterEarlyWin ?? continueAfterEarlyWin.value;
      }
    }
  }

  return {
    // State
    newWords,
    useDefinition,
    team1Score,
    team2Score,
    teamOne,
    teamTwo,
    currentPage,
    currentTeamTurn,
    addWordsSuccessful,
    useSound,
    settings,
    vocabularyTypes,
    firstToReach,
    forfeitingTeam,
    addWordsError,
    gameWords,
    usedIndexes,
    indexWinner,
    isGameOver,
    continueAfterEarlyWin,
    difficulty,
    toggleFirstToReach,
    
    // Getters
    wordsRemaining,
    activeTeamScore,
    earlyWinner,
    killedIndexes,
    
    // Actions
    initGame,
    clearState,
    addWords,
    recordCorrectAnswer,
    disableUsedWord,
    switchTurn,
    checkGameOver,
    saveState,
    loadState
  }
})