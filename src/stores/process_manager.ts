import type { AppConfig } from "@/configs/apps.config";
import { defineStore } from "pinia";
import { ref, markRaw, type Component } from "vue";

export interface Process {
    id: string;
    appId: string;
    name: string;
    component: Component;
    minimized: boolean;
    fullscreen: boolean;
    zIndex: number;
}

export const useProcessManager = defineStore('processManager', () => {
    const activeProcesses = ref<Process[]>([]);
    const topZIndex = ref<number>(100);

    function openApp(appConfig: AppConfig) {
        const existingProcess = activeProcesses.value.find(p => p.appId === appConfig.id);
        if (existingProcess) {
            existingProcess.minimized = false;
            focusApp(existingProcess.id);
            return;
        }

        const newProcess: Process = {
            id: `${appConfig.id}-${Date.now()}`,
            appId: appConfig.id,
            name: appConfig.name,
            component: markRaw(appConfig.component),
            minimized: false,
            fullscreen: false,
            zIndex: ++topZIndex.value,
        };

        activeProcesses.value.push(newProcess);
    }

    function focusApp(id: string) {
        const processToFoucs = activeProcesses.value.find(p => p.id === id);
        if (!processToFoucs) return;

        const index = activeProcesses.value.indexOf(processToFoucs);
        activeProcesses.value.splice(index, 1);
        activeProcesses.value.push(processToFoucs);

        activeProcesses.value.forEach((p, i) => {
            p.zIndex = 100 + i;
        });
    }

    function minimizeApp(id: string) {
        const processToMinimize = activeProcesses.value.find(p => p.id === id);
        if (processToMinimize) processToMinimize.minimized = true;
    }

    function toggleFullscreenApp(id: string) {
        const processToFullscreen = activeProcesses.value.find(p => p.id === id);
        if (processToFullscreen) processToFullscreen.fullscreen = !processToFullscreen.fullscreen;
    }

    function closeApp(id: string) {
        activeProcesses.value = activeProcesses.value.filter(p => p.id !== id);
    }

    return { activeProcesses, openApp, focusApp, minimizeApp, toggleFullscreenApp, closeApp };
});