import {apiUrl} from "@/lib/utils.ts";

const GETcoursePlansCountApiEndpoint = 'restapi/personal/course/{courseId}/plans/counts/v1'

export const GETcoursePlansCountApiUrl = (params: GETcoursePlansCountParams) => {
    return apiUrl(GETcoursePlansCountApiEndpoint, params)
}

export type GETcoursePlansCount = {
    allPlansCount: string
    currentPlansCount: string
    pastPlansCount: string
    withoutDatePlansCount: string
    topicsCount: string
}

export type GETcoursePlansCountParams = {
    courseId: number,
}