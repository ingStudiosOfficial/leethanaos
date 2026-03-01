<script setup lang="ts">
import { useProcessManager } from '@/stores/process_manager';
import DesktopSurface from './DesktopSurface.vue';
import TaskBar from './TaskBar.vue';
import WindowShell from './WindowShell.vue';
import { appRegistry } from '@/configs/apps.config';
import gsap from 'gsap';

const emit = defineEmits(['lock', 'sleep', 'shutdown', 'reboot']);

const processManagerStore = useProcessManager();

function getIcon(appId: string) {
    return appRegistry.find(a => a.id === appId)?.icon || '';
}

function windowOnEnter(el: Element, done: () => void) {
    const processId = el.id.replace('window-', '');
    const iconEl = document.getElementById(`taskbar-icon-${processId}`);

    if (iconEl) {
        const rect = el.getBoundingClientRect();
        const iconRect = iconEl.getBoundingClientRect();

        const deltaX = (iconRect.left + iconRect.width / 2) - (rect.left + rect.width / 2);
        const deltaY = (iconRect.top + iconRect.height / 2) - (rect.top + rect.height / 2);

        gsap.fromTo(el, 
            {
                x: deltaX,
                y: deltaY,
                scale: 0.1,
                opacity: 0,
            },
            {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: done,
            }
        );
    } else {
        gsap.fromTo(el,
            {
                opacity: 0,
                scale: 0.95,
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: done,
            }
        );
    }
}

function windowOnLeave(el: Element, done: () => void) {
    const processId = el.id.replace('window-', '');
    const iconEl = document.getElementById(`taskbar-icon-${processId}`);

    if (iconEl) {
        const rect = el.getBoundingClientRect();
        const iconRect = iconEl.getBoundingClientRect();

        const deltaX = (iconRect.left + iconRect.width / 2) - (rect.left + rect.width / 2);
        const deltaY = (iconRect.top + iconRect.height / 2) - (rect.top + rect.height / 2);

        gsap.to(el, {
            x: deltaX,
            y: deltaY,
            scale: 0.1,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                gsap.set(el, { clearProps: 'all' });
                done();
            },
        });
    } else {
        gsap.to(el, {
            opacity: 0,
            scale: 0.95,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                gsap.set(el, { clearProps: 'all' });
                done();
            },
        });
    }
}
</script>

<template>
    <div class="desktop-grid">
        <DesktopSurface class="desktop-surface"></DesktopSurface>
        <TaskBar class="taskbar" @lock="emit('lock')" @sleep="emit('sleep')" @shutdown="emit('shutdown')" @reboot="emit('reboot')"></TaskBar>
        <div v-for="process in processManagerStore.activeProcesses" :key="process.id">
            <Transition :css="false" @enter="windowOnEnter" @leave="windowOnLeave">
                <WindowShell v-show="!process.minimized" :style="{ zIndex: process.zIndex }" :name="process.name" :icon="getIcon(process.appId)" :fullscreen="process.fullscreen" :id="`window-${process.id}`" @mousedown="processManagerStore.focusApp(process.id)" @minimize="processManagerStore.minimizeApp(process.id)" @fullscreen="processManagerStore.toggleFullscreenApp(process.id)" @close="processManagerStore.closeApp(process.id)">
                    <component :is="process.component" v-bind="process.props"></component>
                </WindowShell>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.desktop-grid {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100dvh;
    width: 100dvw;
    background-image: url('/default_wallpaper.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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