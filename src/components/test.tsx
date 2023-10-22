import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {baseUrl} from "@/lib/utils.ts";

export default function TestSuspense() {

    const {data} = useQuery(['yeet'], async () => {
        const res = await axios.get(`${baseUrl}restapi/personal/person/v1`, {
            params: {
                "access_token": window.localStorage.getItem("access_token")
            }
        }).then((res: any) => {
            console.log(res)
            return res
        })
        return res.data
    }, {
        suspense: true,
    })

    return (
        <div>
            <h1>Test Suspense</h1>
            <p>{data.FullName}</p>
        </div>
    )
}