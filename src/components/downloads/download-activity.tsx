import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDownloadActivity } from "@/hooks/useDownloadActivity";
import { formatSize } from "@/lib/resources/resource-format";
import {
	AlertTriangle,
	CheckCircle2,
	Download,
	FolderOpen,
	Loader2,
	RefreshCcw,
} from "lucide-react";
import { useState } from "react";

const statusIcon = {
	downloading: (
		<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
	),
	completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
	failed: <AlertTriangle className="h-4 w-4 text-destructive" />,
};

export default function DownloadActivity() {
	const [open, setOpen] = useState(false);
	const { entries, clearFinished } = useDownloadActivity();

	if (entries.length === 0) return null;

	const activeCount = entries.filter(
		(entry) => entry.status === "downloading",
	).length;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative shrink-0">
					<Download className="h-5 w-5" />
					{activeCount > 0 && (
						<span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
							{activeCount}
						</span>
					)}
					<span className="sr-only">Downloads</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-96 p-0">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<h2 className="text-sm font-semibold">Downloads</h2>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={clearFinished}
					>
						Clear finished
					</Button>
				</div>
				<div className="flex max-h-96 flex-col gap-1 overflow-y-auto p-2">
					{entries.map((entry) => (
						<div
							key={entry.id}
							className="flex items-start gap-3 rounded-md px-2 py-2"
						>
							<span className="mt-0.5">{statusIcon[entry.status]}</span>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium">{entry.filename}</p>
								<p className="truncate text-xs text-muted-foreground">
									{entry.status === "downloading" && "Downloading..."}
									{entry.status === "completed" &&
										(entry.size ? formatSize(entry.size) : "Done")}
									{entry.status === "failed" &&
										(entry.error || "Download failed")}
								</p>
							</div>
							{entry.status === "completed" && entry.path && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="shrink-0"
									onClick={() => void window.app.openShell(entry.path!)}
									title="Open in folder"
								>
									<FolderOpen className="h-4 w-4" />
								</Button>
							)}
							{entry.status === "failed" && entry.retry && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="shrink-0"
									onClick={entry.retry}
									title="Retry"
								>
									<RefreshCcw className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
