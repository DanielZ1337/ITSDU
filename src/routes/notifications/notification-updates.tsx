import NotificationsCardsFallback from "@/components/notifications/fallback/notifications-card-skeletons";
import NotificationCards from "@/components/notifications/notifications-cards";
import UpdatesTypeSelect, {
	useUpdatesTypeSelect,
} from "@/components/notifications/notifications-updates-type-select";
import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import { Suspense, lazy, memo } from "react";
import { Helmet } from "react-helmet-async";
// import { FetchMoreInview } from "@/components/fetch-more-in-view";
const FetchMoreInviewLazy = lazy(() =>
	import("@/components/fetch-more-in-view").then((module) => ({
		default: module.FetchMoreInview,
	})),
);

function NotificationUpdates() {
	const {
		data: notifications,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGETnotificationsStream(
		{
			showLightBulletins: true,
			PageIndex: 0,
			PageSize: 10,
			UseNewerThan: true,
		},
		{
			keepPreviousData: true,
		},
	);

	const { selectedUpdatesType, setSelectedUpdatesType, filteredNotifications } =
		useUpdatesTypeSelect(notifications);

	return (
		<>
			<Helmet>
				<title>Recent Updates</title>
			</Helmet>
			<div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-zinc-100/40 px-6 py-5 shadow backdrop-blur-md dark:bg-zinc-800/40">
				<h1 className="text-2xl font-bold">Recent Updates</h1>
				<UpdatesTypeSelect
					update={selectedUpdatesType}
					onChange={setSelectedUpdatesType}
				/>
			</div>
			<div className="p-6">
				<div className="flex flex-col gap-4">
					{isLoading ? (
						<NotificationsCardsFallback />
					) : (
						<NotificationCards filteredNotifications={filteredNotifications} />
					)}
				</div>
				{!isLoading && (
					<Suspense fallback={null}>
						<FetchMoreInviewLazy
							hasNextPage={hasNextPage}
							fetchNextPage={fetchNextPage}
							isFetchingNextPage={isFetchingNextPage}
						>
							{isFetchingNextPage
								? "Fetching more notifications..."
								: "End of notifications"}
						</FetchMoreInviewLazy>
					</Suspense>
				)}
			</div>
		</>
	);
}

export default memo(NotificationUpdates);
