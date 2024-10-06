import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDELETElightbulletinComment from "@/queries/lightbulletin/useDELETElightbulletinComment";
import { ItslearningRestApiEntitiesComment } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Comment";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LightbulletinCommentDropdown({
	comment,
	setIsEditing,
}: {
	comment: ItslearningRestApiEntitiesComment;
	setIsEditing: (isEditing: boolean) => void;
}) {
	const {
		mutate: deleteComment,
		isLoading: isDeleting,
		error: err,
		status,
	} = useDELETElightbulletinComment(
		{
			commentId: comment.Id,
		},
		{
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
		if (status === "success") {
			toast.success("Success", {
				description: "Comment deleted successfully",
				duration: 5000,
			});
		}

		if (status === "error") {
			toast.error("Error", {
				description:
					err.message || "An error occurred while trying to delete the comment",
				duration: 5000,
			});
		}
	}, [status]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"ghost"}
					size={"icon"}
					className={"rounded-full hover:shadow"}
				>
					<ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{comment.AllowEditComment && (
					<DropdownMenuItem onClick={() => setIsEditing(true)}>
						Edit
					</DropdownMenuItem>
				)}
				{comment.AllowDeleteComment && (
					<DropdownMenuItem
						onClick={() => {
							deleteComment({
								commentId: comment.Id,
							});
						}}
						className="hover:!bg-destructive"
					>
						Delete
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
