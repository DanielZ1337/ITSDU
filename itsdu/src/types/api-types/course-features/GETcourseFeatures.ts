import { apiUrl } from "@/lib/utils.ts";

const GETcourseFeaturesApiEndpoint =
	"restapi/personal/courses/{courseId}/features/v2";

export const GETcourseFeaturesApiUrl = (params: GETcourseFeaturesParams) => {
	return apiUrl(GETcourseFeaturesApiEndpoint, {
		courseId: params.courseId,
	});
};

export type GETcourseFeatures = {
	Name: string;
	Url: string;
	Features: {
		Name: string;
		Url: string;
		Features: any;
	}[];
};

export type GETcourseFeaturesParams = {
	courseId: number;
};
