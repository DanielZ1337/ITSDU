import type { AuthSessionStatus } from "@/types/auth";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

type RetriableAxiosConfig = AxiosRequestConfig & {
	__itsduAuthRetry?: boolean;
};

let interceptorInstalled = false;
let refreshInFlight: Promise<AuthSessionStatus> | null = null;

export function setupAuthRefreshInterceptor() {
	if (interceptorInstalled) return;
	interceptorInstalled = true;

	axios.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			const config = error.config as RetriableAxiosConfig | undefined;

			if (
				error.response?.status !== 401 ||
				!config ||
				config.__itsduAuthRetry ||
				isAuthRefreshRequest(config)
			) {
				return Promise.reject(error);
			}

			config.__itsduAuthRetry = true;

			try {
				await refreshSessionOnce();
				const accessToken = await window.auth.store.get("access_token");
				if (accessToken) {
					config.params = {
						...(config.params ?? {}),
						access_token: accessToken,
					};
				}
				return axios.request(config);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		},
	);
}

function refreshSessionOnce() {
	if (!refreshInFlight) {
		refreshInFlight = window.auth
			.refresh({ throwOnFailure: true })
			.finally(() => {
				refreshInFlight = null;
			});
	}

	return refreshInFlight;
}

function isAuthRefreshRequest(config: AxiosRequestConfig) {
	return String(config.url ?? "").includes("/oauth2/token");
}
