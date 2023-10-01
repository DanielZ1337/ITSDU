import {apiUrl, baseUrl} from "@/lib/utils.ts";
import ReactDOM from 'react-dom/client'
import './index.css'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import Providers from "@/components/providers.tsx";
import axios from "axios";

// const Root = React.lazy(() => import("./routes/root"));
/*
const ErrorPage = React.lazy(() => import("./error-page"));
const Contact = React.lazy(() => import("./routes/contact"));
const Layout = React.lazy(() => import("./components/layout"));
const Test = React.lazy(() => import("./routes/test"));
const Test1 = React.lazy(() => import("./routes/test1"));
const Profile = React.lazy(() => import("./routes/profile.tsx"));
const Index = React.lazy(() => import("./routes/index"));
const Course = React.lazy(() => import("./routes/course"));
const Querytesting = React.lazy(() => import("./routes/querytesting"));
*/

import ErrorPage from "./error-page.tsx"
import Contact from "./routes/contact.tsx"
import Layout from "./components/layout.tsx"
import Test from "./routes/test.tsx"
import Test1 from "./routes/test1.tsx"
import Profile from "./routes/profile.tsx"
import Index from "./routes/index.tsx"
import Course from "./routes/course.tsx"
import Querytesting from "./routes/querytesting.tsx"

const router = createHashRouter([
    {
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Index/>,
                errorElement: <ErrorPage/>,
                index: true,
            },
            {
                path: "/course",
                element: <Course/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/querytesting",
                element: <Querytesting/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/profile",
                element: <Profile/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/contacts/:id",
                element: <Contact/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/test",
                element: <Test/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/test1",
                element: <Test1/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "*",
                element: <ErrorPage/>,
                errorElement: <ErrorPage/>,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Providers>
        {/*<React.StrictMode>*/}
        <RouterProvider fallbackElement={<ErrorPage/>} future={{
            v7_startTransition: true,
        }} router={router}/>
        {/*</React.StrictMode>*/}
    </Providers>
)

/*setInterval(async () => {
    const access_token = window.localStorage.getItem('access_token')

    try {
        axios.post(apiUrl('restApi/keepalive/online/v1'), {
            "access_token": access_token
        }, {
            params: {
                "access_token": access_token
            }
        })
    } catch (e) {
        console.log(e)
    }
}, 1000 * 60 * 60) // 1 hour*/

setInterval(async () => {
    // refresh token
    const refresh_token = window.localStorage.getItem('refresh_token')
    if (refresh_token) {
        try {
            // @ts-ignore
            const {data} = await axios.post(apiUrl('restapi/oauth2/token'), {
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": '10ae9d30-1853-48ff-81cb-47b58a325685',
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })

            window.localStorage.setItem('access_token', data.access_token)
            window.localStorage.setItem('refresh_token', data.refresh_token)
        } catch (e) {
            console.log(e)
        }
    }
}, 1000 * 60 * 30) // 30 minutes

setInterval(() => {
    const access_token = window.localStorage.getItem('access_token')
    axios.get(`${baseUrl}restapi/personal/instantmessages/messagethreads/unread/count/v1`, {
        params: {
            'access_token': access_token
        }
    }).then((res: { data: number; }) => {
        console.log(res.data)
        const count = res.data
        if (res.data > 0) {
            new Notification('itslearning', {
                body: `You have ${count} unread messages`,
                icon: 'itsl-itslearning-file://icon.ico'
            })
        }
    }).catch((err: any) => {
        console.log(err)
    })
}, 1000 * 60) // 1 minute

// Remove Preload scripts loading
postMessage({payload: 'removeLoading'}, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
})
