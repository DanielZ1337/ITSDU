import { NotificationsCardSkeleton } from "../notifications-card-skeleton";

export default function NotificationsCardsFallback({
	count,
}: { count?: number }) {
	return Array(count || 10)
		.fill(0)
		.map((_, i) => <NotificationsCardSkeleton key={i} />);
}
