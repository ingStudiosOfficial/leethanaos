import { getDb } from "@/db";
import { defineStore } from "pinia";
import { reactive, ref, toRaw } from "vue";

export type EntryType = 'file' | 'directory' | 'link';

export interface FileSystemNode {
    name: string;
    type: EntryType;
    size: number;
    location: string;
    content?: string;
    children?: Record<string, FileSystemNode>;
    metadata: {
        permissions: string;
        owner: string;
        createdAt: number;
        modifiedAt: number;
        thumbnail?: string;
    };
}

const storageKey = import.meta.env.VITE_FS_STORAGE_KEY;

export const useFileSystem = defineStore('fileSystem', () => {
    const drive = reactive<Record<string, FileSystemNode>>({});
    const initialized = ref<boolean>(false);

    async function persist() {
        const db = await getDb();
        await db.put('drive', window.structuredClone(toRaw(drive['/'])), 'root');
    }

    async function init() {
        if (initialized.value) return;

        const db = await getDb();
        const savedDrive = await db.get('drive', 'root');

        if (savedDrive) {
            drive['/'] = savedDrive;
        } else {
            drive['/'] = {
                name: '/',
                type: 'directory',
                size: 0,
                location: '/',
                metadata: {
                    permissions: 'all',
                    owner: 'root',
                    createdAt: Date.now(),
                    modifiedAt: Date.now(),
                },
                children: {
                    'bin':   createDir('bin', '/bin'),
                    'boot':  createDir('boot', '/boot'),
                    'dev':   createDir('dev', '/dev'),
                    'etc':   createDir('etc', '/etc'),
                    'home':  createDir('home', '/home'),
                    'lib':   createDir('lib', '/lib'),
                    'media': createDir('media', '/media'),
                    'mnt':   createDir('mnt', '/mnt'),
                    'opt':   createDir('opt', '/opt'),
                    'proc':  createDir('proc', '/proc'),
                    'root':  createDir('root', '/root'),
                    'run':   createDir('run', '/run'),
                    'sbin':  createDir('sbin', '/sbin'),
                    'srv':   createDir('srv', '/srv'),
                    'tmp':   createDir('tmp', '/tmp'), 
                    'usr':   createDir('usr', '/usr'),
                    'var':   createDir('var', '/var'),
                },
            }

            await persist();
        }

        initialized.value = true;
    }

    function getFileSize(content: string): number {
        const size = new Blob([content]).size;
        return size;
    }

    function createDir(name: string, path: string, owner = 'root', size: number = 0, children: Record<string, FileSystemNode> = {}, permissions: string = '755'): FileSystemNode {
        const node: FileSystemNode = {
            name,
            type: 'directory',
            size: size,
            location: path,
            children: children,
            metadata: {
                permissions: permissions,
                owner,
                createdAt: Date.now(),
                modifiedAt: Date.now(),
            },
        };

        return node;
    }

    function createFile(name: string, path: string, owner = 'root', size: number = 0, content: string = '', permissions: string = '755'): FileSystemNode {
        const node: FileSystemNode = {
            name,
            type: 'file',
            size: size,
            location: path,
            content: content,
            metadata: {
                permissions: permissions,
                owner,
                createdAt: Date.now(),
                modifiedAt: Date.now(),
            },
        };

        return node;
    }

    async function makeDir(parentPath: string, names: string[]) {
        const parentNode = getNode(parentPath);
        if (!parentNode) throw new Error('Target does not exist');
        if (parentNode.type !== 'directory') throw new Error('Target is not a directory');

        if (!parentNode.children) parentNode.children = {};

        const errors: string[] = [];
        let changed = false;

        for (const name of names) {
            try {
                if (parentNode.children[name]) throw new Error('File exists');

                const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
                parentNode.children[name] = createDir(name, newPath, 'leethana');

                changed = true;
            } catch (error) {
                if (error instanceof Error) errors.push(`mkdir: ${error.message}`);
                else if (typeof error === 'string') errors.push(`mkdir: ${error}`);
            }
        }

        if (changed) {
            parentNode.metadata.modifiedAt = Date.now();
            await persist();
        }

        if (errors.length !== 0) throw new Error(errors.join('\n'));
    }

    async function removeDir(parentPath: string, names: string[]) {
        const parentNode = getNode(parentPath);
        if (!parentNode) throw new Error('Target does not exist');
        if (parentNode.type !== 'directory') throw new Error('Target is not a directory');

        const errors: string[] = [];
        let changed = false;

        for (const name of names) {
            try {
                if (!parentNode.children || !parentNode.children[name]) throw new Error('No such file or directory');
                if (parentNode.children[name].type !== 'directory') throw new Error('Not a directory');
                if (parentNode.children?.[name].children && Object.keys(parentNode.children?.[name].children).length > 0) throw new Error('Directory not empty');

                delete parentNode.children[name];

                changed = true;
            } catch (error) {
                if (error instanceof Error) errors.push(`rmdir: ${error.message}`);
                else if (typeof error === 'string') errors.push(`rmdir: ${error}`);
            }
        }

        if (changed) {
            parentNode.metadata.modifiedAt = Date.now();
            await persist();
        }

        if (errors.length !== 0) throw new Error(errors.join('\n'));
    }

    async function makeFile(parentPath: string, names: string[]) {
        const parentNode = getNode(parentPath);
        if (!parentNode) throw new Error('Target does not exist');
        if (parentNode.type !== 'directory') throw new Error('Target is not a directory');

        const errors: string[] = [];
        let changed = false;

        for (const name of names) {
            try {
                if (!parentNode.children) parentNode.children = {};
                if (parentNode.children[name]) throw new Error(`'${name}': File exists`);

                const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
                parentNode.children[name] = createFile(name, newPath, 'leethana');

                changed = true;
            } catch (error) {
                if (error instanceof Error) errors.push(`touch: ${error.message}`);
                else if (typeof error === 'string') errors.push(`touch: ${error}`);
            }
        }

        if (changed) {
            parentNode.metadata.modifiedAt = Date.now();
            await persist();
        }

        if (errors.length !== 0) throw new Error(errors.join('\n'));
    }

    function getNode(path: string): FileSystemNode | null {
        if (!initialized.value) return null;

        const segments = path.split('/').filter(s => s !== '');

        let currentNode: FileSystemNode | undefined = drive['/'];

        if (!currentNode) return null;

        for (const segment of segments) {
            if (currentNode.children && currentNode.children[segment]) {
                currentNode = currentNode.children[segment];
            } else {
                return null;
            }
        }

        return currentNode;
    }

    async function removeNode(parentPath: string, names: string[]) {
        const parentNode = getNode(parentPath);
        if (!parentNode) throw new Error('Target does not exist');
        if (parentNode.type !== 'directory') throw new Error('Target is not a directory');

        const optionsRegex = /-(.*?)\s/;
        const optionsRegexArray = names.join(' ').match(optionsRegex);
        const options: string[] = [];
        if (optionsRegexArray && optionsRegexArray[1]) {
            const optionsArray = optionsRegexArray[1].split('');
            for (const option of optionsArray) options.push(option);
            names.splice(0, 1);
        }

        const errors: string[] = [];
        let changed = false;

        for (const name of names) {
            try {
                if (!parentNode.children || !parentNode.children[name]) throw new Error('No such file or directory');
                if (parentNode.children?.[name].children && Object.keys(parentNode.children?.[name].children).length > 0 && !options.includes('r')) throw new Error('Directory not empty');

                delete parentNode.children[name];

                changed = true;
            } catch (error) {
                if (error instanceof Error) errors.push(`rm: ${error.message}`);
                else if (typeof error === 'string') errors.push(`rm: ${error}`);
            }
        }

        if (changed) {
            parentNode.metadata.modifiedAt = Date.now();
            await persist();
        }

        if (errors.length !== 0) throw new Error(errors.join('\n'));
    }

    async function editFile(filePath: string, fileName: string, content: string, allowCreateFile: boolean) {
        const filePathArray = filePath.split('/');
        const parentPath = `/${filePathArray.slice(0, filePathArray.length - 2).join('/')}`.replace(/\/+/g, '/');
        const parentNode = getNode(parentPath);

        if (!parentNode) throw new Error('Parent does not exist');

        if (allowCreateFile) {
            const file = createFile(fileName, filePath, 'leethana', getFileSize(content), content);
            if (!parentNode.children) parentNode.children = {};
            parentNode.children[fileName] = file;
            return;
        }

        const file = getNode(filePath);

        if (!file) throw new Error('Target does not exist');
        if (file.type !== 'file') throw new Error('Target is not a file');

        file.content = content;
        file.size = getFileSize(content);
        file.metadata.modifiedAt = Date.now();

        await persist();
    }

    function listDirectory(currentDir: string, params: string[]): string {
        const currentNode = getNode(currentDir);
        if (!currentNode) return '';
        const childrenArray: string[] = [];
        for (const child in currentNode.children) {
            childrenArray.push(child);
        }
        return childrenArray.join('\n');
    }

    return { drive, init, makeDir, makeFile, removeDir, getNode, removeNode, editFile, listDirectory };
});