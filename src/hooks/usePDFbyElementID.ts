import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { TanstackKeys } from '../types/tanstack-keys';
export default function useResourceByElementID(elementId: number | string, queryConfig?: UseQueryOptions<string, Error, string, string[]>) {

    return useQuery([TanstackKeys.ResourceByElementID, elementId.toString()], async () => {
        const arraybuffer = await window.blob.get(elementId)
        const blob = new Blob([arraybuffer], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        return url
    }, {
        ...queryConfig
    })
}