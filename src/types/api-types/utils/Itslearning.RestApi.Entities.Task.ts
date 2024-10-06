import { ItslearningRestApiEntitiesElementType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementType.ts";
import { ItslearningRestApiEntitiesTaskStatus } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatus.ts";
import { ItsolutionsItslUtilsConstantsLocationType } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.LocationType.ts";

export type ItslearningRestApiEntitiesTask = {
  Description: string;
  LocationTitle: string;
  LocationFriendlyName: string;
  TaskId: number;
  Title: string;
  Status: ItslearningRestApiEntitiesTaskStatus;
  Deadline: Date;
  Url: string;
  ContentUrl: string;
  IconUrl: string;
  ElementId: number;
  ElementType: ItslearningRestApiEntitiesElementType;
  LearningToolId: number;
  Homework: boolean;
  LocationType: ItsolutionsItslUtilsConstantsLocationType;
  LocationId: number;
};
