import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TanstackKeys } from '../../types/tanstack-keys';
import { ItsduResourcesDBWrapper } from '@/lib/resource-indexeddb/resourceIndexedDB';
import { getSortedResourcesByTime } from '@/lib/resource-indexeddb/resource-indexeddb-utils';
import axios from 'axios';
import { GETcourseResourceInfo, GETcourseResourceInfoApiUrl } from '@/types/api-types/courses/GETcourseResourceInfo';
import { getAccessToken } from '@/lib/utils';

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
        const last_accessed = new Date()

        if (resource) {
            const { arrayBuffer, type } = resource
            const blob = new Blob([arrayBuffer], { type })
            const url = URL.createObjectURL(blob)
            const text = await blob.text()
            const stream = blob.stream()
            db.getIndexedDB().updateData(elementId.toString(), { last_accessed })

            return { ...resource, url, text, stream, blob }
        }

        const file = await window.resources.file.get(elementId)
        const { arrayBuffer, type } = file
        const blob = new Blob([arrayBuffer], { type })
        const url = URL.createObjectURL(blob)
        const text = await blob.text()
        const stream = blob.stream()

        // get resource info from itslearning API

        const resourceInfoPromise = (await axios.get(GETcourseResourceInfoApiUrl({
            resourceId: Number(elementId)
        }), {
            params: {
                'access_token': await getAccessToken()
            }
        })).data as GETcourseResourceInfo

        const resourceInfoRes = resourceInfoPromise

        const { CourseTitle, CourseId } = resourceInfoRes

        const resourceInfo = {
            CourseTitle,
            CourseId
        }

        const insertResourceObject = {
            elementId: elementId.toString(),
            last_accessed,
            ...file,
            ...resourceInfo
        }

        db.getIndexedDB().checkRemainingSpace((file.size / 1024 / 1024), {
            onStorageAvailable: async () => {
                console.log('Storage is available for resource')
                await db.insertResource(insertResourceObject)
            },
            onStorageUnavailable: async () => {
                console.log('Storage is unavailable')
                const allResources = await db.getAllResources()
                const sortedResources = getSortedResourcesByTime(allResources)
                const resourcesToDelete = sortedResources.slice(0, Math.floor(sortedResources.length / 2))
                resourcesToDelete.forEach(async ({ elementId }) => {
                    await db.deleteResourceById(elementId.toString())
                })

                await db.insertResource(insertResourceObject)
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