<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue';

const isSelecting = ref<boolean>(false);
const startPos = reactive({ x: 0, y: 0 });
const selectionBox = reactive({ top: 0, left: 0, width: 0, height: 0 });

function startSelection(event: MouseEvent) {
    if (!(event.target as HTMLElement).classList.contains('selection-area')) return;

    isSelecting.value = true;
    startPos.x = event.clientX;
    startPos.y = event.clientY;

    updateBox(event);

    window.addEventListener('mousemove', doSelection);
    window.addEventListener('mouseup', stopSelection);
}

function doSelection(event: MouseEvent) {
    if (!isSelecting.value) return;
    updateBox(event);
}

function updateBox(event: MouseEvent) {
    selectionBox.left = Math.min(event.clientX, startPos.x);
    selectionBox.top = Math.min(event.clientY, startPos.y);
    selectionBox.width = Math.abs(event.clientX - startPos.x);
    selectionBox.height = Math.abs(event.clientY - startPos.y);
}

function stopSelection() {
    isSelecting.value = false;
    window.removeEventListener('mousemove', doSelection);
    window.removeEventListener('mouseup', stopSelection);
}

onUnmounted(() => {
    window.removeEventListener('mousemove', doSelection);
    window.removeEventListener('mouseup', stopSelection);
});
</script>

<template>
    <div class="selection-area" @mousedown.self="startSelection">
        <div v-if="isSelecting" class="selection-box" :style="{
            top: `${selectionBox.top}px`,
            left: `${selectionBox.left}px`,
            width: `${selectionBox.width}px`,
            height: `${selectionBox.height}px`,
        }"></div>
    </div>
</template>

<style scoped>
.selection-area {
    width: 100%;
    height: 100%;
    position: fixed;
    user-select: none;
    z-index: 5;
}

.selection-box {
    position: fixed;
    border: 1px solid var(--md-sys-color-surface-container);
    background-color: var(--md-sys-color-surface-container-translucent);
    pointer-events: none;
    z-index: 100;
}
</style>