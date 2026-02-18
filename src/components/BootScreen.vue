<script setup lang="ts">
import '@material/web/button/filled-button.js';
import { ref, onMounted } from 'vue';

interface ComponentProps {
    skipAnimations?: boolean;
}

const props = defineProps<ComponentProps>();
const emit = defineEmits(['start']);
const bootComplete = ref<boolean>(false);

function bootAnimationFinished() {
    bootComplete.value = true;
}

onMounted(() => {
    if (props.skipAnimations) {
        bootComplete.value = true;
    }
});
</script>

<template>
    <div class="content-wrapper" :class="{ 'no-animations': skipAnimations }">
        <h1 class="os-name">LeethanaOS</h1>
        <p class="os-desc" @animationend="bootAnimationFinished()">A portfolio disguised as an operating system</p>
        <md-filled-button class="start-button" :disabled="!bootComplete" @click="emit('start')">Start</md-filled-button>
    </div>
</template>

<style scoped>
.content-wrapper {
    display: grid;
    place-items: center;
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
}

.os-name {
    color: var(--md-sys-color-primary);
    opacity: 0;
    animation: titleFadeIn 2.0s ease-in;
    animation-fill-mode: forwards;
    grid-column: 1;
    grid-row: 1;
    transform: translateY(-2.8dvh);
}

.os-desc {
    color: var(--md-sys-color-on-surface);
    opacity: 0;
    animation: descFadeIn 2.0s ease-in;
    animation-fill-mode: forwards;
    grid-column: 1;
    grid-row: 1;
}

.start-button {
    opacity: 0;
    animation: btnFadeIn 2.0s ease-in;
    animation-fill-mode: forwards;
    grid-column: 1;
    grid-row: 1;
    transform: translateY(2.8dvh);
}

@keyframes titleFadeIn {
    0% {
        opacity: 0;
        transform: translateY(-2.8dvh);
    }
    75% {
        opacity: 1;
        transform: translateY(-2.8dvh);
    }
    100% {
        opacity: 1;
        transform: translateY(-10dvh);
    }
}

@keyframes descFadeIn {
    0% {
        opacity: 0;
    }
    85% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes btnFadeIn {
    0% {
        opacity: 0;
        transform: translateY(2.8dvh);
    }
    75% {
        opacity: 1;
        transform: translateY(2.8dvh);
    }
    100% {
        opacity: 1;
        transform: translateY(10dvh);
    }
}

.no-animations .os-name,
.no-animations .os-desc,
.no-animations .start-button {
    animation: none !important;
    opacity: 1 !important;
}

.no-animations .os-name {
    transform: translateY(-10dvh);
}

.no-animations .start-button {
    transform: translateY(10dvh);
}
</style>