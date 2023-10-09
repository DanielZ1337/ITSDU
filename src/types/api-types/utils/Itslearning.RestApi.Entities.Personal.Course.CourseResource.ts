import {
    ItslearningRestApiEntitiesElementType
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementType.ts";

export type ItslearningRestApiEntitiesPersonalCourseCourseResource = {
    Title: string
    ElementId: number
    ElementType: ItslearningRestApiEntitiesElementType
    CourseId: number
    Url: string
    ContentUrl: string
    IconUrl: string
    Active: boolean
    LearningToolId: number
    AddElementUrl: string
    Homework: boolean
    Path: string
    LearningObjectId: number
    LearningObjectInstanceId: number
}