<script setup lang="ts">
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
import { ref } from 'vue';

interface ComponentProps {
    name: string;
    icon: string;
    fullscreen: boolean;
}

interface InitMouse {
    x: number;
    y: number;
}

interface InitSize {
    width: number;
    height: number;
}

const props = defineProps<ComponentProps>();

const emit = defineEmits(['close', 'minimize', 'fullscreen']);

const x = ref<number>(100);
const y = ref<number>(100);
const width = ref<number>(75);
const height = ref<number>(75);
const isDragging = ref<boolean>(false);

let startX = 0;
let startY = 0;

const initMouse: InitMouse = { x: 0, y: 0 };
const initSize: InitSize = { width: width.value, height: height.value };

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

function startResize(event: MouseEvent) {
    if (props.fullscreen) return;

    initMouse.x = event.clientX;
    initMouse.y = event.clientY;
    initSize.width = width.value;
    initSize.height = height.value;

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
}

function onResize(event: MouseEvent) {
    const deltaXPixels = event.clientX - initMouse.x;
    const deltaYPixels = event.clientY - initMouse.y;

    const deltaVW = (deltaXPixels / window.innerWidth) * 100;
    const deltaVH = (deltaYPixels / window.innerHeight) * 100;

    width.value = initSize.width + deltaVW;
    height.value = initSize.height + deltaVH;
}

function stopResize() {
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
}
</script>

<template>
    <div class="window-shell" :style="{
        left: props.fullscreen ? '0' : `${x}px`,
        top: props.fullscreen ? '0' : `${y}px`,
        width: props.fullscreen ? '100dvw' : `${width}dvw`,
        height: props.fullscreen ? '100dvh' : `${height}dvh`,
        borderRadius: props.fullscreen ? '0' : '25px',
    }">
        <div class="window-bar" @mousedown.prevent.stop="startDrag">
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
        <div class="botright-resize" @mousedown.prevent.stop="startResize"></div>
    </div>
</template>

<style scoped>
.window-shell {
    position: fixed;
    width: 75dvw;
    height: 75dvh;
    display: flex;
    flex-direction: column;
    background-color: var(--md-sys-color-surface);
    border-radius: 25px;
    box-shadow: 0 0 10px var(--md-sys-color-scrim-alpha);
    box-sizing: border-box;
    overflow: hidden;
}

.window-bar {
    width: 100%;
    height: 10dvh;
    background-color: var(--md-sys-color-surface-container);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    top: 0;
    left: 0;
    overflow: scroll;
}

.window-content {
    width: 100%;
    height: 100%;
    background-color: var(--md-sys-color-surface);
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

.botright-resize {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
}
</style>