<script setup lang="ts">
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';
import { appRegistry } from '@/configs/apps.config';
import { useProcessManager, type Process } from '@/stores/process_manager';

const processManagerStore = useProcessManager();

function toggleMinimize(process: Process) {
    process.minimized = !process.minimized;
    if (!process.minimized) {
        processManagerStore.focusApp(process.id);
    }
}
</script>

<template>
    <div class="content-wrapper">
        <div class="apps">
            <button v-for="process in processManagerStore.activeProcesses" :key="process.id" :id="`taskbar-icon-${process.id}`" class="app" @click="toggleMinimize(process)">
                <md-ripple></md-ripple>
                <md-focus-ring></md-focus-ring>
                <img class="app-icon" :src="appRegistry.find(a => a.id === process.appId)?.icon" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--md-sys-color-surface-container-translucent);
    box-sizing: border-box;
    padding: 5px;
    backdrop-filter: blur(5px);
    border-radius: 25px 25px 0 0;
    z-index: 10000;
}

.apps {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    gap: 10px;
}

.app {
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    border-radius: 50%;
}

.app-icon {
    width: 100%;
    height: 100%;
}
</style>