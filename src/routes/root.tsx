import {useEffect, useState} from "react"
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { baseUrl } from "@/lib/utils";
import {Button} from "@/components/ui/button.tsx";

export default function Root() {
    const [code, setCode] = useState<string>("")
    const [accessToken, setAccessToken] = useState<string>("")


    useEffect(() => {
        const post_code = window.localStorage.getItem("code")
        const access_token = window.localStorage.getItem("access_token")
        if (post_code) setCode(post_code)
        if (access_token) setAccessToken(access_token)
    }, [])

    /* useEffect(() => {
      fetch("http://localhost:8080/api")
        .then(res => res.json())
        .then(data => console.log(data))
    }, []) */

    useEffect(() => {
        axios.get(`${baseUrl}signalr/hubs/negotiate`).then(res => {
            const connectionToken = res.data.ConnectionToken
            console.log(connectionToken)
            axios.get(`${baseUrl}signalr/hubs/start?transport=webSockets&clientProtocol=2.1&connectionToken=${connectionToken}&connectionData=%5B%7B%22name%22%3A%22instantmessagehub%22%7D%5D&_=${new Date().getTime()}`).then(res => {
                console.log(res)
            })
        })
    }, []);

    const [showLogin, setShowLogin] = useState<boolean>(false)

    const navigate = useNavigate()
    const [count, setCount] = useState<number>(0)


    return (
        <div className="flex gap-2 flex-col">
            <div data-size="large" className="data-[size=large]:bg-pink-800">
                lmaoo
            </div>
            <Button data-lmaowtf={count} className={"data-[lmaowtf='10']:bg-pink-800"} onClick={() => setCount((prev) => prev + 1)}>count: {count}</Button>
            <button onClick={() => axios.get('http://localhost:8080/api/yes').then(res => {
                console.log(res)
            })}>
                request
            </button>
            {baseUrl}
            {showLogin && (
                <webview
                    src="https://sdu.itslearning.com/oauth2/authorize.aspx?client_id=10ae9d30-1853-48ff-81cb-47b58a325685&state=damn&response_type=code&scope=Calendar%20Children%20CkEditor%20Courses%20Hierarchies%20LearningObjectiveRepository%20LearningObjectivesReports%20LightBulletin%20Messages%20Notifications%20Person%20Planner%20Sso%20Statistics%20StudentPlan%20Supervisor%20TaskListDailyWorkflow%20Tasks%20Workload&redirect_uri=itsl-itslearning://login"></webview>
            )}
            <button onClick={() => navigate('/contacts/1')}>
                go to contacts
            </button>
            <button onClick={() => axios.get('http://localhost:8080/api/lmaoooo')}>
                make request
            </button>
            <button onClick={() => {
                window.localStorage.removeItem("code")
                window.localStorage.removeItem("access_token")
                window.localStorage.clear()
                window.location.reload()
            }} className="px-4 py-2 bg-black text-white">
                CLEAR LOCAL STORAGE
            </button>
            <form onSubmit={() => window.localStorage.setItem("code", code)}>
                <input
                    type="text"
                    placeholder="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </form>
            <form onSubmit={() => window.localStorage.setItem("access_token", accessToken)}>
                <input
                    type="text"
                    placeholder="access_token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                />
            </form>
            <button onClick={() => setShowLogin((prev) => !prev)} className="px-4 py-2 bg-black text-white">
                GET CODE
            </button>
            <button onClick={getAccessToken} className="px-4 py-2 bg-black text-white">
                GET ACCESS_TOKEN
            </button>
            <button onClick={sendRequest} className="px-4 py-2 bg-black text-white">
                SEND REQUEST
            </button>
            <Button onClick={refreshAccessToken}>REFRESH ACCESS_TOKEN</Button>
            <div className="flex flex-col gap-2">
                <h1>CODE: {code}</h1>
                <h1>ACCESS_TOKEN: {accessToken}</h1>
            </div>
            <div className="h-screen"/>
        </div>
    )
}

async function refreshAccessToken() {
    const oauthUrl = `${baseUrl}restapi/oauth2/token`
    const qs = await import ('qs').then(m => m.default)
    const body = qs.stringify({
        "grant_type": "refresh_token",
        "refresh_token": window.localStorage.getItem("refresh_token"),
        "client_id": "10ae9d30-1853-48ff-81cb-47b58a325685",
    })

    axios.post(oauthUrl, body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(res => {
        const {access_token, refresh_token} = res.data
        window.localStorage.setItem("access_token", access_token)
        window.localStorage.setItem("refresh_token", refresh_token)
        window.location.reload()
    }).catch(err => console.log(err))
}

async function getAccessToken() {
    const oauthUrl = `${baseUrl}restapi/oauth2/token`
    const qs = await import ('qs').then(m => m.default)
    const body = qs.stringify({
        "grant_type": "authorization_code",
        "code": window.localStorage.getItem("code"),
        "client_id": "10ae9d30-1853-48ff-81cb-47b58a325685",
    })

    axios.post(oauthUrl, body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(res => {
        window.localStorage.setItem("access_token", res.data.access_token)
        window.location.reload()
    }).catch(err => console.log(err))
}

function sendRequest() {
    axios.get(`${baseUrl}restapi/personal/person/v1`, {
        params: {
            "access_token": window.localStorage.getItem("access_token")
        }
    }).then(res => {
        console.log(res)
    })
}