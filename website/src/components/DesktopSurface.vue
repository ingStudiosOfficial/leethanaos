<script setup lang="ts">
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';
import { appRegistry } from '@/configs/apps.config';
import { useProcessManager } from '@/stores/process_manager';
import MarqueeSelection from './MarqueeSelection.vue';

const processManagerStore = useProcessManager();
</script>

<template>
    <div class="content-wrapper">
        <button v-for="app in appRegistry" :key="app.id" class="desktop-item" @click="processManagerStore.openApp(app)">
            <md-ripple></md-ripple>
            <md-focus-ring style="--md-focus-ring-shape: 25px"></md-focus-ring>
            
            <div class="app-icon-wrapper">
                <img class="app-icon" :src="app.icon" :alt="app.name" />
            </div>
            
            <p class="app-name">{{ app.name }}</p>
        </button>
        <MarqueeSelection></MarqueeSelection>
    </div>
</template>

<style scoped>
.content-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: repeat(auto-fill, 100px); 
    grid-template-columns: repeat(auto-fill, 100px);
    grid-auto-flow: column;
    gap: 15px;
    align-content: start;
    overflow: hidden;
    padding: 20px;
}

.desktop-item {
    background: none;
    border: none;
    outline: none;
    position: relative;
    border-radius: 25px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
}

.app-icon-wrapper {
    width: 56px;
    height: 56px;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    box-sizing: border-box;
    transition: background-color 0.2s;
}

.app-name {
    margin-top: 8px;
    font-size: 12px;
    color: var(--md-sys-color-on-surface);
    text-shadow: 0 1px 2px rgba(0 0 0 / 0.5); 
}

.app-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>