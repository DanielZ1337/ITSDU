import { keepPreviousData, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: false,
			// No global polling: queries that need it opt in via their own refetchInterval.
			placeholderData: keepPreviousData,
			refetchOnReconnect: "always",
			// throwOnError: true
		},
	},
});
