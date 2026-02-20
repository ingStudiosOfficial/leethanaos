<script setup lang="ts">
import { ref } from 'vue';
import BootScreen from './components/BootScreen.vue';
import MainScreen from './components/MainScreen.vue';
import SleepScreen from './components/SleepScreen.vue';
import type { SleepMode } from './types/SleepMode';

type ScreenType = 'boot' | 'desktop' | 'sleep';

const currentScreen = ref<ScreenType>('boot');
const noBootAnimations = ref<boolean>(false);
const sleepMode = ref<SleepMode>('sleep');

function startDesktop() {
	currentScreen.value = 'desktop';
}

function lockDesktop() {
	noBootAnimations.value = true;
	currentScreen.value = 'boot';
}

function sleepDesktop(selectedSleepMode: SleepMode) {
	sleepMode.value = selectedSleepMode;
	currentScreen.value = 'sleep';
}

function rebootDesktop() {
	noBootAnimations.value = false;
	currentScreen.value = 'boot';
}

function onSleepWake() {
	noBootAnimations.value = true;
	currentScreen.value = 'boot';
}
</script>

<template>
	<main>
		<BootScreen v-if="currentScreen === 'boot'" :skip-animations="noBootAnimations" @start="startDesktop()"></BootScreen>
		<MainScreen v-if="currentScreen === 'desktop'" @lock="lockDesktop()" @sleep="sleepDesktop('sleep')" @shutdown="sleepDesktop('shutdown')" @reboot="sleepDesktop('reboot')"></MainScreen>
		<SleepScreen v-if="currentScreen === 'sleep'" :sleep-mode="sleepMode" @reboot-complete="rebootDesktop()" @sleep-wake="onSleepWake()"></SleepScreen>
	</main>
</template>

<style scoped>
.main {
	width: 100%;
	height: 100%;
}
</style>
