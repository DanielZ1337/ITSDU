import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETunstarredCourses,
    GETunstarredCoursesApiUrl,
    GETunstarredCoursesParams
} from "@/api-types/course-cards/GETunstarredCourses.ts";

export default function useGETunstarredCourses(params: GETunstarredCoursesParams, queryConfig?: UseQueryOptions<GETunstarredCourses, Error, GETunstarredCourses, string[]>) {

    return useQuery(['unstarredCourses', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETunstarredCoursesApiUrl({
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