import {
	type InfiniteData,
	type QueryKey,
	type UseInfiniteQueryOptions,
	type UseInfiniteQueryResult,
	type UseQueryOptions,
	type UseQueryResult,
	useInfiniteQuery,
	useQuery,
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";

/**
 * Options the app's query hooks accept from callers. `suspense` keeps the v4 call-site style
 * (`{ suspense: true }`) working: those callers render inside a <Suspense> boundary and expect data.
 * It must not change between renders of the same component.
 */
type WithSuspense = { suspense?: boolean };

export type QueryConfig<
	TQueryFnData,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
> = Omit<
	UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
	"queryKey" | "queryFn"
> &
	WithSuspense;

export type InfiniteQueryConfig<TPage, TError = Error> = Omit<
	UseInfiniteQueryOptions<TPage, TError, InfiniteData<TPage>, QueryKey, any>,
	"queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
> &
	WithSuspense & {
		getNextPageParam?: (lastPage: TPage, allPages: TPage[]) => unknown;
	};

/** `useQuery` that honours `suspense: true` by delegating to `useSuspenseQuery`. */
export function useQueryCompat<
	TQueryFnData,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(
	options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> &
		WithSuspense,
): UseQueryResult<TData, TError> {
	const { suspense, ...rest } = options;
	if (suspense && rest.enabled !== false) {
		return useSuspenseQuery(rest as never) as unknown as UseQueryResult<
			TData,
			TError
		>;
	}
	return useQuery(rest);
}

/** `useInfiniteQuery` that honours `suspense: true` by delegating to `useSuspenseInfiniteQuery`. */
export function useInfiniteQueryCompat<
	TPage,
	TError = Error,
	TPageParam = unknown,
>(
	options: Omit<
		UseInfiniteQueryOptions<
			TPage,
			TError,
			InfiniteData<TPage>,
			QueryKey,
			TPageParam
		>,
		"getNextPageParam"
	> &
		WithSuspense & {
			getNextPageParam: (
				lastPage: TPage,
				allPages: TPage[],
			) => TPageParam | undefined | null;
		},
): UseInfiniteQueryResult<InfiniteData<TPage>, TError> {
	const { suspense, ...rest } = options;
	if (suspense && rest.enabled !== false) {
		return useSuspenseInfiniteQuery(
			rest as never,
		) as unknown as UseInfiniteQueryResult<InfiniteData<TPage>, TError>;
	}
	return useInfiniteQuery(rest as never) as UseInfiniteQueryResult<
		InfiniteData<TPage>,
		TError
	>;
}
