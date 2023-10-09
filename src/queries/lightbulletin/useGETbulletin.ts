import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {GETbulletin, GETbulletinApiUrl, GETbulletinParams} from "@/types/api-types/lightbulletin/GETbulletin.ts";

export default function useGETbulletin(params: GETbulletinParams, queryConfig?: UseQueryOptions<GETbulletin, Error, GETbulletin, string[]>) {

    return useQuery(['bulletin', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETbulletinApiUrl({
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