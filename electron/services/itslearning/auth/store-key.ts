import { app, safeStorage } from "electron";
import Store from "electron-store";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const KEY_FILE = "itsdu-store-key.bin";
const PLAIN_PREFIX = "plain:";

/**
 * Per-install encryption key for the auth store. It is random, generated on first run and wrapped with the
 * OS keychain (safeStorage) when available, so it is never shipped inside the app bundle.
 */
export function getInstallStoreKey(): string {
	const file = path.join(app.getPath("userData"), KEY_FILE);
	if (fs.existsSync(file)) {
		const raw = fs.readFileSync(file);
		const plain = raw.toString("utf8");
		if (plain.startsWith(PLAIN_PREFIX)) return plain.slice(PLAIN_PREFIX.length);
		return safeStorage.decryptString(raw);
	}
	const key = randomBytes(32).toString("base64");
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(
		file,
		safeStorage.isEncryptionAvailable()
			? safeStorage.encryptString(key)
			: Buffer.from(PLAIN_PREFIX + key, "utf8"),
	);
	return key;
}

type AuthData = Record<string, unknown>;

/**
 * Opens `<base>-v2` (per-install key). If the legacy store `<base>` (key baked into older builds) exists and the
 * new one is empty, its contents are copied over and the legacy file is removed only after a verified copy.
 */
export function openAuthStore(base: string, legacyKey: string | undefined) {
	const v2 = new Store<AuthData>({
		name: `${base}-v2`,
		watch: true,
		encryptionKey: getInstallStoreKey(),
	});
	migrateLegacyAuthStore(base, legacyKey, v2);
	return v2;
}

function migrateLegacyAuthStore(
	base: string,
	legacyKey: string | undefined,
	v2: Store<AuthData>,
) {
	const legacyFile = path.join(app.getPath("userData"), `${base}.json`);
	if (!legacyKey || v2.size > 0 || !fs.existsSync(legacyFile)) return;
	try {
		const legacy = new Store<AuthData>({ name: base, encryptionKey: legacyKey });
		const data = legacy.store;
		if (Object.keys(data).length === 0) return;
		v2.store = data;
		if (JSON.stringify(v2.store) !== JSON.stringify(data)) {
			throw new Error("verification failed");
		}
		fs.rmSync(legacyFile, { force: true });
		console.log("[auth] migrated persisted session to the per-install store key");
	} catch (error) {
		// Keep the legacy file untouched; the user can still sign in again.
		console.warn("[auth] could not migrate the legacy auth store", error);
	}
}
