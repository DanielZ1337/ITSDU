import {
    ItslearningPlatformRestApiSdkCommonEntitiesWhenToShowResult
} from "@/types/api-types/utils/Itslearning.Platform.RestApi.Sdk.Common.Entities.WhenToShowResult.ts";

export type ItslearningRestApiEntitiesAssessmentRecordAssessmentRecordItem = {
    GradeBookItemId: number
    Title: string
    Weight: number
    WhenToShowResult: ItslearningPlatformRestApiSdkCommonEntitiesWhenToShowResult
    AssessmentId: number
    IsFinal: boolean
    IsPassedDeadline: boolean
    TermId: number
    CategoryId: number
    ElementType: string
    ElementId: number
    MaxScore: number
    IsActive: boolean
    UseScore: boolean
    IsAssessmentVisible: boolean
    IsCustomAssessmentVisible: boolean
    IsReadOnly: boolean
    LearningToolId: number
    Deadline: Date
    FormattedDeadline: string
    IsLearningPathSubElement: boolean
}