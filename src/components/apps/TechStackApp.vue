<script setup lang="ts">
import { ref } from 'vue';
import techStack from '../../data/tech_stack.json' with { type: 'json' };

const currentTechStack = ref<object>(techStack);
</script>

<template>
    <div class="app-wrapper">
        <h2 class="header">Tech Stack</h2>
        
        <div v-for="(items, category) in currentTechStack" :key="category">
            <h3 class="header">{{ category }}</h3>
            <ul>
                <li v-for="item in items" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100%;
}

.header {
    color: var(--md-sys-color-primary);
}

.highlight {
    color: var(--md-sys-color-secondary);
}
</style>