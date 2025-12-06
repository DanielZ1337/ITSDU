import renderLink from "@/components/custom-render-link-linkify";
import PersonHoverCard from "@/components/person/person-hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRelativeTimeString } from "@/lib/utils";
import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import usePUTnotificationsMarkAsRead from "@/queries/notifications/usePUTnotificationsMarkAsRead";
import {
	isSupportedResourceInApp,
	useNavigateToResource,
} from "@/types/api-types/extra/learning-tool-id-types";
import Linkify from "linkify-react";
import { ArrowLeft, Calendar, FileText, Megaphone, User } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import useGETnotificationElements from "../../queries/notifications/useGETnotificationElements";

function NotificationDetailSkeleton() {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			{/* Header skeleton */}
			<div className="flex-shrink-0 border-b border-border/50 bg-muted/30 px-6 py-4">
				<Skeleton className="h-4 w-24 mb-3" />
				<Skeleton className="h-7 w-96" />
			</div>
			{/* Content skeleton */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="mx-auto max-w-2xl">
					<div className="rounded-xl border border-border/50 bg-card/50 p-6">
						<div className="flex items-center gap-3 mb-4">
							<Skeleton className="h-10 w-10 rounded-lg" />
							<Skeleton className="h-5 w-48" />
						</div>
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-3/4 mb-6" />
						<Skeleton className="h-32 w-full rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default function NotificationID() {
	const { notificationId } = useParams();

	if (!notificationId) throw new Error("notificationId is required");

	const { data: notification, isLoading } = useGETnotificationsStream(
		{
			FromId: Number(notificationId),
			PageSize: 1,
			showLightBulletins: true,
		},
		{
			suspense: false,
		},
	);

	const currentNotification = notification?.pages[0]?.EntityArray[0];

	const { data: resources } = useGETnotificationElements({
		notificationId: currentNotification?.NotificationId ?? 0,
		PageSize: 100,
	});

	const navigateToResource = useNavigateToResource();

	const { mutate: markAsRead } = usePUTnotificationsMarkAsRead();

	useEffect(() => {
		if (markAsRead && currentNotification) {
			const timeout = setTimeout(() => {
				markAsRead([
					{
						NotificationId: notificationId,
						IsRead: true,
					},
				]);
			}, 100);
			return () => clearTimeout(timeout);
		}
	}, [markAsRead, currentNotification, notificationId]);

	if (isLoading || !currentNotification) {
		return <NotificationDetailSkeleton />;
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<Helmet>
				<title>{currentNotification.Text}</title>
			</Helmet>

			{/* Header */}
			<div className="flex-shrink-0 border-b border-border/50 bg-muted/30 px-6 py-4">
				<Link
					to="/notifications"
					className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to notifications
				</Link>
				<h1 className="text-xl font-semibold text-foreground">
					{currentNotification.Text}
				</h1>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="mx-auto max-w-2xl">
					<div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
						{/* Notification header */}
						<div className="border-b border-border/50 bg-muted/20 px-6 py-4">
							<div className="flex items-center gap-3">
								<img
									loading="lazy"
									src={currentNotification.IconUrl}
									alt=""
									className="h-10 w-10 rounded-lg bg-muted p-1.5"
								/>
								<div className="flex-1 min-w-0">
									<h2 className="font-medium text-foreground truncate">
										{currentNotification.LocationTitle}
									</h2>
									<div className="flex items-center gap-3 text-sm text-muted-foreground">
										<span className="flex items-center gap-1">
											<Calendar className="h-3.5 w-3.5" />
											{getRelativeTimeString(new Date(currentNotification.PublishedDate))}
										</span>
										<span className="flex items-center gap-1">
											<User className="h-3.5 w-3.5" />
											<PersonHoverCard
												personId={currentNotification.PublishedBy.PersonId}
												showTitle={false}
											>
												<span className="hover:underline cursor-pointer">
													{currentNotification.PublishedBy.FullName}
												</span>
											</PersonHoverCard>
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Notification content */}
						<div className="p-6 space-y-6">
							{/* Main text */}
							<p className="text-foreground">{currentNotification.Text}</p>

							{/* Announcement/Light Bulletin */}
							{currentNotification.LightBulletin && (
								<div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
									<div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-muted/30">
										<Megaphone className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium text-foreground">Announcement</span>
									</div>
									<div className="p-4">
										<p className="whitespace-pre-wrap text-sm text-foreground/90">
											<Linkify options={{ render: renderLink }}>
												{currentNotification.LightBulletin.Text}
											</Linkify>
										</p>
									</div>
								</div>
							)}

							{/* Resources */}
							{currentNotification.ElementsCount > 0 && resources?.EntityArray && resources.EntityArray.length > 0 && (
								<div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
									<div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-muted/30">
										<FileText className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium text-foreground">
											Resources ({resources.EntityArray.length})
										</span>
									</div>
									<div className="p-2">
										{resources.EntityArray.map((resource) => (
											<button
												key={resource.ElementId}
												onClick={async () => {
													if (isSupportedResourceInApp(resource)) {
														navigateToResource(resource);
													} else {
														await window.app.openExternal(resource.ContentUrl);
													}
												}}
												className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50 group"
											>
												<img
													loading="lazy"
													src={resource.IconUrl}
													alt=""
													className="h-8 w-8 rounded-md bg-muted p-1"
												/>
												<span className="text-sm text-foreground group-hover:text-primary transition-colors">
													{resource.Title}
												</span>
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
