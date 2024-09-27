import {apiUrl} from "@/lib/utils.ts";

const POSTcourseCardsRankApiEndpoint = "restapi/personal/courses/cards/rank/v1"

export const POSTcourseCardsRankApiUrl = apiUrl(POSTcourseCardsRankApiEndpoint)

export type POSTcourseCardsRankBody = {
    CourseId: number
    Rank: number
}[]


