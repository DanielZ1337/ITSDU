import { apiUrl, ITSLEARNING_API_MAX_PAGESIZE } from "@/lib/utils.ts";
import {
    ItslearningRestApiEntitiesPersonCourseCardData
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonCourseCardData.ts";

const GETcoursesv3ApiEndpoint = 'restapi/personal/courses/v3?PageIndex={PageIndex}&PageSize={PageSize}&filter={filter}'

export const GETcoursesv3ApiUrl = (params: GETcoursesv3Params) => {
    return apiUrl(GETcoursesv3ApiEndpoint, {
        PageIndex: params.PageIndex,
        PageSize: params.PageSize,
        filter: params.filter
    })
}

export type GETcoursesv3 = {
    Total: number
    CurrentPageIndex: number
    PageSize: number
    EntityArray: ItslearningRestApiEntitiesPersonCourseCardData[]
}

export type GETcoursesv3Params = {
    PageIndex?: number
    PageSize?: ITSLEARNING_API_MAX_PAGESIZE
    filter?: string
}