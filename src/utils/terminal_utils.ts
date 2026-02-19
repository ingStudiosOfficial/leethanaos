import { availableCommands } from "@/configs/commands.config";

export function parseCommand(command: string, ...params: unknown[][]): string {
    const commandFound = availableCommands.find(c => c.name === command);
    if (!commandFound) return 'Unknown command';

    const response = commandFound.function(...params);

    return response;
}