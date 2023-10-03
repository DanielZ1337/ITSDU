import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETinstantMessagesv2,
    GETinstantMessagesv2ApiUrl,
    GETinstantMessagesv2Params
} from "@/api-types/messages/GETinstantMessagesv2.ts";

export default function useGETinstantMessagesv2(params: GETinstantMessagesv2Params, queryConfig?: UseQueryOptions<GETinstantMessagesv2, Error, GETinstantMessagesv2, string[]>) {

    return useQuery(['messagesv2', ...getQueryKeysFromParamsObject(params)], async () => {
        console.log('useGETmessages')
        const res = await axios.get(GETinstantMessagesv2ApiUrl(params), {
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