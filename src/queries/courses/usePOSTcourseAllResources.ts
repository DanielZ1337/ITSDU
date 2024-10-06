import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	POSTcourseAllResources,
	POSTcourseAllResourcesApiUrl,
	POSTcourseAllResourcesBody,
	POSTcourseAllResourcesParams,
} from "@/types/api-types/courses/POSTcourseAllResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePOSTcourseAllResources(
	params: POSTcourseAllResourcesParams,
	body: POSTcourseAllResourcesBody,
	queryConfig?: UseMutationOptions<
		POSTcourseAllResources,
		Error,
		POSTcourseAllResources,
		string[]
	>,
) {
	return useMutation(
		[TanstackKeys.CourseAllResources, ...getQueryKeysFromParamsObject(params)],
		async () => {
			const res = await axios.post(
				POSTcourseAllResourcesApiUrl({
					...params,
				}),
				body,
				{
					params: {
						access_token: (await getAccessToken()) || "",
						...params,
					},
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		{
			...queryConfig,
		},
	);
}
