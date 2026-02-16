<script setup lang="ts">
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
import { ref } from 'vue';

interface ComponentProps {
    name: string;
    icon: string;
    fullscreen: boolean;
}

const props = defineProps<ComponentProps>();

const emit = defineEmits(['close', 'minimize', 'fullscreen']);

const x = ref<number>(100);
const y = ref<number>(100);
const isDragging = ref<boolean>(false);

let startX = 0;
let startY = 0;

function startDrag(event: MouseEvent) {
    if (props.fullscreen) return;

    isDragging.value = true;

    startX = event.clientX - x.value;
    startY = event.clientY - y.value;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
}

function onDrag(event: MouseEvent) {
    if (!isDragging.value) return;

    x.value = event.clientX - startX;
    y.value = event.clientY - startY;
}

function stopDrag() {
    isDragging.value = false;

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}
</script>

<template>
    <div class="window-shell" :style="{
        left: props.fullscreen ? '0' : `${x}px`,
        top: props.fullscreen ? '0' : `${y}px`,
        width: props.fullscreen ? '100dvw' : '75dvw',
        height: props.fullscreen ? '100dvh' : '75dvh',
    }">
        <div class="window-bar" @mousedown="startDrag">
            <div class="bar-left">
                <img class="window-icon" :src="props.icon" />
                <p class="window-name">{{ props.name }}</p>
            </div>
            <div class="bar-right">
                <md-icon-button @click="emit('minimize')">
                    <md-icon>minimize</md-icon>
                </md-icon-button>
                <md-icon-button @click="emit('fullscreen')">
                    <md-icon>{{ fullscreen ? 'fullscreen_exit' : 'fullscreen' }}</md-icon>
                </md-icon-button>
                <md-icon-button @click="emit('close')">
                    <md-icon>close</md-icon>
                </md-icon-button>
            </div>
        </div>
        <div class="window-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.window-shell {
    position: fixed;
    width: 75dvw;
    height: 75dvh;
    display: grid;
    grid-template-rows: 10% 90%;
    background-color: var(--md-sys-color-surface);
    border-radius: 25px;
    box-shadow: 0 0 10px var(--md-sys-color-scrim-alpha);
    box-sizing: border-box;
}

.window-bar {
    width: 100%;
    height: 100%;
    background-color: var(--md-sys-color-surface-container);
    border-radius: 25px 25px 0 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
}

.window-content {
    width: 100%;
    height: 100%;
    background-color: var(--md-sys-color-surface);
    border-radius: 0 0 25px 25px;
    box-sizing: border-box;
    overflow: scroll;
}

.bar-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.window-icon {
    aspect-ratio: 1 / 1;
    height: 3dvw;
}

.window-name {
    font-size: 0.8rem;
}

.bar-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}
</style>