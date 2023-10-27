import useGETnotifications from '@/queries/notifications/useGETnotifications'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer';

export default function NotificationsIndex() {
    const { data: notifications, fetchNextPage, hasNextPage, isFetchingNextPage } = useGETnotifications({
        PageIndex: 0,
        PageSize: 10,
        UseNewerThan: true,
    }, {
        suspense: true,
        keepPreviousData: true,
    })
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <div className="rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications && notifications.pages.map((notificationPage, index) => (
                <div key={index}>
                    {notificationPage.EntityArray.map((notification) => (
                        <div key={notification.NotificationId} className="mb-4">
                            <h3 className="text-lg font-semibold">{notification.PublishedBy.FullName}</h3>
                            <p className="text-gray-700">{notification.Text}</p>
                        </div>
                    ))}
                </div>
            ))}
            <div ref={ref} className="text-center mt-4 text-gray-600 text-sm">
                {isFetchingNextPage ? 'Fetching more notifications...' : 'End of notifications'}
            </div>
        </div>
    )
}
