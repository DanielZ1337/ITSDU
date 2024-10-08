import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useUser } from "@/hooks/atoms/useUser";
import { cn, getRelativeTimeString } from "@/lib/utils.ts";
import usePUTlightbulletinUpdateComment from "@/queries/lightbulletin/usePUTlightbulletinUpdateComment.ts";
import { ItslearningRestApiEntitiesComment } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Comment.ts";
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
		<div className="flex space-x-2">
			<LightbulletinAvatar
				src={comment.Author.ProfileImageUrlSmall}
				name={comment.Author.FullName}
				className="mt-1"
			/>
			<div className={"w-full"}>
				<PersonHoverCard
					personId={comment.Author.PersonId}
					asChild
					showTitle={false}
				>
					<Link
						to={`/person/${comment.Author.PersonId}`}
						className="font-semibold text-blue-500 hover:underline"
					>
						{comment.Author.FullName}{" "}
					</Link>
				</PersonHoverCard>
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
					<p className={cn("mt-0.5 font-normal", isUpdating && "opacity-50")}>
						{comment.CommentText}
					</p>
				)}
				<HoverDate
					date={comment.CreatedDateTime}
					className="text-sm text-gray-500"
				>
					Posted {getRelativeTimeString(new Date(comment.CreatedDateTime))}
				</HoverDate>
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
