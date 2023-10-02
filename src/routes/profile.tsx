import axios from "axios";
import {baseUrl} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Label} from "@radix-ui/react-dropdown-menu";
import useGETcurrentUser from "@/queries/person/useGETcurrentUser.ts";
import {Button} from "@/components/ui/button.tsx";
import {GETssoUrlApiUrl} from "@/api-types/sso/GETssoUrl.ts";

export default function Profile() {
    const [requestUrl, setRequestUrl] = useState<string>()
    const [ssoRequestUrl, setSsoRequestUrl] = useState<string>()
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
            <form onSubmit={(event) => {
                event.preventDefault()
                if (!ssoRequestUrl) return

                axios.get(GETssoUrlApiUrl({
                    url: ssoRequestUrl
                }), {
                    params: {
                        "access_token": window.localStorage.getItem("access_token")
                    },
                }).then(res => {
                    //https://sdu.itslearning.com/Oauth2/MobileAppLoginSso.aspx?Native=true&UserId=467633&Expired=2023-10-01T20%3a25%3a38&ReturnUrl=%2fLearningToolElement%2fViewLearningToolElement.aspx%3fLearningToolElementId%3d1220029&Signature=9a2db544de1ede5b169233c1f10841b7
                    console.log(res)
                    const url = res.data.Url.replace('https://sdu.itslearning.com/', '')
                    console.log(url)
                    // console.log(apiUrl(res.data.Url.replace('https://sdu.itslearning.com', '')))
                    axios.get(`${baseUrl}${url}`, {
                        headers: {
                            Accept: 'text/html'
                        },
                        responseType: 'text'
                    }).then(res => {
                        console.log(res)
                    })
                }).catch(err => {
                    console.log(err)
                })
            }}>
                <Label>Make an SSO request to sdu.itslearning.com</Label>
                <Input type="text" value={ssoRequestUrl} onChange={(e) => setSsoRequestUrl(e.target.value)}/>
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