const allPatterns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']

export const usePatterMatch = defineStore('patternMatch', () => {
const players = ref<1 | 2 | 3 | 4>(2)
const numberOfPatterns = ref(20)

const openedPatterns = ref<string[]>(['1', '2'])

const scores = ref({
    1: 0,
    2: 0,
    3: 0,
})

const checkPattern = () => {

}

const addScore = () => {

}

const disableMatchedPatterns = () => {

}

const switchTurn = () => {

}

const shufflePatterns = () => {

}

const startGame = () => {

}

const restart = () => {

}

const clearAll = () => {

}

return {
    players,
    numberOfPatterns,
    openedPatterns,
    scores,
    checkPattern,
    addScore,
    disableMatchedPatterns,
    switchTurn,
    shufflePatterns,
    startGame,
    restart,
    clearAll,
}
})