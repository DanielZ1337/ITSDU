import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { TanstackKeys } from "@/types/tanstack-keys";

type ResponseObject = {
    title: string
    date: {
        from: Date | null
        to: Date | null
    }
    description: string
    resourcesAndActivities: ResourceActivityObject[]
}

type ResourceActivityObject = {
    planId: string
    elementId: string
    link: string
    title: string
}

export default function useGETcoursePlanElements(courseId: number | string, topicId: number | string, queryConfig?: UseQueryOptions<ResponseObject[], Error, ResponseObject[], string[]>) {

    return useQuery([TanstackKeys.CoursePlanElements, String(courseId), String(topicId)], async () => {
        const mediaLink = await window.resources.coursePlans.elements.get(courseId, topicId) as ResponseObject[]

        if (!mediaLink) throw new Error('Media link not found');

        return mediaLink;
    }, {
        ...queryConfig
    })
}