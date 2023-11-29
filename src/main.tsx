import { getAccessToken } from "@/lib/utils.ts";
import ReactDOM from 'react-dom/client';
import '@/index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Providers from "@/components/providers.tsx";
import axios from "axios";
import { lazy } from "react";

const Documents = lazy(() => import("./routes/documents/documents"));
const Layout = lazy(() => import("./components/layout"));
const ErrorPage = lazy(() => import("@/error-page.tsx"));
const Profile = lazy(() => import("@/routes/profile.tsx"));
const Index = lazy(() => import("@/routes/index.tsx"));
const Calendar = lazy(() => import("@/routes/calendar.tsx"));
const SuspenseWrapper = lazy(() => import("@/components/suspense-wrapper.tsx"));
const Messages = lazy(() => import("@/components/messages/messages.tsx"));
const CourseLayout = lazy(() => import("@/components/course/layout/course-layout.tsx"));
const CourseIndex = lazy(() => import("@/routes/course/course-index.tsx"));
const CourseParticipants = lazy(() => import("@/routes/course/course-participants.tsx"));
const CourseInformation = lazy(() => import("@/routes/course/course-information.tsx"));
const CourseResources = lazy(() => import("@/routes/course/course-resources"));
const CourseRootResources = lazy(() => import("@/routes/course/course-root-resources"));
const CourseTasks = lazy(() => import("@/routes/course/course-tasks.tsx"));
const PersonIndex = lazy(() => import("@/routes/person/person-index.tsx"));
const CoursesIndex = lazy(() => import("@/routes/courses.tsx"));
const CourseError = lazy(() => import("./routes/course/course-error"));
import { GETunreadInstantMessagesCountApiUrl } from "./types/api-types/messages/GETunreadInstantMessagesCount";
const NotificationUpdates = lazy(() => import("./routes/notifications/notification-updates"));
const CourseAnnouncements = lazy(() => import("./routes/course/course-announcements"));
const NotificationID = lazy(() => import("./routes/notifications/notification-id"));
const CourseAnnouncementError = lazy(() => import("./routes/course/errors-pages/course-announcement-error"));
const CourseSchedule = lazy(() => import("./routes/course/course-schedule"));
const OfficeDocument = lazy(() => import("./routes/documents/office-document"));
const OtherFiles = lazy(() => import("./routes/documents/other-files"));
const Overview = lazy(() => import("./routes/overview"));

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const router = createHashRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Index />,
                errorElement: <ErrorPage />,
                index: true,
            },
            {
                path: "/documents",
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "pdf/:elementId",
                        element: <SuspenseWrapper><Documents /></SuspenseWrapper>,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "office/:elementId",
                        element: <SuspenseWrapper><OfficeDocument /></SuspenseWrapper>,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "other/:elementId",
                        element: <SuspenseWrapper><OtherFiles /></SuspenseWrapper>,
                        errorElement: <ErrorPage />,
                    }
                ]
            },
            {
                path: "/overview/:courseId",
                element: <SuspenseWrapper><Overview /></SuspenseWrapper>,
                errorElement: <ErrorPage />,
            },
            {
                path: "/person/:id",
                element: <SuspenseWrapper><PersonIndex /></SuspenseWrapper>,
                errorElement: <ErrorPage />,
            },
            {
                path: "/courses",
                element: <SuspenseWrapper><CoursesIndex /></SuspenseWrapper>,
                errorElement: <ErrorPage />,
            },
            {
                path: "/updates",
                errorElement: <ErrorPage />,
                children: [
                    {
                        element: <SuspenseWrapper><NotificationUpdates /></SuspenseWrapper>,
                        errorElement: <ErrorPage />,
                        index: true,
                    },
                    {
                        path: ":notificationId",
                        element: <SuspenseWrapper><NotificationID /></SuspenseWrapper>,
                        errorElement: <ErrorPage />,
                    }
                ]
            },
            {
                path: "/calendar",
                element: <SuspenseWrapper><Calendar /></SuspenseWrapper>,
                errorElement: <ErrorPage />,
            },
            {
                path: "/courses/:id",
                element: <SuspenseWrapper><CourseLayout /></SuspenseWrapper>,
                errorElement: <CourseError />,
                children: [
                    {
                        element: <SuspenseWrapper><CourseIndex /></SuspenseWrapper>,
                        index: true,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "resources",
                        errorElement: <ErrorPage />,
                        children: [
                            {
                                element: <SuspenseWrapper><CourseRootResources /></SuspenseWrapper>,
                                errorElement: <ErrorPage />,
                                index: true,
                            },
                            {
                                path: ":folderId",
                                element: <SuspenseWrapper><CourseResources /></SuspenseWrapper>,
                                errorElement: <ErrorPage />,
                            },
                        ]
                    },
                    {
                        path: "schedule",
                        element: <SuspenseWrapper><CourseSchedule /></SuspenseWrapper>,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "announcements",
                        element: <SuspenseWrapper><CourseAnnouncements /></SuspenseWrapper>,
                        errorElement: <CourseAnnouncementError />,
                    },
                    {
                        path: "course-information",
                        element: <SuspenseWrapper><CourseInformation /></SuspenseWrapper>,
                    },
                    {
                        path: "tasks",
                        element: <SuspenseWrapper><CourseTasks /></SuspenseWrapper>,
                    },
                    {
                        path: "participants",
                        element: <SuspenseWrapper>
                            <CourseParticipants />
                        </SuspenseWrapper>,
                    },
                    {
                        path: "*",
                        element: <ErrorPage />,
                        errorElement: <ErrorPage />,
                    }
                ],
            },
            {
                path: "/profile",
                element: <SuspenseWrapper><Profile /></SuspenseWrapper>,
                errorElement: <ErrorPage />,
            },
            {
                path: "/messages/:id?",
                element: <SuspenseWrapper><Messages /></SuspenseWrapper>,
                errorElement: <ErrorPage />,
            },
            {
                path: "*",
                element: <ErrorPage />,
                errorElement: <ErrorPage />,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Providers>
        <SuspenseWrapper max>
            {/* <React.StrictMode> */}
            <RouterProvider fallbackElement={<ErrorPage />} future={{
                v7_startTransition: true,
            }} router={router} />
            <ReactQueryDevtools position="left" />
            {/* </React.StrictMode> */}
        </SuspenseWrapper>
    </Providers>
)

// unread messages notification system
type UnreadMessages = {
    count: number
    timestamp: number
}
const unreadMessages: UnreadMessages[] = [
    {
        count: 0,
        timestamp: Date.now()
    }
]
setInterval(async () => {
    const access_token = await getAccessToken()
    axios.get(GETunreadInstantMessagesCountApiUrl(), {
        params: {
            'access_token': access_token
        }
    }).then((res: {
        data: number;
    }) => {
        unreadMessages.push({
            count: res.data,
            timestamp: Date.now()
        })

        if (unreadMessages.length > 10) {
            unreadMessages.shift()
        }

        // check if there are any unread messages based on the timestamps and the count
        if (unreadMessages[unreadMessages.length - 1].count > 0 && unreadMessages[unreadMessages.length - 1].timestamp - unreadMessages[0].timestamp < 1000 * 60 * 5) {
            if (unreadMessages[unreadMessages.length - 1].count !== unreadMessages[unreadMessages.length - 2].count) {
                new Notification('itslearning', {
                    body: `You have ${unreadMessages[unreadMessages.length - 1].count} unread message${unreadMessages[unreadMessages.length - 1].count > 1 ? 's' : ''}`,
                    icon: 'itsl-itslearning-file://icon.ico'
                })

            }
        }
    }).catch((err: any) => {
        console.log(err)
    })
}, 1000 * 15) // 15 seconds

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
})
