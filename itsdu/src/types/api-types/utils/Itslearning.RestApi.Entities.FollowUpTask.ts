import { ItslearningRestApiEntitiesElementType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementType.ts";

export type ItslearningRestApiEntitiesFollowUpTask = {
	Title: string;
	LocationTitle: string;
	NumberOfNewOrUpdatedSubmissions: number;
	NumberOfSubmissionsToAssess: number;
	TotalNumberOfEvaluateSubmissions: number;
	Url: string;
	ContentUrl: string;
	IconUrl: string;
	ElementId: number;
	ElementType: ItslearningRestApiEntitiesElementType;
	LearningToolId: number;
};
