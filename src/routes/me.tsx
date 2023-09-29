import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {baseUrl} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Label} from "@radix-ui/react-dropdown-menu";

export default function Me() {
    const [requestUrl, setRequestUrl] = useState<string>()
    console.log(window.localStorage.getItem("access_token"))
    const {data} = useQuery(['me'], async () => {
        const res = await axios.get(`${baseUrl}restapi/personal/person/v1`, {
            params: {
                "access_token": window.localStorage.getItem("access_token")
            }
        }).then(res => {
            console.log(res)
            return res
        })
        return res.data
    }, {
        suspense: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        refetchInterval: 1000 * 60 * 60,
        refetchIntervalInBackground: true,
    })

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault()

                axios.get(`${baseUrl}${requestUrl}`, {
                    params: {
                        "access_token": window.localStorage.getItem("access_token")
                    }
                }).then(res => {
                    console.log(res)
                })
            }}>
                <Label>Make a test request to sdu.itslearning.com</Label>
                <Input type="text" value={requestUrl} onChange={(e) => setRequestUrl(e.target.value)}/>
            </form>
            <div className="border rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Name:</span>
                        <span>{data.FullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Language:</span>
                        <span>{data.Language}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Time Zone:</span>
                        <span>{data.TimeZoneId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Can Access Message System:</span>
                        <span>{data.CanAccessMessageSystem ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Can Access Calendar:</span>
                        <span>{data.CanAccessCalendar ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Can Access Personal Settings:</span>
                        <span>{data.CanAccessPersonalSettings ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                {JSON.stringify(data)}
            </div>
        </div>
    )
}