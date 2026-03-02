import { compgenCommand } from "@/commands/compgen.command";
import { echoCommand } from "@/commands/echo.command";
import { helpCommand } from "@/commands/help.command";
import { openUrlCommand } from "@/commands/open_url.command";
import { testCommand } from "@/commands/test.command";

export interface Command {
    name: string;
    function: (params: unknown[]) => string;
}

export const availableCommands: Command[] = [
    {
        name: 'test',
        function: testCommand,
    },
    {
        name: 'openurl',
        function: openUrlCommand,
    },
    {
        name: 'compgen',
        function: compgenCommand,
    },
    {
        name: 'echo',
        function: echoCommand,
    },
    {
        name: 'help',
        function: helpCommand,
    }
];