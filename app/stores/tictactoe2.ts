import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- Type Definitions ---
export type Player = 'x' | 'o' | 'tie' | '';

export interface CellCoordinates {
  row: number;
  col: number;
}

export interface Cell extends CellCoordinates {
  value: Player;
}

export interface GameHistory {
  grid: Cell[][];
  winner: string;
  winCells: Cell[];
}

export const useTictactoe2 = defineStore('tictactoe2', () => {
  const startGame = ref<boolean>(false);
  const playGame = ref<boolean>(false);
  const winningCells = ref<Cell[]>([]);
  const gameGrid = ref<Cell[][]>([]);
  const winCombo = ref<Cell[][]>([]);
  const historyGames = ref<GameHistory[]>([]);
  const numberOfTurns = ref<number>(0);
  const resetGrid = ref<boolean>(false);
  const gameEnd = ref<boolean>(false);
  const playerTurn = ref<Player>('');
  const numberOfRows = ref(90)
  const numberOfCols = ref(90)
  const player1 = ref('')
  const player2 = ref('')
  
  const gameScores = ref<Record<string, number>>({
    'x': 0,
    'o': 0,
    'tie': 0,
  });
  
  const plays = ref<Record<string, [number, number][]>>({
    'x': [],
    'o': []
  });

  const createGameGrid = (startCell: CellCoordinates, totalCols: number, totalRows: number, reuse: boolean = false) => {
    let usedCells = historyGames.value.flatMap(game => game.grid.flat());
    
    if (gameEnd.value) {
      clearPreviousGame();
      gameEnd.value = false;
    }

    let col = startCell.col;
    let row = startCell.row;
    
    for (let i = row; i < row + 3; i++) {
      // Fix: Build the row first to guarantee it exists before pushing
      const currentRow: Cell[] = [];
      
      for (let j = col; j < col + 3; j++) {
        let filledCell = usedCells.some(cell => cell.row === i && cell.col === j);
        let cellExists = j < totalCols && i < totalRows;
        
        if (filledCell || (!cellExists && !reuse)) {
          gameGrid.value = [];
          return;
        }
        
        currentRow.push({
          row: i,
          col: j,
          value: '',
        });
      }
      gameGrid.value.push(currentRow);
    }

    setWinCombination();
  };

  const setWinCombination = () => {
    winCombo.value.push(...gameGrid.value);

    // Fix: Build combo array first, then push to winCombo
    for (let i = 0; i < 3; i++) {
      const colCombo: Cell[] = [];
      for (let j = 0; j < 3; j++) {
        const targetRow = winCombo.value[j];
        if (targetRow && targetRow[i]) colCombo.push(targetRow[i] as Cell);
      }
      if (colCombo.length === 3) winCombo.value.push(colCombo);
    }
    
    for (let i = 0; i < 1; i++) {
      const diag1: Cell[] = [];
      for (let j = 0; j < 3; j++) {
        const targetRow = winCombo.value[j];
        if (targetRow && targetRow[j]) diag1.push(targetRow[j] as Cell);
      }      
      if (diag1.length === 3) winCombo.value.push(diag1);
    }
    
    for (let i = 0; i < 1; i++) {
      const diag2: Cell[] = [];
      for (let j = 2; j >= 0; j--) {
        const targetRow = winCombo.value[j];
        if (targetRow && targetRow[2 - j]) diag2.push(targetRow[2 - j] as Cell);
      }  
      if (diag2.length === 3) winCombo.value.push(diag2);
    }
  };

  const inSubGrid = (referenceCell: CellCoordinates): Cell | undefined => {
    let row = referenceCell.row;
    let col = referenceCell.col;
    if (playGame.value && gameGrid.value.length) {
      let flattenedGrid = gameGrid.value.flat();
      return flattenedGrid.find(el => el.row === row && el.col === col);
    }
    return undefined;
  };

  const subGridIndex = (referenceCell: CellCoordinates): number | '' => {
    let row = referenceCell.row;
    let col = referenceCell.col;
    if (playGame.value && gameGrid.value.length) {
      let flattenedGrid = gameGrid.value.flat().map(val => [val.row, val.col]);

      for (let index = 0; index < flattenedGrid.length; index++) {
        const item = flattenedGrid[index];
        // Fix: Check if item exists
        if (item && item[0] === row && item[1] === col) {
          return index;
        }
      }
    }
    return '';
  };

  const historyGridIndex = (referenceCell: CellCoordinates): number | undefined => {
    let row = referenceCell.row;
    let col = referenceCell.col;

    if (historyGames.value.length) {
      let grids = historyGames.value.map(game => game.grid);
      for (let i = 0; i < grids.length; i++) {
        const currentGrid = grids[i];
        if (!currentGrid) continue; // Fix: safety check
        
        let flatGrid = currentGrid.flat();
        for (let j = 0; j < flatGrid.length; j++) {
          const cell = flatGrid[j];
          if (cell && cell.row === row && cell.col === col) {
            return j;
          }
        }
      }
    }
    return undefined;
  };

  const clearAll = () => {
    gameScores.value = { 'x': 0, 'o': 0, 'tie': 0 };
    historyGames.value = [];
    clearPreviousGame();
  };

  const cellValue = (referenceCell: CellCoordinates): [number, number] | undefined => {
    let row = referenceCell.row;
    let col = referenceCell.col;
    const val = ref<[number, number]>();
    
    gameGrid.value.forEach((r, i) => {
      r.forEach((cell, j) => {
        if (cell.row === row && cell.col === col) {
          val.value = [i, j];
        }
      });
    });
    
    return val.value;
  };

  const play = (referenceCell: CellCoordinates, value?: Player) => {
    let row = referenceCell.row;
    let col = referenceCell.col;
    
    if (gameEnd.value || value) return;
    if (!startGame.value) startGame.value = true;
    
    gameGrid.value.forEach((r, i) => {
      r.forEach((cell, j) => {
        if (cell.row === row && cell.col === col) {
          const targetRow = gameGrid.value[i];
          const targetCell = targetRow ? targetRow[j] : undefined;
          
          // Fix: Safely check if cell is already populated
          if (!targetCell || targetCell.value) return;
          
          numberOfTurns.value++;
          
          // Fix: Safely push to record array
          const currentPlays = plays.value[playerTurn.value as string];
          if (currentPlays) currentPlays.push([row, col]);
          
          targetCell.value = playerTurn.value;
          
          cellValue({ row, col });
          
          if (numberOfTurns.value > 4) checkWin();
        }
      });
    });
    
    playerTurn.value = playerTurn.value === 'x' ? 'o' : 'x';
  };

  const checkWin = () => {
    const currentPlays = plays.value[playerTurn.value as string];
    if (!currentPlays) return;

    for (let i = 0; i < winCombo.value.length; i++) {
      const combo = winCombo.value[i];
      if (!combo) continue; // Fix: safety check
      
      let win = combo.every(cell => {
        return currentPlays.some(play => play[0] === cell.row && play[1] === cell.col);
      });

      if (win) {
        gameEnd.value = true;
        startGame.value = false;
        
        // Fix: Typescript object assignment
        winningCells.value = [...combo]; 
        saveProgress(playerTurn.value + ' WINS', winningCells.value);
        
        if (playerTurn.value === 'x') {
          gameScores.value['x'] = (gameScores.value['x'] || 0) + 1;
        } else {
          gameScores.value['o'] = (gameScores.value['o'] || 0) + 1;
        }
      }
    }

    if (numberOfTurns.value === 9 && !gameEnd.value) {
      gameEnd.value = true;
      startGame.value = false;
      saveProgress('Tie game', winningCells.value);
      
      // Fix: Record safety check
      gameScores.value['tie'] = (gameScores.value['tie'] || 0) + 1;
      playerTurn.value = playerTurn.value === 'x' ? 'o' : 'x';
    }
  };

  const saveProgress = (verdict: string, winCells: Cell[]) => {
    historyGames.value.push({
      grid: JSON.parse(JSON.stringify(gameGrid.value)),
      winner: verdict,
      winCells: [...winCells]
    });
  };

  const clearPreviousGame = () => {
    gameGrid.value = [];
    winCombo.value = [];
    winningCells.value = [];
    startGame.value = false;
    numberOfTurns.value = 0; 
    playerTurn.value = playerTurn.value === 'x' ? 'o' : 'x';
    plays.value = { 'x': [], 'o': [] };
  };

  const deleteGrid = (referenceCell: CellCoordinates) => { 
    let row = referenceCell.row;
    let col = referenceCell.col;
    const historyIndex = ref<number | null>(null);
    
    let grids = historyGames.value.map(game => game.grid.flat());
    let isGameGrid = gameGrid.value.flat().some(cell => cell.row === row && cell.col === col);

    for (let i = 0; i < grids.length; i++) {
      if (historyIndex.value !== null) break;
      const grid = grids[i]; 
      if (!grid) continue; // Fix: safety check
      
      grid.forEach((cell) => {
        if (cell.row === row && cell.col === col) {
          historyIndex.value = i;
        }
      });
    }

    if (isGameGrid) {
      historyGames.value = historyGames.value.filter((_, index) => index !== historyIndex.value);
      gameGrid.value = [];
    } 
    else {
      historyGames.value = historyGames.value.filter((_, index) => index !== historyIndex.value);  
    }
  };

  const setGrid = (referenceCell: CellCoordinates, totalCols: number, totalRows: number) => {
    console.log('wow');
    
    let row = referenceCell.row;
    let col = referenceCell.col;
    
    let historyGrids = historyGames.value.map(game => game.grid.flat());
    let isGameGrid = gameGrid.value.flat().some(cell => cell.row === row && cell.col === col);
    let usedCells = historyGames.value.length ? historyGames.value.flatMap(game => game.grid.flat()) : [];
    let filledCell = usedCells.some(cell => cell.row === row && cell.col === col);

    if ((!historyGrids.length && !isGameGrid) || !filledCell) {
      createGameGrid(referenceCell, totalCols, totalRows);
    } 
    else {
      if (!resetGrid.value) return;
      const historyIndex = ref<number | null>(null);
      
      for (let i = 0; i < historyGrids.length; i++) {
        if (historyIndex.value !== null) break;
        const grid = historyGrids[i]; 
        if (!grid) continue; // Fix: safety check
        
        grid.forEach((cell) => {
          if (cell.row === row && cell.col === col) {
            historyIndex.value = i;
          }
        });
      }
  
      if (isGameGrid) {
        // Fix: Safe access into arrays
        let grid_ = gameGrid.value[0]?.[0];  
        historyGames.value = historyGames.value.filter((_, gameIndex) => gameIndex !== historyIndex.value);
        if (grid_) {
          createGameGrid({row: grid_.row, col: grid_.col}, totalCols, totalRows, true);
        }
      } 
      else {
        if (gameEnd.value && historyIndex.value !== null) {  
          let targetHistoryGame = historyGames.value[historyIndex.value];
          // Fix: Safe access
          let cell = targetHistoryGame?.grid[0]?.[0];
          
          if (cell) {
             historyGames.value = historyGames.value.filter((_, index) => index !== historyIndex.value);
             createGameGrid({row: cell.row, col: cell.col}, totalCols, totalRows, true);
          }
        }
      }
    }

    resetGrid.value = false;
  };

  return {
    player2,
    player1,
    resetGrid,
    startGame,
    playGame,
    playerTurn,
    gameGrid,
    gameEnd,
    winningCells,
    numberOfCols,
    numberOfRows,
    historyGames,
    clearAll,
    cellValue,
    createGameGrid,
    inSubGrid,
    historyGridIndex,
    subGridIndex,
    play,
    setGrid,
    gameScores,
    deleteGrid,
  };
});