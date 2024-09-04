import { getAccessToken } from '@/lib/utils.ts'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { createHashRouter, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { lazy, useEffect, useRef } from 'react'
import { GETunreadInstantMessagesCountApiUrl } from './types/api-types/messages/GETunreadInstantMessagesCount'
import { ErrorBoundary } from 'react-error-boundary'
import { defaultSettings } from '@/types/settings'
import { GlobalErrorBoundaryProvider } from './contexts/global-error-boundary-context'
import { useQuery } from '@tanstack/react-query'
import useGETssoUrl from './queries/sso/useGETssoUrl'
import { Loader } from './components/ui/loader'
import { GlobalShortcuts } from './components/global-shortcuts'

const RouterProvider = lazy(() => import('react-router-dom').then((module) => ({ default: module.RouterProvider })))
const Providers = lazy(() => import('@/components/providers.tsx'))
const ReactQueryDevtools = lazy(() =>
	import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools }))
)
const MediaDocuments = lazy(() => import('./routes/documents/media-documents'))
const CoursePlans = lazy(() => import('./routes/course/course-plans'))
const Documents = lazy(() => import('./routes/documents/documents'))
const Layout = lazy(() => import('./components/layout'))
const ErrorPage = lazy(() => import('@/error-page.tsx'))
const Profile = lazy(() => import('@/routes/profile.tsx'))
const Index = lazy(() => import('@/routes/index.tsx'))
const Calendar = lazy(() => import('@/routes/calendar.tsx'))
const SuspenseWrapper = lazy(() => import('@/components/suspense-wrapper.tsx'))
const Messages = lazy(() => import('@/components/messages/messages.tsx'))
const CourseLayout = lazy(() => import('@/components/course/layout/course-layout.tsx'))
const CourseIndex = lazy(() => import('@/routes/course/course-index.tsx'))
const CourseParticipants = lazy(() => import('@/routes/course/course-participants.tsx'))
const CourseInformation = lazy(() => import('@/routes/course/course-information.tsx'))
const CourseResources = lazy(() => import('@/routes/course/course-resources'))
const CourseRootResources = lazy(() => import('@/routes/course/course-root-resources'))
const CourseTasks = lazy(() => import('@/routes/course/course-tasks.tsx'))
const PersonIndex = lazy(() => import('@/routes/person/person-index.tsx'))
const CoursesIndex = lazy(() => import('@/routes/courses.tsx'))
const CourseError = lazy(() => import('@/routes/course/course-error'))

const NotificationUpdates = lazy(() => import('@/routes/notifications/notification-updates'))
const CourseAnnouncements = lazy(() => import('@/routes/course/course-announcements'))
const NotificationID = lazy(() => import('@/routes/notifications/notification-id'))
const CourseAnnouncementError = lazy(() => import('@/routes/course/errors-pages/course-announcement-error'))
const CourseSchedule = lazy(() => import('@/routes/course/course-schedule'))
const OfficeDocuments = lazy(() => import('@/routes/documents/office-documents'))
const OtherFiles = lazy(() => import('@/routes/documents/other-files'))
const Overview = lazy(() => import('@/routes/overview'))
const AIChats = lazy(() => import('@/routes/ai-chats'))
const MergeZIPDocumentsLazy = lazy(() => import('@/routes/merge-zip-documents'))
const TestNewCalenderLazy = lazy(() => import('@/routes/test-new-calendar'))
const NativeSSOElement = lazy(() => import('@/routes/sso/native-sso-element'))

const router = createHashRouter([
	{
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Index />,
				errorElement: <ErrorPage />,
				index: true,
			},
			{
				path: '/documents',
				errorElement: <ErrorPage />,
				children: [
					{
						path: 'pdf/:elementId',
						element: <Documents />,
						errorElement: <ErrorPage />,
					},
					{
						path: 'office/:elementId',
						element: <OfficeDocuments />,
						errorElement: <ErrorPage />,
					},
					{
						path: 'media/:elementId',
						element: <MediaDocuments />,
						errorElement: <ErrorPage />,
					},
					{
						path: 'other/:elementId',
						element: <OtherFiles />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: '/overview',
				element: <Overview />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/person/:id',
				element: <PersonIndex />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/courses',
				element: <CoursesIndex />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/updates',
				errorElement: <ErrorPage />,
				children: [
					{
						element: <NotificationUpdates />,
						errorElement: <ErrorPage />,
						index: true,
					},
					{
						path: ':notificationId',
						element: <NotificationID />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: '/calendar',
				element: <Calendar />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/courses/:id',
				element: <CourseLayout />,
				errorElement: <CourseError />,
				children: [
					{
						element: <CourseIndex />,
						index: true,
						errorElement: <ErrorPage />,
					},
					{
						path: 'resources',
						errorElement: <ErrorPage />,
						children: [
							{
								element: <CourseRootResources />,
								errorElement: <ErrorPage />,
								index: true,
							},
							{
								path: ':folderId',
								element: <CourseResources />,
								errorElement: <ErrorPage />,
							},
						],
					},
					{
						path: 'schedule',
						element: <CourseSchedule />,
						errorElement: <ErrorPage />,
					},
					{
						path: 'updates',
						element: <CourseAnnouncements />,
						errorElement: <CourseAnnouncementError />,
					},
					{
						path: 'course-information',
						element: <CourseInformation />,
					},
					{
						path: 'tasks',
						element: <CourseTasks />,
					},
					{
						path: 'participants',
						element: <CourseParticipants />,
					},
					{
						path: 'plans',
						element: <CoursePlans />,
						errorElement: <ErrorPage />,
					},
					{
						path: '*',
						element: <ErrorPage />,
						errorElement: <ErrorPage />,
					},
				],
			},
			{
				path: '/profile',
				element: <Profile />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/messages/:id?',
				element: <Messages />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/ai-chats/:page?',
				element: <AIChats />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/merge-zip-documents',
				element: <MergeZIPDocumentsLazy />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/test-calendar',
				element: <TestNewCalenderLazy />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/sso',
				element: <NativeSSOElement />,
				errorElement: <ErrorPage />,
			},
			{
				path: '*',
				element: <ErrorPage />,
				errorElement: <ErrorPage />,
			},
		],
	},
])

// initialize settings in the local storage
if (!localStorage.getItem('settings')) {
	localStorage.setItem('settings', JSON.stringify({ ...defaultSettings }))
} else {
	//if settings is already initialized but not all the settings are present, add the missing settings
	const settings = JSON.parse(localStorage.getItem('settings')!)
	localStorage.setItem('settings', JSON.stringify({ ...defaultSettings, ...settings }))
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<GlobalErrorBoundaryProvider>
		<ErrorBoundary fallback={<></>}>
			<SuspenseWrapper max>
				<Providers>
					{/* <React.StrictMode> */}
					<RouterProvider
						fallbackElement={<ErrorPage />}
						future={{
							v7_startTransition: true,
						}}
						router={router}
					/>
					<ReactQueryDevtools
						position='top'
						buttonPosition='top-left'
					/>
					{/* </React.StrictMode> */}
					<GlobalShortcuts />
				</Providers>
			</SuspenseWrapper>
		</ErrorBoundary>
	</GlobalErrorBoundaryProvider>
)

// unread messages notification system
type UnreadMessages = {
	count: number
	timestamp: number
}
const unreadMessages: UnreadMessages[] = [
	{
		count: 0,
		timestamp: Date.now(),
	},
]
setInterval(async () => {
	const access_token = await getAccessToken()
	axios
		.get(GETunreadInstantMessagesCountApiUrl(), {
			params: {
				access_token: access_token,
			},
		})
		.then((res: { data: number }) => {
			unreadMessages.push({
				count: res.data,
				timestamp: Date.now(),
			})

			if (unreadMessages.length > 10) {
				unreadMessages.shift()
			}

			const lastUnreadMessage = unreadMessages[unreadMessages.length - 1]
			const secondLastUnreadMessage = unreadMessages[unreadMessages.length - 2]

			// check if there are any unread messages based on the timestamps and the count
			if (lastUnreadMessage.count > 0 && lastUnreadMessage.timestamp - unreadMessages[0].timestamp < 1000 * 60 * 5) {
				if (lastUnreadMessage.count !== secondLastUnreadMessage.count) {
					new Notification('itslearning', {
						body: `You have ${lastUnreadMessage.count} unread message${lastUnreadMessage.count > 1 ? 's' : ''}`,
						icon: 'itsl-itslearning-file://icon.ico',
					})
				}
			}
		})
		.catch((err: any) => {
			console.log(err)
		})
}, 1000 * 15) // 15 seconds

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
	console.log(message)
})
