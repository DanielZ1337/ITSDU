import { ResourceFileType } from "@/queries/resources/useResourceByElementID";
import { IndexedDB } from "./indexedDB";

const DB_NAME = 'itsdu';
const DB_VERSION = 3;
const DB_STORE_NAME = 'itsdu-resources';
// const DB_SCHEMA = ['elementId', 'name', 'arrayBuffer', 'size', 'type', 'last_updated', 'last_accessed'];
const DB_KEY_PATH = 'elementId';
const DB_INDEXES = [
    {
        name: 'elementId',
        keyPath: 'elementId',
        options: { unique: true },
    },
    {
        name: 'name',
        keyPath: 'name',
        options: { unique: false },
    },
    {
        name: 'arrayBuffer',
        keyPath: 'arrayBuffer',
        options: { unique: false },
    },
    {
        name: 'size',
        keyPath: 'size',
        options: { unique: false },
    },
    {
        name: 'type',
        keyPath: 'type',
        options: { unique: false },
    },
    /* {
        name: 'last_updated',
        keyPath: 'last_updated',
        options: { unique: false },
    }, */
    {
        name: 'last_accessed',
        keyPath: 'last_accessed',
        options: { unique: false },
    },
];

export type IndexedDBResourceFileType = Omit<ResourceFileType, 'url' | 'text' | 'stream' | 'blob'> & {
    elementId: string
    // last_updated: Date
    last_accessed: Date
}

class ItsduResourcesDBWrapper {
    private static instance: ItsduResourcesDBWrapper;
    private indexedDB: IndexedDB<IndexedDBResourceFileType>;

    private constructor() {
        this.indexedDB = new IndexedDB<IndexedDBResourceFileType>(DB_NAME, DB_VERSION, DB_INDEXES, DB_STORE_NAME, DB_KEY_PATH);
    }

    public static async getInstance() {
        if (!ItsduResourcesDBWrapper.instance) {
            ItsduResourcesDBWrapper.instance = new ItsduResourcesDBWrapper();
            await ItsduResourcesDBWrapper.instance.getIndexedDB().openDB();
        }
        return ItsduResourcesDBWrapper.instance;
    }

    public async getAllResources() {
        try {
            return await this.indexedDB.getAllData();
        } catch (error) {
            console.error('Failed to get all resources:', error);
            return [];
        }
    }

    public async getResourceById(id: string) {
        try {
            return await this.indexedDB.getData(DB_STORE_NAME, id);
        } catch (error) {
            console.error(`Failed to get resource with id ${id}:`, error);
            return undefined;
        }
    }

    public async insertResource(resource: IndexedDBResourceFileType) {
        try {
            await this.indexedDB.insertData(DB_STORE_NAME, resource);
        } catch (error) {
            console.error('Failed to insert resource:', error);
        }
    }

    public async deleteResourceById(id: string) {
        try {
            await this.indexedDB.deleteData(DB_STORE_NAME, id);
        } catch (error) {
            console.error(`Failed to delete resource with id ${id}:`, error);
        }
    }

    public async clearResources() {
        try {
            await this.indexedDB.clearData(DB_STORE_NAME);
        } catch (error) {
            console.error('Failed to clear resources:', error);
        }
    }

    public async closeDB() {
        this.indexedDB.closeDB();
    }

    public getDB(): IDBDatabase | null {
        return this.indexedDB.getDB();
    }

    public getIndexedDB() {
        return this.indexedDB;
    }
}

export {
    ItsduResourcesDBWrapper,
}
