import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import UpdatesTypeSelect, {
    useUpdatesTypeSelect
} from "@/components/notifications/notifications-updates-type-select";
import NotificationsCardsFallback from "@/components/notifications/fallback/notifications-card-skeletons";
import NotificationCards from "@/components/notifications/notifications-cards";
import { NotificationsCardsFetchMoreInView } from "@/components/notifications/notifications-cards-fetch-more-in-view";

export default function NotificationUpdates() {
    const {
        data: notifications,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGETnotificationsStream({
        showLightBulletins: true,
        PageIndex: 0,
        PageSize: 10,
        UseNewerThan: true,
    }, {
        keepPreviousData: true,
    });

    const {
        selectedUpdatesType,
        setSelectedUpdatesType,
        filteredNotifications
    } = useUpdatesTypeSelect(notifications);

    return (
        <>
            <div className="py-5 sticky top-0 flex items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40 backdrop-blur-md shadow z-10 justify-between">
                <h1 className="text-2xl font-bold">Recent Updates</h1>
                <UpdatesTypeSelect update={selectedUpdatesType} onChange={setSelectedUpdatesType} />
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {isLoading ? <NotificationsCardsFallback /> : <NotificationCards filteredNotifications={filteredNotifications} />}
                </div>
                {!isLoading && (
                    <NotificationsCardsFetchMoreInView
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
            </div>
        </>
    );
}