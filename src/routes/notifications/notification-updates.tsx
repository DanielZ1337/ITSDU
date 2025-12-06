import NotificationsCardsFallback from "@/components/notifications/fallback/notifications-card-skeletons";
import NotificationCards from "@/components/notifications/notifications-cards";
import UpdatesTypeSelect, {
	useUpdatesTypeSelect,
} from "@/components/notifications/notifications-updates-type-select";
import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import { Bell } from "lucide-react";
import { Suspense, lazy, memo } from "react";
import { Helmet } from "react-helmet-async";

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
		<div className="flex h-full w-full flex-col overflow-hidden">
			<Helmet>
				<title>Recent Updates</title>
			</Helmet>
			{/* Header */}
			<div className="flex-shrink-0 border-b border-border/50 bg-muted/30 px-6 py-5">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
							<Bell className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h1 className="text-xl font-semibold text-foreground">Recent Updates</h1>
							<p className="text-sm text-muted-foreground">Stay up to date with your courses</p>
						</div>
					</div>
					<UpdatesTypeSelect
						update={selectedUpdatesType}
						onChange={setSelectedUpdatesType}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="mx-auto max-w-3xl space-y-4">
					{isLoading ? (
						<NotificationsCardsFallback />
					) : (
						<NotificationCards filteredNotifications={filteredNotifications} />
					)}
					{!isLoading && (
						<Suspense fallback={null}>
							<FetchMoreInviewLazy
								hasNextPage={hasNextPage}
								fetchNextPage={fetchNextPage}
								isFetchingNextPage={isFetchingNextPage}
							>
								<div className="py-8 text-center text-sm text-muted-foreground">
									{isFetchingNextPage
										? "Fetching more notifications..."
										: "End of notifications"}
								</div>
							</FetchMoreInviewLazy>
						</Suspense>
					)}
				</div>
			</div>
		</div>
	);
}

export default memo(NotificationUpdates);
