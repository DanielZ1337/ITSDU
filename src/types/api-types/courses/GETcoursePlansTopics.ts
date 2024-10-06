import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";

const GETcoursePlansTopicsApiEndpoint =
	"restapi/personal/course/{courseId}/plans/topics/v1?PageIndex={PageIndex}&PageSize={PageSize}&ChildId={ChildId}";

export const GETcoursePlansTopicsApiUrl = (
	params: GETcoursePlansTopicsParams,
) => {
	return apiUrl(GETcoursePlansTopicsApiEndpoint, params);
};

export type GETcoursePlansTopics = Topic[];

export type GETcoursePlansTopicsParams = {
	courseId: number;
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
	ChildId?: number;
};

/**
 * This should be changed. But since their API isn't public, I can't know what the actual response is.
 */

interface Topic {
	name: string;
	description: string;
	color: string;
	borderColor: any;
	id: number;
	url: string;
	planCount: number;
	start: string;
	stop: string;
	customFields: any;
}
