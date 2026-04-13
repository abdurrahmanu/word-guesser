// stores/game.ts
import { defineStore } from 'pinia'

const ALL_WORDS = [
  "action", "advice", "afraid", "airport", "animal", "answer", "appear", "apple", "artist", "asleep", "attack", "author", "aware",
  "balance", "banana", "battle", "beautiful", "believe", "benefit", "bicycle", "blanket", "bottle", "branch", "brave", "bridge", "butter",
  "camera", "cancel", "candle", "careful", "castle", "central", "chance", "chicken", "choose", "circle", "clever", "coffee", "common",
  "danger", "decide", "defend", "degree", "deliver", "desert", "design", "detail", "differ", "dinner", "doctor", "double", "dragon",
  "eagle", "effect", "effort", "elephant", "employ", "empty", "energy", "engine", "ensure", "entire", "escape", "estate", "expert",
  "fabric", "factory", "famous", "farmer", "father", "figure", "finger", "finish", "flavor", "flower", "follow", "forest", "future",
  "garage", "garden", "gather", "gentle", "global", "golden", "ground", "growth", "guard", "guess", "guest", "guide", "guitar",
  "habit", "hammer", "handle", "happen", "health", "heart", "heavy", "height", "helmet", "hidden", "history", "hollow", "hunger",
  "ignore", "iguana", "impact", "import", "improve", "include", "income", "injury", "inside", "insect", "intend", "invite", "island",
  "jacket", "jewel", "journal", "journey", "joyful", "judge", "juice", "jumpy", "jungle", "junior", "justice", "justify",
  "karma", "kettle", "kidney", "killer", "kingdom", "kitchen", "kitten", "knife", "knight", "knock", "knowledge", "knuckle",
  "ladder", "language", "laptop", "leader", "league", "length", "lesson", "letter", "listen", "little", "lovely", "loyal", "luggage",
  "machine", "magic", "manage", "market", "master", "matter", "memory", "mental", "method", "middle", "minute", "mirror", "mother",
  "narrow", "nation", "native", "nature", "needle", "nephew", "nerve", "normal", "notice", "novel", "number", "nurse",
  "object", "observe", "ocean", "office", "online", "option", "orange", "order", "origin", "outfit", "output", "owner",
  "package", "paint", "palace", "parent", "party", "peaceful", "pencil", "people", "person", "picture", "planet", "pocket",
  "quality", "quarter", "quartz", "queen", "query", "quest", "quick", "quiet", "quilt", "quirk", "quiver", "quote",
  "rabbit", "reason", "record", "reduce", "region", "relate", "remain", "remove", "repair", "report", "rescue", "return",
  "safety", "sample", "school", "screen", "search", "season", "second", "secret", "secure", "shadow", "silver", "single",
  "table", "target", "teacher", "temple", "theory", "thirsty", "thread", "ticket", "timber", "tomato", "travel", "turtle",
  "ugly", "unable", "uncle", "uniform", "union", "unique", "unite", "unlock", "update", "urgent", "useful", "usual",
  "vacant", "valley", "value", "velvet", "verbal", "verify", "vessel", "victim", "victory", "village", "vision", "volume",
  "waffle", "wallet", "wander", "warm", "water", "wealth", "weapon", "weather", "weight", "welcome", "window", "winter",
  "xenon", "xylophone",
  "yacht", "yellow", "yield", "yogurt", "young", "youth", "yummy",
  "zebra", "zero", "zipper", "zodiac", "zombie", "zone"
];

export const useGameStore = defineStore('game', () => {
  const team1Score = ref(0)
  const team2Score = ref(0)
  const teamOne = ref('Team One')
  const teamTwo = ref('Team Two')
  const currentTeamTurn = ref<1 | 2>(1) // 1 or 2
  const settings = ref({
    wordCount: 16,
    timerSeconds: 35,
    allowTransfer: true
  })
  const gameWords = ref<string[]>([])
  const usedIndexes = ref<number[]>([])
  const transferredCount = ref(0)
  const isGameOver = ref(false)
  const continueAfterEarlyWin = ref(false)
  const shuffledArray = ref<string[]>()

  function shuffleArray(array: string[]) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i] as any, shuffled[j] as any] = [shuffled[j], shuffled[i]];
    }
        
        return shuffled;
    }

  const wordsRemaining = computed(() => settings.value.wordCount - usedIndexes.value.length)
  
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

  // --- Actions ---
  function initGame(newSettings: { wordCount: number, timerSeconds: number, allowTransfer: boolean }) {
    settings.value = newSettings;
    team1Score.value = 0;
    team2Score.value = 0;
    currentTeamTurn.value = 1;
    usedIndexes.value = [];
    transferredCount.value = 0;
    isGameOver.value = false;
    continueAfterEarlyWin.value = false;

    shuffledArray.value = shuffleArray([...ALL_WORDS])

    // Randomly select words for this session
    const shuffled = [...shuffledArray.value].sort(() => 0.5 - Math.random());
    gameWords.value = shuffled.slice(0, newSettings.wordCount);
    
    saveState();
  }

  function recordCorrectAnswer(team: number) {
    if (team === 1) team1Score.value++;
    else team2Score.value++;
  }

  function markWordUsed(index: number) {
    if (!usedIndexes.value.includes(index)) {
      usedIndexes.value.push(index);
    }
    checkGameOver();
    saveState();
  }

  function switchTurn() {
    currentTeamTurn.value = currentTeamTurn.value === 1 ? 2 : 1;
    saveState();
  }

  function checkGameOver() {
    if (usedIndexes.value.length >= settings.value.wordCount) {
      isGameOver.value = true;
    }
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
        transferredCount: transferredCount.value,
        isGameOver: isGameOver.value,
        continueAfterEarlyWin: continueAfterEarlyWin.value
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
        transferredCount.value = parsedState.transferredCount ?? transferredCount.value;
        isGameOver.value = parsedState.isGameOver ?? isGameOver.value;
        continueAfterEarlyWin.value = parsedState.continueAfterEarlyWin ?? continueAfterEarlyWin.value;
      }
    }
  }

  return {
    // State
    team1Score,
    team2Score,
    teamOne,
    teamTwo,
    currentTeamTurn,
    settings,
    gameWords,
    usedIndexes,
    transferredCount,
    isGameOver,
    continueAfterEarlyWin,
    
    // Getters
    wordsRemaining,
    activeTeamScore,
    earlyWinner,
    
    // Actions
    initGame,
    recordCorrectAnswer,
    markWordUsed,
    switchTurn,
    checkGameOver,
    saveState,
    loadState
  }
})