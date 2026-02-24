<script setup lang="ts">
import { useFileSystem } from '@/stores/file_system';
import { getLuaVersion, parseCommand } from '@/utils/terminal_utils';
import { onMounted, reactive, ref } from 'vue';

interface TerminalHistory {
    command: string;
    output: string;
    directory: string;
    key: string;
}

const fileSystemStore = useFileSystem();

const currentDir = ref<string>('~');
const commandText = ref<string>('');
const inputRef = ref<HTMLInputElement | null>(null);
const inputFocused = ref<boolean>(true);
const currentOutput = ref<string>('');
const history = reactive<TerminalHistory[]>([]);
const luaVersion = ref<string>('');
const activeProcess = ref<{
    send: (input: string) => void;
    stop: () => void;
} | null>(null);

let currentCommandIndex = history.length;

function focusInput() {
    inputRef.value?.focus();
}

async function onCommandSend(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey && inputFocused) {
        event.preventDefault();
        
        const input = commandText.value;
        if (!input && !activeProcess.value) return;

        const historyKey = window.crypto.randomUUID();

        if (activeProcess.value) {
            const lastHistory = history[history.length - 1];
            const item = history.find(h => h.key === historyKey);
            if (lastHistory) {
                lastHistory.output += `${(item?.output ? '\n' : '')}${input}`;
            }
            activeProcess.value.send(input);
            commandText.value = '';
            return;
        }

        history.push({ 
            command: input, 
            output: '', 
            directory: currentDir.value, 
            key: historyKey 
        });

        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const matches = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            matches.push(match[1] || match[2] || match[0]);
        }

        const command = matches[0];
        const params = matches.slice(1);

        if (!command) {
            history[history.length - 1]!.output = 'Command not found';
            commandText.value = '';
            return;
        }

        commandText.value = '';

        try {
            const finalResult = await parseCommand(command, input, params, {
                onOutput: (text) => {
                    const item = history.find(h => h.key === historyKey);
                    if (item) {
                        item.output += (item.output ? '\n' : '') + text;
                    }
                },
                onProcessStart: (proc) => {
                    activeProcess.value = proc;
                },
                clearHistory: () => {
                    history.length = 0;
                },
                changeDirectory: (dir) => {
                    let dirToChange = currentDir.value;

                    switch (dir) {
                        case '.': {
                            dirToChange = currentDir.value;
                            break;
                        }

                        case '..': {
                            const filePathArray = currentDir.value.split('/');
                            dirToChange = filePathArray[filePathArray.length - 2] || '/';
                            break;
                        }

                        default: {
                            const filePathArray = currentDir.value.split('/');
                            filePathArray.push(dir);
                            dirToChange = filePathArray.join('/');
                            break;
                        }
                    }

                    if (!fileSystemStore.getNode(dirToChange)) {
                        return 'No such file or directory'
                    }

                    currentDir.value = dirToChange.replaceAll('//', '/');
                },
                listDirectory: (params) => {
                    return fileSystemStore.listDirectory(currentDir.value, params);
                },
            });

            if (finalResult) {
                const item = history.find(h => h.key === historyKey);
                if (item && !item.output.includes(finalResult)) {
                    item.output += (item.output ? '\n' : '') + finalResult;
                }
            }
        } catch (err) {
            const item = history.find(h => h.key === historyKey);
            if (item) item.output += `Error: ${err}`;
        } finally {
            activeProcess.value = null;
        }
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
                    <span class="user-text">leethana@web</span>: <span class="current-dir">{{ item.directory === '/home' ? '~' : item.directory }}</span> >
                </span>
                <span class="display-text">{{ item.command }}</span>
            </div>
            <p class="output">{{ item.output }}</p>
        </div>

        <div class="command-row">
            <div class="command-line">
                <span v-if="!activeProcess" class="prompt">
                    <span class="user-text">leethana@web</span>: <span class="current-dir">{{ currentDir === '/home' ? '~' : currentDir }}</span> >
                </span>
                <span class="display-text">{{ commandText }}<span v-show="inputFocused" class="cursor"></span></span>
            </div>
            <p class="output">{{ currentOutput }}</p>
        </div>

        <textarea ref="inputRef" v-model="commandText" class="hidden-terminal-input" autofocus spellcheck="false" autocomplete="off" @focus="inputFocused = true" @blur="inputFocused = false" @keydown.enter="onCommandSend" @keydown.up.prevent="onArrowKey" @keydown.down.prevent="onArrowKey" />
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
    white-space: normal;
}

.display-text {
    white-space: pre-wrap; 
    word-break: break-all;
    color: #ffffff;
    display: inline; 
}

.hidden-terminal-input {
    position: fixed;
    top: -100px;
    left: 0;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
}

.cursor {
    display: inline-block;
    width: 8px;
    height: 1.2rem;
    background-color: #ffffff;
    margin-left: 2px;
    vertical-align: text-bottom;
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