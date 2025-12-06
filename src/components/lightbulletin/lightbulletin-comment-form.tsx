import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import usePOSTlightbulletinAddComment from "@/queries/lightbulletin/usePOSTlightbulletinAddComment.ts";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function LightbulletinCommentForm({
	lightbulletinId,
	hasComments = false,
}: {
	lightbulletinId: number;
	hasComments?: boolean;
}) {
	const [comment, setComment] = React.useState<string>("");

	const { mutate, isLoading } = usePOSTlightbulletinAddComment(
		{
			lightBulletinId: lightbulletinId,
		},
		{
			onSuccess: () => {
				setComment("");
				toast.success("Success", {
					description: "Comment added successfully",
					duration: 3000,
				});
			},
			onError: (err) => {
				toast.error("Error", {
					description:
						err.message || "An error occurred while trying to add the comment",
					duration: 5000,
				});
			},
		},
	);

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement> | KeyboardEvent) => {
			e.preventDefault();

			if (comment.length === 0) return;

			mutate({
				Comment: comment,
			});
		},
		[comment, mutate],
	);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Enter" && e.ctrlKey) {
				console.log("ctrl+enter");
				handleSubmit(e);
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleSubmit]);

	return (
		<form className={`mt-3 pt-3 ${hasComments ? 'border-t border-border/30' : ''}`} onSubmit={handleSubmit}>
			<div className="flex gap-2">
				<Input
					className="flex-1 h-9 text-sm bg-background/50"
					id="comment"
					name="comment"
					placeholder="Write a comment..."
					type="text"
					onChange={(e) => setComment(e.target.value)}
					value={comment}
				/>
				{comment.length > 0 && (
					<Button
						disabled={isLoading}
						variant="default"
						size="sm"
						className="h-9"
						type="submit"
					>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Post"
						)}
					</Button>
				)}
			</div>
		</form>
	);
}
