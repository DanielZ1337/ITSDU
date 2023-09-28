import {baseUrl} from "@/lib/utils.ts";
import React from "react";
import ReactDOM from 'react-dom/client'
import './index.css'
import {createHashRouter, defer, RouterProvider} from 'react-router-dom'
import Providers from "@/components/providers.tsx";
import axios from "axios";

// const Root = React.lazy(() => import("./routes/root"));
const ErrorPage = React.lazy(() => import("./error-page"));
const Contact = React.lazy(() => import("./routes/contact"));
const Layout = React.lazy(() => import("./components/layout"));
const Test = React.lazy(() => import("./routes/test"));
const Test1 = React.lazy(() => import("./routes/test1"));
const Me = React.lazy(() => import("./routes/me"));
const Index = React.lazy(() => import("./routes/index"));
const Course = React.lazy(() => import("./routes/course"));
// import Root from "@/routes/root.tsx";
/*import ErrorPage from "@/error-page.tsx";
import Contact from "@/routes/contact.tsx";
import Layout from "@/components/layout.tsx";
import Test from "@/routes/test.tsx";
import Test1 from "@/routes/test1.tsx";
import Me from "@/routes/me.tsx";
import Index from "@/routes/index.tsx";
import Course from "@/routes/course.tsx";*/

const router = createHashRouter([
    {
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Index/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "/course",
                element: <Course/>,
                errorElement: <ErrorPage/>,
                loader: async ({request}) => {
                    const url = new URL(request.url);
                    const courseId = url.searchParams.get("id");
                    const courseData = axios.get(`${baseUrl}restapi/personal/courses/${courseId}/bulletins/v1`, {
                        params: {
                            'access_token': window.localStorage.getItem('access_token')
                        }
                    })

                    return defer({
                        courseData
                    });
                },
            },
            {
                path: "/me",
                element: <Me/>,
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
