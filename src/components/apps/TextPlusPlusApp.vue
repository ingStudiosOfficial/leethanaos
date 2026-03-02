<script setup lang="ts">
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
import '@material/web/dialog/dialog.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/button/outlined-button.js';
import { type FileSystemNode, useFileSystem } from '@/stores/file_system';
import DirectoryMenuItem from '../DirectoryMenuItem.vue';
import { ref, toRaw, useTemplateRef } from 'vue';
import { MdDialog } from '@material/web/dialog/dialog.js';
import type { MdMenu } from '@material/web/menu/menu.js';

export type TextPPProps = 
    | {
        hasExisting?: true;
        name: string;
        path: string;
        content: string;
    }
    | {
        hasExisting?: false;
        name?: string;
        path?: string;
        content?: string;
    };

const props = defineProps<TextPPProps>();

const fileSystemStore = useFileSystem();

const fileToSave = ref<TextPPProps>(window.structuredClone(toRaw(props)));
const fileSystemFromRoot = ref<FileSystemNode | null>(fileSystemStore.getNode('/'));
const dialogOpened = ref<boolean>(false);
const fileSystemMenu = useTemplateRef<MdMenu>('fileSystemMenu');
const fileDialog = useTemplateRef<MdDialog>('saveDialog');
const saveError = ref<string>('');

async function save() {
    if (!fileToSave.value.hasExisting) {
        saveAs();
        return;
    }

    console.log(fileToSave);

    try {
        await fileSystemStore.editFile(fileToSave.value.path || '/home', fileToSave.value.name, fileToSave.value.content || '', true);
    } catch (error) {
        console.error('Error while editing file:', error);
        saveError.value = error as string;
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

async function closeDialog() {
    await fileDialog.value?.close();
    dialogOpened.value = false;
}

async function triggerSaveFromDialog() {
    if (!fileToSave.value.name || !fileToSave.value.path) {
        saveError.value = 'Filename or path is missing.';
        return;
    }

    fileToSave.value.hasExisting = true;

    try {
        await fileSystemStore.editFile(fileToSave.value.path || '/home', fileToSave.value.name, fileToSave.value.content || '', true);
        closeDialog();
    } catch (error) {
        console.error('Error while editing file:', error);
        saveError.value = error as string;
    }
}
</script>

<template>
    <div class="app-wrapper">
        <div class="actions-menu">
            <md-filled-button @click="save()">
                {{ fileToSave.hasExisting? 'Save' : 'Save as' }}
                <md-icon slot="icon">{{ fileToSave.hasExisting ? 'save' : 'save_as' }}</md-icon>
            </md-filled-button>
            <md-filled-tonal-button v-if="fileToSave.hasExisting" @click="saveAs()">
                Save as
                <md-icon slot="icon">save_as</md-icon>
            </md-filled-tonal-button>
        </div>
        <div class="textarea-wrapper">
             <textarea v-model="fileToSave.content" class="editable-area" autofocus="true"></textarea>
        </div>
    </div>
    <md-dialog :open="dialogOpened" ref="saveDialog" @closed="dialogOpened = false">
        <div slot="headline">Save as</div>
        <div class="save-dialog-content" slot="content">
            <md-outlined-text-field v-model="fileToSave.name" label="Filename"></md-outlined-text-field>
            <div class="location-container">
                <md-outlined-button id="file-location" @click="toggleMenu()">Location</md-outlined-button>
                <p>{{ fileToSave.path }}</p>
            </div>
            <md-filled-button id="file-location" @click="triggerSaveFromDialog()">Save</md-filled-button>
            <p v-if="saveError" class="save-error">{{ saveError }}</p>
            <md-menu class="file-system-menu" ref="fileSystemMenu" anchor="file-location" positioning="fixed" has-overflow @closed="onMenuClose()">
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

.location-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.save-error {
    color: var(--md-sys-color-error);
}
</style>