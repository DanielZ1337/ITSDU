import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {GETcurrentUser, GETcurrentUserApiUrl} from "@/api-types/person/GETcurrentUser.ts";

export default function useGETcurrentUser(queryConfig?: UseQueryOptions<GETcurrentUser, Error, GETcurrentUser, string[]>) {

    return useQuery(['currentUser', window.localStorage.getItem('access_token') || ''], async () => {
        const res = await axios.get(GETcurrentUserApiUrl(), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}