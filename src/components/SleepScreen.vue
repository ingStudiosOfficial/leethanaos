<script setup lang="ts">
import type { SleepMode } from '@/types/SleepMode';
import { onMounted, onUnmounted, ref } from 'vue';
import '@material/web/progress/circular-progress.js';

interface ComponentProps {
    sleepMode: SleepMode;
}

const props = defineProps<ComponentProps>();

const emit = defineEmits(['restartComplete', 'sleepWake']);

const sleepMessage = ref<string>(getSleepMessage());
const displayLoading = ref<boolean>(props.sleepMode === 'sleep' ? false : true);

function getSleepMessage(): string {
    switch (props.sleepMode) {
        case 'sleep':
            return 'Sleeping...';
        case 'shutdown':
            return 'Shutting down...';
        case 'restart':
            return 'Restarting...';
        default:
            return 'Sleeping...';
    }
}

async function restartDesktop() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    displayLoading.value = true;
    sleepMessage.value = 'Booting up...';
    await new Promise(resolve => setTimeout(resolve, 2000));
    emit('restartComplete');
}

async function loadBeforeShutdown() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    displayLoading.value = false;
    if (props.sleepMode === 'restart') restartDesktop();
}

function onSleepWake() {
    if (props.sleepMode !== 'sleep') return;

    emit('sleepWake');
}

onMounted(() => {
    if (props.sleepMode !== 'sleep') loadBeforeShutdown();
    document.addEventListener('keydown', onSleepWake);
    document.addEventListener('mousedown', onSleepWake);
});

onUnmounted(() => {
    document.removeEventListener('keydown', onSleepWake);
    document.removeEventListener('mousedown', onSleepWake);
});
</script>

<template>
    <div class="content-wrapper">
        <div v-if="displayLoading" class="loading">
            <md-circular-progress style="--md-circular-progress-size: 60px" indeterminate></md-circular-progress>
            <p class="sleep-message">{{ sleepMessage }}</p>
        </div>
        <div v-if="!displayLoading" class="sleep"></div>
    </div>
</template>

<style scoped>
.content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
}

.sleep-message {
    font-size: 1.25rem;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
}

.sleep {
    background-color: #000000;
    width: 100%;
    height: 100%;
}
</style>