import {apiUrl} from "@/lib/utils.ts";
import {
    ItslearningRestApiEntitiesAssessmentRecordAssessmentRecordItem
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.AssessmentRecord.AssessmentRecordItem.ts";
import {
    ItslearningRestApiEntitiesAssessmentRecordAssessmentScale
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.AssessmentRecord.AssessmentScale.ts";

const GETcourseGradesApiEndpoint = 'restapi/personal/course/{courseId}/assessmentrecord/assessmentrecordelements/v1?termId={termId}'

export const GETcourseGradesApiUrl = (params: GETcourseGradesParams) => {
    return apiUrl(GETcourseGradesApiEndpoint, {
        courseId: params.courseId,
        termId: params.termId
    })
}

export type GETcourseGrades = {
    AssessmentRecordItems: ItslearningRestApiEntitiesAssessmentRecordAssessmentRecordItem[],
    AssessmentRecordItemsCount: number,
    FinalAssessmentRecordItems: ItslearningRestApiEntitiesAssessmentRecordAssessmentRecordItem[],
    AssessmentScales: ItslearningRestApiEntitiesAssessmentRecordAssessmentScale[],
    IsScoreInUse: boolean,
}

export type GETcourseGradesParams = {
    courseId: number
    termId?: number
}