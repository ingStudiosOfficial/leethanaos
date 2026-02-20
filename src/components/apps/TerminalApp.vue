<script setup lang="ts">
import { getLuaVersion, parseCommand } from '@/utils/terminal_utils';
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
const luaVersion = ref<string>('');

let currentCommandIndex = history.length;

function focusInput() {
    inputRef.value?.focus();
}

async function onCommandSend(event: KeyboardEvent) {
    if (event.key === 'Enter' && inputFocused) {
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const commandTextValue = commandText.value;
        const matches = [];
        let match;

        while ((match = regex.exec(commandTextValue)) !== null) {
            matches.push(match[1] || match[2] || match[0]);
        }

        const command = matches[0];
        const params = matches.slice(1);

        if (!command) {
            currentOutput.value = 'No command found';
            return;
        }

        const response = await parseCommand(command, commandTextValue, params);

        history.push({ 
            command: commandText.value, 
            output: response, 
            directory: currentDir.value, 
            key: window.crypto.randomUUID() 
        });
        
        commandText.value = '';
        currentOutput.value = '';
    }
}

function onArrowKey(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
        currentCommandIndex = (currentCommandIndex - 1 + history.length) % history.length;
    } else if (event.key === 'ArrowDown') {
        currentCommandIndex = (currentCommandIndex + 1) % history.length;
    }

    console.log(currentCommandIndex);
    console.log(history.length);

    const commandSelected = history.map(h => h.command)[currentCommandIndex];
    if (!commandSelected) {
        commandText.value = '';
        return;
    }

    commandText.value = commandSelected;
}

onMounted(async () => {
    focusInput();
    currentCommandIndex = history.length;
    luaVersion.value = await getLuaVersion();
});
</script>

<template>
    <div class="app-wrapper" @click="focusInput">
        <p>leethanaOS [Version 1.0.0, {{ luaVersion }}]</p>
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
            <p class="output">{{ item.output }}</p>
        </div>
        <div class="command-row">
            <div class="command-line">
                <span class="prompt">
                    <span class="user-text">leethana@web</span>: <span class="current-dir">{{ currentDir }}</span> >
                </span>
                <div class="input-area">
                    <span class="display-text">{{ commandText }}</span>
                    <span v-show="inputFocused" class="cursor"></span>
                    
                    <input ref="inputRef" v-model="commandText" class="hidden-input" autofocus spellcheck="false" autocomplete="off" @focus="inputFocused = true" @blur="inputFocused = false" @keydown.enter="onCommandSend" @keydown.up.prevent="onArrowKey" @keydown.down.prevent="onArrowKey" />
                </div>
            </div>
            <p class="output">{{ currentOutput }}</p>
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
    min-height: 100%;
    font-size: 1rem;
    position: relative;
}

.command-line {
    display: block; 
    word-break: break-all;
    line-height: 1.5;
}

.input-area {
    position: relative;
    display: inline;
    word-break: break-all;
}

.display-text {
    white-space: pre-wrap; 
    word-break: break-all;
    color: #ffffff;
}

.hidden-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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

.output {
    white-space: pre-line;
}
</style>