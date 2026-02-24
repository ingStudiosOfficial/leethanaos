import { availableCommands } from "@/configs/commands.config";
import { LuaEngine, LuaFactory } from "wasmoon";

interface TerminalProcess {
    send: (input: string) => void;
    stop: () => void;
}

type OnProcessStartHook = (process: TerminalProcess) => void;

let luaInstance: LuaEngine | null = null;

async function getLuaInstance(): Promise<LuaEngine> {
    if (!luaInstance) {
        const factory = new LuaFactory();
        luaInstance = await factory.createEngine();

        const lVersion = await getLuaVersion();

        const sysTable: Record<string, unknown> = {
            version: 'leethanaOS-1.0.0',
            luaVersion: lVersion,
        };

        availableCommands.forEach((cmd) => {
            sysTable[cmd.name] = (...args: unknown[]) => {
                return cmd.function(args); 
            };
        });
        
        luaInstance.global.set('sys', sysTable);
    }

    return luaInstance;
}

export async function parseCommand(command: string, rawInput: string, params: unknown[], hooks: { onOutput: (s: string) => void, onProcessStart: OnProcessStartHook, clearHistory: () => void, changeDirectory: (dir: string) => void | string, listDirectory: (params: string[]) => string } ): Promise<string> {
    switch (command) {
        case 'clear':
            hooks.clearHistory();
            return '';

        case 'cd':
            const error = hooks.changeDirectory(params[0] as string);
            return error ? error : '';

        case 'ls':
            const dir = hooks.listDirectory(params.map(String));
            return dir;
    }

    const commandFound = availableCommands.find(c => c.name === command);
    if (commandFound) {
        const response = commandFound.function(params);
        return response;   
    }

    luaInstance = await getLuaInstance();

    luaInstance.global.set('print', (...args: unknown[]) => {
        const output = args.map(String).join('\t');
        hooks.onOutput(output);
    });

    let resolveInput: ((value: string) => void) | null = null;

    luaInstance.global.set('readline', () => {
        return new Promise((resolve) => {
            resolveInput = resolve;
        });
    });

    hooks.onProcessStart({
        send: (text: string) => {
            if (!resolveInput) return;

            const res = resolveInput;
            resolveInput = null;
            res(text);
        },
        stop: () => {
            resolveInput = null;
        },
    });

    try {
        return await luaInstance.doString(rawInput);
    } catch (error) {
        const errorMessage = String(error);

        return errorMessage;
    }
}

export async function getLuaVersion(): Promise<string> {
    luaInstance = await getLuaInstance();

    return await luaInstance.doString('return _VERSION');
}