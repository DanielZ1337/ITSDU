import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseParticipants,
    GETcourseParticipantsApiUrl,
    GETcourseParticipantsParams
} from "@/types/api-types/courses/GETcourseParticipants.ts";

export default function useGETcourseParticipants(params: GETcourseParticipantsParams, queryConfig?: UseQueryOptions<GETcourseParticipants, Error, GETcourseParticipants, string[]>) {

    return useQuery(['courseParticipants', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseParticipantsApiUrl({
            ...params
        }), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}