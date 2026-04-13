<script setup lang="ts">
import { navigateTo } from 'nuxt/app';

</script>

<template>
    <div class="py-20">
        <p class="text-red-400 text-7xl text-center">ERROR</p>
        <button @click="navigateTo('/')" class="inline-block w-fit mx-auto px-8 py-1 rounded-md hover:text-white hover:bg-black duration-100 transition-colors">BACK TO HOME</button>
    </div>
</template>