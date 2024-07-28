import {ItslearningRestApiEntitiesElementType} from "./Itslearning.RestApi.Entities.ElementType"

export type ItslearningRestApiEntitiesPersonalCourseCourseResourceWithRole = {
    CourseCode: string,
    CourseTitle: string,
    ContextRole: any,
    Title: string,
    ElementId: number,
    ElementType: ItslearningRestApiEntitiesElementType
    CourseId: number,
    Url: string,
    ContentUrl: string,
    IconUrl: string,
    Active: boolean,
    LearningToolId: number,
    AddElementUrl: string,
    Homework: boolean,
    Path: string,
    LearningObjectId: number,
    LearningObjectInstanceId: number,
}