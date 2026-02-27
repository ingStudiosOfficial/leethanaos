<script setup lang="ts">
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
import '@material/web/dialog/dialog.js';
import { useFileSystem } from '@/stores/file_system';

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

const props = defineProps<ComponentProps>();

const fileSystemStore = useFileSystem();

async function save() {
    if (!props.hasExisting) {
        saveAs();
        return;
    }

    try {
        await fileSystemStore.editFile(props.path, props.name, props.content, false);
    } catch (error) {
        console.error('Error while editing file:', error);
    }
}

function saveAs() {

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
             <textarea class="editable-area" autofocus="true"></textarea>
        </div>
    </div>
    <md-dialog>
        <div slot="headline">Save as</div>
        <div slot="content">
            
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
</style>