<template>
    <div class="h-screen max-h-screen flex flex-col bg-slate-900">
        <TictactoeNavbar />
        <div class="flex-1 overflow-auto">
                <div v-if="settings.gridMode === 'single'" class="bg-slate-900 min-h-screen">
                    <TictactoeBoxes />
                </div>
                <div v-else class="flex-1 overflow-auto flex items-center justify-center">
                    <TictactoeGrid />
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const tictactoe = useTictactoe()
const {gameType, settings} = storeToRefs(tictactoe)
</script>