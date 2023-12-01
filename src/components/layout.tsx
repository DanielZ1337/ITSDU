import { Suspense, useRef } from "react";
import { cn } from '../lib/utils';
import BrowserNav from "@/components/browse-nav";
import { ErrorBoundary } from "react-error-boundary";
import MessagesDropdown from "@/components/messages/dropdown/messages-dropdown";
import NotificationsDropdown from "@/components/notifications/notifications-dropdown";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@nextui-org/spinner";
import Titlebar from "@/components/titlebar/titlebar";
import TitlebarSearch from "@/components/titlebar/titlebar-search";
import SettingsModal from "@/components/settings/settings-modal";
import MessagesDropDownSkeleton from "@/components/messages/dropdown/fallbacks/messages-dropdown-titlebar-fallback";
import NotificationsDropDownSkeleton from "@/components/notifications/fallback/notifications-dropdown-fallback";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import AboutModal from "@/components/about-modal";
import IsOnlineIndicator from "@/components/is-online-indicator";
import Sidebar from "./layout/sidebar";
import TitlebarButton from "./titlebar/titlebar-button";
import SuspenseWrapper from "./suspense-wrapper";

export default function Layout() {
    const { sidebarActive } = useSidebar()
    const ref = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation()

    return (
        <div className="flex h-screen max-h-screen min-h-screen flex-col overflow-hidden">
            <IsOnlineIndicator />
            <div className="flex items-center justify-between border-b px-4 py-2 drag border-background/40">
                <Link className="shrink-0 no-drag" to={'/'}>
                    <img src="itsl-itslearning-file://i_logo_colored.png" alt="itslearning"
                        className="my-auto mt-2 ml-4 h-8 w-8" />
                </Link>
                <div className="w-full max-w-xl px-4">
                    <ErrorBoundary fallback={<TitlebarButton disabled />}>
                        <TitlebarSearch />
                    </ErrorBoundary>
                </div>
                <div className={"no-drag flex flex-row items-center justify-center gap-4"}>
                    <ErrorBoundary fallback={<MessagesDropDownSkeleton />}>
                        <Suspense fallback={<MessagesDropDownSkeleton />}>
                            <MessagesDropdown />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<NotificationsDropDownSkeleton />}>
                        <Suspense fallback={<NotificationsDropDownSkeleton />}>
                            <NotificationsDropdown />
                        </Suspense>
                    </ErrorBoundary>
                    <Titlebar />
                </div>
            </div>
            <BrowserNav />
            <div className="relative flex max-h-screen flex-1 flex-col overflow-hidden drag bg-background">
                <Sidebar />
                <div
                    className={"no-drag ml-24 h-full flex flex-1 overflow-hidden dark:bg-foreground/[2%] transition-all rounded-tl-md border-t border-l"}>
                    <ErrorBoundary fallback={<div>ERROR</div>}>
                        <Suspense
                            fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"} />}>
                            <div className="flex flex-1 flex-col overflow-x-auto overflow-y-auto"
                                /*style={{
                                    scrollbarGutter: "stable both-edges"
                                }}*/
                                ref={ref}
                                key={pathname}
                            >
                                <SuspenseWrapper>
                                    <Outlet />
                                </SuspenseWrapper>
                            </div>
                        </Suspense>
                    </ErrorBoundary>
                </div>
                <div
                    className={cn('pointer-events-none absolute top-0 left-0 h-full w-full bg-black/50 transition-all backdrop-blur-lg z-10 shadow-sm', sidebarActive ? 'opacity-100' : 'opacity-0')} />
                <ScrollToTopButton viewportRef={ref} />
                <Toaster />
                <SettingsModal />
                <AboutModal />
            </div>
        </div>
    )
}









