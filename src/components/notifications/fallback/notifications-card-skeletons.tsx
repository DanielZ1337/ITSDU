import {NotificationsCardSkeleton} from "../notifications-card-skeleton";

export default function NotificationsCardsFallback() {
    return Array(10).fill(0).map((_, i) => (
        <NotificationsCardSkeleton key={i}/>
    ));
}