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
    private db: IDBDatabase | null = null;
    private DB_NAME: string;
    private DB_VERSION: number;
    private DB_STORE_NAME: string;
    private keyPath: string; // Add keyPath property

    constructor(dbName: string, dbVersion: number, dbStoreName: string, keyPath: string = "id") {
        this.DB_NAME = dbName;
        this.DB_VERSION = dbVersion;
        this.keyPath = keyPath;
        this.DB_STORE_NAME = dbStoreName;
        this.openDB();
    }

    public async openDB(): Promise<IDBDatabase> {
        if (!this.db) {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

                request.onerror = () => {
                    console.error("Failed to open database:", request.error);
                    reject(request.error);
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db)
                };

                request.onupgradeneeded = () => {
                    this.db = request.result;
                    this.initializeSchema();
                };
            });
        }

        return this.db;
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

            const objectStore = this.getObjectStore("readonly");
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

    public getData(primaryKey: string): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore("readonly");
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

    public insertData(data: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore("readwrite");

            const request = objectStore.put(data);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public deleteData(primaryKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore("readwrite");
            const request = objectStore.delete(primaryKey);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public clearData(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore("readwrite");
            const request = objectStore.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public updateData(primaryKey: string, data: Partial<T>): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database is not open"));
                return;
            }

            const objectStore = this.getObjectStore("readwrite");
            const request = objectStore.get(primaryKey);

            request.onsuccess = () => {
                const existingData = request.result as T;
                const newData = {...existingData, ...data};
                const updateRequest = objectStore.put(newData);

                updateRequest.onsuccess = () => {
                    resolve();
                };

                updateRequest.onerror = () => {
                    reject(updateRequest.error);
                };
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    public getObjectStore = (mode: IDBTransactionMode) => {
        if (!this.db) {
            throw new Error("Database is not open");
        }

        const transaction = this.db.transaction(this.DB_STORE_NAME, mode);
        return transaction.objectStore(this.DB_STORE_NAME);
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

    private initializeSchema(): void {
        try {
            if (!this.db) {
                throw new Error("Database is not open");
            }

            const store = this.db.createObjectStore(this.DB_STORE_NAME, {keyPath: this.keyPath}); // Use keyPath value
        } catch (error) {
            console.error("Failed to initialize schema:", error);
        }
    }
}

export {
    IndexedDB,
    MAX_DB_SIZE,
};
