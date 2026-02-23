import { defineStore } from "pinia";
import { reactive } from "vue";

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

export const useFileSystem = defineStore('fileSystem', () => {
    const drive = reactive<Record<string, FileSystemNode>>({
        '/': {
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
        },
    });

    function createDir(name: string, path: string, owner = 'root', size: number = 0, children: Record<string, FileSystemNode> = {}, permissions: string = '755'): FileSystemNode {
        return {
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
        }
    }

    function getNode(path: string): FileSystemNode | null {
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

    return { drive, createDir, getNode };
});