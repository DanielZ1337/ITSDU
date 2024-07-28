import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: false,
			refetchInterval: 1000 * 60 * 5, // 5 minutes
			keepPreviousData: true,
			refetchOnReconnect: "always",
			// useErrorBoundary: true
		},
	},
});
