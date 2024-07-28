import { apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesPersonalCourseCourseResourceWithRole } from "../utils/Itslearning.RestApi.Entities.Personal.Course.CourseResourceWithRole";

const GETcourseResourceInfoApiEndpoint =
	"restapi/personal/courses/resources/{resourceId}/v1";

export const GETcourseResourceInfoApiUrl = (
	params: GETcourseResourceInfoParams,
) => {
	return apiUrl(GETcourseResourceInfoApiEndpoint, params);
};

export type GETcourseResourceInfo =
	ItslearningRestApiEntitiesPersonalCourseCourseResourceWithRole;

export type GETcourseResourceInfoParams = {
	resourceId: number;
};
