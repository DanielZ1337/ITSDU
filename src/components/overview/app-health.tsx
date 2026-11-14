import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { downloadActivityAtom } from "@/atoms/download-activity";
import {
	updateAvailableVersionAtom,
	updateCheckErrorAtom,
	updateReadyAtom,
} from "@/atoms/update-status";
import { useAuthSessionStatus } from "@/hooks/useAuthSessionStatus";
import type { ResourceCacheHealth } from "@/lib/resource-indexeddb/resourceIndexedDB";

export function AppHealth({
	locale,
	health,
}: {
	locale: "en" | "da";
	health: ResourceCacheHealth | null;
}) {
	const da = locale === "da";
	const session = useAuthSessionStatus();
	const downloads = useAtomValue(downloadActivityAtom);
	const ready = useAtomValue(updateReadyAtom);
	const available = useAtomValue(updateAvailableVersionAtom);
	const updateError = useAtomValue(updateCheckErrorAtom);
	const failed = downloads.filter((item) => item.status === "failed").length;
	const connection = !session.isOnline
		? da
			? "Offline"
			: "Offline"
		: session.state === "reauthRequired"
			? da
				? "Log ind igen"
				: "Sign in again"
			: session.state === "authenticated"
				? da
					? "Forbundet"
					: "Connected"
				: da
					? "Ukendt"
					: "Unknown";
	const update = updateError
		? da
			? "Opdateringstjek fejlede"
			: "Update check failed"
		: ready
			? da
				? "Klar til at installere"
				: "Ready to install"
			: available
				? `${da ? "Tilgængelig" : "Available"}: v${available}`
				: da
					? "Ingen kendt opdatering"
					: "No known update";
	return (
		<section
			className="rounded-xl border bg-card p-5"
			aria-labelledby="app-health-title"
		>
			<h2 id="app-health-title" className="font-semibold">
				{da ? "Appens tilstand" : "App health"}
			</h2>
			<dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
				<div>
					<dt className="text-muted-foreground">
						{da ? "Forbindelse" : "Connection"}
					</dt>
					<dd>{connection}</dd>
				</div>
				<div>
					<dt className="text-muted-foreground">
						{da ? "Opdateringer" : "Updates"}
					</dt>
					<dd>{update}</dd>
				</div>
				<div>
					<dt className="text-muted-foreground">
						{da ? "Seneste downloadproblemer" : "Recent download problems"}
					</dt>
					<dd>{failed}</dd>
				</div>
			</dl>
			{health && (
				<p className="mt-3 text-sm text-muted-foreground">
					<Link className="underline" to="/resources">
						{da ? "Gemte ressourcer" : "Cached resources"}
					</Link>
					: {health.cachedCount} ·{" "}
					{da ? "Kræver opmærksomhed" : "Need attention"}:{" "}
					{health.failedCount + health.staleCount + health.missingCount}
				</p>
			)}
		</section>
	);
}
