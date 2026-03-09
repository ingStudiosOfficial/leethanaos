<script setup lang="ts">
import MarkdownPreview from '@uivjs/vue-markdown-preview';
import '@uivjs/vue-markdown-preview/markdown.css';

export type MarkdownlyProps = {
    content?: string;
}

const props = defineProps<MarkdownlyProps>();
</script>

<template>
    <div class="app-wrapper">
        <MarkdownPreview class="md-preview">
            {{ props.content || '# Your Markdown Content' }}
        </MarkdownPreview>
    </div>
    
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.md-preview {
    width: 100%;
    height: 100%;
    background-color: transparent;
}
</style>