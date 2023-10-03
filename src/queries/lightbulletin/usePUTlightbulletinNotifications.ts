import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    PUTlightbulletinNotifications,
    PUTlightbulletinNotificationsApiUrl,
    PUTlightbulletinNotificationsBody,
    PUTlightbulletinNotificationsParams
} from "@/api-types/lightbulletin/PUTlightbulletinNotifications.ts";

export default function usePUTlightbulletinNotifications(params: PUTlightbulletinNotificationsParams, body: PUTlightbulletinNotificationsBody, queryConfig?: UseMutationOptions<PUTlightbulletinNotifications, Error, PUTlightbulletinNotificationsBody, string[]>) {

    return useMutation(['lightbulletinNotifications', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.put(PUTlightbulletinNotificationsApiUrl({
            ...params
        }), body, {
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