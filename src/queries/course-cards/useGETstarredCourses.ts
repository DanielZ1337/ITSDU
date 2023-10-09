import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETstarredCourses,
    GETstarredCoursesApiUrl,
    GETstarredCoursesParams
} from "@/types/api-types/course-cards/GETstarredCourses.ts";

export default function useGETstarredCourses(params: GETstarredCoursesParams, queryConfig?: UseQueryOptions<GETstarredCourses, Error, GETstarredCourses, string[]>) {

    return useQuery(['starredCourses', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETstarredCoursesApiUrl({
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
        suspense: true,
        ...queryConfig
    })
}