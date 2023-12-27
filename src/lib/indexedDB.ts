type IDBUtilsResult<T> = Promise<T[]>;

type CustomIDBIndexParameters = {
    name: string,
    keyPath: string | Iterable<string>,
    options?: IDBIndexParameters | undefined
};

interface checkRemainingSpaceOptions {
    onStorageAvailable?: () => void,
    onStorageUnavailable?: () => void,
}

const MAX_DB_SIZE = 300 * 1024 * 1024; // 50 MB

class IndexedDB<T> {
    private db: IDBDatabase | null;
    private DB_NAME: string;
    private DB_VERSION: number;
    private DB_INDEXES: CustomIDBIndexParameters[];
    private DB_STORE_NAME: string;
    private keyPath: string; // Add keyPath property

    constructor(dbName: string, dbVersion: number, dbIndexes: CustomIDBIndexParameters[], dbStoreName: string, keyPath: string = "id") {
        this.db = null;
        this.DB_NAME = dbName;
        this.DB_VERSION = dbVersion;
        this.DB_INDEXES = dbIndexes;
        this.keyPath = keyPath;
        this.DB_STORE_NAME = dbStoreName;
        this.openDB();
    }

    public async openDB(): Promise<void> {
        if (!this.db) {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onerror = () => {
                    console.error("Failed to open database:", request.error);
                    reject(request.error);
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    resolve();
                };

                request.onupgradeneeded = () => {
                    this.db = request.result;
                    this.initializeSchema();
                };
            });
        }
    }

    private initializeSchema(): void {
        try {
            if (!this.db) {
                throw new Error("Database is not open");
            }

            const store = this.db.createObjectStore(this.DB_STORE_NAME, { keyPath: this.keyPath }); // Use keyPath value
            this.DB_INDEXES.forEach((index) => {
                const { name, keyPath, options } = index;
                store.createIndex(name, keyPath as string | string[], options as IDBIndexParameters | undefined); // Fix the type of options
            });
        } catch (error) {
            console.error("Failed to initialize schema:", error);
        }
    }

    public closeDB(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    public getAllData(): IDBUtilsResult<T> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore(this.DB_STORE_NAME, "readonly");
            const request = objectStore.getAll();

            request.onsuccess = () => {
                const data = request.result as T[];
                resolve(data);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public getData(storeName: string, primaryKey: any): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore(storeName, "readonly");
            const request = objectStore.get(primaryKey);

            request.onsuccess = () => {
                const data = request.result as T;
                resolve(data);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public insertData(storeName: string, data: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore(storeName, "readwrite");

            const request = objectStore.put(data);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public deleteData(storeName: string, primaryKey: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore(storeName, "readwrite");
            const request = objectStore.delete(primaryKey);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public clearData(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore(storeName, "readwrite");
            const request = objectStore.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public getObjectStore = (storeName: string, mode: IDBTransactionMode) => {
        if (!this.db) {
            throw new Error("Database is not open");
        }

        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    public getDBName(): string {
        return this.DB_NAME;
    }

    public getDBVersion(): number {
        return this.DB_VERSION;
    }

    public getDBInfo(): { name: string; version: number } {
        return {
            name: this.DB_NAME,
            version: this.DB_VERSION,
        }
    }

    public getDB(): IDBDatabase | null {
        return this.db;
    }

    /**
     * 
     * @param required required space in MB
     * @returns 
     */
    public async checkRemainingSpace(required?: number, {
        onStorageAvailable,
        onStorageUnavailable,
    }: checkRemainingSpaceOptions = {}): Promise<void> {
        if (!this.db) {
            throw new Error("Database is not open");
        }

        if (!navigator.storage) return;

        const estimate = await navigator.storage.estimate();
        let available = 0;

        // calculate remaining storage in MB
        if (!estimate.usage || !estimate.quota) return;
        available = Math.floor((estimate.quota - estimate.usage) / 1024 / 1024);

        // consider the maximum database size
        const remainingSpace = Math.min(available, MAX_DB_SIZE / 1024 / 1024);

        if (required && remainingSpace >= required) {
            console.log('Storage is available');
            onStorageAvailable && onStorageAvailable();
        } else {
            console.log('Storage is unavailable');
            onStorageUnavailable && onStorageUnavailable();
        }
    }
}

export {
    IndexedDB,
    MAX_DB_SIZE,
};
