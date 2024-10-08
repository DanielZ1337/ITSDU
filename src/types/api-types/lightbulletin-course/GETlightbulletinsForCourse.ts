import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinTimePeriod } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinTimePeriod.ts";
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinV2.ts";

const GETlightbulletinsForCourseApiEndpoint =
	" restapi/personal/courses/{courseId}/bulletins/v1?timePeriod={timePeriod}&UseNewerThan={UseNewerThan}&FromId={FromId}&PageIndex={PageIndex}&PageSize={PageSize}";

export const GETlightbulletinsForCourseApiUrl = (
	params: GETlightbulletinsForCourseParams,
) => {
	return apiUrl(GETlightbulletinsForCourseApiEndpoint, {
		courseId: params.courseId,
		timePeriod: params.timePeriod,
		UseNewerThan: params.UseNewerThan,
		FromId: params.FromId,
		PageIndex: params.PageIndex,
		PageSize: params.PageSize,
	});
};

export type GETlightbulletinsForCourse = {
	EntityArray: ItslearningRestApiEntitiesLightBulletinsLightBulletinV2[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};

export type GETlightbulletinsForCourseParams = {
	courseId: number;
	timePeriod?: ItslearningRestApiEntitiesLightBulletinsLightBulletinTimePeriod;
	UseNewerThan?: boolean;
	FromId?: number;
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};
