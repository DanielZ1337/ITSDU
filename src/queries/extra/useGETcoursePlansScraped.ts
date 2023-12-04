import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import MediaDocuments from '../../routes/documents/media-documents';

export default function useGETcoursePlansScraped(courseId: number | string, queryConfig?: UseQueryOptions<CoursePlan[], Error, CoursePlan[], string[]>) {

    return useQuery([TanstackKeys.CoursePlansScraped, String(courseId)], async () => {
        const coursePlans = await window.resources.coursePlans.get(courseId) as CoursePlan[];

        if (!coursePlans) throw new Error('Media link not found');

        return coursePlans;
    }, {
        ...queryConfig
    })
}

type CoursePlan = {
    dataTopicId: number | string;
    planTitle: string;
    plansCount: number;
    fromDate: string | null;
    toDate: string | null;
    attributes: {
        id: string
        class: string
        "data-topic-id": string
    }
}