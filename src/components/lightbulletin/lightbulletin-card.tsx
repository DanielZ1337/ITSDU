import LightbulletinCommentForm from "@/components/lightbulletin/lightbulletin-comment-form.tsx";
import LightbulletinComments from "@/components/lightbulletin/lightbulletin-comments.tsx";
import LightbulletinCommentsLoader from "@/components/lightbulletin/lightbulletin-comments-loader.tsx";
import PersonHoverCard from "@/components/person/person-hover-card";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCourse } from "@/hooks/atoms/useCourse";
import useGETlightbulletinResources from "@/queries/lightbulletin/useGETlightbulletinResources.ts";
import usePUTlightbulletinNotifications from "@/queries/lightbulletin/usePUTlightbulletinNotifications.ts";
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinV2";
import { LinkifyType } from "@/types/linkify";
import Linkify from "linkify-react";
import { BellOff, BellRing, ChevronDown, ChevronUp, MessageSquare, Paperclip } from "lucide-react";
import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import renderLink from "../custom-render-link-linkify";
import HoverDate from "../hover-date";
import { Loader } from "../ui/loader";
import LightbulletinAvatar from "./lightbulletin-avatar";
import LightbulletinImage from "./lightbulletin-image";
import LightbulletinLink from "./lightbulletin-link";
import LightbulletinLinkPreview from "./lightbulletin-link-preview";
import LightbulletinResource from "./lightbulletin-resource";

export default function LightbulletinCard({
	bulletin,
	links,
}: {
	bulletin: ItslearningRestApiEntitiesLightBulletinsLightBulletinV2;
	links?: LinkifyType[];
}) {
	const [readMore, setReadMore] = useState(false);
	const textRef = React.useRef<HTMLPreElement>(null);
	const [showComments, setShowComments] = useState<boolean>(false);
	const [showResources, setShowResources] = useState<boolean>(false);
	const { courseId } = useCourse();

	const { mutate, isLoading } = usePUTlightbulletinNotifications({
		lightbulletinId: bulletin.LightBulletinId,
	});

	const { data: Resources } = useGETlightbulletinResources(
		{
			bulletinId: bulletin.LightBulletinId,
		},
		{
			enabled: bulletin.ResourcesCount > 0,
		},
	);

	const hasReadMore = bulletin.Text.split("\n").length > 6;

	return (
		<div
			data-marginonpublished={bulletin.Text.split("\n").length > 1}
			data-readmore={readMore}
			data-hasreadmore={hasReadMore}
			key={bulletin.LightBulletinId}
			className="group relative rounded-xl border border-border/40 bg-card/50 transition-all duration-300 hover:bg-gradient-to-b hover:from-muted/30 hover:to-muted/10 overflow-hidden"
		>
			{/* Card Header */}
			<div className="flex items-start justify-between gap-4 p-4 pb-0">
				<div className="flex items-center gap-3 min-w-0">
					<LightbulletinAvatar
						src={bulletin.PublishedBy.ProfileImageUrlSmall}
						name={bulletin.PublishedBy.FullName}
					/>
					<div className="flex flex-col min-w-0">
						<PersonHoverCard
							personId={bulletin.PublishedBy.PersonId}
							asChild
							showTitle={false}
						>
							<Link
								to={`/person/${bulletin.PublishedBy.PersonId}`}
								className="font-medium text-foreground hover:text-primary transition-colors truncate"
							>
								{bulletin.PublishedBy.FullName}
							</Link>
						</PersonHoverCard>
						<HoverDate date={bulletin.PublishedDate} />
					</div>
				</div>

				{/* Notification Toggle */}
				<Button
					disabled={isLoading}
					onClick={() => {
						mutate(
							{
								isSubscribed: !bulletin.IsSubscribed,
							},
							{
								onSuccess: () => {
									bulletin.IsSubscribed = !bulletin.IsSubscribed;
									toast.success("Success", {
										description: bulletin.IsSubscribed
											? "You will now receive notifications for this announcement"
											: "You will no longer receive notifications for this announcement",
										duration: 3000,
									});
								},
								onError: () => {
									toast.error("Error", {
										description: "Something went wrong",
										duration: 3000,
									});
								},
							},
						);
					}}
					size="icon"
					variant="ghost"
					className="h-8 w-8 rounded-full flex-shrink-0 hover:bg-muted"
				>
					{bulletin.IsSubscribed ? (
						<BellRing className="w-4 h-4 text-primary" />
					) : (
						<BellOff className="w-4 h-4 text-muted-foreground" />
					)}
				</Button>
			</div>

			{/* Card Content */}
			<div className="p-4">
				<pre
					ref={textRef}
					onClick={() => hasReadMore && setReadMore((prev) => !prev)}
					className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed group-data-[readmore=false]:line-clamp-6 group-data-[readmore=true]:line-clamp-none transition-all duration-200 group-data-[hasreadmore=true]:cursor-pointer"
				>
					<Linkify options={{ render: renderLink }}>{bulletin.Text}</Linkify>
				</pre>

				{/* Read More Indicator */}
				{hasReadMore && (
					<button
						onClick={() => setReadMore((prev) => !prev)}
						className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
					>
						{readMore ? (
							<>
								<ChevronUp className="w-3 h-3" />
								Show less
							</>
						) : (
							<>
								<ChevronDown className="w-3 h-3" />
								Read more
							</>
						)}
					</button>
				)}
			</div>

			{/* Attached Images */}
			{bulletin.AttachedImages && bulletin.AttachedImages.length > 0 && (
				<div className="px-4 pb-4">
					<div className="flex gap-2 overflow-x-auto rounded-lg">
						{bulletin.AttachedImages.map((image) => (
							<LightbulletinImage key={image.OriginalFileId} image={image} />
						))}
					</div>
				</div>
			)}

			{/* Link Previews */}
			{links && links.length > 0 && (
				<div className="px-4 pb-4 flex flex-wrap gap-2">
					{links.map((link) => (
						<Suspense
							key={link.href}
							fallback={
								<LightbulletinLink>
									<Loader className="stroke-current text-muted-foreground w-4 h-4" />
								</LightbulletinLink>
							}
						>
							<LightbulletinLinkPreview
								key={link.href}
								href={link.value}
								type={link.type as "url" | "email"}
								title={link.value}
							/>
						</Suspense>
					))}
				</div>
			)}
			{/* <div
                className={"w-full items-center justify-center flex flex-col gap-4 truncate text-lg group-data-[readmore=false]:hidden group-data-[readmore=true]:flex"}>
                <OgImagePreview url={links[links.length - 1]} />
            </div> */}
			{/* Resources Section */}
			{showResources && Resources && (
				<div className="px-4 pb-4">
					<div className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-2">
						{Resources.EntityArray.map((resource) => (
							<LightbulletinResource
								key={resource.ElementId}
								resource={resource}
								courseId={courseId!}
							/>
						))}
					</div>
				</div>
			)}

			{/* Comments Section */}
			{showComments && (
				<div className="px-4 pb-4">
					<div className="rounded-lg border border-border/50 bg-muted/30 p-3">
						{bulletin.CommentsCount > 0 && (
							<Suspense
								fallback={
									<LightbulletinCommentsLoader count={Math.min(bulletin.CommentsCount, 3)} />
								}
							>
								<LightbulletinComments
									lightbulletinId={bulletin.LightBulletinId}
								/>
							</Suspense>
						)}
						<LightbulletinCommentForm
							lightbulletinId={bulletin.LightBulletinId}
							hasComments={bulletin.CommentsCount > 0}
						/>
					</div>
				</div>
			)}

			{/* Card Footer - Action Buttons */}
			<div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-muted/20">
				<Button
					variant={showComments ? "secondary" : "ghost"}
					size="sm"
					onClick={() => setShowComments(!showComments)}
					className="h-8 gap-1.5 text-xs"
				>
					<MessageSquare className="w-3.5 h-3.5" />
					<span>{bulletin.CommentsCount}</span>
					<span className="hidden sm:inline">Comments</span>
				</Button>

				{bulletin.ResourcesCount > 0 && (
					<Button
						variant={showResources ? "secondary" : "ghost"}
						size="sm"
						onClick={() => setShowResources(!showResources)}
						className="h-8 gap-1.5 text-xs"
					>
						<Paperclip className="w-3.5 h-3.5" />
						<span>{bulletin.ResourcesCount}</span>
						<span className="hidden sm:inline">Files</span>
					</Button>
				)}
			</div>
			{/*<div className="mt-4 flex justify-end">
                {hasReadMore && (
                    <div className={"mx-auto w-full flex items-center justify-center"}>
                        <Button variant={"secondary"} size={"sm"}
                                className={"text-blue-500 cursor-pointer"}
                                onClick={() => setReadMore(!readMore)}>
                            {readMore ? "Read less" : "Read more"}
                        </Button>
                    </div>
                )}
            </div>*/}
		</div>
	);
}

export function LightbulletinBadgeButton({
	children,
	...props
}: {
	children: React.ReactNode;
} & React.ComponentProps<typeof Badge>) {
	return (
		<Badge size={"lg"} {...props}>
			{children}
		</Badge>
	);
}
