<script setup lang="ts">
import type { SleepMode } from '@/types/SleepMode';
import { ref } from 'vue';
import '@material/web/progress/circular-progress.js';

interface ComponentProps {
    sleepMode: SleepMode;
}

const props = defineProps<ComponentProps>();

const sleepMessage = ref<string>(getSleepMessage());

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
</script>

<template>
    <div class="content-wrapper">
        <md-circular-progress style="--md-circular-progress-size: 60px" indeterminate></md-circular-progress>
        <p class="sleep-message">{{ sleepMessage }}</p>
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
</style>