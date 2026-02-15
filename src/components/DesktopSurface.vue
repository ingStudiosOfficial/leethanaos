<script setup lang="ts">
import '@material/web/focus/md-focus-ring.js';

import { appRegistry } from '@/configs/apps';
</script>

<template>
    <div class="content-wrapper">
        <button v-for="app in appRegistry" :key="app.id" class="desktop-item">
            <md-foucs-ring></md-foucs-ring>
            <div class="app-icon">

            </div>
            <p class="app-name">{{ app.name }}</p>
        </button>
    </div>
</template>

<style scoped>
.content-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: repeat(auto-fill, 75px);
    grid-template-columns: repeat(auto-fill, 75px);
    grid-auto-flow: column;
    gap: 20px;
    align-content: start;
    overflow: hidden;
    padding: 20px;
}

.desktop-item {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

.app-name {
    font-size: 13px;
}

.app-icon {
    width: 35px;
    height: 35px;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 50%;
}
</style>