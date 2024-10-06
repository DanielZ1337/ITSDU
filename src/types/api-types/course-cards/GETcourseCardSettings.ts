import { apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesCourseCardSettings } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCardSettings.ts";

const GETcourseCardSettingsApiEndpoint =
	"restapi/personal/courses/cards/{courseId}/settings/v1";

export const GETcourseCardSettingsApiUrl = (
	params: GETcourseCardSettingsParams,
) => {
	return apiUrl(GETcourseCardSettingsApiEndpoint, {
		courseId: params.courseId,
	});
};

export type GETcourseCardSettings =
	ItslearningRestApiEntitiesCourseCardSettings;

export type GETcourseCardSettingsParams = {
	courseId: number;
};
