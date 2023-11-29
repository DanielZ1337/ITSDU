import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TanstackKeys } from '../../types/tanstack-keys';

export type ResourceFileType = {
    name: string
    arrayBuffer: ArrayBuffer
    size: number
    type: string
    url: string
    text: string
    stream: ReadableStream
    blob: Blob
}

export default function useResourceByElementID(elementId: number | string, queryConfig?: UseQueryOptions<ResourceFileType, Error, ResourceFileType, string[]>) {

    return useQuery([TanstackKeys.ResourceByElementID, elementId.toString()], async () => {
        const file = await window.resources.file.get(elementId)
        const { arrayBuffer, type } = file
        const blob = new Blob([arrayBuffer], { type })
        const url = URL.createObjectURL(blob)
        const text = await blob.text()
        const stream = blob.stream()
        return { ...file, url, text, stream, blob }
    }, {
        ...queryConfig,
        // complete caching of resources
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
    })
}