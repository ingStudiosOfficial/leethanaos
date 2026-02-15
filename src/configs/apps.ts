import { defineAsyncComponent, markRaw, type Component } from "vue";

export interface AppConfig {
    id: string;
    name: string;
    icon: string;
    component: Component;
}

export const appRegistry: AppConfig[] = [
    {
        id: 'hello_world',
        name: 'Hello World',
        icon: '/icons/text_file.png',
        component: markRaw(defineAsyncComponent(() => import('../components/apps/HelloWorldApp.vue'))),
    }
];