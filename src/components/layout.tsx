import MessagesDropDownSkeleton from "@/components/messages/dropdown/fallbacks/messages-dropdown-titlebar-fallback";
import NotificationsDropDownSkeleton from "@/components/notifications/fallback/notifications-dropdown-fallback";
import { Button } from "@/components/ui/button";
import { useCommandPalette } from "@/hooks/atoms/useCommandPalette";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import { useUnreadMessagesNotification } from "@/hooks/useUnreadMessagesNotification";
import { isMacOS } from "@/lib/utils";
import { Spinner } from "@nextui-org/spinner";
import { Command } from "lucide-react";
import { Suspense, lazy, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { useUpdateAvailableToast } from "./update-available-toast";

const ToasterLazy = lazy(() =>
	import("@/components/ui/toaster").then((module) => ({
		default: module.Toaster,
	})),
);
const ScrollToTopButtonLazy = lazy(
	() => import("@/components/scroll-to-top-button"),
);
const MessagesDropdown = lazy(
	() => import("@/components/messages/dropdown/messages-dropdown"),
);
const NotificationsDropdown = lazy(
	() => import("@/components/notifications/notifications-dropdown"),
);
const NotificationCenterLazy = lazy(
	() => import("@/components/notifications/notification-center"),
);
const DownloadActivityLazy = lazy(
	() => import("@/components/downloads/download-activity"),
);
const BrowserNavLazy = lazy(() => import("@/components/browse-nav"));
const TitlebarButtonsLazy = lazy(
	() => import("@/components/titlebar/titlebar"),
);
const TitlebarSearchLazy = lazy(
	() => import("@/components/titlebar/titlebar-search"),
);
const SettingsModalLazy = lazy(
	() => import("@/components/settings/settings-modal"),
);
const AboutModalLazy = lazy(() => import("@/components/about-modal"));
const CommandPaletteLazy = lazy(
	() => import("@/components/command-palette/command-palette"),
);
const IsOnlineIndicatorLazy = lazy(
	() => import("@/components/is-online-indicator"),
);
const SidebarLazy = lazy(() => import("./layout/sidebar"));
const TitlebarButtonLazy = lazy(() => import("./titlebar/titlebar-button"));
const SuspenseWrapperLazy = lazy(() => import("./suspense-wrapper"));
const SonnerLazy = lazy(() =>
	import("@/components/ui/sonner").then((module) => ({
		default: module.Toaster,
	})),
);

const quickNavRoutes = [
	"/overview",
	"/courses",
	"/calendar",
	"/all-tasks",
	"/messages",
];

export default function Layout() {
	useUpdateAvailableToast();
	useUnreadMessagesNotification();
	const { sidebarActive } = useSidebar();
	const ref = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const { toggleCommandPalette } = useCommandPalette();

	const { pathname } = useLocation();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (!(e.ctrlKey || e.metaKey)) return;
			const index = Number(e.key) - 1;
			if (Number.isInteger(index) && quickNavRoutes[index]) {
				e.preventDefault();
				navigate(quickNavRoutes[index]);
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [navigate]);

	useEffect(() => {
		const handleTrayNavigate = (_event: unknown, routePath: string) => {
			navigate(routePath);
		};

		window.ipcRenderer.on("tray:navigate", handleTrayNavigate);
		return () => {
			window.ipcRenderer.removeAllListeners("tray:navigate");
		};
	}, [navigate]);

	return (
		<div className="flex h-screen max-h-screen min-h-screen flex-col overflow-hidden">
			<Suspense fallback={<IsOnlineIndicatorLazy />}>
				<IsOnlineIndicatorLazy />
			</Suspense>
			<div className="flex items-center justify-between border-b px-4 py-2 drag border-background/40">
				<Link
					className="shrink-0 no-drag mt-2 px-2 py-1 bg-muted/20 rounded-lg"
					to={"/"}
				>
					<img
						loading="eager"
						src="itsl-itslearning-file://i_logo_colored.png"
						alt="itslearning"
						className="my-auto h-8 w-8"
					/>
				</Link>
				<div className="w-full max-w-xl px-4">
					<ErrorBoundary
						fallback={
							<Suspense fallback={<TitlebarButtonLazy disabled />}>
								<TitlebarButtonLazy />
							</Suspense>
						}
					>
						<Suspense fallback={<TitlebarButtonLazy disabled />}>
							<TitlebarSearchLazy />
						</Suspense>
					</ErrorBoundary>
				</div>
				<div
					className={"no-drag flex flex-row items-center justify-center gap-2"}
				>
					<Button
						variant="ghost"
						size="icon"
						className="shrink-0"
						onClick={toggleCommandPalette}
						title={`Command palette (${isMacOS() ? "⌘" : "Ctrl"}K)`}
					>
						<Command className="h-5 w-5" />
						<span className="sr-only">Open command palette</span>
					</Button>
					<ErrorBoundary fallback={null}>
						<Suspense fallback={null}>
							<DownloadActivityLazy />
						</Suspense>
					</ErrorBoundary>
					<ErrorBoundary fallback={null}>
						<Suspense fallback={null}>
							<NotificationCenterLazy />
						</Suspense>
					</ErrorBoundary>
					<ErrorBoundary
						fallback={
							<Suspense fallback={<MessagesDropDownSkeleton />}>
								<MessagesDropDownSkeleton />
							</Suspense>
						}
					>
						<Suspense fallback={<MessagesDropDownSkeleton />}>
							<MessagesDropdown />
						</Suspense>
					</ErrorBoundary>
					<ErrorBoundary
						fallback={
							<Suspense fallback={<NotificationsDropDownSkeleton />}>
								<NotificationsDropDownSkeleton />
							</Suspense>
						}
					>
						<Suspense fallback={<NotificationsDropDownSkeleton />}>
							<NotificationsDropdown />
						</Suspense>
					</ErrorBoundary>
					<Suspense fallback={<TitlebarButtonsLazy />}>
						<TitlebarButtonsLazy />
					</Suspense>
				</div>
			</div>
			<Suspense fallback={null}>
				<BrowserNavLazy />
			</Suspense>
			<div className="relative flex max-h-screen flex-1 overflow-hidden drag bg-background transition-colors ">
				<Suspense fallback={null}>
					<SidebarLazy />
				</Suspense>
				<div
					className={
						"no-drag h-full flex flex-1 overflow-hidden dark:bg-foreground/[2%] transition-colors rounded-tl-md border-t border-l"
					}
				>
					<ErrorBoundary fallback={<div>ERROR</div>}>
						<Suspense
							fallback={
								<Spinner
									size="lg"
									color="primary"
									label="Loading..."
									className={"m-auto"}
								/>
							}
						>
							<div
								className="flex min-h-0 flex-1 flex-col overflow-x-auto overflow-y-auto"
								/*style={{
									scrollbarGutter: "stable both-edges"
								}}*/
								ref={ref}
								key={pathname}
							>
								<SuspenseWrapperLazy>
									<Outlet />
								</SuspenseWrapperLazy>
							</div>
						</Suspense>
					</ErrorBoundary>
				</div>
				<div
					className={cn(
						"pointer-events-none absolute top-0 left-0 h-full w-full bg-black/30 transition-all backdrop-blur-sm z-10 shadow-sm",
						sidebarActive ? "opacity-100" : "opacity-0",
					)}
				/>
				<Suspense fallback={null}>
					<ScrollToTopButtonLazy viewportRef={ref} />
					<ToasterLazy />
					<SonnerLazy />
					<SettingsModalLazy />
					<AboutModalLazy />
					<CommandPaletteLazy />
				</Suspense>
			</div>
		</div>
	);
}
