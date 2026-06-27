import { GETcourseResourceInfo } from "@/types/api-types/courses/GETcourseResourceInfo";
import { IndexedDB } from "../indexedDB";

const DB_NAME = "itsdu";
const DB_VERSION = 3;
const DB_STORE_NAME = "itsdu-resources";
// const DB_SCHEMA = ['elementId', 'name', 'arrayBuffer', 'size', 'type', 'last_updated', 'last_accessed'];
const DB_KEY_PATH = "elementId";
/* const DB_INDEXES = [
    {
        name: 'elementId',
        keyPath: 'elementId',
        options: { unique: true },
    },
]; */

export type CachedResourceStatus = "cached" | "missing" | "stale" | "failed";
export type CachedResourceOpenMode =
	| "pdf"
	| "office"
	| "image"
	| "video"
	| "text"
	| "browser"
	| "download"
	| "unknown";

export type IndexedDBResourceFileType = {
	elementId: string;
	name: string;
	arrayBuffer?: ArrayBuffer | Uint8Array;
	size: number;
	type: string;
	last_accessed: Date;
	cachedAt?: Date;
	lastOpenedAt?: Date;
	fileExtension?: string;
	mimeType?: string;
	openMode?: CachedResourceOpenMode;
	cacheStatus?: CachedResourceStatus;
	failureReason?: string;
} & Partial<GETcourseResourceInfo> & {
		CourseTitle?: string;
		CourseId?: number;
		courseTitle?: string;
		courseId?: number;
	};

export type ResourceCacheHealth = {
	totalCount: number;
	cachedCount: number;
	missingCount: number;
	staleCount: number;
	failedCount: number;
	totalSize: number;
	oldestAccessedAt: Date | null;
	newestAccessedAt: Date | null;
};

function toDate(value: unknown, fallback = new Date()) {
	const date = value instanceof Date ? value : new Date(String(value ?? ""));
	return Number.isNaN(date.getTime()) ? fallback : date;
}

function inferExtension(name: string) {
	const match = name.match(/\.([a-z0-9]+)$/i);
	return match ? match[1].toLowerCase() : "";
}

function inferOpenMode(
	name: string,
	mimeType?: string,
): CachedResourceOpenMode {
	const extension = inferExtension(name);
	if (extension === "pdf" || mimeType === "application/pdf") return "pdf";
	if (
		["doc", "docx", "ppt", "pptx", "xls", "xlsx", "odt", "odp"].includes(
			extension,
		)
	)
		return "office";
	if (
		mimeType?.startsWith("image/") ||
		["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)
	)
		return "image";
	if (
		mimeType?.startsWith("video/") ||
		["mp4", "mkv", "webm", "mov"].includes(extension)
	)
		return "video";
	if (
		mimeType?.startsWith("text/") ||
		["txt", "csv", "json", "md", "xml"].includes(extension)
	)
		return "text";
	return "unknown";
}

function byteLength(value: unknown) {
	if (!value) return 0;
	if (value instanceof ArrayBuffer) return value.byteLength;
	if (ArrayBuffer.isView(value)) return value.byteLength;
	return 0;
}

export function normalizeCachedResourceRecord(
	record: Partial<IndexedDBResourceFileType> & Record<string, unknown>,
): IndexedDBResourceFileType {
	const elementId = String(record.elementId ?? "");
	const name =
		typeof record.name === "string" && record.name.trim().length > 0
			? record.name
			: elementId;
	const inferredSize = byteLength(record.arrayBuffer);
	const size =
		typeof record.size === "number" && Number.isFinite(record.size)
			? record.size
			: inferredSize;
	const type =
		typeof record.type === "string" && record.type.length > 0
			? record.type
			: "application/octet-stream";
	const lastAccessed = toDate(
		record.lastOpenedAt ?? record.last_accessed ?? record.cachedAt,
	);
	const hasContent = byteLength(record.arrayBuffer) > 0;
	const status =
		record.cacheStatus === "failed" ||
		record.cacheStatus === "stale" ||
		record.cacheStatus === "missing"
			? record.cacheStatus
			: hasContent
				? "cached"
				: "missing";

	return {
		...record,
		elementId,
		name,
		size,
		type,
		last_accessed: lastAccessed,
		lastOpenedAt: toDate(
			record.lastOpenedAt ?? record.last_accessed,
			lastAccessed,
		),
		cachedAt: toDate(record.cachedAt, lastAccessed),
		fileExtension:
			typeof record.fileExtension === "string"
				? record.fileExtension
				: inferExtension(name),
		mimeType: typeof record.mimeType === "string" ? record.mimeType : type,
		openMode:
			record.openMode ??
			inferOpenMode(
				name,
				typeof record.mimeType === "string" ? record.mimeType : type,
			),
		cacheStatus: status,
		CourseTitle:
			record.CourseTitle ??
			(typeof record.courseTitle === "string" ? record.courseTitle : undefined),
		CourseId:
			record.CourseId ??
			(typeof record.courseId === "number" ? record.courseId : undefined),
	} as IndexedDBResourceFileType;
}

class ItsduResourcesDBWrapper {
	private static instance: ItsduResourcesDBWrapper;
	private indexedDB: IndexedDB<IndexedDBResourceFileType>;

	private constructor() {
		this.indexedDB = new IndexedDB<IndexedDBResourceFileType>(
			DB_NAME,
			DB_VERSION,
			DB_STORE_NAME,
			DB_KEY_PATH,
		);
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
			const resources = await this.indexedDB.getAllData();
			return resources
				.map((resource) =>
					normalizeCachedResourceRecord(
						resource as Partial<IndexedDBResourceFileType> &
							Record<string, unknown>,
					),
				)
				.filter((resource) => resource.elementId.length > 0);
		} catch (error) {
			console.error("Failed to get all resources:", error);
			return [];
		}
	}

	public async getResourceById(id: string) {
		try {
			const resource = await this.indexedDB.getData(id);
			if (!resource) return undefined;
			return normalizeCachedResourceRecord(
				resource as Partial<IndexedDBResourceFileType> &
					Record<string, unknown>,
			);
		} catch (error) {
			console.error(`Failed to get resource with id ${id}:`, error);
			return undefined;
		}
	}

	public async insertResource(resource: IndexedDBResourceFileType) {
		try {
			await this.indexedDB.insertData(normalizeCachedResourceRecord(resource));
		} catch (error) {
			console.error("Failed to insert resource:", error);
		}
	}

	public async deleteResourceById(id: string) {
		try {
			await this.indexedDB.deleteData(id);
		} catch (error) {
			console.error(`Failed to delete resource with id ${id}:`, error);
		}
	}

	public async clearResources() {
		try {
			await this.indexedDB.clearData();
		} catch (error) {
			console.error("Failed to clear resources:", error);
		}
	}

	public async clearProblemResources() {
		const resources = await this.getAllResources();
		const problemResources = resources.filter(
			(resource) =>
				resource.cacheStatus === "missing" ||
				resource.cacheStatus === "failed" ||
				!resource.arrayBuffer,
		);

		await Promise.all(
			problemResources.map((resource) =>
				this.deleteResourceById(resource.elementId),
			),
		);

		return problemResources.length;
	}

	public async enforceMaxSize(maxBytes: number) {
		if (!Number.isFinite(maxBytes) || maxBytes <= 0) return;

		const resources = await this.getAllResources();
		let totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
		if (totalSize <= maxBytes) return;

		const lru = [...resources].sort(
			(a, b) =>
				new Date(a.lastOpenedAt ?? a.last_accessed).getTime() -
				new Date(b.lastOpenedAt ?? b.last_accessed).getTime(),
		);

		let removed = 0;
		while (totalSize > maxBytes && lru.length > 1) {
			const resource = lru.shift();
			if (!resource) break;
			await this.deleteResourceById(resource.elementId);
			totalSize -= resource.size;
			removed++;
		}

		return removed;
	}

	public async getCacheHealth(): Promise<ResourceCacheHealth> {
		const resources = await this.getAllResources();
		const accessTimes = resources
			.map(
				(resource) => new Date(resource.lastOpenedAt ?? resource.last_accessed),
			)
			.filter((date) => !Number.isNaN(date.getTime()))
			.sort((a, b) => a.getTime() - b.getTime());

		return {
			totalCount: resources.length,
			cachedCount: resources.filter(
				(resource) => resource.cacheStatus === "cached",
			).length,
			missingCount: resources.filter(
				(resource) =>
					resource.cacheStatus === "missing" || !resource.arrayBuffer,
			).length,
			staleCount: resources.filter(
				(resource) => resource.cacheStatus === "stale",
			).length,
			failedCount: resources.filter(
				(resource) => resource.cacheStatus === "failed",
			).length,
			totalSize: resources.reduce(
				(total, resource) => total + resource.size,
				0,
			),
			oldestAccessedAt: accessTimes[0] ?? null,
			newestAccessedAt: accessTimes.at(-1) ?? null,
		};
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

export { ItsduResourcesDBWrapper };
