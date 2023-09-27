import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {baseUrl} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button";

export default function Me() {
    console.log(window.localStorage.getItem("access_token"))
    const {data, isLoading} = useQuery(['me'], async () => {
        const res = await axios.get(`${baseUrl}restapi/personal/person/v1`, {
            params: {
                "access_token": window.localStorage.getItem("access_token")
            }
        }).then(res => {
            console.log(res)
            return res
        })
        return res.data
    })

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            <h1>Me</h1>
            <Button onClick={() => {
                window.notification.send('yeet', 'This is a test notification')
            }}>Send notifcation</Button>
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
                    {JSON.stringify(data)}
                    {/* Add more important fields as needed */}
                </div>
            </div>
        </div>
    )
}