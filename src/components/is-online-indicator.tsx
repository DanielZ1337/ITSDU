import { useGlobalErrorBoundary } from "@/contexts/global-error-boundary-context";
import { useAuthSessionStatus } from "@/hooks/useAuthSessionStatus";
import { useIsOnline } from "@/hooks/useIsOnline";
import { queryClient } from "@/lib/tanstack-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";

export default function IsOnlineIndicator() {
	const { isOnline, debouncedIsOnline } = useIsOnline();
	const sessionStatus = useAuthSessionStatus();
	const { resetBoundary } = useErrorBoundary();
	const { resetAllErrorBoundaries } = useGlobalErrorBoundary();

	const changedFromOfflineToOnline =
		debouncedIsOnline === false && isOnline === true;

	useEffect(() => {
		void window.auth.setOnlineStatus(isOnline);
	}, [isOnline]);

	useEffect(() => {
		if (changedFromOfflineToOnline) {
			window.auth.refresh().finally(() => {
				setTimeout(() => {
					resetBoundary();
					resetAllErrorBoundaries();
					queryClient.clear();
					queryClient.resetQueries();
					queryClient.removeQueries();
					queryClient.invalidateQueries();
					queryClient.refetchQueries();
				}, 100);

				/* setTimeout(() => {
                    navigate(0)
                }, 1000) */
			});
		}
	}, [changedFromOfflineToOnline]);

	return (
		<>
			<AnimatePresence>
				{sessionStatus.state === "reauthRequired" && (
					<IsOnline
						title="Login required. Your saved session is no longer valid."
						className="bg-red-600"
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{sessionStatus.state !== "reauthRequired" &&
					(isOnline === false || sessionStatus.state === "offline") && (
						<IsOnline
							title="You are offline. Cached resources remain available."
							className="bg-red-500"
						/>
					)}
			</AnimatePresence>
			<AnimatePresence>
				{sessionStatus.state === "refreshing" && (
					<IsOnline
						title="Refreshing Itslearning session..."
						className="bg-blue-600"
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{sessionStatus.state === "stale" && isOnline && (
					<IsOnline
						title="Session status is stale. ITSDU is reconnecting in the background."
						className="bg-amber-600"
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{changedFromOfflineToOnline && (
					<IsOnline title="You are online" className="bg-green-500" />
				)}
			</AnimatePresence>
		</>
	);
}

function IsOnline({ title, className }: { title: string; className?: string }) {
	return (
		<m.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			className={cn(
				"text-white items-center flex justify-center leading-tight tracking-tight font-semibold",
				className,
			)}
		>
			<span className="block py-2">{title}</span>
		</m.div>
	);
}
