import {QueryOptions, useQuery} from '@tanstack/react-query';
import {baseUrl} from "@/lib/utils.ts";
import axios from "axios";
import {StarredCourses} from "@/api-types/GETstarredCourses.ts";

type StarredCourseCards = {
    pageIndex?: string,
    pageSize?: string,
    sortBy?: string,
    searchText?: string,
    isShowMore?: string,
}

const url = ({pageIndex, pageSize, sortBy, searchText, isShowMore}: StarredCourseCards) => `${baseUrl}restapi/personal/courses/cards/starred/v1?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=${sortBy}&SearchText=${searchText}&IsShowMore=${isShowMore}`

export function useStarredCourseCards({pageIndex, pageSize, sortBy, searchText, isShowMore}: StarredCourseCards, options?: QueryOptions) {
    return useQuery(['starredCourseCards'], async () => {
        const res = await axios.get(url({pageIndex, pageSize, sortBy, searchText, isShowMore}), {
            params: {
                "access_token": localStorage.getItem("access_token") || "",
            }
        })
        const {data} = res
        return data as StarredCourses
    }, {
        enabled: false,
        ...options
    })
}