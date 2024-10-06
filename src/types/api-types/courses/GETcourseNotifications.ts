import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils";
import { ItslearningRestApiEntitiesStreamItemV2 } from "../utils/Itslearning.RestApi.Entities.StreamItemV2";

const GETcourseNotificationsApiEndpoint =
  "restapi/personal/courses/{courseId}/stream/v1?showLightBulletins={showLightBulletins}&UseNewerThan={UseNewerThan}&FromId={FromId}&PageIndex={PageIndex}&PageSize={PageSize}";

export const GETcourseNotificationsApiUrl = (params: GETcourseNotificationsParams) =>
  apiUrl(GETcourseNotificationsApiEndpoint, params);

export type GETcourseNotificationsParams = {
  courseId: number;
  showLightBulletins?: boolean;
  FromId?: number;
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
  UseNewerThan?: boolean;
};

export type GETcourseNotifications = {
  EntityArray: ItslearningRestApiEntitiesStreamItemV2[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};
