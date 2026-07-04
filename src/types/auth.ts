export type AuthSessionState =
	| "unknown"
	| "anonymous"
	| "authenticated"
	| "stale"
	| "offline"
	| "refreshing"
	| "reauthRequired";

export type AuthSessionReason =
	| "none"
	| "network"
	| "expired"
	| "revoked"
	| "missing"
	| "invalid";

export type AuthSessionStatus = {
	state: AuthSessionState;
	hasPersistedSession: boolean;
	isOnline: boolean;
	lastValidatedAt?: string;
	lastRefreshAt?: string;
	accessTokenExpiresAt?: string;
	reason: AuthSessionReason;
};

export type AuthRefreshOptions = {
	throwOnFailure?: boolean;
};
