import {
	ArrowLeftCircleIcon,
	ArrowRightCircleIcon,
	HomeIcon,
	RefreshCwIcon,
} from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { useTabs } from "@/components/tabs/tab-manager";
import { Button } from "@/components/ui/button";
import { useBrowseNavigation } from "@/hooks/atoms/useBrowseNavigation";
import { queryClient } from "@/lib/tanstack-client";
import { Input } from "./ui/input";

export default function BrowserNav() {
	const { showBrowseNavigation, toggleBrowseNavigation } =
		useBrowseNavigation();
	const { activeTab, navigate, goBack, goForward, reload } = useTabs();
	const [address, setAddress] = useState(activeTab.location.pathname);

	useEffect(() => {
		const { pathname, search, hash } = activeTab.location;
		setAddress(pathname + search + hash);
	}, [activeTab.location]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// alt left and right arrow
			if (e.altKey && e.key === "ArrowLeft") {
				e.preventDefault();
				void goBack();
			} else if (e.altKey && e.key === "ArrowRight") {
				e.preventDefault();
				void goForward();
			}

			if (e.ctrlKey && e.key === "r") {
				e.stopPropagation();
				handleReload();
			}

			if (e.ctrlKey && e.key === "l") {
				e.stopPropagation();
				console.log("focus address bar");
				document.querySelector("input")?.focus();
				console.log(document.querySelector("input"));
			}

			if (e.ctrlKey && e.key === "b") {
				e.preventDefault();
				toggleBrowseNavigation();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [goBack, goForward, toggleBrowseNavigation]);

	const handleReload = () => {
		window.auth.refresh().finally(() => {
			queryClient.invalidateQueries();
			queryClient.resetQueries();
			void reload();
		});
	};

	return (
		<AnimatePresence>
			{showBrowseNavigation && (
				<m.div
					layout
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="shrink-0 no-drag"
				>
					<div className="mt-2 mb-4 flex w-full items-center justify-center gap-1 border-y-2 px-2 py-4 drag border-foreground-50 no-drag">
						{/* Back button */}
						<Button
							className="no-drag"
							variant={"ghost"}
							size={"icon"}
							onClick={() => void goBack()}
						>
							<ArrowLeftCircleIcon />
						</Button>
						{/* Forward button */}
						<Button
							className="no-drag"
							variant={"ghost"}
							size={"icon"}
							onClick={() => void goForward()}
						>
							<ArrowRightCircleIcon />
						</Button>
						{/* Reload button */}
						<Button
							className="no-drag"
							variant={"ghost"}
							size={"icon"}
							onClick={handleReload}
						>
							<RefreshCwIcon />
						</Button>
						{/* Home button */}
						<Button
							className="no-drag"
							variant={"ghost"}
							size={"icon"}
							onClick={() => void navigate("/")}
						>
							<HomeIcon />
						</Button>
						{/* Address bar */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								void navigate(address);
							}}
							className="w-full px-2 no-drag"
						>
							<Input
								className="w-full"
								type="text"
								value={address}
								onFocus={(e) =>
									e.currentTarget.setSelectionRange(
										1,
										e.currentTarget.value.length,
									)
								}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</form>
					</div>
				</m.div>
			)}
		</AnimatePresence>
	);
}
