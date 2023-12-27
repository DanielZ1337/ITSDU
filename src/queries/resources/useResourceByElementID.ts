import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TanstackKeys } from '../../types/tanstack-keys';
import { ItsduResourcesDBWrapper } from '@/lib/resourceIndexedDB';

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
        const db = await ItsduResourcesDBWrapper.getInstance()
        const resource = await db.getResourceById(elementId.toString())
        if (resource) {
            const { arrayBuffer, type } = resource
            const blob = new Blob([arrayBuffer], { type })
            const url = URL.createObjectURL(blob)
            const text = await blob.text()
            const stream = blob.stream()
            return { ...resource, url, text, stream, blob }
        }

        const file = await window.resources.file.get(elementId)
        const { arrayBuffer, type } = file
        const blob = new Blob([arrayBuffer], { type })
        const url = URL.createObjectURL(blob)
        const text = await blob.text()
        const stream = blob.stream()
        const last_accessed = new Date()

        db.getIndexedDB().checkRemainingSpace((file.size / 1024 / 1024), {
            onStorageAvailable: async () => {
                console.log('Storage is available for resource')
                await db.insertResource({ elementId: elementId.toString(), last_accessed, ...file })
            },
            onStorageUnavailable: async () => {
                console.log('Storage is unavailable')
                const allResources = await db.getAllResources()
                const sortedResources = allResources.sort((a, b) => a.last_accessed.getTime() - b.last_accessed.getTime())
                const resourcesToDelete = sortedResources.slice(0, Math.floor(sortedResources.length / 2))
                resourcesToDelete.forEach(async ({ elementId }) => {
                    await db.deleteResourceById(elementId.toString())
                })

                await db.insertResource({ elementId: elementId.toString(), last_accessed, ...file })
            }
        })
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