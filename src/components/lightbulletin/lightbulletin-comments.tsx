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
			<div
				className={
					"flex flex-col w-full h-full p-4 justify-center items-center"
				}
			>
				<span
					className={
						"text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
					}
				>
					No comments
				</span>
			</div>
		);
	}

	return (
		<>
			<div className="w-full h-0.5 bg-foreground/10" />
			<div className="flex flex-col gap-4 pt-4">
				{comments?.map((comment) => (
					<LightbulletinComment comment={comment} key={comment.Id} />
				))}
			</div>
		</>
	);
}
