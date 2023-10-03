import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETinstantMessagesv3,
    GETinstantMessagesv3ApiUrl,
    GETinstantMessagesv3Params
} from "@/api-types/messages/GETinstantMessagesv3.ts";

export default function useGETinstantMessagesv3(params: GETinstantMessagesv3Params, queryConfig?: UseQueryOptions<GETinstantMessagesv3, Error, GETinstantMessagesv3, string[]>) {

    return useQuery(['messagesv3', ...getQueryKeysFromParamsObject(params)], async () => {
        console.log('useGETmessages')
        const res = await axios.get(GETinstantMessagesv3ApiUrl(params), {
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