<script setup lang="ts">
import { parseCommand } from '@/utils/terminal_utils';
import { onMounted, reactive, ref } from 'vue';

interface TerminalHistory {
    command: string;
    output: string;
    directory: string;
    key: string;
}

const currentDir = ref<string>('~');
const commandText = ref<string>('');
const inputRef = ref<HTMLInputElement | null>(null);
const inputFocused = ref<boolean>(true);
const currentOutput = ref<string>('');
const history = reactive<TerminalHistory[]>([]);

function focusInput() {
    inputRef.value?.focus();
}

function onCommandSend(event: KeyboardEvent) {
    if (event.key === 'Enter' && inputFocused) {
        const commandSplit = commandText.value.split(' ');
        const command = commandSplit.slice(0, 1)[0];
        const params = commandSplit.slice(1);

        if (!command) {
            currentOutput.value = 'No command found';
            return;
        }

        const response = parseCommand(command, params);

        history.push({ command: commandText.value, output: response, directory: currentDir.value, key: window.crypto.randomUUID() });
        commandText.value = '';
        currentOutput.value = '';
    }
}

onMounted(() => {
    focusInput();
    document.addEventListener('keydown', onCommandSend);
});
</script>

<template>
    <div class="app-wrapper" @click="focusInput">
        <p>leethanaOS [Version 1.0.0]</p>
        <p>© 2026 (ing) Studios</p>
        <div v-for="item in history" :key="item.key" class="history">
            <div class="command-line">
                <span class="prompt">
                    <span class="user-text">leethana@web</span>: <span class="current-dir">{{ currentDir }}</span> >
                </span>
                <div class="input-area">
                    <span class="display-text">{{ item.command }}</span>
                </div>
            </div>
            <p>{{ item.output }}</p>
        </div>
        <div class="command-row">
            <div class="command-line">
                <span class="prompt">
                    <span class="user-text">leethana@web</span>: <span class="current-dir">{{ currentDir }}</span> >
                </span>
                <div class="input-area">
                    <span class="display-text">{{ commandText }}</span>
                    <span v-show="inputFocused" class="cursor"></span>
                    
                    <input ref="inputRef" v-model="commandText" class="hidden-input" autofocus spellcheck="false" autocomplete="off" @focus="inputFocused = true" @blur="inputFocused = false" />
                </div>
            </div>
            <p>{{ currentOutput }}</p>
        </div>
    </div>
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    padding: 20px;
    font-family: 'Google Sans Code';
    background-color: #000000;
    color: #ffffff;
    width: 100%;
    height: 100%;
    font-size: 1rem;
}

.command-line {
    /* Allows the prompt and input-area to sit side-by-side until they need to wrap */
    display: block; 
    word-break: break-all;
    line-height: 1.5;
}

.input-area {
    position: relative;
    display: inline; /* Changed from inline-flex */
    word-break: break-all;
}

.display-text {
    /* pre-wrap is essential: it preserves spaces but allows line breaks */
    white-space: pre-wrap; 
    word-break: break-all;
    color: #ffffff;
}

.hidden-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; /* Now covers the full wrapped area */
    opacity: 0;
    cursor: text;
    border: none;
    outline: none;
    z-index: 2;
    padding: 0;
    margin: 0;
}

.cursor {
    display: inline-block;
    width: 8px;
    height: 1rem;
    background-color: #ffffff;
    /* Vertical-align ensures it sits on the text baseline while wrapping */
    vertical-align: middle;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    from, to { background-color: transparent; }
    50% { background-color: #ffffff; }
}

.user-text {
    color: var(--md-sys-color-secondary);
}

.current-dir {
    color: var(--md-sys-color-primary);
}
</style>