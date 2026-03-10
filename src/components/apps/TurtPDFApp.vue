<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed';
import 'vue-pdf-embed/dist/styles/annotationLayer.css';
import 'vue-pdf-embed/dist/styles/textLayer.css';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
import { useTemplateRef } from 'vue';

const hiddenUpload = useTemplateRef<HTMLInputElement>('hiddenUpload');

export type TurtPDFProps = {
    name?: string;
    location?: string;
    content?: string;
};

const props = defineProps<TurtPDFProps>();

function clickHiddenUpload() {
    hiddenUpload.value?.click();
}
</script>

<template>
    <div class="app-wrapper">
        <div class="actions-menu">
            <md-filled-tonal-button @click="clickHiddenUpload()">
                Upload
                <md-icon slot="icon">upload</md-icon>
            </md-filled-tonal-button>
            <input class="hidden-upload" ref="hiddenUpload" type="file" />
        </div>
        <VuePdfEmbed class="viewer" annotation-layer text-layer :source="props.content || '/sample_pdf.pdf'"></VuePdfEmbed>
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
    height: fit-content;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    flex-shrink: 0;
}

.viewer {
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
    flex-grow: 1;
    overflow-y: auto;
}

.hidden-upload {
    display: none;
}
</style>