<script setup lang="ts">
import { computed } from 'vue';
import type { FileSystemNode } from '@/stores/file_system';
import '@material/web/menu/menu.js';
import '@material/web/menu/sub-menu.js';
import '@material/web/menu/menu-item.js';

const props = defineProps<{
    nodes?: Record<string, FileSystemNode>
}>();

const emit = defineEmits(['select']);

const directories = computed(() => {
    if (!props.nodes) return [];
    return Object.values(props.nodes).filter(n => n.type === 'directory');
});

function hasSubDirs(node: FileSystemNode) {
    if (!node.children) return false;
    return Object.values(node.children).some(c => c.type === 'directory');
}
</script>

<template>
    <template v-for="node in directories" :key="node.location">
        <md-sub-menu v-if="hasSubDirs(node)">
            <md-menu-item slot="item" @click="emit('select', node.location)">
                <div slot="headline">{{ node.name }}</div>
                <md-icon slot="start">folder</md-icon>
                <md-icon slot="end">arrow_right</md-icon>
            </md-menu-item>
            
            <md-menu slot="menu">
                <DirectoryMenuItem :nodes="node.children" @select="(path: string) => emit('select', path)" />
            </md-menu>
        </md-sub-menu>

        <md-menu-item v-else @click="emit('select', node.location)">
            <div slot="headline">{{ node.name }}</div>
            <md-icon slot="start">folder</md-icon>
        </md-menu-item>
    </template>
</template>