import { cn, getRelativeTimeString } from "@/lib/utils";
import useGETnotificationElements from "@/queries/notifications/useGETnotificationElements";
import { ItslearningRestApiEntitiesStreamItemV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.StreamItemV2";
import { AnimatePresence, m } from "framer-motion";
import * as linkify from "linkifyjs";
import { ChevronDown, Megaphone } from "lucide-react";
import { useState } from "react";
import LightbulletinCard from "../lightbulletin/lightbulletin-card";
import NotificationElement from "./notification-element";
import NotificationTitle from "./notification-title";

export default function NotificationCard({
	notification,
	showLocation = true,
}: {
	notification: ItslearningRestApiEntitiesStreamItemV2;
	showLocation?: boolean;
}) {
	const { data } = useGETnotificationElements(
		{
			notificationId: notification.NotificationId,
			PageSize: 100,
		},
		{
			suspense: true,
		},
	);

	const [showElements, setShowElements] = useState(false);
	const [showLightBulletin, setShowLightBulletin] = useState(false);

	const isAnnouncement = !!notification.LightBulletin;

	return (
		<div className="rounded-xl border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card/80">
			{/* Header */}
			<div className="flex items-start gap-3">
				<div className={cn(
					"flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 overflow-hidden",
					isAnnouncement
						? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-purple-500/20"
						: "bg-gradient-to-br from-primary/10 to-orange-500/10 ring-1 ring-primary/20"
				)}>
					<img
						loading="lazy"
						src={notification.IconUrl}
						alt=""
						className="h-6 w-6"
					/>
				</div>
				<div className="flex-1 min-w-0">
					<h2 className="font-medium text-foreground">
						<NotificationTitle
							notification={notification}
							showLocation={showLocation}
							showElements={showElements}
							setShowElements={setShowElements}
							element={data?.EntityArray[0]}
						/>
					</h2>
					<p className="text-sm text-muted-foreground mt-0.5">
						{getRelativeTimeString(new Date(notification.PublishedDate))}
					</p>
				</div>
			</div>

			{/* Show announcement button */}
			{notification.LightBulletin && (
				<button
					className={cn(
						"mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
						"text-primary hover:bg-primary/10",
						showLightBulletin && "bg-primary/10"
					)}
					onClick={() => setShowLightBulletin((prev) => !prev)}
				>
					<Megaphone className="h-4 w-4" />
					{showLightBulletin ? "Hide" : "Show"} announcement
					<ChevronDown className={cn(
						"h-4 w-4 transition-transform",
						showLightBulletin && "rotate-180"
					)} />
				</button>
			)}

			{/* Additional elements */}
			<AnimatePresence>
				{showElements && (
					<m.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						<div className="mt-3 space-y-2 border-t border-border/50 pt-3">
							{data!.EntityArray.slice(1).map((element, i) => (
								<m.div
									key={element.ElementId}
									initial={{ opacity: 0, y: 10 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: { delay: i * 0.05, type: "tween", duration: 0.2 },
									}}
									exit={{ opacity: 0, y: 10 }}
								>
									<NotificationElement element={element} />
								</m.div>
							))}
						</div>
					</m.div>
				)}
			</AnimatePresence>

			{/* Light bulletin */}
			<AnimatePresence>
				{showLightBulletin && notification.LightBulletin && (
					<m.div
						initial={{ opacity: 0, y: 10, height: 0 }}
						animate={{ opacity: 1, y: 0, height: "auto" }}
						exit={{ opacity: 0, y: 10, height: 0 }}
						transition={{ type: "tween", duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="mt-3 border-t border-border/50 pt-3">
							<LightbulletinCard
								links={linkify.find(notification.LightBulletin.Text)}
								bulletin={notification.LightBulletin}
							/>
						</div>
					</m.div>
				)}
			</AnimatePresence>
		</div>
	);
}
