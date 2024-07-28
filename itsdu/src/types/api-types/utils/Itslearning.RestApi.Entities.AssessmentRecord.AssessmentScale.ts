import { ItslearningRestApiEntitiesAssessmentRecordAssessmentScaleValue } from "@/types/api-types/utils/Itslearning.RestApi.Entities.AssessmentRecord.AssessmentScaleValue.ts";

export type ItslearningRestApiEntitiesAssessmentRecordAssessmentScale = {
	AssessmentScaleId: number;
	Title: string;
	AssessmentTotals: number;
	Values: ItslearningRestApiEntitiesAssessmentRecordAssessmentScaleValue[];
};
