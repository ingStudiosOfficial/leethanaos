import { availableCommands } from "@/configs/commands.config";

export function compgenCommand(options: unknown[]): string {
    const option = options[0];

    if (typeof option !== 'string') return 'Invalid option type.';

    switch (option) {
        case '-c':
            return availableCommands.map(c => c.name).join('\n');
        default:
            return 'Yeah sorry if we didn\'t include your Linux commands...';
    }
}