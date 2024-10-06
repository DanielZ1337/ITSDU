import { apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesCourseCardSettings } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCardSettings.ts";

const POSTcourseCardSettingsApiEndpoint =
  "restapi/personal/courses/cards/{courseId}/settings/v1";

export const POSTcourseCardSettingsApiUrl = (params: POSTcourseCardSettingsParams) => {
  return apiUrl(POSTcourseCardSettingsApiEndpoint, {
    courseId: params.courseId,
  });
};

export type POSTcourseCardSettings = ItslearningRestApiEntitiesCourseCardSettings;

export type POSTcourseCardSettingsParams = {
  courseId: number;
};

export type POSTcourseCardSettingsBody = ItslearningRestApiEntitiesCourseCardSettings;
