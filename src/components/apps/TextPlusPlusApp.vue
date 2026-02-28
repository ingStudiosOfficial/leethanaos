<script setup lang="ts">
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
import '@material/web/dialog/dialog.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { type FileSystemNode, useFileSystem } from '@/stores/file_system';
import DirectoryMenuItem from '../DirectoryMenuItem.vue';
import { ref, toRaw, useTemplateRef } from 'vue';

type ComponentProps = 
    | {
        hasExisting: true;
        name: string;
        path: string;
        content: string;
    }
    | {
        hasExisting: false;
        name?: string;
        path?: string;
        content?: string;
    };
    
interface MdMenu extends HTMLElement {
    open: boolean;
}

const props = defineProps<ComponentProps>();

const fileSystemStore = useFileSystem();

const fileToSave = ref<ComponentProps>(window.structuredClone(toRaw({ location: '/home', ...props })));
const fileSystemFromRoot = ref<FileSystemNode | null>(fileSystemStore.getNode('/'));
const dialogOpened = ref<boolean>(false);
const fileSystemMenu = useTemplateRef<MdMenu>('file-system-menu');

async function save() {
    if (!props.hasExisting) {
        saveAs();
        return;
    }

    try {
        await fileSystemStore.editFile(fileToSave.value.path || , props.name, props.content, false);
    } catch (error) {
        console.error('Error while editing file:', error);
    }
}

function saveAs() {
    dialogOpened.value = true;
}

function handleSelect(path: string) {
    console.log('Selected directory:', path);
    fileToSave.value.path = path;
    if (fileSystemMenu.value) fileSystemMenu.value.open = false;
}

function toggleMenu() {
    if (!fileSystemMenu.value) return;

    fileSystemMenu.value.open = !fileSystemMenu.value.open;
}

function onMenuClose() {
    if (!fileSystemMenu.value) return;

    fileSystemMenu.value.open = false;
}
</script>

<template>
    <div class="app-wrapper">
        <div class="actions-menu">
            <md-filled-button @click="save()">
                {{ hasExisting? 'Save' : 'Save as' }}
                <md-icon slot="icon">{{ hasExisting ? 'save' : 'save_as' }}</md-icon>
            </md-filled-button>
            <md-filled-tonal-button v-if="hasExisting" @click="saveAs()">
                Save as
                <md-icon slot="icon">save_as</md-icon>
            </md-filled-tonal-button>
        </div>
        <div class="textarea-wrapper">
             <textarea v-model="fileToSave.content" class="editable-area" autofocus="true"></textarea>
        </div>
    </div>
    <md-dialog :open="dialogOpened" @closed="dialogOpened = false">
        <div slot="headline">Save as</div>
        <div class="save-dialog-content" slot="content">
            <md-outlined-text-field v-model="fileToSave.name" label="Filename"></md-outlined-text-field>
            <md-filled-button id="file-location" @click="toggleMenu()">Location</md-filled-button>
            <md-filled-button id="file-location" @click="toggleMenu()" @click="save()">Save</md-filled-button>
            <md-menu class="file-system-menu" ref="file-system-menu" anchor="file-location" positioning="fixed" has-overflow @closed="onMenuClose()">
                <md-menu-item @click="handleSelect('/')">
                    <div slot="headline">/ (root)</div>
                    <md-icon slot="start">folder_special</md-icon>
                </md-menu-item>
                <DirectoryMenuItem :nodes="fileSystemFromRoot?.children" @select="handleSelect" />
            </md-menu>
        </div>
    </md-dialog>
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-family: 'Google Sans Code';
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

.editable-area {
    width: 100%;
    height: 100%;
    font-family: 'Google Sans Code';
    resize: none;
    border: none;
    background-color: transparent;
    outline: none;
    font-size: 1.2rem;
}

.textarea-wrapper {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.save-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    overflow: visible;
}
</style>