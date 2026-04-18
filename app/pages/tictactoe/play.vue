<template>
    <div>
        <TictactoeNavbar />
        <div v-if="settings.gridMode === 'single'" class="bg-slate-900 min-h-screen">
            <TictactoeBoxes />
        </div>
        <div v-else>
            <TictactoeGrid />
        </div>
    </div>
</template>

<script setup lang="ts">
const tictactoe = useTictactoe()
const {gameType, settings} = storeToRefs(tictactoe)
</script>