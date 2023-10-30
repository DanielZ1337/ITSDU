import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    POSTcourseCardSettings,
    POSTcourseCardSettingsApiUrl,
    POSTcourseCardSettingsBody,
    POSTcourseCardSettingsParams
} from "@/types/api-types/course-cards/POSTcourseCardSettings.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function usePOSTcourseCardSettings(params: POSTcourseCardSettingsParams, queryConfig?: UseMutationOptions<POSTcourseCardSettings, Error, POSTcourseCardSettingsBody, string[]>) {

    return useMutation([TanstackKeys.CourseCardSettings, ...getQueryKeysFromParamsObject(params)], async (body) => {
        const res = await axios.post(POSTcourseCardSettingsApiUrl({
            ...params
        }), body, {
            params: {
                "access_token": await getAccessToken() || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data
    }, {
        ...queryConfig
    })
}