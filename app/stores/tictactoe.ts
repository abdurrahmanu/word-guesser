import { ref } from 'vue';
import { defineStore } from 'pinia';
import { toNumber } from '@vue/shared';

export type PlayerSymbol = 'x' | 'o' | '';

export const useTictactoe = defineStore('tictactoe', () => {
  const turn = ref<PlayerSymbol | string>('');
  const start = ref<boolean>(false);
  const squares = ref<HTMLElement | null>(null);
  const boxesID = ref<string[]>([]);
  const playerOne = ref<PlayerSymbol | string>('');
  const playerTwo = ref<PlayerSymbol | string>('');
  const playerOneIndexes = ref<number[]>([]);
  const playerTwoIndexes = ref<number[]>([]);
  const chooseSymbol = ref<boolean>(true);
  const winIndexes = ref<number[]>([]);
  const drawTies = ref<number>(0);
  const playerOneWins = ref<number>(0);
  const playerTwoWins = ref<number>(0);
  const vsPC = ref<boolean>(false);
  const resetGame = ref<boolean>(false);
  const openModal = ref<boolean>(false);

  const settings = ref({
  gridMode: 'multiple',
  targetScore: 3
})

const toggleFirstToReach = ref(false)
const gameType = ref<'human' | 'AI'>('human')
  
  const winCombo = ref<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ]);

  function play(e: MouseEvent) {    
    const target = e.target as HTMLElement;
    
    if (!target || !target.id) return;
    if (boxesID.value.includes(target.id)) return;
    
    if (!start.value) start.value = true;
    boxesID.value.push(target.id);

    if (turn.value === playerOne.value) {
      target.innerText = playerOne.value as string;
      turn.value = playerTwo.value;
      playerOneIndexes.value.push(toNumber(target.id));
      if (playerOneIndexes.value.length > 2) checkWin(1);
    } 
    else {
      target.innerText = playerTwo.value as string;
      turn.value = playerOne.value;
      playerTwoIndexes.value.push(toNumber(target.id));
      if (playerTwoIndexes.value.length > 2) checkWin(2);
    }
  }

  function setSymbol(symbol: PlayerSymbol) {
    symbol === 'x' ? playerTwo.value = 'o' : playerTwo.value = 'o';  
    playerOne.value = symbol;
    chooseSymbol.value = false;  
    turn.value = playerOne.value;
  }

  function checkWin(player: number) {
    if (player === 1) {
      winIndexes.value = winCombo.value.find(arr => arr.every(el => playerOneIndexes.value.includes(el))) || [];
      if (winIndexes.value.length) {
        turn.value = playerOne.value;
        setTimeout(() => {
          playerOneWins.value++;
          reset();
        }, 700);
      }
    } 
    else {
      winIndexes.value = winCombo.value.find(arr => arr.every(el => playerTwoIndexes.value.includes(el))) || [];
      if (winIndexes.value.length) {
        turn.value = playerTwo.value;
        setTimeout(() => {
          playerTwoWins.value++;
          reset();
        }, 700);
      }
    }
      
    if ((playerOneIndexes.value.length === 5 || playerTwoIndexes.value.length === 5) && !winIndexes.value.length) {
      setTimeout(() => {
        drawTies.value++;
        reset();
      }, 300);
    }
  }
  
  function reset() {
    openModal.value = false;
    start.value = false;
    boxesID.value = [];
    winIndexes.value = [];
    playerOneIndexes.value = [];
    playerTwoIndexes.value = [];
    
    // Safely iterate over HTML collection in TS
    if (squares.value) {
      Array.from(squares.value.children).forEach(each => {
        (each as HTMLElement).innerText = '';
      });
    }
  }

  // Renamed parameter to avoid TS type shadowing
  function restart() {
    openModal.value = false;
    reset();
    playerOneWins.value = 0;
    playerTwoWins.value = 0;
    drawTies.value = 0;
  }
  
  function undoMove() {
    openModal.value = false;
    if (!boxesID.value.length) return;
    
    let lastMoveIndex = boxesID.value[boxesID.value.length - 1];
    
    if (squares.value) {
      const targetElement = Array.from(squares.value.children).find(el => el.id === lastMoveIndex) as HTMLElement | undefined;
      if (targetElement) {
        targetElement.innerText = '';
      }
    }
    
    boxesID.value.pop();
  }

  return {
    checkWin,
    restart,
    undoMove,
    reset,
    setSymbol,
    play,
    squares,
    settings,
    toggleFirstToReach,
    gameType,
    playerTwoWins,
    playerOneWins,
    winIndexes,
    resetGame,
    turn,
    playerTwoIndexes,
    playerOneIndexes,
    playerTwo,
    playerOne,
    openModal,
    drawTies,
    boxesID,
    start,
    chooseSymbol,
    vsPC,
  };
});