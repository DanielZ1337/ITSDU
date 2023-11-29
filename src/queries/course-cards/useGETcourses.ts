import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETstarredCourses,
    GETstarredCoursesApiUrl,
    GETstarredCoursesParams
} from "@/types/api-types/course-cards/GETstarredCourses.ts";
import {
    GETunstarredCourses,
    GETunstarredCoursesApiUrl,
    GETunstarredCoursesParams
} from "@/types/api-types/course-cards/GETunstarredCourses.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useGETcourses(isStarred: "Starred" | "Unstarred" | "All" = "Starred", params: GETstarredCoursesParams | GETunstarredCoursesParams, queryConfig?: UseQueryOptions<GETstarredCourses | GETunstarredCourses, Error, GETstarredCourses | GETunstarredCourses, string[]>) {

    return useQuery([TanstackKeys.Courses, isStarred, ...getQueryKeysFromParamsObject(params)], async () => {
        if (isStarred === "All") {
            const starredRes = await axios.get(GETstarredCoursesApiUrl({
                ...params
            }), {
                params: {
                    "access_token": await getAccessToken() || '',
                    ...params,
                }
            });

            if (starredRes.status !== 200) throw new Error(starredRes.statusText);

            const unstarredRes = await axios.get(GETunstarredCoursesApiUrl({
                ...params
            }), {
                params: {
                    "access_token": await getAccessToken() || '',
                    ...params,
                }
            });

            console.log(unstarredRes);

            if (unstarredRes.status !== 200) throw new Error(unstarredRes.statusText);

            return {
                EntityArray: [
                    ...starredRes.data.EntityArray,
                    ...unstarredRes.data.EntityArray
                ],
                Total: unstarredRes.data.Total + starredRes.data.Total,
                CurrentPageIndex: unstarredRes.data.CurrentPageIndex,
                PageSize: unstarredRes.data.PageSize
            } as GETstarredCourses & GETunstarredCourses;
        } else {
            const res = await axios.get(isStarred === "Starred" ? GETstarredCoursesApiUrl({
                ...params
            }) : GETunstarredCoursesApiUrl({
                ...params
            }), {
                params: {
                    "access_token": await getAccessToken() || '',
                    ...params,
                }
            });

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        }
    }, {
        suspense: true,
        ...queryConfig
    })
}