import { ItslearningRestApiEntitiesStreamItemV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.StreamItemV2";
import { Suspense } from "react";
import NotificationCard from "./notifications-card";
import { NotificationsCardSkeleton } from "./notifications-card-skeleton";

export default function NotificationCards({
  filteredNotifications,
}: {
  filteredNotifications: ItslearningRestApiEntitiesStreamItemV2[][] | undefined;
}) {
  return filteredNotifications?.map((page) =>
    page.map((notification) => (
      <Suspense
        fallback={<NotificationsCardSkeleton />}
        key={notification.NotificationId}
      >
        <NotificationCard key={notification.NotificationId} notification={notification} />
      </Suspense>
    )),
  );
}
