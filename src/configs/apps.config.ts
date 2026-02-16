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
        name: '.hello_world',
        icon: '/icons/hello_world_icon.png',
        component: markRaw(defineAsyncComponent(() => import('../components/apps/HelloWorldApp.vue'))),
    },
    {
        id: 'about_me',
        name: 'About Me',
        icon: '/icons/about_me_icon.png',
        component: markRaw(defineAsyncComponent(() => import('../components/apps/AboutMeApp.vue'))),
    },
];