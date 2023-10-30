import {getAccessToken} from "@/lib/utils";
import {GETcurrentUser, GETcurrentUserApiUrl} from "@/types/api-types/person/GETcurrentUser.ts";
import axios from "axios";
import {atom} from "jotai";

//@ts-ignore
export const userAtom = atom<GETcurrentUser | null>(async () => {
    const res = await axios.get<GETcurrentUser>(GETcurrentUserApiUrl(), {
        params: {
            "access_token": await getAccessToken() || '',
        },
    })

    if (res.status !== 200) throw new Error(res.statusText);

    return res.data;
})

/* export const [userAtom] = atomsWithQuery<GETcurrentUser | null>(() => ({
    queryKey: ['currentUser', window.getAccessToken || ''],
    queryFn: async () => {
        const res = await axios.get(GETcurrentUserApiUrl(), {
            params: {
                "access_token": await getAccessToken() || '',
            },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    },
})) */