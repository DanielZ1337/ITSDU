import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TanstackKeys } from "../../types/tanstack-keys";

type OfficeDocument = {
  accessToken: string;
  downloadUrl: string;
};

export default function useOfficeDocumentByElementId(
  elementId: number | string,
  queryConfig?: UseQueryOptions<OfficeDocument, Error, OfficeDocument, string[]>
) {
  return useQuery({
    queryKey: [
      TanstackKeys.ResourceOfficeDocumentByElementID,
      elementId.toString(),
    ],
    queryFn: async () => {
      return await window.resources.officeDocuments.get(elementId);
    },
    ...queryConfig,
    // complete caching of resources
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });
}
