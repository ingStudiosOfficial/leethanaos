<script setup lang="ts">
import { ref } from 'vue';
import BootScreen from './components/BootScreen.vue';
import MainScreen from './components/MainScreen.vue';

type ScreenType = 'boot' | 'desktop';

const currentScreen = ref<ScreenType>('boot');

function startDesktop() {
	currentScreen.value = 'desktop';
}
</script>

<template>
	<main>
		<BootScreen v-if="currentScreen === 'boot'" @start="startDesktop()"></BootScreen>
		<MainScreen v-if="currentScreen === 'desktop'"></MainScreen>
	</main>
</template>

<style scoped>
.main {
	width: 100%;
	height: 100%;
}
</style>
