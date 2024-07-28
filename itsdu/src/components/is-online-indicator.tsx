import { useIsOnline } from "@/hooks/useIsOnline";
import { queryClient } from "@/lib/tanstack-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useGlobalErrorBoundary } from "@/contexts/global-error-boundary-context";

export default function IsOnlineIndicator() {
	const { isOnline, debouncedIsOnline } = useIsOnline();
	const { resetBoundary } = useErrorBoundary();
	const { resetAllErrorBoundaries } = useGlobalErrorBoundary();

	const changedFromOfflineToOnline =
		debouncedIsOnline === false && isOnline === true;
	const navigate = useNavigate();

	useEffect(() => {
		if (changedFromOfflineToOnline) {
			window.auth.refresh().then(() => {
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
				{isOnline === false && (
					<IsOnline title="You are offline" className="bg-red-500" />
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
