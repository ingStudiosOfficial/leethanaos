import { availableCommands } from "@/configs/commands.config";
import { LuaEngine, LuaFactory } from "wasmoon";

let luaInstance: LuaEngine | null = null;

async function getLuaInstance(): Promise<LuaEngine> {
    if (!luaInstance) {
        const factory = new LuaFactory();
        luaInstance = await factory.createEngine();
    }

    return luaInstance;
}

export async function parseCommand(command: string, rawInput: string, ...params: unknown[][]): Promise<string> {
    const commandFound = availableCommands.find(c => c.name === command);
    if (commandFound) {
        const response = commandFound.function(...params);

        return response;   
    }

    luaInstance = await getLuaInstance();

    let outputBuffer = '';

    luaInstance.global.set('print', (...args: unknown[]) => {
        outputBuffer += args.map(arg => String(arg)).join('\t') + '\n';
    });

    try {
        const result = await luaInstance.doString(rawInput);

        if (outputBuffer) return outputBuffer.trim();
        if (result === undefined || result === null) return '';

        console.log(result);

        if (typeof result === 'object') {
            return JSON.stringify(result, null, 2); 
        }

        return String(result);
    } catch (error) {
        const errorMessage = String(error);

        if (errorMessage.includes('nil') || errorMessage.includes('not found')) {
            return 'Command not found';
        }

        return errorMessage;
    }
}

export async function getLuaVersion(): Promise<string> {
    luaInstance = await getLuaInstance();

    return await luaInstance.doString('return _VERSION');
}