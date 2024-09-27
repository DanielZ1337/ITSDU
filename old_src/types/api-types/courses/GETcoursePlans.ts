import {apiUrl} from "@/lib/utils.ts";
import {ItslearningRestApiEntitiesPlannerPlanPreview} from "../utils/Itslearning.RestApi.Entities.Planner.PlanPreview";

const GETcoursePlansApiEndpoint = 'restapi/personal/planner/v1?courseId={courseId}&startDate={startDate}&stopDate={stopDate}'

export const GETcoursePlansApiUrl = (params: GETcoursePlansParams) => {
    return apiUrl(GETcoursePlansApiEndpoint, {
        courseId: params.courseId,
        startDate: params.startDate,
        stopDate: params.stopDate
    })
}

export type GETcoursePlans = {
    EntityArray: ItslearningRestApiEntitiesPlannerPlanPreview[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETcoursePlansParams = {
    courseId: number,
    startDate?: Date,
    stopDate?: Date
}