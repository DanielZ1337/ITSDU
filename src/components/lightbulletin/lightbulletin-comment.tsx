import renderLink from "@/components/custom-render-link-linkify.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useUser } from "@/hooks/atoms/useUser";
import { cn, getRelativeTimeString } from "@/lib/utils.ts";
import usePUTlightbulletinUpdateComment from "@/queries/lightbulletin/usePUTlightbulletinUpdateComment.ts";
import { ItslearningRestApiEntitiesComment } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Comment.ts";
import Linkify from "linkify-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import HoverDate from "../hover-date";
import PersonHoverCard from "../person/person-hover-card";
import { Loader } from "../ui/loader";
import LightbulletinAvatar from "./lightbulletin-avatar";
import LightbulletinCommentDropdown from "./lightbulletin-comment-dropdown";

export default function LightbulletinComment({
	comment,
}: { comment: ItslearningRestApiEntitiesComment }) {
	const [commentText, setCommentText] = useState(comment.CommentText);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [showUpdate, setShowUpdate] = useState<boolean>(false);
	const user = useUser()!;
	const { mutate: updateComment, isLoading: isUpdating } =
		usePUTlightbulletinUpdateComment(
			{
				commentId: comment.Id,
			},
			{
				onSuccess: () => {
					setIsEditing(false);
					toast.success("Success", {
						description: "Comment updated successfully",
						duration: 5000,
					});
					comment.CommentText = commentText;
				},
				onError: (err) => {
					toast.error("Error", {
						description:
							err.message ||
							"An error occurred while trying to update the comment",
						duration: 5000,
					});
				},
			},
		);

	useEffect(() => {
		setShowUpdate(
			isEditing &&
			commentText.length > 0 &&
			commentText !== comment.CommentText,
		);
	}, [comment.CommentText, commentText, isEditing]);

	return (
		<div className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
			<LightbulletinAvatar
				src={comment.Author.ProfileImageUrlSmall}
				name={comment.Author.FullName}
				className="mt-0.5 flex-shrink-0"
			/>
			<div className="flex-1 min-w-0">
				<div className="flex items-baseline gap-2">
					<PersonHoverCard
						personId={comment.Author.PersonId}
						asChild
						showTitle={false}
					>
						<Link
							to={`/person/${comment.Author.PersonId}`}
							className="text-sm font-medium text-foreground hover:text-primary transition-colors"
						>
							{comment.Author.FullName}
						</Link>
					</PersonHoverCard>
					<HoverDate
						date={comment.CreatedDateTime}
						className="text-xs text-muted-foreground"
					>
						{getRelativeTimeString(new Date(comment.CreatedDateTime))}
					</HoverDate>
				</div>
				{isEditing ? (
					<form
						onSubmit={(e) => {
							e.preventDefault();

							if (commentText.length === 0 || isUpdating) return;

							updateComment({
								Comment: commentText,
							});
						}}
					>
						<Input
							type="text"
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							className={cn("mb-2 w-full", isUpdating && "opacity-50")}
						/>
						<div className="mb-2 flex gap-2">
							<Button
								type="button"
								variant={"ghost"}
								size={"sm"}
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</Button>
							{showUpdate && (
								<Button
									variant={"outline"}
									size={"sm"}
									type={"submit"}
									disabled={
										commentText.length === 0 || isUpdating || !showUpdate
									}
									className={
										"inline-flex justify-center items-center text-center space-x-2"
									}
								>
									{isUpdating ? (
										<span
											className={
												"inline-flex shrink-0 text-center justify-center items-center"
											}
										>
											<Loader size={"xs"} className="mr-2 inline-block" />
											Updating...
										</span>
									) : (
										<span>Update</span>
									)}
								</Button>
							)}
						</div>
					</form>
				) : (
					<p className={cn("text-sm text-foreground/90 mt-0.5 whitespace-pre-wrap", isUpdating && "opacity-50")}>
						<Linkify options={{ render: renderLink }}>
							{comment.CommentText}
						</Linkify>
					</p>
				)}
			</div>
			{comment.Author.PersonId === user.PersonId && (
				<>
					{/* the dropdown menu button will move otherwise, don't know why. This works tho */}
					<div className="flex-grow" />
					<LightbulletinCommentDropdown
						comment={comment}
						setIsEditing={setIsEditing}
					/>
				</>
			)}
		</div>
	);
}
