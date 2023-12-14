import { getAccessToken } from "@/lib/utils.ts";
import ReactDOM from 'react-dom/client';
import '@/index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Providers from "@/components/providers.tsx";
import axios from "axios";
import { lazy, useEffect, useState } from "react";
import { GETunreadInstantMessagesCountApiUrl } from "./types/api-types/messages/GETunreadInstantMessagesCount";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const MediaDocuments = lazy(() => import("./routes/documents/media-documents"));
const CoursePlans = lazy(() => import("./routes/course/course-plans"));
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

const NotificationUpdates = lazy(() => import("./routes/notifications/notification-updates"));
const CourseAnnouncements = lazy(() => import("./routes/course/course-announcements"));
const NotificationID = lazy(() => import("./routes/notifications/notification-id"));
const CourseAnnouncementError = lazy(() => import("./routes/course/errors-pages/course-announcement-error"));
const CourseSchedule = lazy(() => import("./routes/course/course-schedule"));
const OfficeDocuments = lazy(() => import("./routes/documents/office-documents"));
const OtherFiles = lazy(() => import("./routes/documents/other-files"));
const Overview = lazy(() => import("./routes/overview"));
const AIChats = lazy(() => import("./routes/ai-chats"));

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
                        element: <Documents />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "office/:elementId",
                        element: <OfficeDocuments />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "media/:elementId",
                        element: <MediaDocuments />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "other/:elementId",
                        element: <OtherFiles />,
                        errorElement: <ErrorPage />,
                    },
                ]
            },
            {
                path: "/overview",
                element: <Overview />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/person/:id",
                element: <PersonIndex />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/courses",
                element: <CoursesIndex />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/updates",
                errorElement: <ErrorPage />,
                children: [
                    {
                        element: <NotificationUpdates />,
                        errorElement: <ErrorPage />,
                        index: true,
                    },
                    {
                        path: ":notificationId",
                        element: <NotificationID />,
                        errorElement: <ErrorPage />,
                    }
                ]
            },
            {
                path: "/calendar",
                element: <Calendar />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/courses/:id",
                element: <CourseLayout />,
                errorElement: <CourseError />,
                children: [
                    {
                        element: <CourseIndex />,
                        index: true,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "resources",
                        errorElement: <ErrorPage />,
                        children: [
                            {
                                element: <CourseRootResources />,
                                errorElement: <ErrorPage />,
                                index: true,
                            },
                            {
                                path: ":folderId",
                                element: <CourseResources />,
                                errorElement: <ErrorPage />,
                            },
                        ]
                    },
                    {
                        path: "schedule",
                        element: <CourseSchedule />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: "updates",
                        element: <CourseAnnouncements />,
                        errorElement: <CourseAnnouncementError />,
                    },
                    {
                        path: "course-information",
                        element: <CourseInformation />,
                    },
                    {
                        path: "tasks",
                        element: <CourseTasks />,
                    },
                    {
                        path: "participants",
                        element:
                            <CourseParticipants />
                        ,
                    },
                    {
                        path: "plans",
                        element: <CoursePlans />,
                        errorElement: <ErrorPage />,
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
                element: <Profile />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/messages/:id?",
                element: <Messages />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/ai-chats",
                element: <AIChats />,
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
            <ReactQueryDevtools position="top" buttonPosition="top-left" />
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
