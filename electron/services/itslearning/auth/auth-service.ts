import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { app, BrowserWindow, ipcMain, safeStorage } from "electron";
import type Store from "electron-store";
import type {
	AuthSessionReason,
	AuthSessionStatus,
} from "../../../../src/types/auth";
import { handle } from "../../../ipc/secure";
import { getAppIconPath } from "../../../utils/icon";
import { ITSLEARNING_URL } from "../itslearning.ts";
import { storeName as mockAwareStoreName } from "../mock-mode";
import { openAuthStore } from "./store-key";
import { GrantType } from "./types/grant_type";
import { StoreKey } from "./types/store_keys";

// https://sdu.itslearning.com/oauth2/authorize.aspx?client_id=10ae9d30-1853-48ff-81cb-47b58a325685&state=A59QS4pAT9cF3tES/66w254LVt3XqdGH0p5T+I7U34Y=&response_type=code&scope=Calendar%20Children%20CkEditor%20Courses%20Hierarchies%20LearningObjectiveRepository%20LearningObjectivesReports%20LightBulletin%20Messages%20Notifications%20Person%20Planner%20Sso%20Statistics%20StudentPlan%20Supervisor%20TaskListDailyWorkflow%20Tasks%20Workload&redirect_uri=itsl-itslearning://login

export const ITSLEARNING_CLIENT_ID = "10ae9d30-1853-48ff-81cb-47b58a325685";
export const ITSLEARNING_REDIRECT_URI = "itsl-itslearning://login";
// const ITSLEARNING_SCOPES = Object.keys(ITSLEARNING_SCOPES_ENUM).map((key) => ITSLEARNING_SCOPES_ENUM[key as keyof typeof ITSLEARNING_SCOPES_ENUM])
// By using middleware, itslearning app uses this scope (presumably a scope for everything)
const ITSLEARNING_SCOPES = ["SCOPE"];
const ITSLEARNING_OAUTH_URL = (baseUrl?: string) =>
	new URL("/oauth2/authorize.aspx", baseUrl ?? ITSLEARNING_URL()).toString();
export const ITSLEARNING_OAUTH_TOKEN_URL = () =>
	new URL("/restapi/oauth2/token", ITSLEARNING_URL()).toString();
let pendingOAuthState: string | null = null;

export const getItslearningOAuthUrl = (oauthUrl?: string) => {
	const url = new URL(oauthUrl ?? ITSLEARNING_OAUTH_URL());
	url.searchParams.append("client_id", ITSLEARNING_CLIENT_ID);

	// Fresh, unguessable CSRF state for every sign-in attempt (verified in getAuthCodeFromURI).
	pendingOAuthState = randomBytes(24).toString("base64url");
	url.searchParams.append("state", pendingOAuthState);
	url.searchParams.append("response_type", "code");
	url.searchParams.append("scope", ITSLEARNING_SCOPES.join(" "));
	url.searchParams.append("redirect_uri", ITSLEARNING_REDIRECT_URI);
	return url.toString();
};

export const REFRESH_ACCESS_TOKEN_INTERVAL = 1000 * 60 * 45; // 45 minutes

let instance: AuthService | null = null;

export class AuthRefreshError extends Error {
	constructor(
		message: string,
		public readonly reason: AuthSessionReason,
		public readonly terminal: boolean,
	) {
		super(message);
		this.name = "AuthRefreshError";
	}
}

export const initializeLoginHandler = () => {
	try {
		ipcMain.removeHandler("itslearning:login");
	} catch (error) {
		console.error(error);
	}
	handle("itslearning:login", async (_event, baseUrl) => {
		const authService = AuthService.getInstance();
		await authService.loadSigninPage(undefined, baseUrl);
	});
};

export class AuthService {
	private store!: Store<Record<string, unknown>>;
	private refreshInFlight: Promise<AuthSessionStatus> | null = null;
	private listeners = new Set<(status: AuthSessionStatus) => void>();
	private status: AuthSessionStatus = {
		state: "unknown",
		hasPersistedSession: false,
		isOnline: true,
		reason: "none",
	};

	constructor() {
		this.initializeStore();
		this.status = {
			...this.status,
			state: this.hasPersistedSession() ? "stale" : "anonymous",
			hasPersistedSession: this.hasPersistedSession(),
		};
	}

	private initializeStore() {
		const storeName = mockAwareStoreName(
			app.isPackaged ? "itsdu-auth-store" : "itsdu-auth-store-dev",
		);
		const legacyKey = import.meta.env.VITE_ITSLEARNING_STORE_KEY as
			| string
			| undefined;

		try {
			this.store = openAuthStore(storeName, legacyKey);
		} catch (error) {
			// Unreadable store (for example a lost OS keychain entry): start clean, the user signs in again.
			console.error(error);
			AuthService.clearAuthStore(`${storeName}-v2`);
			this.store = openAuthStore(storeName, undefined);
		}
	}

	private static clearAuthStore(storeName: string) {
		const authStorePath = path.join(
			app.getPath("userData"),
			`${storeName}.json`,
		);
		fs.rmSync(authStorePath, { force: true });
		console.error(`Deleted unreadable auth store at ${authStorePath}`);
	}

	public static getInstance(): AuthService {
		if (!instance) {
			instance = new AuthService();
		}
		return instance;
	}

	public getTokens() {
		return this.store.store;
	}

	public clearTokens() {
		this.store.clear();
		this.setStatus({
			state: "anonymous",
			hasPersistedSession: false,
			reason: "missing",
		});
	}

	public setToken(key: StoreKey, token: string) {
		const buffer = safeStorage.encryptString(token);
		this.store.set(key, buffer.toString("latin1"));
	}

	public deleteToken(key: StoreKey) {
		this.store.delete(key);
	}

	public getToken(key: StoreKey): string | null {
		try {
			if (!this.store.has(key)) return null;
			return safeStorage.decryptString(
				Buffer.from(String(this.store.get(key)), "latin1"),
			);
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public hasPersistedSession() {
		return Boolean(this.getToken("refresh_token"));
	}

	public getSessionStatus(): AuthSessionStatus {
		return {
			...this.status,
			hasPersistedSession: this.hasPersistedSession(),
		};
	}

	public subscribe(listener: (status: AuthSessionStatus) => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	public markStale(reason: AuthSessionReason = "none") {
		if (!this.hasPersistedSession()) {
			this.setStatus({ state: "anonymous", reason: "missing" });
			return;
		}
		this.setStatus({
			state: "stale",
			hasPersistedSession: true,
			reason,
		});
	}

	public setOnlineStatus(isOnline: boolean) {
		const hadPersistedSession = this.hasPersistedSession();
		this.setStatus({
			isOnline,
			state: !hadPersistedSession
				? "anonymous"
				: isOnline
					? this.status.state === "offline"
						? "stale"
						: this.status.state
					: "offline",
			hasPersistedSession: hadPersistedSession,
			reason: !hadPersistedSession ? "missing" : isOnline ? "none" : "network",
		});
	}

	private setStatus(status: Partial<AuthSessionStatus>) {
		this.status = {
			...this.status,
			...status,
			hasPersistedSession:
				status.hasPersistedSession ?? this.hasPersistedSession(),
		};

		for (const listener of this.listeners) {
			listener(this.getSessionStatus());
		}

		for (const window of BrowserWindow.getAllWindows()) {
			window.webContents.send("auth:statusChanged", this.getSessionStatus());
		}
	}

	/**
	 * Will throw an error if no refresh token is found or if the refresh token is invalid
	 */
	public async refreshAccessToken() {
		if (this.refreshInFlight) return this.refreshInFlight;

		const refresh = this.refreshAccessTokenInternal().finally(() => {
			this.refreshInFlight = null;
		});
		this.refreshInFlight = refresh;
		return refresh;
	}

	private async refreshAccessTokenInternal(): Promise<AuthSessionStatus> {
		const current_refresh_token = this.getToken("refresh_token");

		if (!current_refresh_token) {
			this.setStatus({
				state: "anonymous",
				hasPersistedSession: false,
				reason: "missing",
			});
			throw new AuthRefreshError("No refresh token", "missing", true);
		}

		this.setStatus({
			state: "refreshing",
			hasPersistedSession: true,
			reason: "none",
		});
		const axios = (await import("axios")).default;

		try {
			const { data } = await axios.post(
				ITSLEARNING_OAUTH_TOKEN_URL(),
				{
					grant_type: GrantType.REFRESH_TOKEN,
					refresh_token: current_refresh_token,
					client_id: ITSLEARNING_CLIENT_ID,
				},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);

			const { access_token, refresh_token, expires_in } = data;
			if (!access_token || !refresh_token) {
				throw new AuthRefreshError("Invalid refresh token", "invalid", true);
			}

			const now = new Date();
			this.setToken("access_token", access_token);
			this.setToken("refresh_token", refresh_token);
			this.setStatus({
				state: "authenticated",
				hasPersistedSession: true,
				isOnline: true,
				lastValidatedAt: now.toISOString(),
				lastRefreshAt: now.toISOString(),
				accessTokenExpiresAt:
					typeof expires_in === "number"
						? new Date(now.getTime() + expires_in * 1000).toISOString()
						: undefined,
				reason: "none",
			});
			return this.getSessionStatus();
		} catch (error) {
			const classified =
				error instanceof AuthRefreshError ? error : classifyRefreshError(error);

			if (classified.terminal) {
				this.store.clear();
				this.setStatus({
					state: "reauthRequired",
					hasPersistedSession: false,
					reason: classified.reason,
				});
			} else {
				this.setStatus({
					state: "offline",
					hasPersistedSession: true,
					isOnline: false,
					reason: classified.reason,
				});
			}

			throw classified;
		}
	}

	public getAuthCodeFromURI(URI: string) {
		try {
			const url = new URL(URI);
			const params = new URLSearchParams(url.search);
			const code = params.get("code");
			const state = params.get("state");
			if (code && pendingOAuthState && state === pendingOAuthState) {
				pendingOAuthState = null;
				return code;
			}
		} catch (error) {
			console.error(error);
		}
		return null;
	}

	public async loadSigninPage(win?: BrowserWindow | null, baseUrl?: string) {
		if (!win) {
			win = new BrowserWindow({
				icon: getAppIconPath(),
				width: 800,
				height: 600,
				// Pinned alongside width/height: frameless windows don't get the same size hints from
				// some Linux WMs/compositors as decorated ones, so without this they can render at the
				// wrong size despite resizable:false.
				minWidth: 800,
				minHeight: 600,
				maxWidth: 800,
				maxHeight: 600,
				webPreferences: {
					nodeIntegration: false,
					contextIsolation: true,
					sandbox: true,
					devTools: false,
				},
				alwaysOnTop: true,
				autoHideMenuBar: true,
				title: "itslearning Login",
				resizable: false,
				acceptFirstMouse: true,
				focusable: true,
				show: true,
				skipTaskbar: true,
				parent: BrowserWindow.getFocusedWindow() || undefined,
				// Native (server-side) window decorations segfault Chromium's GTK integration on some
				// Linux setups (e.g. GNOME/GTK versions missing the font-antialiasing key under
				// org.gnome.desktop.interface); see createAuthWindow() in electron/main.ts for the same fix.
				frame: false,
				roundedCorners: true,
			});
			// This window is frameless with no preload script (it loads itslearning's own OAuth page),
			// so there is no native or in-page close affordance. Escape is the only way out if the
			// automated sign-in below doesn't complete.
			win.webContents.on("before-input-event", (_event, input) => {
				if (input.type === "keyDown" && input.key === "Escape") win?.close();
			});
		}

		await win?.loadURL(getItslearningOAuthUrl(baseUrl));
		await win?.webContents.executeJavaScript(
			`__doPostBack('ctl00$ContentPlaceHolder1$federatedLoginButtons$ctl00$ctl00','')`,
		);
		setTimeout(async () => {
			await win?.webContents.executeJavaScript(
				`document.getElementsByClassName('table')[0].click()`,
			);
		}, 1000);
	}
}

function classifyRefreshError(error: unknown): AuthRefreshError {
	const maybeAxios = error as {
		code?: string;
		message?: string;
		response?: { status?: number; data?: { error?: string } };
	};
	const status = maybeAxios.response?.status;
	const oauthError = maybeAxios.response?.data?.error;

	if (
		status === 400 ||
		status === 401 ||
		oauthError === "invalid_grant" ||
		oauthError === "invalid_client"
	) {
		return new AuthRefreshError("Refresh token is invalid", "invalid", true);
	}

	if (
		maybeAxios.code === "ECONNABORTED" ||
		maybeAxios.code === "ENOTFOUND" ||
		maybeAxios.code === "ECONNREFUSED" ||
		maybeAxios.code === "ERR_NETWORK" ||
		!maybeAxios.response
	) {
		return new AuthRefreshError("Network unavailable", "network", false);
	}

	return new AuthRefreshError("Session refresh failed", "network", false);
}

/*
https://sdu.itslearning.com/restapi/oauth2/token', {
                "grant_type": "authorization_code",
                "code": deeplinkingUrl,
                "client_id": ITSLEARNING_CLIENT_ID,
 */
