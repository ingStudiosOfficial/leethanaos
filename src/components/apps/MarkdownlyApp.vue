<script setup lang="ts">
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';
import { appRegistry } from '@/configs/apps.config';
import { useProcessManager } from '@/stores/process_manager';
import type { TextPPProps } from './TextPlusPlusApp.vue';

export type MarkdownlyProps = {
    name?: string;
    location?: string;
    content?: string;
}

const props = defineProps<MarkdownlyProps>();

const processManagerStore = useProcessManager();

const initialMarkdown = `
# Welcome to Markdownly!
Open a Markdown file in the terminal by entering \`\`\`md [filename]\`\`\`.
`;

function openFileInTPP() {
    const tppAppConfig = appRegistry.find(a => a.id === 'text_plus_plus');
    if (!tppAppConfig || !props.location) return;

    processManagerStore.openApp(tppAppConfig, {
        hasExisting: props.location !== undefined,
        name: props.name,
        path: props.location.split('/').slice(0, -1).join('/'),
        content: props.content,
    } as TextPPProps);
}

function createFileInTPP() {
    const tppAppConfig = appRegistry.find(a => a.id === 'text_plus_plus');
    if (!tppAppConfig) return;

    processManagerStore.openApp(tppAppConfig, {
        hasExisting: false,
    } as TextPPProps);
}
</script>

<template>
    <div class="app-wrapper">
        <div class="actions-menu">
            <md-outlined-button v-if="props.location !== undefined" @click="openFileInTPP()">
                Edit
                <md-icon slot="icon">edit</md-icon>
            </md-outlined-button>
            <md-outlined-button v-else @click="createFileInTPP()">
                Create
                <md-icon slot="icon">add</md-icon>
            </md-outlined-button>
        </div>
        <MarkdownPreview class="md-preview">
            {{ props.content || initialMarkdown }}
        </MarkdownPreview>
    </div>
    
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.actions-menu {
    padding: 10px 20px;
    background-color: var(--md-sys-color-surface-container);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.md-preview {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: transparent;
}
</style>