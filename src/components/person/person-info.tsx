import useGETperson from "@/queries/person/useGETperson.ts";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import CopyButton from "../copy-button";
import ProfileAvatar from "../profile-avatar";

export function PersonInfo({ personId }: { personId: number }) {
	const { data: person } = useGETperson(
		{
			personId,
		},
		{
			suspense: true,
		},
	);

	if (!personId || !person) {
		return (
			<div className={"m-auto"}>
				<div className={"flex flex-col gap-4 w-full p-4 items-center"}>
					<p className={"text-3xl font-bold text-balance"}>Person not found</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="px-4 py-2">
				<h1 className="text-center text-3xl font-bold text-balance">
					{person.FullName}
				</h1>
				<span className="flex gap-2 items-center justify-center py-2">
					<p className="mt-1 text-center text-sm text-foreground/50 text-balance relative h-fit w-fit">
						{/*@ts-ignore*/}
						{person.AdditionalInfo}
					</p>
					<CopyButton
						className="relative top-0.5 bottom-0 left-0 right-0 bg-primary/20 text-primary"
						value={person.AdditionalInfo}
						isBlockHovered
						onCopy={() => toast.success("Copied to clipboard")}
					/>
				</span>
			</div>
			<ProfileAvatar
				src={person.ProfileImageUrl}
				name={person.FullName}
				className={"w-32 h-32 border-4 mx-auto border-primary/20"}
				classNameFallbackAvatar="w-full h-full"
				classNameFallback={"bg-foreground/20"}
			/>
		</div>
	);
}
