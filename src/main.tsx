import {baseUrl, cn} from "@/lib/utils.ts";
import React, {Suspense} from "react";
import ReactDOM from 'react-dom/client'
import './index.css'
import {createHashRouter, defer, RouterProvider} from 'react-router-dom'
import Providers from "@/components/providers.tsx";
import axios from "axios";
import {StarIcon} from "lucide-react";

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
                element: <Suspense fallback={<div className={"flex flex-col"}>
                    <div className={"flex flex-row flex-wrap gap-4 items-center justify-center"}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((card: any) => (
                                <div key={card} className={"flex flex-col w-72 h-36 bg-white rounded-md shadow-md"}>
                                    <div className={"flex flex-col w-full h-1/2 p-4"}>
                                        <div className={"flex flex-row justify-between items-center"}>
                                            <div className={"w-4/5 h-4 bg-gray-200 rounded-md animate-pulse"}/>
                                            <StarIcon
                                                className={cn("stroke-yellow-500 shrink-0 m-1", card.IsFavouriteCourse && 'fill-yellow-500')}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>}>
                    <Index/>
                </Suspense>,
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
