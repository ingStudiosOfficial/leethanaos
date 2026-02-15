<script setup lang="ts">
import DesktopSurface from './DesktopSurface.vue';
import TaskBar from './TaskBar.vue';

</script>

<template>
    <div class="desktop-grid">
        <DesktopSurface class="desktop-surface"></DesktopSurface>
        <TaskBar class="taskbar"></TaskBar>
    </div>
</template>

<style scoped>
.desktop-grid {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100dvh;
    width: 100dvw;
}

.desktop-surface {
    flex-grow: 1;
}

.taskbar {
    bottom: 0;
    left: 0;
    height: 8%;
    flex-shrink: 0;
}
</style>