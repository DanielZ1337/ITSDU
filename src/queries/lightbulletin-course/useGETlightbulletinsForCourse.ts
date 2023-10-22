import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETlightbulletinsForCourse,
    GETlightbulletinsForCourseApiUrl,
    GETlightbulletinsForCourseParams
} from "@/types/api-types/lightbulletin-course/GETlightbulletinsForCourse.ts";

export default function useGETlightbulletinsForCourse(params: GETlightbulletinsForCourseParams, queryConfig?: UseQueryOptions<GETlightbulletinsForCourse, Error, GETlightbulletinsForCourse, string[]>) {

    return useQuery({
        queryKey: ['lightbulletinsForCourse', ...getQueryKeysFromParamsObject(params)], queryFn: async () => {
            const res = await axios.get(GETlightbulletinsForCourseApiUrl({
                ...params
            }), {
                params: {
                    "access_token": localStorage.getItem('access_token') || '',
                    ...params,
                }
            });

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        },
        ...queryConfig
    })
}