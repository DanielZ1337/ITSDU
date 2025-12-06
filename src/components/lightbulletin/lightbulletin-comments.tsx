import LightbulletinComment from "@/components/lightbulletin/lightbulletin-comment.tsx";
import useGETlightbulletinAllComments from "@/queries/lightbulletin/useGETlightbulletinAllComments.ts";

export default function LightbulletinComments({
	lightbulletinId,
}: {
	lightbulletinId: number;
}) {
	const { data } = useGETlightbulletinAllComments(
		{
			lightBulletinId: lightbulletinId,
		},
		{
			suspense: true,
		},
	);

	const comments = data?.EntityArray.sort((a, b) => {
		return (
			new Date(a.CreatedDateTime).getTime() -
			new Date(b.CreatedDateTime).getTime()
		);
	});

	if (data!.EntityArray.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-6 text-center">
				<p className="text-sm text-muted-foreground">
					No comments yet. Be the first to comment!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{comments?.map((comment) => (
				<LightbulletinComment comment={comment} key={comment.Id} />
			))}
		</div>
	);
}
