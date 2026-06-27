import {
	fileExtension,
	getResourceKind,
} from "@/lib/resources/resource-format";

export function ResourceTypeBadge({
	name,
	mimeType,
	compact = false,
}: {
	name: string;
	mimeType?: string;
	compact?: boolean;
}) {
	const ext = fileExtension(name);
	const kind = getResourceKind(name, mimeType);
	const label = ext ? ext.slice(0, 4) : kind.slice(0, 4);
	return (
		<div
			className={
				compact
					? "flex h-7 min-w-9 shrink-0 items-center justify-center rounded bg-primary/10 px-1.5 text-[10px] font-semibold uppercase text-primary"
					: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-[10px] font-semibold uppercase text-muted-foreground"
			}
			title={kind}
		>
			{label}
		</div>
	);
}
