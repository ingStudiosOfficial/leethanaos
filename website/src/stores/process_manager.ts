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
    props?: Record<string, unknown>;
}

export const useProcessManager = defineStore('processManager', () => {
    const activeProcesses = ref<Process[]>([]);
    const focusTier = ref<Process[]>([]);
    const topZIndex = ref<number>(100);

    function openApp(appConfig: AppConfig, props?: Record<string, unknown>) {
        const existingProcess = activeProcesses.value.find(p => p.appId === appConfig.id);
        if (existingProcess) {
            existingProcess.minimized = false;
            if (props) existingProcess.props = props;
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
            props: props,
        };

        activeProcesses.value.push(newProcess);
        focusTier.value.push(newProcess);
    }

    function focusApp(id: string) {
        const processToFoucs = activeProcesses.value.find(p => p.id === id);
        if (!processToFoucs) return;

        const index = activeProcesses.value.indexOf(processToFoucs);
        focusTier.value.splice(index, 1);
        focusTier.value.push(processToFoucs);

        focusTier.value.forEach((p, i) => {
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
        focusTier.value = focusTier.value.filter(p => p.id !== id);
    }

    return { activeProcesses, openApp, focusApp, minimizeApp, toggleFullscreenApp, closeApp };
});