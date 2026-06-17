import { availableCommands } from '@/configs/commands.config';
import type { useFileSystem } from '@/stores/file_system';
import { LuaEngine, LuaFactory } from 'wasmoon';

interface TerminalProcess {
	send: (input: string) => void;
	stop: () => void;
}

type OnProcessStartHook = (process: TerminalProcess) => void;

interface Hooks {
	onOutput: (s: string) => void;
	onProcessStart: OnProcessStartHook;
	clearHistory: () => void;
	changeDirectory: (dir: string) => void | string;
	listDirectory: (params: string[]) => string;
	makeDirectory: (params: string[]) => Promise<void | string>;
	removeDirectory: (params: string[]) => Promise<void | string>;
	createFile: (params: string[]) => Promise<void | string>;
	rmNode: (params: string[]) => Promise<void | string>;
	openTPP: (params: string[]) => void | string;
	getFileContent: (params: string[]) => string | null;
	openMd: (params: string[]) => void | string;
	getFileSystemStore: () => ReturnType<typeof useFileSystem>;
	getCurrentDir: () => string;
}

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

export async function parseCommand(
	command: string,
	rawInput: string,
	params: unknown[],
	hooks: Hooks,
): Promise<string> {
	let evaluateLuaFromFile = false;

	switch (command) {
		case 'clear': {
			hooks.clearHistory();
			return '';
		}

		case 'cd': {
			const error = hooks.changeDirectory(params[0] as string);
			return error ? error : '';
		}

		case 'ls': {
			const dir = hooks.listDirectory(params.map(String));
			return dir;
		}

		case 'mkdir': {
			const error = await hooks.makeDirectory(params.map(String));
			return error || '';
		}

		case 'rmdir': {
			const error = await hooks.removeDirectory(params.map(String));
			return error || '';
		}

		case 'touch': {
			const error = await hooks.createFile(params.map(String));
			return error || '';
		}

		case 'rm': {
			const error = await hooks.rmNode(params.map(String));
			return error || '';
		}

		case 'tpp': {
			const error = hooks.openTPP(params.map(String));
			return error || '';
		}

		case 'lua': {
			evaluateLuaFromFile = true;
			break;
		}

		case 'md': {
			const error = hooks.openMd(params.map(String));
			return error || '';
		}

		case 'cp': {
			const sourceFileName = params.map(String)[0];
			const destinationFileName = params.map(String)[1];

			if (!sourceFileName || !destinationFileName) {
				return 'cp: you must include a source or destination file to copy';
			}

			const currentDir = hooks.getCurrentDir();

			const fileSystemStore = hooks.getFileSystemStore();

			const parentNode = fileSystemStore.getNode(currentDir);
			if (!parentNode) throw new Error('cp: target does not exist');
			if (parentNode.type !== 'directory') throw new Error('cp: target is not a directory');

			const sourceFile = fileSystemStore.getNode(
				`${currentDir}/${sourceFileName}`.replace(/\/+/g, '/'),
			);

			if (!parentNode.children) parentNode.children = {};
			if (parentNode.children[destinationFileName])
				throw new Error(`cp: file '${destinationFileName}' exists`);

			const destinationFile = fileSystemStore.createFile(
				destinationFileName,
				currentDir,
				'root',
				sourceFile?.size,
				sourceFile?.content,
				sourceFile?.metadata.permissions,
			);

			parentNode.children[destinationFileName] = destinationFile;

			parentNode.metadata.modifiedAt = Date.now();
			await fileSystemStore.persist();

			return '';
		}

		case 'cat': {
			return hooks.getFileContent(params.map(String)) || '';
		}
	}

	const commandFound = availableCommands.find((c) => c.name === command);
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

	if (evaluateLuaFromFile) {
		const fileToEvaluate = hooks.getFileContent(params.map(String));
		if (!fileToEvaluate) return 'File not found';

		return await luaInstance.doString(fileToEvaluate);
	}

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
