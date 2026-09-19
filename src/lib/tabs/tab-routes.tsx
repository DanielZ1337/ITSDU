import { lazy } from "react";
import {
	createMemoryRouter,
	type InitialEntry,
	Navigate,
	Outlet,
} from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { useSettings } from "@/hooks/atoms/useSettings";

const AllTasks = lazy(() => import("@/routes/all-tasks"));
const MediaDocuments = lazy(() => import("@/routes/documents/media-documents"));
const CoursePlans = lazy(() => import("@/routes/course/course-plans"));
const Documents = lazy(() => import("@/routes/documents/documents"));
const ErrorPage = lazy(() => import("@/error-page"));
const Profile = lazy(() => import("@/routes/profile"));
const Index = lazy(() => import("@/routes/index"));
const Calendar = lazy(() => import("@/routes/calendar"));
const Messages = lazy(() => import("@/components/messages/messages"));
const CourseLayout = lazy(
	() => import("@/components/course/layout/course-layout"),
);
const CourseIndex = lazy(() => import("@/routes/course/course-index"));
const CourseParticipants = lazy(
	() => import("@/routes/course/course-participants"),
);
const CourseInformation = lazy(
	() => import("@/routes/course/course-information"),
);
const CourseResources = lazy(() => import("@/routes/course/course-resources"));
const CourseRootResources = lazy(
	() => import("@/routes/course/course-root-resources"),
);
const CourseTasks = lazy(() => import("@/routes/course/course-tasks"));
const PersonIndex = lazy(() => import("@/routes/person/person-index"));
const CoursesIndex = lazy(() => import("@/routes/courses"));
const CourseError = lazy(() => import("@/routes/course/course-error"));
const NotificationUpdates = lazy(
	() => import("@/routes/notifications/notification-updates"),
);
const CourseAnnouncements = lazy(
	() => import("@/routes/course/course-announcements"),
);
const NotificationID = lazy(
	() => import("@/routes/notifications/notification-id"),
);
const CourseAnnouncementError = lazy(
	() => import("@/routes/course/errors-pages/course-announcement-error"),
);
const CourseSchedule = lazy(() => import("@/routes/course/course-schedule"));
const OfficeDocuments = lazy(
	() => import("@/routes/documents/office-documents"),
);
const OtherFiles = lazy(() => import("@/routes/documents/other-files"));
const Overview = lazy(() => import("@/routes/overview"));
const Resources = lazy(() => import("@/routes/resources"));
const AIChats = lazy(() => import("@/routes/ai-chats"));
const MergeZIPDocuments = lazy(() => import("@/routes/merge-zip-documents"));
const TestNewCalendar = lazy(() => import("@/routes/test-new-calendar"));
const NativeSSOElement = lazy(() => import("@/routes/sso/native-sso-element"));

function LandingRedirect() {
	const { settings, isHydrated } = useSettings();

	if (!isHydrated) return <Loader />;

	const landingPath =
		{
			overview: "/overview",
			courses: "/courses",
			calendar: "/calendar",
			tasks: "/all-tasks",
			messages: "/messages",
		}[settings.navigation.defaultLandingPage] ?? "/overview";

	return <Navigate to={landingPath} replace />;
}

function TabRouteRoot() {
	return <Outlet />;
}

export function createTabRouter(initialEntry: InitialEntry) {
	return createMemoryRouter(
		[
			{
				path: "/",
				element: <TabRouteRoot />,
				errorElement: <ErrorPage />,
				children: [
					{ index: true, element: <LandingRedirect /> },
					{
						path: "documents",
						children: [
							{ path: "pdf/:elementId", element: <Documents /> },
							{ path: "office/:elementId", element: <OfficeDocuments /> },
							{ path: "media/:elementId", element: <MediaDocuments /> },
							{ path: "other/:elementId", element: <OtherFiles /> },
						],
					},
					{ path: "overview", element: <Overview /> },
					{ path: "resources", element: <Resources /> },
					{ path: "person/:id", element: <PersonIndex /> },
					{ path: "courses", element: <Index /> },
					{ path: "courses-legacy", element: <CoursesIndex /> },
					{
						path: "updates",
						children: [
							{ index: true, element: <NotificationUpdates /> },
							{ path: ":notificationId", element: <NotificationID /> },
						],
					},
					{ path: "all-tasks", element: <AllTasks /> },
					{ path: "calendar", element: <Calendar /> },
					{
						path: "courses/:id",
						element: <CourseLayout />,
						errorElement: <CourseError />,
						children: [
							{ index: true, element: <CourseIndex /> },
							{
								path: "resources",
								children: [
									{ index: true, element: <CourseRootResources /> },
									{ path: ":folderId", element: <CourseResources /> },
								],
							},
							{ path: "schedule", element: <CourseSchedule /> },
							{
								path: "updates",
								element: <CourseAnnouncements />,
								errorElement: <CourseAnnouncementError />,
							},
							{ path: "course-information", element: <CourseInformation /> },
							{ path: "tasks", element: <CourseTasks /> },
							{ path: "participants", element: <CourseParticipants /> },
							{ path: "plans", element: <CoursePlans /> },
							{ path: "*", element: <ErrorPage /> },
						],
					},
					{ path: "profile", element: <Profile /> },
					{ path: "messages/:id?", element: <Messages /> },
					{ path: "ai-chats/:page?", element: <AIChats /> },
					{ path: "merge-zip-documents", element: <MergeZIPDocuments /> },
					{ path: "test-calendar", element: <TestNewCalendar /> },
					{ path: "sso", element: <NativeSSOElement /> },
					{ path: "*", element: <ErrorPage /> },
				],
			},
		],
		{ initialEntries: [initialEntry] },
	);
}

export type TabRouter = ReturnType<typeof createTabRouter>;
