import axios from "axios";
import {baseUrl} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Label} from "@radix-ui/react-dropdown-menu";
import useGETcurrentUser from "@/queries/person/useGETcurrentUser.ts";
import {Button} from "@/components/ui/button.tsx";

export default function Profile() {
    const [requestUrl, setRequestUrl] = useState<string>()
    const {data} = useGETcurrentUser({
        suspense: true,
    })

    return (
        <div>
            <Button onClick={() => {
                window.notification.send("Test Notification", "This is a test notification")
            }}>Test Notification</Button>
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
                        <span>{data?.FullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Language:</span>
                        <span>{data?.Language}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Time Zone:</span>
                        <span>{data?.TimeZoneId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Can Access Message System:</span>
                        <span>{data?.CanAccessMessageSystem ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Can Access Calendar:</span>
                        <span>{data?.CanAccessCalendar ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Can Access Personal Settings:</span>
                        <span>{data?.CanAccessPersonalSettings ? 'Yes' : 'No'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}