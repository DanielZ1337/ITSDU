import { fileExtension } from "@/lib/resources/resource-format";
import { File as FileIcon } from "lucide-react";

export function ResourceTypeBadge({ name }: { name: string }) {
	const ext = fileExtension(name);
	return (
		<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-[10px] font-semibold uppercase text-muted-foreground">
			{ext ? ext.slice(0, 4) : <FileIcon className="h-4 w-4" />}
		</div>
	);
}
