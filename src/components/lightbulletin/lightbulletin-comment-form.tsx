import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import usePOSTlightbulletinAddComment from "@/queries/lightbulletin/usePOSTlightbulletinAddComment.ts";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function LightbulletinCommentForm({
	lightbulletinId,
}: {
	lightbulletinId: number;
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
		<form className="my-4" onSubmit={handleSubmit}>
			{/*<label className="sr-only" htmlFor="comment">
                            Add a new comment
                        </label>*/}
			<Input
				className="mb-2"
				id="comment"
				name="comment"
				placeholder="Add a new comment..."
				type="text"
				onChange={(e) => setComment(e.target.value)}
				value={comment}
			/>
			{comment.length > 0 && (
				<Button
					disabled={isLoading}
					variant={"outline"}
					size={"lg"}
					className="w-full"
					type="submit"
				>
					{isLoading ? (
						<span
							className={
								"inline-flex shrink-0 text-center justify-center items-center"
							}
						>
							<Loader2 className="mr-2 inline-block animate-spin" size={16} />
							Adding comment...
						</span>
					) : (
						"Add comment"
					)}
				</Button>
			)}
		</form>
	);
}
