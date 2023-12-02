import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import MediaDocuments from '../../routes/documents/media-documents';

export default function useGETMediaDocument(elementId: number | string, queryConfig?: UseQueryOptions<string, Error, string, string[]>) {

    return useQuery([TanstackKeys.ResourceMediaByElementID, String(elementId)], async () => {
        const mediaLink = await window.resources.media.get(elementId)

        if (!mediaLink) throw new Error('Media link not found');

        return mediaLink;
    }, {
        ...queryConfig
    })
}