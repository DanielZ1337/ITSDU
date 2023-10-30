import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {TanstackKeys} from '../../types/tanstack-keys';
import {
    GETlightbulletinAllComments,
    GETlightbulletinAllCommentsApiUrl,
    GETlightbulletinAllCommentsParams
} from "@/types/api-types/lightbulletin/GETlightbulletinAllComments.ts";

export default function useGETlightbulletinAllComments(params: GETlightbulletinAllCommentsParams, queryConfig?: UseQueryOptions<GETlightbulletinAllComments, Error, GETlightbulletinAllComments, string[]>) {

    return useQuery([TanstackKeys.LightbulletinAllComments, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETlightbulletinAllCommentsApiUrl({
            ...params
        }), {
            params: {
                "access_token": await getAccessToken() || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}