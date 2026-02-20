export function echoCommand(message: unknown[]): string {
    if (typeof message[0] !== 'string') return '';

    return message[0];
}