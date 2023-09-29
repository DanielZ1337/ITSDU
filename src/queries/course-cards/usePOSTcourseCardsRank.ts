import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {POSTcourseCardsRankApiUrl, POSTcourseCardsRankBody} from "@/api-types/course-cards/POSTcourseCardsRank.ts";

export default function usePOSTcourseCardsRank(body: POSTcourseCardsRankBody, queryConfig?: UseMutationOptions<undefined, Error, undefined, string[]>) {

    return useMutation(['courseCardsRank'], async () => {
        const res = await axios.post(POSTcourseCardsRankApiUrl, body, {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data
    }, {
        ...queryConfig
    })
}