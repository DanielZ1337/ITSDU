import {ItslearningRestApiEntitiesCourseCard} from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCard.ts";
import {apiUrl} from "@/lib/utils.ts";
import {GETstarredCoursesParams} from "@/types/api-types/course-cards/GETstarredCourses.ts";
import {CourseCardsSortByTypes} from "@/types/api-types/extra/course-cards-sort-by-types.ts";

const GETunstarredCoursesApiEndpoint = "restapi/personal/courses/cards/unstarred/v1?PageIndex={PageIndex}&PageSize={PageSize}&sortBy={sortBy}&searchText={searchText}&isShowMore={isShowMore}"

export const GETunstarredCoursesApiUrl = (params: GETstarredCoursesParams) => {
    return apiUrl(GETunstarredCoursesApiEndpoint, {
        PageIndex: params.PageIndex,
        PageSize: params.PageSize,
        sortBy: params.sortBy,
        searchText: params.searchText,
        isShowMore: params.isShowMore
    })
}

export type GETunstarredCourses = {
    EntityArray: ItslearningRestApiEntitiesCourseCard[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETunstarredCoursesParams = {
    PageIndex: number
    PageSize: number
    sortBy?: CourseCardsSortByTypes
    searchText: string
    isShowMore?: boolean
}