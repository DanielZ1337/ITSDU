import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {GETcourseBasic, GETcourseBasicApiUrl, GETcourseBasicParams} from "@/types/api-types/courses/GETcourseBasic.ts";

export default function useGETcourseBasic(params: GETcourseBasicParams, queryConfig?: UseQueryOptions<GETcourseBasic, Error, GETcourseBasic, string[]>) {

    return useQuery(['courseBasic', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseBasicApiUrl({
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