import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const Root = React.lazy(() => import("./routes/root"));
const ErrorPage = React.lazy(() => import("./error-page"));
const Contact = React.lazy(() => import("./routes/contact"));
const Layout = React.lazy(() => import("./components/layout"));
const Test = React.lazy(() => import("./routes/test"));


const router = createHashRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Root/>,
                errorElement: <ErrorPage/>,
                children: [{}],
            },
            {
                path: "/contacts/:id",
                element: <Contact/>,
                errorElement: <ErrorPage/>,
                children: [{}],
            },
            {
                path: "/test",
                element: <Test/>,
                errorElement: <ErrorPage/>,
            },
            {
                path: "*",
                element: <ErrorPage/>,
                children: [{}],
            }
        ]
    },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <RouterProvider router={router}/>
        </React.StrictMode>
    </QueryClientProvider>
    ,
)

// Remove Preload scripts loading
postMessage({payload: 'removeLoading'}, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
})
