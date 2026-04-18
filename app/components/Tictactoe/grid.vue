<template>
    <div ref="boxesContainer" 
    :style="gridSizing" 
    :class="[!useCustomSize && 'flex flex-wrap w-full']" class="boxes-container bg-slate-900 overflow-scroll">
        <div 
            v-for="(cell, i) in grid" 
            :key="i"
            :id="i.toString()"
            class="cell relative transition-all duration-100 w-full h-full"
            :style="[style, {'--i': i}]"
            :data-row="cell.row" 
            :data-col="cell.col" 
            :class="getCellClasses(cell)"
            @click.self="handleClick(cell)">
            <span class="pointer-events-none drop-shadow-md" :class="getTextColor(getCellValue(cell))">
                {{ getCellValue(cell) }}
            </span>
            <button 
                v-if="historyGridIndex(cell) === 0 && playGame"
                @click.stop="deleteGrid(cell)" 
                class="absolute w-7 h-7 top-1 left-1 bg-slate-200 text-white rounded-md p-1.5 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 z-20"
                title="Delete Board">
                <SvgDelete class="w-full h-full" />
            </button>
            <button 
                v-if="historyGridIndex(cell) === 8 && playGame"
                @click.stop="resetGrid = true; setGrid(cell, grid_[0].length, grid_.length)" 
                class="absolute w-8 h-8 bottom-1 right-1 bg-slate-100 hover:bg-slate-200 text-white rounded-md p-1.5 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 z-20 flex items-center justify-center"
                title="Restart from here">
                <SvgRestart class="w-10" />
            </button>
        </div>  
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

const tictactoe = useTictactoe2()
const {playGame, resetGrid, gameGrid, winningCells, squareSize, historyGames, useScreenWidth, useCustomSize, gameEnd, numberOfCols, numberOfRows} = storeToRefs(tictactoe)
const {deleteGrid, setGrid, inSubGrid, play, cellValue, historyGridIndex} = tictactoe

const boxesContainer = ref(null)
const numberOfBoxes = ref(0)
const boxWidth = ref('0px')
const boxHeight = ref('0px')
const width = ref(0)
const height = ref(0)
const grid = ref([])
const style = ref({})
const grid_ = ref([])

const handleClick = (cell) => {
    if (!playGame.value) return;

    if ((!gameGrid.value.length) || gameEnd.value) {
        setGrid(cell, grid_.value[0].length, grid_.value.length);
    } 
    else if (gameGrid.value.length && !gameEnd.value && inSubGrid(cell)) {
        const val = cellValue(cell);
        if (val) {
            play(cell, gameGrid.value[val[0]][val[1]].value);
        }
    }
}

const gridSizing = computed(() => {
    if (useCustomSize.value) {        
        return {
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfCols.value}, ${squareSize.value}px)`,
            gridTemplateRows: `repeat(${numberOfRows.value}, ${squareSize.value}px)`,
        }
    }
})

const getCellValue = (cell) => {
    if (!playGame.value) return '';

    // Check if it is in active game grid
    if (gameGrid.value.length && inSubGrid(cell) && !gameEnd.value) {
        const val = cellValue(cell);
        if (val && gameGrid.value[val[0]][val[1]]) {
            return gameGrid.value[val[0]][val[1]].value.toUpperCase();
        }
    }

    // Check if in history grids
    const historyCells = historyGames.value.flatMap(game => game.grid).flat();
    const found = historyCells.find(c => c.row === cell.row && c.col === cell.col);
    if (found && found.value) {
        return found.value.toUpperCase();
    }

    return '';
}

const getTextColor = (text) => {
    if (text === 'X') return 'text-cyan-400';
    if (text === 'O') return 'text-pink-400';
    return '';
}

const getCellClasses = (cell) => {
    if (!playGame.value) return 'border border-slate-800';

    let classes = ['cursor-pointer'];

    const isWinCell = winningCells.value.some(c => c.row === cell.row && c.col === cell.col) || 
                      historyGames.value.flatMap(g => g.winCells).some(c => c.row === cell.row && c.col === cell.col);
    
    const isActiveSubgrid = inSubGrid(cell);

    const isHistorySubgrid = historyGames.value.flatMap(g => g.grid).flat().some(c => c.row === cell.row && c.col === cell.col);

    if (isWinCell) {
        classes.push('win-cell');
    } else if (isActiveSubgrid) {
        classes.push('subgrid');
    } else if (isHistorySubgrid) {
        classes.push('history-subgrid');
    } else {
        classes.push('empty-cell');
    }

    return classes.join(' ');
}

function resizerFunction () {    
    squareSize.value = 50

    if (useScreenWidth.value) {        
        const cssObject = getComputedStyle(document.body)
        width.value = +cssObject.getPropertyValue('width').slice(0, -2)
        height.value = +cssObject.getPropertyValue('height').slice(0, -2)
        
        const numberOfboxesV = height.value / squareSize.value
        const numberOfboxesH = width.value  / squareSize.value 
        
        boxWidth.value = squareSize.value + ((width.value % squareSize.value) / numberOfboxesH) + 'px'
        boxHeight.value = squareSize.value + ((height.value % squareSize.value) / numberOfboxesV) + 'px'
        
        style.value = {
            'width' : boxWidth.value,
            'height': boxHeight.value
        }

        let decimalIndexH = numberOfboxesH.toString().indexOf('.') > 0 ? numberOfboxesH.toString().indexOf('.') : numberOfboxesH
        let decimalIndexV = numberOfboxesV.toString().indexOf('.') > 0 ? numberOfboxesV.toString().indexOf('.') : numberOfboxesV
        
        let realNumberOfBoxesV = parseInt(numberOfboxesV.toString().slice(0, decimalIndexV))
        let realNumberOfBoxesH = parseInt(numberOfboxesH.toString().slice(0, decimalIndexH))
        
        grid_.value = Array.from({length: realNumberOfBoxesV}, (_, row) => 
            Array.from({length: realNumberOfBoxesH}, (_, col) => ({
                row, col, value: ''
            }))
        )
        
        grid.value = grid_.value.flat()
        numberOfBoxes.value = realNumberOfBoxesH * realNumberOfBoxesV   
    }

    if (useCustomSize.value) {
        boxesContainer.value.style.width = squareSize.value * numberOfRows.value

        style.value = {
            'width' : squareSize.value + 'px',
            'height': squareSize.value + 'px',
        }

        grid_.value = Array.from({length: numberOfCols.value}, (_, row) => 
            Array.from({length: numberOfRows.value}, (_, col) => ({
                row, col, value: ''
            }))
        )

        grid.value = grid_.value.flat()
        numberOfBoxes.value = numberOfCols.value * numberOfRows.value        
    }
}

onMounted(() => {
    if (boxesContainer.value instanceof HTMLElement) resizerFunction()
})

window.addEventListener('resize', () => {
    resizerFunction()
})

watch(() => boxesContainer.value, (newValue) => {
    if (newValue instanceof HTMLElement) resizerFunction()
})
</script>

<style scoped>
@reference "tailwindcss";

.cell {
    @apply w-fit h-fit font-black text-3xl flex items-center justify-center font-mono ring ring-slate-800;
}

.boxes-container {
    @apply uppercase h-full;
}
/* 1. Empty/Background Cells */
.empty-cell {
    @apply border border-slate-700/50 hover:bg-slate-800/30 transition-colors; 
}

/* 2. Active Playing Subgrid */
.subgrid {
    @apply bg-slate-800 border border-slate-600 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] hover:bg-slate-700 z-10;
}

/* 3. History (Completed) Subgrid */
.history-subgrid {
    @apply bg-slate-900/80 border border-slate-800/80 cursor-default grayscale-[30%];
}

/* 4. Winning Cells (Highest Priority - overrides background and borders) */
.win-cell {
    @apply bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-20 scale-[1.02] rounded-md
}
</style>