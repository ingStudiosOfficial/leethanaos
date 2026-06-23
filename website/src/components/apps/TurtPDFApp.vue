<script setup lang="ts">
import VuePdfEmbed, { useVuePdfEmbed } from 'vue-pdf-embed';
import 'vue-pdf-embed/dist/styles/annotationLayer.css';
import 'vue-pdf-embed/dist/styles/textLayer.css';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/icon/icon.js';
import { onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue';

const hiddenUpload = useTemplateRef<HTMLInputElement>('hiddenUpload');

export type TurtPDFProps = {
    name?: string;
    location?: string;
    content?: string | Uint8Array;
};

const props = defineProps<TurtPDFProps>();

const pdfFile = ref<string | Uint8Array>(props.content || '/sample_pdf.pdf');
const turtPDFApp = useTemplateRef<HTMLElement>('turtPDFApp');
const appDimensions = reactive<{ w: number, h: number }>({ w: turtPDFApp.value?.offsetWidth || 0, h: turtPDFApp.value?.offsetHeight || 0 });

let resizeObserver: ResizeObserver | null = null;
const { doc } = useVuePdfEmbed({ source: pdfFile });

function clickHiddenUpload() {
    hiddenUpload.value?.click();
}

async function onFileUpload(event: Event) {
    const target = (event.target as HTMLInputElement);

    if (!target.files || target.files.length === 0) {
        return;
    }

    const uploadedFile = target.files[0];

    if (!uploadedFile) return;

    try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        pdfFile.value = new Uint8Array(arrayBuffer);
    } catch (error) {
        console.error('Error while reading PDF:', error);
    }
}

onMounted(() => {
    if (turtPDFApp.value) {
        resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                appDimensions.w = entry.contentRect.width;
                appDimensions.h = entry.contentRect.height;
            }
        });

        resizeObserver.observe(turtPDFApp.value);
    }
});

onUnmounted(() => {
    resizeObserver?.disconnect();
});
</script>

<template>
    <div class="app-wrapper" ref="turtPDFApp">
        <div class="actions-menu">
            <md-filled-tonal-button @click="clickHiddenUpload()">
                Upload
                <md-icon slot="icon">upload</md-icon>
            </md-filled-tonal-button>
            <input class="hidden-upload" ref="hiddenUpload" type="file" accept=".pdf" @change="onFileUpload" />
        </div>
        <VuePdfEmbed class="viewer" annotation-layer text-layer :source="doc" :width="appDimensions.w"></VuePdfEmbed>
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