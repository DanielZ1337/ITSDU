import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import {
    GETpersonsRelations,
    GETpersonsRelationsApiUrl,
    GETpersonsRelationsParams
} from "@/types/api-types/person/GETpersonsRelations.ts";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";

export default function useGETpersonsRelations(params: GETpersonsRelationsParams, queryConfig?: UseQueryOptions<GETpersonsRelations, Error, GETpersonsRelations, string[]>) {

    return useQuery({
        queryKey: ["personsRelations", ...getQueryKeysFromParamsObject(params)],
        queryFn: async () => {
            const res = await axios.get(GETpersonsRelationsApiUrl({
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