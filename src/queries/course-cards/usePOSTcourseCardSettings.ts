import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    POSTcourseCardSettings,
    POSTcourseCardSettingsApiUrl,
    POSTcourseCardSettingsBody,
    POSTcourseCardSettingsParams
} from "@/types/api-types/course-cards/POSTcourseCardSettings.ts";

export default function usePOSTcourseCardSettings(params: POSTcourseCardSettingsParams, queryConfig?: UseMutationOptions<POSTcourseCardSettings, Error, POSTcourseCardSettingsBody, string[]>) {

    return useMutation(['courseCardSettings', ...getQueryKeysFromParamsObject(params)], async (body) => {
        const res = await axios.post(POSTcourseCardSettingsApiUrl({
            ...params
        }), body, {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data
    }, {
        ...queryConfig
    })
}