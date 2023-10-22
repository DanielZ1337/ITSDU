import { GETcurrentUser, GETcurrentUserApiUrl } from "@/types/api-types/person/GETcurrentUser.ts";
import axios from "axios";
import { atom, useAtom } from "jotai";

export const userAtom = atom<GETcurrentUser | null>(async () => {
    const res = await axios.get<GETcurrentUser>(GETcurrentUserApiUrl(), {
        params: {
            "access_token": localStorage.getItem('access_token') || '',
        },
    })

    if (res.status !== 200) throw new Error(res.statusText);

    return res.data;
})


export const useUser = () => {
    const [user] = useAtom(userAtom);

    return user;
}


/* export const [userAtom] = atomsWithQuery<GETcurrentUser | null>(() => ({
    queryKey: ['currentUser', window.localStorage.getItem('access_token') || ''],
    queryFn: async () => {
        const res = await axios.get(GETcurrentUserApiUrl(), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    },
})) */