import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {GETperson, GETpersonApiUrl, GETpersonParams} from "@/types/api-types/person/GETperson.ts";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";

export default function useGETperson(params: GETpersonParams, queryConfig?: UseQueryOptions<GETpersonParams, Error, GETperson, string[]>) {

    return useQuery(['person', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETpersonApiUrl(params), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}