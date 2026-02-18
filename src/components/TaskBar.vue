<script setup lang="ts">
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { appRegistry } from '@/configs/apps.config';
import { useProcessManager, type Process } from '@/stores/process_manager';
import { onMounted, onUnmounted } from 'vue';

interface MdMenu extends HTMLElement {
    open: boolean;
}

const emit = defineEmits(['lock', 'sleep', 'shutdown', 'restart']);

const processManagerStore = useProcessManager();

function toggleMinimize(process: Process) {
    process.minimized = !process.minimized;
    if (!process.minimized) {
        processManagerStore.focusApp(process.id);
    }
}

function toggleStartMenu() {
    const startMenu: MdMenu = document.getElementById('start-menu') as MdMenu;
    startMenu.open = !startMenu.open;
}

function listenForStartMenuPress(event: KeyboardEvent) {
    if (event.metaKey && event.altKey) {
        event.preventDefault();
        toggleStartMenu();
    }
}

onMounted(() => {
    document.addEventListener('keydown', listenForStartMenuPress);
});

onUnmounted(() => {
    document.removeEventListener('keydown', listenForStartMenuPress);
});
</script>

<template>
    <div class="content-wrapper">
        <div class="apps">
            <button class="start-button" id="start-button" @click="toggleStartMenu()">
                <md-ripple></md-ripple>
                <md-focus-ring></md-focus-ring>
                <img class="start-icon" src="/icons/turtle_start_icon.png" />
            </button>
            <md-menu id="start-menu" anchor="start-button" positioning="popover">
                <md-menu-item @click="emit('lock')">
                    <div slot="headline">Lock</div>
                    <md-icon slot="start">lock</md-icon>
                </md-menu-item>
                <md-menu-item @click="emit('sleep')">
                    <div slot="headline">Sleep</div>
                    <md-icon slot="start">bedtime</md-icon>
                </md-menu-item>
                <md-menu-item @click="emit('shutdown')">
                    <div slot="headline">Shutdown</div>
                    <md-icon slot="start">power_settings_new</md-icon>
                </md-menu-item>
                <md-menu-item @click="emit('restart')">
                    <div slot="headline">Restart</div>
                    <md-icon slot="start">replay</md-icon>
                </md-menu-item>
            </md-menu>
            <button v-for="process in processManagerStore.activeProcesses" :key="process.id" :id="`taskbar-icon-${process.id}`" class="app" @click="toggleMinimize(process)">
                <md-ripple></md-ripple>
                <md-focus-ring></md-focus-ring>
                <img class="app-icon" :src="appRegistry.find(a => a.id === process.appId)?.icon" />
            </button>
        </div>
    </div>
</template>

<style scoped>
md-focus-ring {
    --md-focus-ring-shape: 10px;
}

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

.app, .start-button {
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    border-radius: 10px;
    padding: 5px;
    box-sizing: border-box;
}

.app-icon, .start-icon {
    width: 100%;
    height: 100%;
}
</style>