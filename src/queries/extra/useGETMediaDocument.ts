import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export default function useGETMediaDocument(
  elementId: number | string,
  queryConfig?: UseQueryOptions<string, Error, string, string[]>,
) {
  return useQuery(
    [TanstackKeys.ResourceMediaByElementID, String(elementId)],
    async () => {
      const mediaLink = await window.resources.media.get(elementId);

      if (!mediaLink) throw new Error("Media link not found");

      return mediaLink;
    },
    {
      ...queryConfig,
      // complete caching of resources
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    },
  );
}
